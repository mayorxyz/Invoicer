import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type MinimalProps = PaperProps & {
  shipToEnabled?: boolean;
  paymentTerms?: string;
  poNumber?: string;
};

export function PaperMinimal({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
}: MinimalProps = {} as MinimalProps) {
  const { draft, state } = useStore();
  if (!draft) return null;

  const business = state.businesses[0] || {};
  const t = totals(draft);
  const accent = accentProp || state.settings?.accent || draft.accent || '#000000';
  const m = (n: number) => formatMoney(n, draft.currency);
  const fmt = (d: string) => (d ? formatDateLocale(d, 'en-US', 'MMM dd, yyyy') : '');
  const isReceipt = draft.mode === 'receipt';

  const poNumber = poProp ?? draft.customFields?.find((f: any) => f.label === 'PO Number')?.value ?? '';
  const extraFields = (draft.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

  const meta: [string, string][] = [
    ['Date', fmt(draft.issueDate)],
    ...(isReceipt ? [] : ([
      ...(paymentTerms ? [['Terms', paymentTerms]] : []),
      ['Due', fmt(draft.dueDate)],
    ] as [string, string][])),
    ...(poNumber ? ([['PO #', poNumber]] as [string, string][]) : []),
    ...extraFields.map((f: any) => [f.label, f.value] as [string, string]),
  ].filter(([, v]) => v);

  return (
    <div className="print-paper bg-surface shadow-xl p-8 sm:p-16 min-h-[297mm] w-full flex flex-col leading-relaxed text-foreground overflow-visible" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-ink mb-2 tracking-tight">{MODE_LABELS[draft.mode] || 'Invoice'}</h1>
          <p className="text-sm sm:text-base tabular text-slate font-mono">#{draft.number}</p>
        </div>
        {meta.length > 0 && (
          <table className="text-xs sm:text-sm tabular shrink-0">
            <tbody>
              {meta.map(([k, v]) => (
                <tr key={k}>
                  <td className="pr-3 py-0.5 text-slate text-right whitespace-nowrap">{k}</td>
                  <td className="py-0.5 text-ink text-right whitespace-nowrap font-medium">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* From / To / Ship */}
      <div data-pdf-break className={`grid gap-8 mb-12 ${shipToEnabled ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <div className="min-w-0 space-y-1.5">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate mb-2">From</p>
          {business.logo && <img src={business.logo} alt="Logo" className="h-8 mb-3 object-contain" />}
          <p className="text-sm sm:text-base font-medium text-ink break-words">{business.name || 'Acme Corporation'}</p>
          {business.address && <p className="text-xs sm:text-sm text-slate whitespace-pre-line break-words leading-relaxed">{business.address}</p>}
          {business.email && <p className="text-xs sm:text-sm text-slate break-all">{business.email}</p>}
          {business.phone && <p className="text-xs sm:text-sm text-slate">{business.phone}</p>}
          {business.taxId && <p className="text-[11px] text-slate font-mono mt-1">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>}
        </div>

        <div className="min-w-0 space-y-1.5">
          <p className="text-[10px] uppercase font-mono tracking-wider text-slate mb-2">To</p>
          <p className="text-sm sm:text-base font-medium text-ink break-words">{draft.client?.name || 'Client Name'}</p>
          {draft.client?.address && <p className="text-xs sm:text-sm text-slate whitespace-pre-line break-words leading-relaxed">{draft.client.address}</p>}
          {draft.client?.email && <p className="text-xs sm:text-sm text-slate break-all">{draft.client.email}</p>}
          {draft.client?.phone && <p className="text-xs sm:text-sm text-slate">{draft.client.phone}</p>}
        </div>

        {shipToEnabled && (
          <div className="min-w-0 space-y-1.5">
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate mb-2">Ship to</p>
            <p className="text-sm sm:text-base font-medium text-ink break-words">{draft.shipToName || 'Recipient Name'}</p>
            {draft.shipToAddress && <p className="text-xs sm:text-sm text-slate whitespace-pre-line break-words leading-relaxed">{draft.shipToAddress}</p>}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-12">
        {draft.items.length === 0 || draft.items.every((i: any) => !i.desc && i.price === 0) ? (
          <div className="text-center py-10 italic text-slate text-sm">No line items added yet.</div>
        ) : (
          draft.items.map((item: any) => {
            const detail = item.customFields?.[0]?.value;
            return (
              <div key={item.id} data-pdf-break className="flex justify-between items-baseline py-4 border-b border-border/60">
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm sm:text-base font-medium text-ink break-words">{item.desc || 'Untitled Item'}</p>
                  {detail && <p className="text-xs sm:text-sm text-slate mt-1 whitespace-pre-line break-words leading-snug">{detail}</p>}
                  <p className="text-xs sm:text-sm text-slate font-mono mt-1">{item.qty} × {m(toMinor(item.price, draft.currency))}</p>
                </div>
                <p className="text-sm sm:text-base tabular text-ink font-mono whitespace-nowrap shrink-0">
                  {m(Math.round(item.qty * toMinor(item.price, draft.currency)))}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Totals */}
      <div data-pdf-break className="totals-block flex justify-end mb-12">
        <div className="w-full sm:w-80 space-y-2.5 text-sm">
          <Row k="Subtotal" v={m(t.subtotal)} />
          {t.invoiceDiscount > 0 && <Row k="Discount" v={`-${m(t.invoiceDiscount)}`} />}
          {t.taxAdded > 0 && <Row k="Tax" v={m(t.taxAdded)} />}
          {t.shipping > 0 && <Row k="Shipping" v={m(t.shipping)} />}
          <div className="flex justify-between text-lg sm:text-xl pt-3 border-t border-border font-medium">
            <span className="text-ink">Total</span>
            <span className="tabular font-mono whitespace-nowrap text-ink">{m(t.total)}</span>
          </div>
          {t.paid > 0 && <Row k="Paid" v={`-${m(t.paid)}`} />}
          <div className="flex justify-between gap-3 text-lg sm:text-xl pt-3 border-t-2 font-semibold" data-accent="border" style={{ borderColor: accent }}>
            <span style={{ color: accent }}>{isReceipt ? 'Paid' : 'Balance due'}</span>
            <span className="tabular font-mono whitespace-nowrap" data-accent="text" style={{ color: accent }}>
              {m(Math.max(0, t.balance))}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div data-pdf-break className="flex flex-col gap-8 mt-auto pt-6 border-t border-border/40">
        {draft.notes && (
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate mb-2">Notes</p>
            <p className="text-xs sm:text-sm text-slate whitespace-pre-line break-words leading-relaxed">{draft.notes}</p>
          </div>
        )}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="h-16 flex items-end justify-center">
              {signature && <img src={signature} alt="Signature" className="max-h-16 max-w-full object-contain" />}
            </div>
            <div className="border-t border-ink pt-1.5 text-[10px] font-mono uppercase tracking-widest text-slate text-center">
              Signature
            </div>
          </div>
        </div>
        {photos.length > 0 && (
          <div className="border-t border-border pt-5">
            <p className="text-[10px] uppercase font-mono tracking-wider text-slate mb-3">Attachments</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-28 sm:h-36 object-cover border border-border rounded-lg" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between text-xs sm:text-sm text-slate">
      <span>{k}</span>
      <span className="tabular font-mono whitespace-nowrap text-foreground">{v}</span>
    </div>
  );
}