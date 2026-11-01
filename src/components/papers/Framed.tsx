import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type FramedProps = PaperProps & {
  shipToEnabled?: boolean;
  paymentTerms?: string;
  poNumber?: string;
  /** Show red page-break guides in the on-screen preview (never exported). */
  showPageGuides?: boolean;
  /** Printable page height; must match your PDF export page height minus margins. */
  pageHeight?: string;
  /**
   * true  = CSS border is omitted; the frame is drawn on every PDF page by drawPdfFrame().
   * false = CSS border (screen preview and browser print / Save as PDF).
   */
  pdfFrame?: boolean;
};

/**
 * Call after html2pdf/jsPDF has built the document. Draws the full frame on EVERY page,
 * including a partly filled last page. Keep the PDF margin >= widthMm + 4 so text clears it.
 *
 * html2pdf().set({ margin: 8 }).from(el).toPdf().get('pdf')
 *   .then((pdf) => drawPdfFrame(pdf, accent)).save();
 * (render the paper with pdfFrame={true} for this export)
 */
export function drawPdfFrame(pdf: any, color = '#1e1b18', widthMm = 2) {
  const pages = pdf.internal.getNumberOfPages();
  const w = pdf.internal.pageSize.getWidth();
  const h = pdf.internal.pageSize.getHeight();
  pdf.setDrawColor(color);
  pdf.setLineWidth(widthMm);
  for (let i = 1; i <= pages; i++) {
    pdf.setPage(i);
    pdf.rect(widthMm / 2, widthMm / 2, w - widthMm, h - widthMm, 'S');
  }
}

const avoidBreak: React.CSSProperties = { breakInside: 'avoid', pageBreakInside: 'avoid' };
const keepColors: React.CSSProperties = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties;

export function PaperFramed({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
  showPageGuides = true,
  pageHeight = '297mm',
  pdfFrame = false,
}: FramedProps = {} as FramedProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#1e1b18';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MM/dd/yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const hasItems = !(draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0));
  const termsText = draft.notes || draft.terms || 'Payment is due within 15 days';
  const hasBank = !!(draft.bankName || draft.bankAccount || draft.bankRouting);

  const metaRow = 'flex justify-between sm:justify-end gap-6';

  // Frame: border repeats on every printed page via box-decoration-break (Chrome/Edge print).
  const frameStyle: React.CSSProperties = pdfFrame
    ? { fontFamily: 'var(--font-sans)', ...keepColors }
    : {
        borderColor: accent,
        borderStyle: 'solid',
        borderWidth: '8px',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone',
        fontFamily: 'var(--font-sans)',
        ...keepColors,
      } as React.CSSProperties;

  return (
    <div
      className="print-paper relative bg-surface shadow-xl w-full flex flex-col text-[13px] leading-snug text-foreground overflow-visible"
      style={frameStyle}
    >
      {/* Preview-only page guides: hidden in print and skipped by html2canvas/html2pdf */}
      {showPageGuides && (
        <div
          aria-hidden
          data-html2canvas-ignore="true"
          className="print:hidden pointer-events-none absolute inset-0 z-10"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, transparent 0, transparent calc(${pageHeight} - 2px), rgba(220,38,38,0.55) calc(${pageHeight} - 2px), rgba(220,38,38,0.55) ${pageHeight})`,
          }}
        />
      )}

      {/* Header bar (inside the frame, first page only) */}
      <div
        className="w-full text-white px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        style={{ backgroundColor: accent, ...keepColors, ...avoidBreak }}
      >
        <div className="text-xl sm:text-2xl font-mono font-bold tracking-tight break-words">#{draft.number}</div>

        <div className="w-full sm:w-auto sm:text-right font-mono text-xs space-y-0.5 italic">
          <div className={metaRow}><span className="opacity-80 not-italic">Invoice Date</span><span>{fmt(draft.issueDate)}</span></div>
          {poNumber && <div className={metaRow}><span className="opacity-80 not-italic">P.O.#</span><span>{poNumber}</span></div>}
          {!isReceipt && <div className={metaRow}><span className="opacity-80 not-italic">Due Date</span><span>{fmt(draft.dueDate)}</span></div>}
          {paymentTerms && !isReceipt && <div className={metaRow}><span className="opacity-80 not-italic">Terms</span><span>{paymentTerms}</span></div>}
          {extraFields.map((f: any) => (
            <div key={f.label} className={metaRow}><span className="opacity-80 not-italic">{f.label}</span><span className="break-words">{f.value}</span></div>
          ))}
        </div>
      </div>

      <div className="px-6 py-5 sm:px-8 sm:py-6 flex flex-col gap-5">
        {/* Business profile */}
        <div data-pdf-break style={avoidBreak} className="text-center space-y-0.5 pb-4 border-b border-border/40">
          {business.logo && <img src={business.logo} alt="Logo" className="h-9 mx-auto mb-1 object-contain" />}
          <h1 className="text-xl sm:text-2xl font-serif font-bold italic text-ink break-words leading-tight">{business.name || 'Signature'}</h1>
          {business.address && <p className="text-xs text-slate whitespace-pre-line break-words">{business.address}</p>}
          {(business.email || business.phone || business.taxId) && (
            <p className="text-xs text-slate break-words">
              {business.email}{business.email && business.phone ? ' • ' : ''}{business.phone}
              {business.taxId && <span className="font-mono">{(business.email || business.phone) ? ' • ' : ''}{business.taxIdLabel || 'Tax ID'}: {business.taxId}</span>}
            </p>
          )}
        </div>

        {/* Bill To & Ship To */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${shipToEnabled ? 'sm:grid-cols-2' : ''} gap-x-12 gap-y-4 pb-4 border-b border-border/40 text-xs ${shipToEnabled ? '' : 'sm:text-center'}`}
        >
          <div className="min-w-0 space-y-0.5">
            <p className="font-serif italic font-bold text-ink text-sm">Bill To</p>
            <p className="font-medium text-ink break-words">{draft.client?.name || 'Jessie M Horne'}</p>
            {draft.client?.address ? (
              <p className="text-slate whitespace-pre-line break-words">{draft.client.address}</p>
            ) : (
              <p className="text-slate">4312 Wood Road<br />New York, NY 10031</p>
            )}
          </div>

          {shipToEnabled && (
            <div className="min-w-0 space-y-0.5">
              <p className="font-serif italic font-bold text-ink text-sm">Ship To</p>
              <p className="font-medium text-ink break-words">{draft.shipToName || 'Jessie M Horne'}</p>
              {draft.shipToAddress ? (
                <p className="text-slate whitespace-pre-line break-words">{draft.shipToAddress}</p>
              ) : (
                <p className="text-slate">2019 Redbud Drive<br />New York, NY 10011</p>
              )}
            </div>
          )}
        </div>

        {/* Items Table (header repeats on every page, rows never split) */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-xs table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '3.5rem' }} />
              <col />
              <col style={{ width: '7rem' }} />
              <col style={{ width: '7rem' }} />
            </colgroup>
            <thead style={{ display: 'table-header-group' }}>
              <tr className="border-b border-ink font-serif italic text-ink">
                <th className="py-2 px-2 text-left">Qty</th>
                <th className="py-2 px-2 text-left">Description</th>
                <th className="py-2 px-2 text-right">Unit Price</th>
                <th className="py-2 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {!hasItems ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 italic text-slate">No line items added yet.</td>
                </tr>
              ) : (
                draft.items.map((item: any) => {
                  const detail = item.customFields?.[0]?.value;
                  return (
                    <tr key={item.id} data-pdf-break style={avoidBreak}>
                      <td className="py-2.5 px-2 align-top font-mono text-slate">{item.qty}</td>
                      <td className="py-2.5 px-2 align-top">
                        <div className="font-medium text-ink break-words">{item.desc || 'Untitled Item'}</div>
                        {detail && <div className="text-[11px] text-slate mt-0.5 whitespace-pre-line break-words">{detail}</div>}
                      </td>
                      <td className="py-2.5 px-2 text-right align-top font-mono text-slate whitespace-nowrap">{m(toMinor(item.price, draft.currency))}</td>
                      <td className="py-2.5 px-2 text-right align-top font-mono font-medium text-ink whitespace-nowrap">{m(Math.round(item.qty * toMinor(item.price, draft.currency)))}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Subtotal & Taxes */}
        <div data-pdf-break style={avoidBreak} className="flex justify-end">
          <div className="w-full sm:w-64 text-xs font-mono">
            <div className="flex justify-between py-0.5"><span className="font-serif italic font-bold text-ink">Subtotal</span><span className="text-ink">{m(t.subtotal)}</span></div>
            {t.invoiceDiscount > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Discount</span><span className="text-ink">-{m(t.invoiceDiscount)}</span></div>}
            {t.taxAdded > 0 && <div className="flex justify-between py-0.5"><span className="font-serif italic font-bold text-ink">Sales Tax</span><span className="text-ink">{m(t.taxAdded)}</span></div>}
            {t.shipping > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Shipping</span><span className="text-ink">{m(t.shipping)}</span></div>}
          </div>
        </div>

        {/* Invoice Total */}
        <div data-pdf-break style={avoidBreak} className="flex justify-between items-center gap-4 pt-3 border-t border-border/60">
          <div className="font-serif italic text-2xl font-bold tracking-tight text-ink">Invoice Total</div>
          <div className="text-2xl font-mono font-bold text-ink">{m(t.total)}</div>
        </div>

        {t.paid > 0 && (
          <div data-pdf-break style={avoidBreak} className="flex justify-end font-mono text-xs text-slate -mt-3">
            <span>Amount Paid: -{m(t.paid)} (Balance Due: {m(Math.max(0, t.balance))})</span>
          </div>
        )}

        {/* Terms | Banking + Signature */}
        <div
          data-pdf-break
          style={avoidBreak}
          className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-10 gap-y-5 pt-4 border-t border-border/40 items-end"
        >
          <div className="min-w-0 space-y-2 text-xs">
            <div>
              <p className="font-serif italic font-bold text-ink text-sm mb-0.5">Terms & Conditions</p>
              <p className="text-slate whitespace-pre-line break-words">{termsText}</p>
            </div>
            {draft.terms && draft.notes && (
              <p className="text-slate whitespace-pre-line break-words">{draft.terms}</p>
            )}
            {hasBank && (
              <div className="space-y-0.5 text-slate">
                {draft.bankName && (
                  <>
                    <p className="font-bold uppercase tracking-wider text-[10px] font-mono">Name of Bank</p>
                    <p className="font-mono break-words">{draft.bankName}</p>
                  </>
                )}
                {draft.bankAccount && <p className="font-mono break-words">Account number: {draft.bankAccount}</p>}
                {draft.bankRouting && <p className="font-mono break-words">Routing: {draft.bankRouting}</p>}
              </div>
            )}
          </div>

          <div className="w-56 text-center sm:justify-self-end">
            <div className="h-14 flex items-end justify-center">
              {signature ? (
                <img src={signature} alt="Signature" className="max-h-14 max-w-full object-contain" />
              ) : (
                <span className="font-serif italic text-2xl tracking-tighter">Signature</span>
              )}
            </div>
          </div>
        </div>

        {photos.length > 0 && (
          <div style={avoidBreak} className="space-y-2 border-t border-border/40 pt-3">
            <p className="font-serif italic font-bold text-ink text-sm">Attachments</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-24 object-cover rounded border border-border" style={avoidBreak} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}