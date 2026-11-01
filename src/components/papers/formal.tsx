import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type ModernProps = PaperProps & {
  shipToEnabled?: boolean;
  paymentTerms?: string;
  poNumber?: string;
  /** Show red page-break guides in the on-screen preview (never exported). */
  showPageGuides?: boolean;
  /** Printable page height; must match your PDF export page height. */
  pageHeight?: string;
};

const avoidBreak: React.CSSProperties = { breakInside: 'avoid', pageBreakInside: 'avoid' };

export function Paperformal({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
  showPageGuides = true,
  pageHeight = '297mm',
}: ModernProps = {} as ModernProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#1e293b';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MM/dd/yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const hasItems = !(draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0));
  const hasBank = !!(draft.bankName || draft.bankAccount || draft.bankRouting);
  const hasLeftCol = !!(draft.notes || draft.terms || hasBank);

  const metaRow = 'flex justify-between gap-6 py-0.5';

  return (
    <div className="print-paper bg-surface shadow-xl min-h-[297mm] w-full flex flex-col text-[13px] leading-relaxed text-foreground overflow-visible" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Top Accent Bar with Stripes / Header Block */}
      <div className="w-full text-white p-10 sm:p-14 relative" style={{ backgroundColor: accent }}>
        <div className="max-w-3xl mx-auto text-center space-y-3">
          {business.logo && <img src={business.logo} alt="Logo" className="h-12 mx-auto mb-4 object-contain brightness-0 invert" />}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight break-words">{business.name || 'John Smith'}</h1>
          {business.address && <p className="text-sm opacity-90 whitespace-pre-line break-words leading-relaxed">{business.address}</p>}
          {(business.email || business.phone) && (
            <p className="text-xs opacity-85 pt-1">
              {business.email}{business.email && business.phone ? ' • ' : ''}{business.phone}
            </p>
          )}
          {business.taxId && <p className="text-xs font-mono opacity-80 pt-1">{business.taxIdLabel || 'TAX ID'}: {business.taxId}</p>}
        </div>
      </div>

      <div className="px-6 py-6 sm:px-10 sm:py-8 flex flex-col gap-6">
        {/* Bill To / Ship To / Meta */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${shipToEnabled ? 'sm:grid-cols-[1fr_1fr_auto]' : 'sm:grid-cols-[1fr_auto]'} gap-y-5 gap-x-10 pb-5 border-b border-border/60 text-xs`}
        >
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

          <div className="min-w-0 sm:min-w-[15rem] font-mono">
            <div className={metaRow}><span className="text-slate">Document Type:</span><span className="font-bold uppercase text-ink">{MODE_LABELS[draft.mode] || 'Invoice'}</span></div>
            <div className={metaRow}><span className="text-slate">Invoice #:</span><span className="font-semibold text-ink">#{draft.number}</span></div>
            <div className={metaRow}><span className="text-slate">Invoice Date:</span><span>{fmt(draft.issueDate)}</span></div>
            {paymentTerms && !isReceipt && <div className={metaRow}><span className="text-slate">Terms:</span><span className="text-right break-words">{paymentTerms}</span></div>}
            {!isReceipt && <div className={metaRow}><span className="text-slate">Due Date:</span><span>{fmt(draft.dueDate)}</span></div>}
            {poNumber && <div className={metaRow}><span className="text-slate">P.O.#:</span><span className="text-right break-words">{poNumber}</span></div>}
            {extraFields.map((f: any) => (
              <div key={f.label} className={metaRow}><span className="text-slate">{f.label}:</span><span className="text-right break-words">{f.value}</span></div>
            ))}
          </div>
        </div>

        {/* Items Table (header repeats on every page, rows never split) */}
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-xs table-fixed border-collapse">
            <colgroup>
              <col style={{ width: '3.5rem' }} />
              <col />
              <col style={{ width: '7rem' }} />
              <col style={{ width: '7.5rem' }} />
            </colgroup>
            <thead style={{ display: 'table-header-group' }}>
              <tr className="text-white uppercase font-mono tracking-wider" style={{ backgroundColor: accent }}>
                <th className="py-2 px-3 text-center">Qty</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-right">Unit Price</th>
                <th className="py-2 px-3 text-right">Amount</th>
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
                      <td className="py-2.5 px-3 text-center align-top font-mono text-slate">{item.qty}</td>
                      <td className="py-2.5 px-3 align-top">
                        <div className="font-medium text-ink break-words">{item.desc || 'Untitled Item'}</div>
                        {detail && <div className="text-[11px] text-slate mt-0.5 whitespace-pre-line break-words">{detail}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-right align-top font-mono text-slate whitespace-nowrap">{m(toMinor(item.price, draft.currency))}</td>
                      <td className="py-2.5 px-3 text-right align-top font-mono font-semibold text-ink whitespace-nowrap">{m(Math.round(item.qty * toMinor(item.price, draft.currency)))}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Totals + banner: one block, kept together, directly under the table */}
        <div data-pdf-break style={avoidBreak} className="space-y-3">
          <div className="flex justify-end">
            <div className="w-full sm:w-72 text-xs font-mono">
              <div className="flex justify-between py-1"><span className="text-slate">Subtotal</span><span className="text-ink">{m(t.subtotal)}</span></div>
              {t.invoiceDiscount > 0 && <div className="flex justify-between py-1"><span className="text-slate">Discount</span><span className="text-ink">-{m(t.invoiceDiscount)}</span></div>}
              {t.taxAdded > 0 && <div className="flex justify-between py-1"><span className="text-slate">Sales Tax</span><span className="text-ink">{m(t.taxAdded)}</span></div>}
              {t.shipping > 0 && <div className="flex justify-between py-1"><span className="text-slate">Shipping</span><span className="text-ink">{m(t.shipping)}</span></div>}
            </div>
          </div>

          <div className="flex justify-between items-center gap-4 px-5 py-3 rounded-lg text-white font-bold text-lg sm:text-xl" style={{ backgroundColor: accent }}>
            <span className="tracking-widest uppercase font-mono">TOTAL</span>
            <span className="font-mono">{m(t.total)}</span>
          </div>
        </div>

        {/* Notes / Terms / Bank | Signature (no forced bottom push) */}
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${hasLeftCol ? 'sm:grid-cols-[1fr_auto]' : ''} gap-x-10 gap-y-6 pt-4 border-t border-border/60 items-end`}
        >
          {hasLeftCol && (
            <div className="min-w-0 space-y-3">
              {draft.notes && (
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate text-[10px] mb-1 font-mono">Notes</p>
                  <p className="text-xs text-slate whitespace-pre-line break-words">{draft.notes}</p>
                </div>
              )}
              {draft.terms && (
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate text-[10px] mb-1 font-mono">Terms & Conditions</p>
                  <p className="text-xs text-slate whitespace-pre-line break-words">{draft.terms}</p>
                </div>
              )}
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
            </div>
          )}

          <div className="w-56 text-center sm:justify-self-end">
            <div className="h-14 flex items-end justify-center mb-1">
              {signature && <img src={signature} alt="Signature" className="max-h-14 max-w-full object-contain" />}
            </div>
            <div className="border-t border-ink pt-1 text-[11px] font-bold uppercase tracking-wider text-ink break-words">
              {business.name || 'John Smith'}
            </div>
          </div>
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