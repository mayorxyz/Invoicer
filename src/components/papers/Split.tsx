import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type SplitProps = PaperProps & {
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

export function PaperSplit({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
  showPageGuides = true,
  pageHeight = '297mm',
}: SplitProps = {} as SplitProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#3b82f6';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MM/dd/yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const hasItems = !(draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0));
  const termsText = draft.notes || draft.terms || 'Payment is due within 15 days';
  const hasBank = !!(draft.bankName || draft.bankAccount || draft.bankRouting);

  const metaRow = 'flex justify-between sm:justify-end gap-4';

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

      {/* Top Accent Bar */}
      <div className="w-full h-3 sm:h-4" style={{ backgroundColor: accent, ...keepColors, ...avoidBreak }} />

      <div className="px-6 py-5 sm:px-10 sm:py-6 flex flex-col gap-5">
        {/* Business Header */}
        <div data-pdf-break style={avoidBreak} className="space-y-0.5">
          {business.logo && <img src={business.logo} alt="Logo" className="h-10 mb-1 object-contain" />}
          <h1 className="text-xl sm:text-2xl font-bold text-ink break-words leading-tight">{business.name || 'John Smith'}</h1>
          {business.address && <p className="text-xs text-slate whitespace-pre-line break-words">{business.address}</p>}
          {(business.email || business.phone || business.taxId) && (
            <p className="text-xs text-slate break-words">
              {business.email}{business.email && business.phone ? ' • ' : ''}{business.phone}
              {business.taxId && <span className="font-mono">{(business.email || business.phone) ? ' • ' : ''}{business.taxIdLabel || 'Tax ID'}: {business.taxId}</span>}
            </p>
          )}
        </div>

        {/* Bill To / Ship To / Meta */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${shipToEnabled ? 'sm:grid-cols-[1fr_1fr_auto]' : 'sm:grid-cols-[1fr_auto]'} gap-y-4 gap-x-10 pb-4 border-b border-border/60 text-xs`}
        >
          <div className="min-w-0 space-y-0.5">
            <p className="font-bold uppercase tracking-wider text-ink">Bill To</p>
            <p className="font-semibold text-ink break-words">{draft.client?.name || 'Client Name'}</p>
            {draft.client?.address && <p className="text-slate whitespace-pre-line break-words">{draft.client.address}</p>}
            {draft.client?.email && <p className="text-slate break-words">{draft.client.email}</p>}
            {draft.client?.phone && <p className="text-slate">{draft.client.phone}</p>}
          </div>

          {shipToEnabled && (
            <div className="min-w-0 space-y-0.5">
              <p className="font-bold uppercase tracking-wider text-ink">Ship To</p>
              <p className="font-semibold text-ink break-words">{draft.shipToName || 'Recipient Name'}</p>
              {draft.shipToAddress && <p className="text-slate whitespace-pre-line break-words">{draft.shipToAddress}</p>}
            </div>
          )}

          <div className="min-w-0 sm:min-w-[14rem] font-mono space-y-0.5">
            <div className={metaRow}><span className="text-slate">INVOICE #</span><span className="font-bold text-ink">{draft.number}</span></div>
            <div className={metaRow}><span className="text-slate">INVOICE DATE</span><span>{fmt(draft.issueDate)}</span></div>
            {poNumber && <div className={metaRow}><span className="text-slate">P.O.#</span><span className="break-words">{poNumber}</span></div>}
            {paymentTerms && !isReceipt && <div className={metaRow}><span className="text-slate">TERMS</span><span className="break-words">{paymentTerms}</span></div>}
            {!isReceipt && <div className={metaRow}><span className="text-slate">DUE DATE</span><span>{fmt(draft.dueDate)}</span></div>}
            {extraFields.map((f: any) => (
              <div key={f.label} className={metaRow}><span className="text-slate">{f.label}</span><span className="break-words">{f.value}</span></div>
            ))}
          </div>
        </div>

        {/* Invoice Total Banner */}
        <div data-pdf-break style={avoidBreak} className="flex justify-between items-center gap-4 px-4 py-3 border-y-2 border-border/80">
          <span className="text-xl sm:text-2xl font-bold tracking-tight text-ink">
            {MODE_LABELS[draft.mode] || 'Invoice'} Total
          </span>
          <span className="text-xl sm:text-2xl font-bold font-mono text-ink">{m(Math.max(0, t.balance))}</span>
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
              <tr className="border-b border-border/60 font-bold uppercase font-mono tracking-wider text-ink">
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

        {/* Subtotal, Taxes, Paid */}
        <div data-pdf-break style={avoidBreak} className="flex justify-end">
          <div className="w-full sm:w-64 text-xs font-mono">
            <div className="flex justify-between py-0.5"><span className="font-medium text-ink">Subtotal</span><span className="text-ink">{m(t.subtotal)}</span></div>
            {t.invoiceDiscount > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Discount</span><span className="text-ink">-{m(t.invoiceDiscount)}</span></div>}
            {t.taxAdded > 0 && <div className="flex justify-between py-0.5"><span className="font-medium text-ink">Sales Tax</span><span className="text-ink">{m(t.taxAdded)}</span></div>}
            {t.shipping > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Shipping</span><span className="text-ink">{m(t.shipping)}</span></div>}
            {t.paid > 0 && <div className="flex justify-between py-0.5"><span className="text-slate">Amount Previously Paid</span><span className="text-ink">-{m(t.paid)}</span></div>}
          </div>
        </div>

        {/* Terms / Banking | Signature */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${signature ? 'sm:grid-cols-[1fr_auto]' : ''} gap-x-10 gap-y-4 pt-4 border-t border-border/40 items-end`}
        >
          <div className="min-w-0 space-y-2 text-xs">
            <div>
              <p className="font-bold uppercase tracking-wider text-ink text-[11px] mb-0.5 font-mono">Terms & Conditions</p>
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

          {signature && (
            <div className="w-56 sm:justify-self-end">
              <div className="h-14 flex items-end justify-center">
                <img src={signature} alt="Signature" className="max-h-14 max-w-full object-contain" />
              </div>
            </div>
          )}
        </div>

        {photos.length > 0 && (
          <div style={avoidBreak} className="space-y-2 border-t border-border/40 pt-3">
            <p className="font-bold uppercase tracking-wider text-ink text-[11px] font-mono">Attachments</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-24 object-cover rounded border border-border" style={avoidBreak} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Accent Bar */}
      <div className="w-full h-3 sm:h-4" style={{ backgroundColor: accent, ...keepColors, ...avoidBreak }} />
    </div>
  );
}