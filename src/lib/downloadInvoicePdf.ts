import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const LIGHT_VARS: Record<string, string> = {
  '--background': '#FFFFFF',
  '--surface': '#FFFFFF',
  '--foreground': '#111827',
  '--muted': '#6B7280',
  '--rule': '#E5E7EB',
  '--border': '#E5E7EB',
  '--ink': '#111827',
  '--slate': '#6B7280',
};

export async function downloadInvoicePdf(
  paperElement: HTMLElement,
  documentNumber: string,
  clientName: string
): Promise<void> {
  let filename = 'invoice.pdf';
  if (documentNumber && clientName) {
    filename = `${sanitizeFilename(documentNumber)}-${sanitizeFilename(clientName)}.pdf`;
  } else if (documentNumber) {
    filename = `${sanitizeFilename(documentNumber)}.pdf`;
  }

  const source =
    (paperElement.querySelector('.print-paper') as HTMLElement | null) ??
    (paperElement.firstElementChild as HTMLElement | null) ??
    paperElement;
  const accent =
    getComputedStyle(source).getPropertyValue('--accent').trim() ||
    getComputedStyle(paperElement).getPropertyValue('--accent').trim();

  const background = '#FFFFFF';
  const foreground = '#111827';

  const A4_W = 794;
  const A4_H = 1122;
  const pad = Math.round((14 * A4_W) / 210); // 14mm in px
  const contentH = A4_H - 2 * pad; // usable height per page, in px

  const clone = source.cloneNode(true) as HTMLElement;

  const container = document.createElement('div');
  container.className = 'ledger-ed';
  container.style.cssText =
    `position:fixed;left:-9999px;top:0;width:${A4_W}px;background:${background};color:${foreground};z-index:-1;pointer-events:none;`;
  if (accent) container.style.setProperty('--accent', accent);
  Object.entries(LIGHT_VARS).forEach(([k, v]) => container.style.setProperty(k, v));
  container.setAttribute('data-theme', 'light');
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    clone.querySelectorAll<HTMLElement>('.print\\:hidden').forEach(el => (el.style.display = 'none'));

    Object.assign(clone.style, {
      background,
      color: foreground,
      width: `${A4_W}px`,
      maxWidth: 'none',
      minHeight: `${contentH}px`,
      margin: '0',
      padding: `0 ${pad}px`,
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    });

    await document.fonts.ready;

    await Promise.all(
      Array.from(clone.querySelectorAll('img')).map(img =>
        img.complete
          ? Promise.resolve()
          : new Promise<void>(resolve => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
      )
    );

    const totalsBlock = clone.querySelector('.totals-block') as HTMLElement | null;
    const lastChild = clone.lastElementChild as HTMLElement | null;
    const pushDown = totalsBlock && lastChild === totalsBlock ? totalsBlock : lastChild;
    if (pushDown) pushDown.style.marginTop = 'auto';

    const fullHeight = Math.ceil(clone.scrollHeight);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: background,
      width: A4_W,
      height: fullHeight,
      windowWidth: A4_W,
      windowHeight: fullHeight,
      logging: false,
      onclone: clonedDoc => {
        const root = clonedDoc.documentElement;
        root.classList.remove('dark');
        root.removeAttribute('data-theme');
        root.style.colorScheme = 'light';
        clonedDoc.body.classList.remove('dark');
      },
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    const marginMm = 14;

    const scale = canvas.width / A4_W;
    const pagePx = Math.floor(contentH * scale);
    const cloneTop = clone.getBoundingClientRect().top;

    // Safe places to start a new page: table rows, blocks, and top-level sections
    const breakEls = [
      ...Array.from(clone.querySelectorAll('tr, .totals-block, .notes-block, [data-pdf-break]')),
      ...Array.from(clone.children),
    ];
    const safeBreaks = Array.from(
      new Set(breakEls.map(el => Math.floor((el.getBoundingClientRect().top - cloneTop) * scale) - 2))
    )
      .filter(b => b > 0)
      .sort((a, b) => a - b);

    let y = 0, page = 0;
    while (y < canvas.height - 2 && page < 20) {
      let end = Math.min(y + pagePx, canvas.height);
      if (canvas.height - y > pagePx) {
        const snap = safeBreaks.filter(b => b > y + pagePx * 0.3 && b <= end).pop();
        if (snap) end = snap;
      }
      const h = end - y;
      const pc = document.createElement('canvas');
      pc.width = canvas.width;
      pc.height = h;
      const ctx = pc.getContext('2d')!;
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, pc.width, pc.height);
      ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (page > 0) pdf.addPage();
      pdf.addImage(pc.toDataURL('image/jpeg', 0.95), 'JPEG', 0, marginMm, pdfW, (h * pdfW) / canvas.width);
      y = end;
      page++;
    }

    pdf.save(filename);
  } finally {
    container.remove();
  }
}