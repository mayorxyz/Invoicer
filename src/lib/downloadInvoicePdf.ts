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

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#FFFFFF';
  container.style.color = '#000000';
  container.style.zIndex = '-1';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    clone.style.background = '#FFFFFF';
    clone.style.color = '#1a1a1a';
    if (accent) clone.style.setProperty('--accent', accent);
    clone.style.maxWidth = 'none';
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';

    const contentRatio = (297 - 20) / (210 - 20);
    clone.style.boxSizing = 'border-box';
    clone.style.minHeight = `${Math.floor(794 * contentRatio)}px`;
    clone.style.display = 'flex';
    clone.style.flexDirection = 'column';

    const bottomBlock = clone.querySelector('.notes-block, .totals-block') as HTMLElement | null;
    if (bottomBlock) bottomBlock.style.marginTop = 'auto';

    const header = clone.querySelector('.invoice-header') as HTMLElement | null;
    if (header) {
      header.style.display = 'flex';
      header.style.flexDirection = 'row';
      header.style.justifyContent = 'space-between';
      header.style.alignItems = 'flex-start';
    }

    const meta = clone.querySelector('.invoice-meta') as HTMLElement | null;
    if (meta) {
      meta.style.marginLeft = 'auto';
      meta.style.textAlign = 'right';
      meta.style.flexShrink = '0';
    }

    clone.querySelectorAll('.text-foreground').forEach(el => {
      (el as HTMLElement).style.color = '#1a1a1a';
    });
    clone.querySelectorAll('.text-muted').forEach(el => {
      (el as HTMLElement).style.color = '#6B6F76';
    });
    clone.querySelectorAll('.from-value').forEach(el => {
      (el as HTMLElement).style.color = '#000000';
    });
    clone.querySelectorAll('.invoice-accent').forEach(el => {
      const node = el as HTMLElement;
      node.style.color = 'var(--accent)';
      node.querySelectorAll('*').forEach(child => {
        (child as HTMLElement).style.color = 'var(--accent)';
      });
    });

    clone.querySelectorAll('.print\\:hidden').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

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
      width: 794,
      windowWidth: 794,
      logging: false,
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - 2 * margin;
    const contentHeight = pdfHeight - 2 * margin;

    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    if (imgHeight <= contentHeight) {
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        margin,
        margin,
        contentWidth,
        imgHeight
      );
    } else {
      const scale = canvas.width / 794;
      const pagePx = Math.floor((contentHeight / contentWidth) * canvas.width);
      const cloneTop = clone.getBoundingClientRect().top;
      const safeBreaks = Array.from(clone.querySelectorAll('tr, .totals-block, .notes-block'))
        .map(el => (el.getBoundingClientRect().top - cloneTop) * scale)
        .sort((a, b) => a - b);

      let y = 0;
      let page = 0;
      while (y < canvas.height - 1 && page < 20) {
        let end = Math.min(y + pagePx, canvas.height);
        if (end < canvas.height) {
          const snap = safeBreaks.filter(b => b > y + pagePx * 0.5 && b <= end).pop();
          if (snap) end = snap;
        }
        const h = end - y;
        const pc = document.createElement('canvas');
        pc.width = canvas.width;
        pc.height = h;
        pc.getContext('2d')!.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
        if (page > 0) pdf.addPage();
        pdf.addImage(
          pc.toDataURL('image/jpeg', 0.95),
          'JPEG',
          margin,
          margin,
          contentWidth,
          (h * contentWidth) / canvas.width
        );
        y = end;
        page++;
      }
    }

    pdf.save(filename);
  } finally {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}