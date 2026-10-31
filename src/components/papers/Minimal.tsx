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

  const business = state.businesses[0];
  const t = totals(draft);
  const accent = accentProp || state.settings.accent || draft.accent;
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
    <div className="bg-surface shadow-xl p-16 min-h-[297mm] flex flex-col leading-relaxed" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="flex justify-between items-end gap-8 mb-12">
        <div>
          <h1 className="text-5xl font-semibold text-ink mb-3">{MODE_LABELS[draft.mode]}</h1>
          <p className="text-base tabular text-slate">{draft.number}</p>
        </div>
        <table className="text-sm tabular shrink-0">
          <tbody>
            {meta.map(([k, v]) => (
              <tr key={k}>
                <td className="pr-3 py-0.5 text-slate text-right whitespace-nowrap">{k}</td>
                <td className="py-0.5 text-ink text-right whitespace-nowrap">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* From / To / Ship */}
      <div data-pdf-break className={`grid gap-10 mb-12 ${shipToEnabled ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="min-w-0">
          <p className="text-xs text-slate uppercase tracking-wide mb-3">From</p>
          {business.logo && <img src={business.logo} alt="" className="h-8 mb-4 object-contain" />}
          <p className="text-base text-ink break-words">{business.name}</p>
          {business.address && <p className="text-sm text-slate whitespace-pre-line break-words mt-2">{business.address}</p>}
          {business.email && <p className="text-sm text-slate break-all">{business.email}</p>}
          {business.phone && <p className="text-sm text-slate">{business.phone}</p>}
          {business.taxId && <p className="text-xs text-slate font-mono mt-1">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate uppercase tracking-wide mb-3">To</p>
          <p className="text-base text-ink break-words">{draft.client.name || '—'}</p>
          {draft.client.address && <p className="text-sm text-slate whitespace-pre-line break-words mt-2">{draft.client.address}</p>}
          {draft.client.email && <p className="text-sm text-slate break-all">{draft.client.email}</p>}
          {draft.client.phone && <p className="text-sm text-slate">{draft.client.phone}</p>}
        </div>
        {shipToEnabled && (
          <div className="min-w-0">
            <p className="text-xs text-slate uppercase tracking-wide mb-3">Ship to</p>
            <p className="text-base text-ink break-words">{draft.shipToName || '—'}</p>
            {draft.shipToAddress && <p className="text-sm text-slate whitespace-pre-line break-words mt-2">{draft.shipToAddress}</p>}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-12">
        {draft.items.map((item: any) => {
          const detail = item.customFields?.[0]?.value;
          return (
            <div key={item.id} data-pdf-break className="flex justify-between items-baseline py-4 border-b border-border">
              <div className="flex-1 min-w-0">
                <p className="text-base text-ink break-words">{item.desc || '—'}</p>
                {detail && <p className="text-sm text-slate mt-1 whitespace-pre-line break-words leading-snug">{detail}</p>}
                <p className="text-sm text-slate mt-1">{item.qty} × {m(toMinor(item.price, draft.currency))}</p>
              </div>
              <p className="text-base tabular text-ink ml-8 whitespace-nowrap shrink-0">
                {m(Math.round(item.qty * toMinor(item.price, draft.currency)))}
              </p>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div data-pdf-break className="totals-block flex justify-end mb-12">
        <div className="w-80 space-y-3">
          <Row k="Subtotal" v={m(t.subtotal)} />
          {t.invoiceDiscount > 0 && <Row k="Discount" v={`-${m(t.invoiceDiscount)}`} />}
          {t.taxAdded > 0 && <Row k="Tax" v={m(t.taxAdded)} />}
          {t.shipping > 0 && <Row k="Shipping" v={m(t.shipping)} />}
          <div className="flex justify-between text-2xl pt-4 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="tabular font-semibold whitespace-nowrap">{m(t.total)}</span>
          </div>
          {t.paid > 0 && <Row k="Paid" v={`-${m(t.paid)}`} />}
          <div className="flex justify-between gap-3 text-2xl pt-4 border-t-2" data-accent="border" style={{ borderColor: accent }}>
            <span className="font-semibold">{isReceipt ? 'Paid' : 'Balance due'}</span>
            <span className="tabular font-semibold whitespace-nowrap" data-accent="text" style={{ color: accent }}>
              {m(Math.max(0, t.balance))}
            </span>
          </div>
        </div>
      </div>

      {/* Footer (last child, sits at the bottom of the page in the PDF) */}
      <div data-pdf-break className="flex flex-col gap-8">
        {draft.notes && (
          <div>
            <p className="text-xs text-slate uppercase tracking-wide mb-3">Notes</p>
            <p className="text-sm text-slate whitespace-pre-line break-words">{draft.notes}</p>
          </div>
        )}
        <div className="flex justify-end">
          <div className="w-64">
            <div className="h-16 flex items-end justify-center">
              {signature && <img src={signature} alt="Signature" className="max-h-16 max-w-full object-contain" />}
            </div>
            <div className="border-t border-ink pt-1.5 text-xs uppercase tracking-wide text-slate text-center">
              Signature
            </div>
          </div>
        </div>
        {photos.length > 0 && (
          <div className="border-t border-border pt-5">
            <p className="text-xs text-slate uppercase tracking-wide mb-3">Attachments</p>
            <div className="grid grid-cols-3 gap-4">
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-36 object-cover border border-border" />
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
    <div className="flex justify-between text-base">
      <span className="text-slate">{k}</span>
      <span className="tabular whitespace-nowrap">{v}</span>
    </div>
  );
}