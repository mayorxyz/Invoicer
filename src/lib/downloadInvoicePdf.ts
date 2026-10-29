import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

/**
 * Sanitize filename by removing invalid characters and replacing spaces with hyphens
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '-') // Replace invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Download invoice paper as PDF
 * @param paperElement - The paper DOM element to capture
 * @param documentNumber - Document number for filename
 * @param clientName - Client name for filename
 */
export async function downloadInvoicePdf(
  paperElement: HTMLElement,
  documentNumber: string,
  clientName: string
): Promise<void> {
  // Build filename
  let filename = 'invoice.pdf';
  if (documentNumber && clientName) {
    filename = `${sanitizeFilename(documentNumber)}-${sanitizeFilename(clientName)}.pdf`;
  } else if (documentNumber) {
    filename = `${sanitizeFilename(documentNumber)}.pdf`;
  }

  // Clone the paper element
  const clone = paperElement.cloneNode(true) as HTMLElement;
  
  // Create off-screen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 width at 96dpi
  container.style.background = '#FFFFFF';
  container.style.color = '#000000';
  container.style.zIndex = '-1';
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    clone.style.background = '#FFFFFF';
    clone.style.color = '#1a1a1a';
    clone.style.maxWidth = 'none';
    clone.style.width = '100%';
    clone.style.margin = '0';
    clone.style.boxShadow = 'none';

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

    const placeholders = clone.querySelectorAll('.print\\:hidden');
    placeholders.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Wait for fonts
    await document.fonts.ready;
    
    // Wait for all images to load
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

    // Capture with html2canvas
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFFFFF',
      width: 794,
      windowWidth: 794,
      logging: false,
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // 10mm margins
    const contentWidth = pdfWidth - 2 * margin;
    const contentHeight = pdfHeight - 2 * margin;

    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * contentWidth) / canvas.width;

    // Find break points for multi-page splitting
    const breakPoints = findBreakPoints(clone, canvas.height, contentWidth);
    
    if (imgHeight <= contentHeight) {
      // Single page - fits entirely
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.95),
        'JPEG',
        margin,
        margin,
        imgWidth,
        imgHeight
      );
    } else {
      // Multi-page - split at break points
      let currentY = 0;
      let pageIndex = 0;

      while (currentY < canvas.height) {
        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Calculate how much of the image to show on this page
        const pageHeight = Math.min(contentHeight, imgHeight - (currentY * contentWidth / canvas.width));
        
        // Create a temporary canvas for this page section
        const pageCanvas = document.createElement('canvas');
        const pageCtx = pageCanvas.getContext('2d');
        
        if (pageCtx) {
          const sourceY = (currentY / canvas.height) * canvas.height;
          const sourceHeight = Math.min(
            (pageHeight / contentHeight) * canvas.height,
            canvas.height - sourceY
          );

          pageCanvas.width = canvas.width;
          pageCanvas.height = sourceHeight;
          
          pageCtx.drawImage(
            canvas,
            0,
            sourceY,
            canvas.width,
            sourceHeight,
            0,
            0,
            canvas.width,
            sourceHeight
          );

          const pageImgHeight = (sourceHeight * contentWidth) / canvas.width;
          
          pdf.addImage(
            pageCanvas.toDataURL('image/jpeg', 0.95),
            'JPEG',
            margin,
            margin,
            contentWidth,
            pageImgHeight
          );
        }

        // Move to next break point
        currentY = findNextBreakPoint(breakPoints, currentY, canvas.height, contentHeight / imgHeight * canvas.height);
        pageIndex++;

        // Safety check to prevent infinite loop
        if (pageIndex > 20) break;
      }
    }

    // Save PDF
    pdf.save(filename);
  } finally {
    // Always remove the clone container
    if (container.parentNode) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Find natural break points in the document (between sections)
 */
function findBreakPoints(
  clone: HTMLElement,
  totalHeight: number,
  contentWidth: number
): number[] {
  const breakPoints: number[] = [0]; // Start with 0
  
  // Look for major sections that should not be split
  const sections = clone.querySelectorAll(
    'table, .totals-block, .notes-block, .paper-signature, [style*="break-inside"]'
  );
  
  let currentOffset = 0;
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    const sectionTop = currentOffset + rect.top;
    const sectionBottom = sectionTop + rect.height;
    
    // Add break point before this section
    if (sectionTop > 0) {
      breakPoints.push(sectionTop);
    }
    
    currentOffset = sectionBottom;
  });
  
  // Add end point
  breakPoints.push(totalHeight);
  
  return breakPoints.sort((a, b) => a - b);
}

/**
 * Find the next break point that fits on the current page
 */
function findNextBreakPoint(
  breakPoints: number[],
  currentY: number,
  totalHeight: number,
  pageHeight: number
): number {
  const targetY = currentY + pageHeight;
  
  // Find the largest break point that fits on this page
  let bestBreak = targetY;
  for (const bp of breakPoints) {
    if (bp > currentY && bp <= targetY) {
      bestBreak = bp;
    }
  }
  
  // If no good break point found, just use target
  return bestBreak >= totalHeight ? totalHeight : bestBreak;
}
