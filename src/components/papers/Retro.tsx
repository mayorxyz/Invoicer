import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type RetroProps = PaperProps & {
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

export function PaperRetro({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
  showPageGuides = true,
  pageHeight = '297mm',
}: RetroProps = {} as RetroProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#ff7a59';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MM/dd/yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const hasItems = !(draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0));
  const hasBank = !!(draft.bankName || draft.bankAccount || draft.bankRouting);
  const hasLeft = !!(draft.notes || draft.terms || hasBank);

  const metaRow = 'flex justify-between sm:justify-end gap-4';
  const cell = 'py-1.5 px-2.5 border-r border-black/40';
  const totalRow = 'border-t border-black/30 font-bold';
  const labelCell = 'py-1.5 px-2.5 text-right border-r border-black/40';

  return (
    <div
      className="print-paper relative shadow-xl w-full flex flex-col text-[12px] leading-snug text-black overflow-visible px-6 py-6 sm:px-10 sm:py-8 gap-5"
      style={{ backgroundColor: accent, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace', ...keepColors }}
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

      {/* Header: title + meta | logo + business name */}
      <div data-pdf-break style={avoidBreak} className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-black/30 pb-4">
        <div className="min-w-0">
          <h1 className="text-4xl sm:text-5xl font-black tracking-widest uppercase leading-none mb-2 break-words">
            {MODE_LABELS[draft.mode] || 'Invoice'}
          </h1>
          <div className="text-xs space-y-0.5">
            <div className="flex gap-6"><span>NO: {draft.number}</span><span>{fmt(draft.issueDate)}</span></div>
            {poNumber && <div>P.O.#: {poNumber}</div>}
            {paymentTerms && !isReceipt && <div>Terms: {paymentTerms}</div>}
            {extraFields.map((f: any) => (
              <div key={f.label} className="break-words">{f.label}: {f.value}</div>
            ))}
          </div>
        </div>

        <div className="min-w-0 sm:text-right">
          {business.logo && <img src={business.logo} alt="Logo" className="h-10 object-contain sm:ml-auto mb-1" />}
          {business.name && <div className="font-bold text-sm tracking-wider uppercase break-words">{business.name}</div>}
        </div>
      </div>

      {/* From / Issued To / Ship To / Payment Due */}
      <div
        data-pdf-break
        style={avoidBreak}
        className={`grid grid-cols-1 ${shipToEnabled ? 'sm:grid-cols-[1fr_1fr_1fr_auto]' : 'sm:grid-cols-[1fr_1fr_auto]'} gap-y-4 gap-x-8 text-xs`}
      >
        <div className="min-w-0 space-y-0.5">
          <p className="uppercase text-black/70">from</p>
          {business.address && <p className="whitespace-pre-line break-words">{business.address}</p>}
          {business.email && <p className="break-words">{business.email}</p>}
          {business.phone && <p>{business.phone}</p>}
          {business.taxId && <p className="break-words">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>}
        </div>

        <div className="min-w-0 space-y-0.5">
          <p className="uppercase text-black/70">issued to</p>
          <p className="font-bold break-words">{draft.client?.name || 'Client Name'}</p>
          {draft.client?.address && <p className="whitespace-pre-line break-words">{draft.client.address}</p>}
          {draft.client?.email && <p className="break-words">{draft.client.email}</p>}
          {draft.client?.phone && <p>{draft.client.phone}</p>}
        </div>

        {shipToEnabled && (
          <div className="min-w-0 space-y-0.5">
            <p className="uppercase text-black/70">ship to</p>
            <p className="font-bold break-words">{draft.shipToName || 'Recipient Name'}</p>
            {draft.shipToAddress && <p className="whitespace-pre-line break-words">{draft.shipToAddress}</p>}
          </div>
        )}

        {!isReceipt && (
          <div className="min-w-0 space-y-0.5 sm:text-right">
            <p className="uppercase text-black/70">payment due</p>
            <p className="font-bold">{fmt(draft.dueDate)}</p>
          </div>
        )}
      </div>

      {/* Grid table with totals (header repeats on every page, rows never split) */}
      <table className="w-full text-xs table-fixed border-collapse border border-black/40">
        <colgroup>
          <col />
          <col style={{ width: '6.5rem' }} />
          <col style={{ width: '3.5rem' }} />
          <col style={{ width: '7rem' }} />
        </colgroup>
        <thead style={{ display: 'table-header-group' }}>
          <tr className="border-b border-black/40">
            <th className={`${cell} text-left font-bold`}>Description</th>
            <th className={`${cell} text-left font-bold`}>Unit Cost</th>
            <th className={`${cell} text-left font-bold`}>qty</th>
            <th className="py-1.5 px-2.5 text-right font-bold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {!hasItems ? (
            <tr>
              <td colSpan={4} className="text-center py-5 italic">No line items added yet.</td>
            </tr>
          ) : (
            draft.items.map((item: any) => {
              const detail = item.customFields?.[0]?.value;
              return (
                <tr key={item.id} className="border-b border-black/30" data-pdf-break style={avoidBreak}>
                  <td className={`${cell} align-top`}>
                    <div className="break-words">{item.desc || 'Untitled Item'}</div>
                    {detail && <div className="text-[10px] text-black/70 whitespace-pre-line break-words">{detail}</div>}
                  </td>
                  <td className={`${cell} align-top whitespace-nowrap`}>{m(toMinor(item.price, draft.currency))}</td>
                  <td className={`${cell} align-top`}>{item.qty}</td>
                  <td className="py-1.5 px-2.5 text-right align-top font-bold whitespace-nowrap">{m(Math.round(item.qty * toMinor(item.price, draft.currency)))}</td>
                </tr>
              );
            })
          )}

          <tr className={totalRow} data-pdf-break style={avoidBreak}>
            <td colSpan={3} className={labelCell}>Sub Total</td>
            <td className="py-1.5 px-2.5 text-right whitespace-nowrap">{m(t.subtotal)}</td>
          </tr>
          {t.invoiceDiscount > 0 && (
            <tr className={totalRow} data-pdf-break style={avoidBreak}>
              <td colSpan={3} className={labelCell}>Discount</td>
              <td className="py-1.5 px-2.5 text-right whitespace-nowrap">-{m(t.invoiceDiscount)}</td>
            </tr>
          )}
          {t.taxAdded > 0 && (
            <tr className={totalRow} data-pdf-break style={avoidBreak}>
              <td colSpan={3} className={labelCell}>Sales Tax</td>
              <td className="py-1.5 px-2.5 text-right whitespace-nowrap">{m(t.taxAdded)}</td>
            </tr>
          )}
          {t.shipping > 0 && (
            <tr className={totalRow} data-pdf-break style={avoidBreak}>
              <td colSpan={3} className={labelCell}>Shipping</td>
              <td className="py-1.5 px-2.5 text-right whitespace-nowrap">{m(t.shipping)}</td>
            </tr>
          )}
          <tr className={`${totalRow} text-sm`} data-pdf-break style={avoidBreak}>
            <td colSpan={3} className={labelCell}>Total</td>
            <td className="py-1.5 px-2.5 text-right whitespace-nowrap">{m(t.total)}</td>
          </tr>
          {t.paid > 0 && (
            <>
              <tr className={totalRow} data-pdf-break style={avoidBreak}>
                <td colSpan={3} className={labelCell}>Amount Paid</td>
                <td className="py-1.5 px-2.5 text-right whitespace-nowrap">-{m(t.paid)}</td>
              </tr>
              <tr className={`${totalRow} text-sm`} data-pdf-break style={avoidBreak}>
                <td colSpan={3} className={labelCell}>Balance due</td>
                <td className="py-1.5 px-2.5 text-right whitespace-nowrap">{m(Math.max(0, t.balance))}</td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      {/* Notes / Terms / Bank | Signature */}
      {(hasLeft || signature) && (
        <div
          data-pdf-break
          style={avoidBreak}
          className={`grid grid-cols-1 ${hasLeft && signature ? 'sm:grid-cols-[1fr_auto]' : ''} gap-x-10 gap-y-4 items-end text-[11px]`}
        >
          {hasLeft && (
            <div className="min-w-0 space-y-2">
              {draft.notes && (
                <div>
                  {draft.terms && <p className="font-bold uppercase tracking-wider text-[10px] mb-0.5">Notes</p>}
                  <p className="whitespace-pre-line break-words">{draft.notes}</p>
                </div>
              )}
              {draft.terms && (
                <div>
                  <p className="font-bold uppercase tracking-wider text-[10px] mb-0.5">Terms & Conditions</p>
                  <p className="whitespace-pre-line break-words">{draft.terms}</p>
                </div>
              )}
              {hasBank && (
                <div className="space-y-0.5">
                  {draft.bankName && (
                    <>
                      <p className="font-bold uppercase tracking-wider text-[10px]">Name of Bank</p>
                      <p className="break-words">{draft.bankName}</p>
                    </>
                  )}
                  {draft.bankAccount && <p className="break-words">Account number: {draft.bankAccount}</p>}
                  {draft.bankRouting && <p className="break-words">Routing: {draft.bankRouting}</p>}
                </div>
              )}
            </div>
          )}

          {signature && (
            <div className="w-56 sm:justify-self-end">
              <div className="h-14 flex items-end justify-center">
                <img src={signature} alt="Signature" className="max-h-14 max-w-full object-contain" />
              </div>
              <div className="border-t border-black/60 pt-0.5 text-center text-[10px] font-bold uppercase tracking-wider break-words">
                {business.name || 'Signature'}
              </div>
            </div>
          )}
        </div>
      )}

      {photos.length > 0 && (
        <div style={avoidBreak} className="border-t border-black/40 pt-3">
          <p className="font-bold uppercase tracking-wider text-[10px] mb-2">Attachments</p>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((p, i) => (
              <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-24 object-cover border border-black/40" style={avoidBreak} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}