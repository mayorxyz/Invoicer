import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type CorporateProps = PaperProps & {
  shipToEnabled?: boolean;
  paymentTerms?: string;
  poNumber?: string;
  /** Show dashed page-break guides in the on-screen preview (never exported). */
  showPageGuides?: boolean;
  /** Printable page height; must match your PDF export page height. */
  pageHeight?: string;
};

const avoidBreak: React.CSSProperties = { breakInside: 'avoid', pageBreakInside: 'avoid' };

export function PaperCorporate({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
  showPageGuides = true,
  pageHeight = '297mm',
}: CorporateProps = {} as CorporateProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#801515';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MM/dd/yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const hasItems = !(draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0));
  const termsText = draft.notes || draft.terms || 'Payment is due within 15 days';
  const hasBank = !!(draft.bankName || draft.bankAccount || draft.bankRouting);
  const hasSignature = !!signature;
  const hasRightCol = hasBank || hasSignature;

  const metaRow = 'flex justify-between sm:justify-end gap-6';

  return (
    <div
      className="print-paper relative bg-surface shadow-xl w-full flex flex-col text-[13px] leading-snug text-foreground overflow-visible"
      style={{ fontFamily: 'var(--font-sans)' }}
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
        className="w-full text-white px-6 py-6 sm:px-10 sm:py-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        style={{ backgroundColor: accent, ...avoidBreak }}
      >
        <h1 className="text-3xl sm:text-4xl font-light tracking-wide uppercase leading-none">
          {MODE_LABELS[draft.mode] || 'Invoice'}
        </h1>

        <div className="w-full sm:w-auto sm:text-right font-mono text-xs space-y-0.5">
          <div className={metaRow}><span className="opacity-80">INVOICE #</span><span className="font-semibold">{draft.number}</span></div>
          <div className={metaRow}><span className="opacity-80">INVOICE DATE</span><span>{fmt(draft.issueDate)}</span></div>
          {poNumber && <div className={metaRow}><span className="opacity-80">P.O.#</span><span>{poNumber}</span></div>}
          {!isReceipt && <div className={metaRow}><span className="opacity-80">DUE DATE</span><span>{fmt(draft.dueDate)}</span></div>}
          {paymentTerms && <div className={metaRow}><span className="opacity-80">TERMS</span><span>{paymentTerms}</span></div>}
          {extraFields.map((f: any) => (
            <div key={f.label} className={metaRow}><span className="opacity-80 uppercase">{f.label}</span><span className="break-words">{f.value}</span></div>
          ))}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col gap-6">
        {/* From / Bill To / Ship To / Total */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${shipToEnabled ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-5 pb-5 border-b border-border/60 text-xs`}
        >
          <div className="min-w-0 space-y-0.5">
            <p className="font-bold uppercase tracking-wider text-slate">From</p>
            {business.logo && <img src={business.logo} alt="Logo" className="h-6 mb-1 object-contain" />}
            <p className="font-semibold text-ink text-sm break-words">{business.name || 'John Smith'}</p>
            {business.address && <p className="text-slate whitespace-pre-line break-words">{business.address}</p>}
            {business.email && <p className="text-slate break-words">{business.email}</p>}
            {business.phone && <p className="text-slate">{business.phone}</p>}
            {business.taxId && <p className="font-mono text-[11px] text-slate">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>}
          </div>

          <div className="min-w-0 space-y-0.5">
            <p className="font-bold uppercase tracking-wider text-slate">Bill To</p>
            <p className="font-semibold text-ink text-sm break-words">{draft.client?.name || 'Client Name'}</p>
            {draft.client?.address && <p className="text-slate whitespace-pre-line break-words">{draft.client.address}</p>}
            {draft.client?.email && <p className="text-slate break-words">{draft.client.email}</p>}
            {draft.client?.phone && <p className="text-slate">{draft.client.phone}</p>}
          </div>

          {shipToEnabled && (
            <div className="min-w-0 space-y-0.5">
              <p className="font-bold uppercase tracking-wider text-slate">Ship To</p>
              <p className="font-semibold text-ink text-sm break-words">{draft.shipToName || 'Recipient Name'}</p>
              {draft.shipToAddress && <p className="text-slate whitespace-pre-line break-words">{draft.shipToAddress}</p>}
            </div>
          )}

          <div className="min-w-0 space-y-0.5 sm:text-right">
            <p className="font-bold uppercase tracking-wider text-slate">Invoice Total</p>
            <p className="text-2xl font-bold font-mono tracking-tight break-words" style={{ color: accent }}>{m(t.total)}</p>
          </div>
        </div>

        {/* Items Table (header repeats on every page, rows never split) */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-xs table-fixed border-collapse">
            <colgroup>
              <col />
              <col style={{ width: '7rem' }} />
              <col style={{ width: '3.5rem' }} />
              <col style={{ width: '7rem' }} />
            </colgroup>
            <thead style={{ display: 'table-header-group' }}>
              <tr className="border-b-2 font-mono tracking-wider" style={{ borderColor: accent, color: accent }}>
                <th className="py-2 px-2 text-left uppercase">Description</th>
                <th className="py-2 px-2 text-right uppercase">Unit Price</th>
                <th className="py-2 px-2 text-center uppercase">Qty</th>
                <th className="py-2 px-2 text-right uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {!hasItems ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 italic text-slate">No line items added yet.</td>
                </tr>
              ) : (
                draft.items.map((item: any) => {
                  const detail = item.customFields?.[0]?.value;
                  return (
                    <tr key={item.id} data-pdf-break style={avoidBreak}>
                      <td className="py-2 px-2 align-top">
                        <div className="font-medium text-ink break-words">{item.desc || 'Untitled Item'}</div>
                        {detail && <div className="text-[11px] text-slate mt-0.5 whitespace-pre-line break-words">{detail}</div>}
                      </td>
                      <td className="py-2 px-2 text-right align-top font-mono text-slate whitespace-nowrap">{m(toMinor(item.price, draft.currency))}</td>
                      <td className="py-2 px-2 text-center align-top font-mono text-slate">{item.qty}</td>
                      <td className="py-2 px-2 text-right align-top font-mono font-semibold text-ink whitespace-nowrap">{m(Math.round(item.qty * toMinor(item.price, draft.currency)))}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Totals: one block, directly under the table */}
        <div data-pdf-break style={avoidBreak} className="flex justify-end">
          <div className="w-full sm:w-72 text-xs font-mono">
            <div className="flex justify-between py-1"><span style={{ color: accent }} className="font-bold">SUBTOTAL</span><span className="text-ink">{m(t.subtotal)}</span></div>
            {t.invoiceDiscount > 0 && <div className="flex justify-between py-1"><span className="text-slate">Discount</span><span className="text-ink">-{m(t.invoiceDiscount)}</span></div>}
            {t.taxAdded > 0 && <div className="flex justify-between py-1"><span style={{ color: accent }} className="font-bold">Sales Tax</span><span className="text-ink">{m(t.taxAdded)}</span></div>}
            {t.shipping > 0 && <div className="flex justify-between py-1"><span className="text-slate">Shipping</span><span className="text-ink">{m(t.shipping)}</span></div>}
            <div className="flex justify-between items-baseline gap-4 mt-1 pt-2 border-t-2" style={{ borderColor: accent, color: accent }}>
              <span className="text-base font-bold uppercase tracking-wider">Total</span>
              <span className="text-lg font-bold">{m(t.total)}</span>
            </div>
            {t.paid > 0 && (
              <>
                <div className="flex justify-between py-1 text-slate"><span>Paid</span><span>-{m(t.paid)}</span></div>
                <div className="flex justify-between py-1 font-bold text-ink"><span>Balance Due</span><span>{m(Math.max(0, t.balance))}</span></div>
              </>
            )}
          </div>
        </div>

        {/* Terms | Bank + Signature (no forced bottom push, no empty columns) */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${hasRightCol ? 'sm:grid-cols-2' : ''} gap-6 pt-4 border-t border-border/60`}
        >
          <div className="min-w-0 space-y-2">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate text-[10px] mb-1 font-mono">Terms & Conditions</p>
              <p className="text-xs text-slate whitespace-pre-line break-words">{termsText}</p>
            </div>
            {draft.terms && draft.notes && (
              <p className="text-xs text-slate whitespace-pre-line break-words">{draft.terms}</p>
            )}
          </div>

          {hasRightCol && (
            <div className="min-w-0 space-y-3">
              {hasBank && (
                <div className="text-xs space-y-0.5 text-slate">
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
              {hasSignature && (
                <div className="flex sm:justify-end">
                  <img src={signature} alt="Signature" className="max-h-16 max-w-[16rem] object-contain" />
                </div>
              )}
            </div>
          )}
        </div>

        {photos.length > 0 && (
          <div className="border-t border-border pt-3" style={avoidBreak}>
            <p className="font-bold uppercase tracking-wider text-slate text-[10px] mb-2 font-mono">Attachments</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-28 object-cover rounded border border-border" style={avoidBreak} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}