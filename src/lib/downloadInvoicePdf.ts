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

  const typography = source.closest('.paper-fs, .paper-ff') as HTMLElement | null;

  const background = '#FFFFFF';
  const foreground = '#111827';

  // 1. Read the template's own background and check if it's a real color
  const srcBg = getComputedStyle(source).backgroundColor;
  const isTransparent = !srcBg || srcBg === 'rgba(0, 0, 0, 0)' || srcBg === 'transparent';
  // Only templates that paint the page with the accent keep a colored page.
  const paperBg = source.hasAttribute('data-pdf-paper-bg') && !isTransparent ? srcBg : background;

  // DEBUG LOG: Check what the export sees (Remove once verified)
  console.log('pdf bg', { srcBg, flag: source.hasAttribute('data-pdf-paper-bg'), paperBg });

  const A4_W = 794;
  const A4_H = 1122;
  
  // Check for full-bleed requirement
  const bleed = source.hasAttribute('data-pdf-bleed') || !!source.querySelector('[data-pdf-bleed]');
  const pad = bleed ? 0 : Math.round((14 * A4_W) / 210); // 14mm in px, or 0 for bleed

  const clone = source.cloneNode(true) as HTMLElement;

  const container = document.createElement('div');
  container.className = 'ledger-ed';
  container.style.cssText =
    `position:fixed;left:-9999px;top:0;width:${A4_W}px;background:${background};color:${foreground};z-index:-1;pointer-events:none;`;
  if (accent) container.style.setProperty('--accent', accent);
  if (typography) {
    typography.classList.forEach((c) => container.classList.add(c));
    ['--paper-fs', '--paper-ff'].forEach((prop) => {
      const value = typography.style.getPropertyValue(prop);
      if (value) container.style.setProperty(prop, value);
    });
  }
  Object.entries(LIGHT_VARS).forEach(([k, v]) => container.style.setProperty(k, v));
  container.setAttribute('data-theme', 'light');
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    clone.querySelectorAll<HTMLElement>('.print\\:hidden').forEach(el => (el.style.display = 'none'));

    // Capture the frame before stripping it
    const cs = getComputedStyle(source);
    const frameW = parseFloat(cs.borderTopWidth) || 0;
    const hasFrame = frameW > 0 && cs.borderTopStyle !== 'none';

    // Color parser to handle rgb(), hex, and color(srgb ...) values
    const toRgba = (color: string): [number, number, number, number] => {
      const c = document.createElement('canvas');
      c.width = c.height = 1;
      const x = c.getContext('2d')!;
      x.clearRect(0, 0, 1, 1);
      x.fillStyle = color;
      x.fillRect(0, 0, 1, 1);
      const d = x.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3]];
    };
    const toRgb = (color: string): [number, number, number] => {
      const [r, g, b] = toRgba(color);
      return [r, g, b];
    };
    const isTransparentColor = (color: string): boolean => {
      const trimmed = color.trim();
      if (!trimmed || trimmed === 'transparent') return true;
      return toRgba(trimmed)[3] === 0;
    };
    const frameHasPaint = hasFrame && !isTransparentColor(cs.borderTopColor);
    const frameRgb = frameHasPaint ? toRgb(cs.borderTopColor) : [0, 0, 0];

    // Handle repeating header/footer bars for bleed templates
    const hdrEl = clone.querySelector('[data-pdf-header]') as HTMLElement | null;
    const ftrEl = clone.querySelector('[data-pdf-footer]') as HTMLElement | null;
    let repeatBars = bleed && !!hdrEl && !!ftrEl;
    let barMm = 0;
    let barRgb: [number, number, number] = [0, 0, 0];
    if (repeatBars && hdrEl) {
      const barColor = getComputedStyle(hdrEl).backgroundColor;
      if (isTransparentColor(barColor)) {
        repeatBars = false;
      } else {
        barMm = (hdrEl.getBoundingClientRect().height * 210) / A4_W;
        barRgb = toRgb(barColor);
        hdrEl.style.display = 'none';
        ftrEl!.style.display = 'none';
      }
    }

    Object.assign(clone.style, {
      background: paperBg,
      color: foreground,
      width: `${A4_W}px`,
      maxWidth: 'none',
      // Keep the clone's minimum height consistent with the printable area
      minHeight: `${Math.round(((297 - 2 * (bleed ? 0 : 10)) * A4_W) / 210)}px`,
      margin: '0',
      // Keep Retro's padding by skipping the 0 ${pad}px override if it has the flag
      padding: source.hasAttribute('data-pdf-paper-bg') ? '' : `0 ${pad}px`,
      borderRadius: '0',
      border: 'none',
      boxShadow: 'none',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
    });

    // Force the background to ensure it overrides any inherited dark theme surfaces
    if (paperBg !== background) {
      clone.style.setProperty('background-color', paperBg, 'important');
      clone.style.setProperty('background-image', 'none', 'important');
    }

    await document.fonts.ready;
    await Promise.all(
      Array.from(clone.querySelectorAll<HTMLElement>('*')).map(el => {
        const s = getComputedStyle(el);
        return document.fonts
          .load(`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`, 'AaBbCc 0123')
          .catch(() => []);
      })
    );

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

    // Non-bleed: push totals/last child to bottom of available space.
// Corporate's last child is its entire content area, so don't push it down.
if (!bleed && source.getAttribute('data-template') !== 'corporate') {
  const totalsBlock = clone.querySelector('.totals-block') as HTMLElement | null;
  const lastChild = clone.lastElementChild as HTMLElement | null;
  const pushDown = totalsBlock && lastChild === totalsBlock ? totalsBlock : lastChild;
  if (pushDown) pushDown.style.marginTop = 'auto';
}

    // Bleed: push footer to the absolute bottom of the last page and pad to full A4 height
    const footerEl = clone.querySelector('[data-pdf-footer]') as HTMLElement | null;
    if (bleed && footerEl && !repeatBars) {
      footerEl.style.marginTop = 'auto';
      const pages = Math.max(1, Math.ceil(clone.scrollHeight / A4_H));
      clone.style.minHeight = `${pages * A4_H}px`;
    }

    // Fit to one page: if the content is slightly too tall, render wider (up to 40%) so it reflows shorter
    const reserveMm = repeatBars ? 2 * barMm + 6 : bleed ? 0 : 20;
    const availMm = 297 - reserveMm;
    let RW = A4_W;
    let fits = false;
    
    // 2. Widen the ladder so more invoices qualify
    for (const k of [1, 1.06, 1.12, 1.18, 1.25, 1.33, 1.4]) {
      RW = A4_W * k;
      container.style.width = `${RW}px`;
      clone.style.width = `${RW}px`;
      if (clone.scrollHeight <= (availMm * RW) / 210 + 1) { fits = true; break; }
    }
    if (!fits) {
      RW = A4_W;
      container.style.width = `${RW}px`;
      clone.style.width = `${RW}px`;
    }

    // 1. Debug log to verify fit check results (Remove once verified)
    console.log('fit', { template: source.getAttribute('data-template'), fits, RW, h: clone.scrollHeight, availMm });

    const fullHeight = Math.ceil(clone.scrollHeight);

    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: paperBg,
      width: RW,
      height: fullHeight,
      windowWidth: RW,
      windowHeight: fullHeight,
      logging: false,
      onclone: clonedDoc => {
  const root = clonedDoc.documentElement;
  root.classList.remove('dark');
  root.removeAttribute('data-theme');
  root.style.colorScheme = 'light';
  clonedDoc.body.classList.remove('dark');

  // html2canvas can't render small-caps / OpenType feature text with correct widths
  const win = clonedDoc.defaultView!;
  clonedDoc.querySelectorAll<HTMLElement>('.ledger-ed *').forEach(el => {
    const s = win.getComputedStyle(el);
    const caps = s.fontVariantCaps && s.fontVariantCaps !== 'normal';
    const feat = s.fontFeatureSettings && s.fontFeatureSettings !== 'normal';
    if (caps || feat) {
      el.style.fontVariantCaps = 'normal';
      el.style.fontFeatureSettings = 'normal';
      if (caps) el.style.textTransform = 'uppercase';
    }
    el.style.wordSpacing = 'normal';
    el.style.fontKerning = 'none';
        el.style.textRendering = 'optimizeSpeed';
  });
},
    });

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pdfW = pdf.internal.pageSize.getWidth();
    
    // Reduced non-bleed vertical margin from 14 to 10 for more room
    const marginMm = bleed ? 0 : 10;
    const gapMm = bleed ? 8 : 0;

    const scale = canvas.width / RW;
    const pagePx = Math.floor(((297 - 2 * marginMm) * canvas.width) / pdfW);
    const cloneTop = clone.getBoundingClientRect().top;

    // Collect all safe break elements across different template architectures
    const breakEls = [
      ...Array.from(clone.querySelectorAll('tr, .totals-block, .notes-block, [data-pdf-break]')),
      ...Array.from(clone.children),
    ];
    
    const safeBreaks = Array.from(
      new Set(breakEls.map(el => Math.floor((el.getBoundingClientRect().top - cloneTop) * scale) - 2))
    )
      .filter(b => b > 0)
      .sort((a, b) => a - b);

    // Updated page loop with bleed gap logic, repeating bars, and reflow-to-fit
    let y = 0, page = 0;
    while (y < canvas.height - 2 && page < 20) {
      const topMm = repeatBars ? barMm + (page > 0 ? 6 : 0) : bleed ? (page > 0 ? gapMm : 0) : marginMm;
      
      // 4. Make sure the page-1 slice math can't reject a successful fit
      const slicePx = fits && page === 0
        ? canvas.height
        : repeatBars
        ? Math.floor(((297 - topMm - barMm - 6) * canvas.width) / pdfW)
        : bleed
        ? Math.floor(((297 - topMm - gapMm) * canvas.width) / pdfW)
        : pagePx;

      const sliceEff = slicePx;

      let end = Math.min(y + sliceEff, canvas.height);
      if (canvas.height - y > sliceEff) {
        const snap = safeBreaks.filter(b => b > y + sliceEff * 0.25 && b <= end).pop();
        if (snap) end = snap;
      }

      // If the rest fits on this page's real printable height, keep it all here
      const bottomMm = repeatBars ? barMm : bleed ? 0 : marginMm;
      const lastPx = Math.floor(((297 - topMm - bottomMm) * canvas.width) / pdfW);
      if (canvas.height - y <= lastPx) end = canvas.height;

      // 3. Force everything onto one page if the fit check succeeded
      if (fits && page === 0) end = canvas.height;

      const h = end - y;
      if (h <= 0) break;

      const pc = document.createElement('canvas');
      pc.width = canvas.width;
      pc.height = h;
      const ctx = pc.getContext('2d')!;
      ctx.fillStyle = paperBg;
      ctx.fillRect(0, 0, pc.width, pc.height);
      ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);

      if (page > 0) pdf.addPage();

      // Paint the PDF page itself so gaps on continuation pages match
      if (paperBg !== background) {
        const [r, g, b] = toRgb(paperBg);
        pdf.setFillColor(r, g, b);
        pdf.rect(0, 0, pdfW, pdf.internal.pageSize.getHeight(), 'F');
      }

      // Standard image drawing (no scaling needed since reflow handles the height)
      pdf.addImage(pc.toDataURL('image/jpeg', 0.95), 'JPEG', 0, topMm, pdfW, (h * pdfW) / canvas.width);

      // Draw repeating header and footer bars natively on every page
      if (repeatBars) {
        const pdfH = pdf.internal.pageSize.getHeight();
        pdf.setFillColor(barRgb[0], barRgb[1], barRgb[2]);
        pdf.rect(0, 0, pdfW, barMm, 'F');
        pdf.rect(0, pdfH - barMm, pdfW, barMm, 'F');
      }

      if (frameHasPaint) {
        const pdfH = pdf.internal.pageSize.getHeight();
        const lwMm = (frameW * 210) / A4_W;
        pdf.setDrawColor(frameRgb[0], frameRgb[1], frameRgb[2]);
        pdf.setLineWidth(lwMm);
        pdf.rect(lwMm / 2, lwMm / 2, pdfW - lwMm, pdfH - lwMm);
      }

      y = end;
      page++;
    }

    pdf.save(filename);
  } finally {
    container.remove();
  }
}