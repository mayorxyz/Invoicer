import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type SidebarProps = PaperProps & {
  shipToEnabled?: boolean;
  paymentTerms?: string;
  poNumber?: string;
  /** Show red page-break guides in the on-screen preview (never exported). */
  showPageGuides?: boolean;
  /** Printable page height; must match your PDF export page height minus margins. */
  pageHeight?: string;
};

const avoidBreak: React.CSSProperties = { breakInside: 'avoid', pageBreakInside: 'avoid' };
const keepColors = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties;

export function PaperSidebar({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
  showPageGuides = true,
  pageHeight = '297mm',
}: SidebarProps = {} as SidebarProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#dc2626';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MM/dd/yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const hasItems = !(draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0));
  const termsText = draft.notes || draft.terms || 'Payment is due within 15 days';
  const hasBank = !!(draft.bankName || draft.bankAccount || draft.bankRouting);
  const hasPhotos = photos.length > 0;

  const label = 'font-bold uppercase tracking-wider mb-0.5';

  return (
    <div
      className="print-paper relative bg-surface shadow-xl w-full flex flex-col text-[13px] leading-snug text-foreground overflow-visible"
      style={{ fontFamily: 'var(--font-sans)', ...keepColors }}
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

      {/* Top Banner */}
      <div
        className="w-full text-white px-6 py-5 sm:px-10 sm:py-6 space-y-1"
        style={{ backgroundColor: accent, ...keepColors, ...avoidBreak }}
      >
        <h1 className="text-3xl sm:text-4xl font-light uppercase tracking-wide leading-none break-words">
          {MODE_LABELS[draft.mode] || 'Invoice'}
        </h1>
        <div className="text-2xl sm:text-3xl font-bold font-mono break-words">{m(t.total)}</div>
        <div className="text-xs font-mono opacity-90">Invoice Date: {fmt(draft.issueDate)}</div>
      </div>

      <div className="px-6 py-5 sm:px-10 sm:py-6 flex flex-col gap-5">
        {/* Sidebar | Main. The divider is the main column's left border, so it continues on every page. */}
        <div className="grid grid-cols-1 sm:grid-cols-[11.5rem_1fr]">
          {/* Left Sidebar */}
          <div style={avoidBreak} className="space-y-3.5 sm:pr-5 pb-4 sm:pb-0 text-xs font-mono min-w-0">
            <div>
              <p className={label} style={{ color: accent }}>INVOICE #</p>
              <p className="text-ink font-semibold break-words">{draft.number}</p>
            </div>

            <div className="space-y-0.5">
              <p className={label} style={{ color: accent }}>From</p>
              {business.logo && <img src={business.logo} alt="Logo" className="h-8 mb-1 object-contain" />}
              <p className="font-semibold text-ink break-words">{business.name || 'John Smith'}</p>
              {business.address && <p className="text-slate whitespace-pre-line break-words">{business.address}</p>}
              {business.email && <p className="text-slate break-words">{business.email}</p>}
              {business.phone && <p className="text-slate">{business.phone}</p>}
              {business.taxId && <p className="text-[11px] text-slate break-words">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>}
            </div>

            <div className="space-y-0.5">
              <p className={label} style={{ color: accent }}>Bill To</p>
              <p className="font-semibold text-ink break-words">{draft.client?.name || 'Client Name'}</p>
              {draft.client?.address && <p className="text-slate whitespace-pre-line break-words">{draft.client.address}</p>}
              {draft.client?.email && <p className="text-slate break-words">{draft.client.email}</p>}
              {draft.client?.phone && <p className="text-slate">{draft.client.phone}</p>}
            </div>

            {shipToEnabled && (
              <div className="space-y-0.5">
                <p className={label} style={{ color: accent }}>Ship To</p>
                <p className="font-semibold text-ink break-words">{draft.shipToName || 'Recipient Name'}</p>
                {draft.shipToAddress && <p className="text-slate whitespace-pre-line break-words">{draft.shipToAddress}</p>}
              </div>
            )}

            {poNumber && (
              <div>
                <p className={label} style={{ color: accent }}>P.O.#</p>
                <p className="text-ink break-words">{poNumber}</p>
              </div>
            )}

            {!isReceipt && (
              <div>
                <p className={label} style={{ color: accent }}>Due Date</p>
                <p className="text-ink">{fmt(draft.dueDate)}</p>
              </div>
            )}

            {paymentTerms && !isReceipt && (
              <div>
                <p className={label} style={{ color: accent }}>Terms</p>
                <p className="text-ink break-words">{paymentTerms}</p>
              </div>
            )}

            {extraFields.map((f: any) => (
              <div key={f.label}>
                <p className={label} style={{ color: accent }}>{f.label}</p>
                <p className="text-ink break-words">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Right Main Content */}
          <div className="min-w-0 sm:border-l border-border/60 sm:pl-5 flex flex-col gap-4">
            {/* Items Table (header repeats on every page, rows never split) */}
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-xs table-fixed border-collapse">
                <colgroup>
                  <col style={{ width: '3rem' }} />
                  <col />
                  <col style={{ width: '6rem' }} />
                  <col style={{ width: '6.5rem' }} />
                </colgroup>
                <thead style={{ display: 'table-header-group' }}>
                  <tr className="border-b border-border/60 font-bold uppercase font-mono tracking-wider" style={{ color: accent }}>
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

            {/* Subtotal, Taxes, Total, Paid, Signature: kept together under the table */}
            <div data-pdf-break style={avoidBreak} className="space-y-2">
              <div className="flex justify-end">
                <div className="w-full sm:w-64 text-xs font-mono">
                  <div className="flex justify-between py-0.5"><span className="font-medium text-ink">Subtotal</span><span className="text-ink">{m(t.subtotal)}</span></div>
                  {t.invoiceDiscount > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Discount</span><span className="text-ink">-{m(t.invoiceDiscount)}</span></div>}
                  {t.taxAdded > 0 && <div className="flex justify-between py-0.5"><span className="font-medium text-ink">Sales Tax</span><span className="text-ink">{m(t.taxAdded)}</span></div>}
                  {t.shipping > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Shipping</span><span className="text-ink">{m(t.shipping)}</span></div>}
                </div>
              </div>

              <div className="flex justify-between items-center gap-4 pt-2 border-t border-border/60">
                <span className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-ink">Total</span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-ink">{m(t.total)}</span>
              </div>

              {t.paid > 0 && (
                <div className="flex justify-end font-mono text-xs text-slate">
                  <span>Amount Paid: -{m(t.paid)} (Balance Due: {m(Math.max(0, t.balance))})</span>
                </div>
              )}

              {signature && (
                <div className="flex justify-end pt-1">
                  <div className="w-56 h-14 flex items-end justify-center">
                    <img src={signature} alt="Signature" className="max-h-14 max-w-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Terms / Banking (| Attachments) */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${hasPhotos ? 'sm:grid-cols-2' : ''} gap-x-10 gap-y-4 pt-4 border-t border-border/40`}
        >
          <div className="min-w-0 space-y-2 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-[11px] mb-0.5 font-mono" style={{ color: accent }}>Terms & Conditions</p>
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

          {hasPhotos && (
            <div className="min-w-0 space-y-1.5">
              <p className="font-bold uppercase tracking-wider text-slate text-[11px] font-mono">Attachments</p>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((p, i) => (
                  <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-24 object-cover rounded border border-border" style={avoidBreak} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}