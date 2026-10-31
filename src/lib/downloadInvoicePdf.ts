import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

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

  const clone = paperElement.cloneNode(true) as HTMLElement;
  const accent = getComputedStyle(paperElement).getPropertyValue('--accent').trim();

  const A4_W = 794;
  const A4_H = 1122;

  const container = document.createElement('div');
  container.style.cssText =
    `position:fixed;left:-9999px;top:0;width:${A4_W}px;background:#fff;color:#1a1a1a;z-index:-1;`;
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // 1. Neutralise theme: remap dark backgrounds/light text to print colours
    const lum = (c: string) => {
      const m = c.match(/[\d.]+/g);
      if (!m) return null;
      const [r, g, b, a = '1'] = m.map(Number);
      return { l: (0.299 * r + 0.587 * g + 0.114 * b) / 255, a: Number(a) };
    };
    [clone, ...Array.from(clone.querySelectorAll<HTMLElement>('*'))].forEach(el => {
      const cs = getComputedStyle(el);
      const bg = lum(cs.backgroundColor);
      if (bg && bg.a > 0 && bg.l < 0.35) el.style.backgroundColor = '#FFFFFF';
      const fg = lum(cs.color);
      if (fg && fg.l > 0.6) el.style.color = '#1a1a1a';
      else if (fg && fg.l < 0.05) el.style.color = '#000000';
      (['borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor'] as const).forEach(p => {
        const c = lum(cs[p]);
        if (c && c.l < 0.35) el.style[p] = '#E5E7EB';
      });
      el.style.boxShadow = 'none';
      el.style.backdropFilter = 'none';
    });

    // 2. Paper = full A4
    Object.assign(clone.style, {
      background: '#FFFFFF',
      color: '#1a1a1a',
      width: `${A4_W}px`,
      maxWidth: 'none',
      minHeight: `${A4_H}px`,
      margin: '0',
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    });
    if (accent) clone.style.setProperty('--accent', accent);

    const cw = clone.getBoundingClientRect().width;
    const ch = clone.getBoundingClientRect().height;
    let framed = false;
    clone.querySelectorAll<HTMLElement>('*').forEach(el => {
      const r = el.getBoundingClientRect();
      if (parseFloat(getComputedStyle(el).borderTopLeftRadius) > 0 && r.width > cw * 0.9 && r.height > ch * 0.5) {
        Object.assign(el.style, { border: 'none', borderRadius: '0', margin: '0', boxShadow: 'none' });
        framed = true;
      }
    });
    if (framed) clone.style.padding = '0';

    const bottomBlock = clone.querySelector('.notes-block, .totals-block') as HTMLElement | null;
    if (bottomBlock) {
      bottomBlock.style.marginTop = 'auto';
      for (let p = bottomBlock.parentElement; p && p !== container; p = p.parentElement) {
        Object.assign(p.style, { display: 'flex', flexDirection: 'column', flex: '1 1 auto' });
      }
    }

    const header = clone.querySelector('.invoice-header') as HTMLElement | null;
    if (header) Object.assign(header.style, {
      display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    });
    const meta = clone.querySelector('.invoice-meta') as HTMLElement | null;
    if (meta) Object.assign(meta.style, { marginLeft: 'auto', textAlign: 'right', flexShrink: '0' });

    clone.querySelectorAll<HTMLElement>('.text-muted').forEach(el => (el.style.color = '#6B6F76'));
    clone.querySelectorAll<HTMLElement>('.invoice-accent').forEach(el => {
      el.style.color = 'var(--accent)';
      el.querySelectorAll<HTMLElement>('*').forEach(c => (c.style.color = 'var(--accent)'));
    });
    clone.querySelectorAll<HTMLElement>('[data-accent="text"]').forEach(el => {
      el.style.color = 'var(--accent)';
    });
    clone.querySelectorAll<HTMLElement>('[data-accent="border"]').forEach(el => {
      const cs = getComputedStyle(el);
      (['borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor'] as const).forEach(p => {
        if (cs[p] && cs[p] !== 'rgba(0, 0, 0, 0)') el.style[p] = 'var(--accent)';
      });
    });
    clone.querySelectorAll<HTMLElement>('.print\\:hidden').forEach(el => (el.style.display = 'none'));

    await document.fonts.ready;

    const images = clone.querySelectorAll('img');
    await Promise.all(
      Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise<void>(resolve => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      width: A4_W,
      height: A4_H,
      windowWidth: A4_W,
      windowHeight: A4_H,
      logging: false,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();   // 210
    const pdfH = pdf.internal.pageSize.getHeight();  // 297

    const pagePx = Math.floor((pdfH / pdfW) * canvas.width);
    const scale = canvas.width / A4_W;
    const cloneTop = clone.getBoundingClientRect().top;
    const safeBreaks = Array.from(clone.querySelectorAll('tr, .totals-block, .notes-block'))
      .map(el => (el.getBoundingClientRect().top - cloneTop) * scale)
      .sort((a, b) => a - b);

    let y = 0, page = 0;
    while (y < canvas.height - 2 && page < 20) {
      let end = Math.min(y + pagePx, canvas.height);
      if (canvas.height - y <= pagePx * 1.01) {
        end = canvas.height; // fits: never snap
      } else {
        const snap = safeBreaks.filter(b => b > y + pagePx * 0.5 && b <= end).pop();
        if (snap) end = snap;
      }
      const h = end - y;
      const pc = document.createElement('canvas');
      pc.width = canvas.width;
      pc.height = h;
      const ctx = pc.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, pc.width, pc.height);
      ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      if (page > 0) pdf.addPage();
      pdf.addImage(pc.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, pdfW, Math.min((h * pdfW) / canvas.width, pdfH));
      y = end;
      page++;
    }

    pdf.save(filename);
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}