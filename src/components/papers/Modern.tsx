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
};

export function PaperModern({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
}: ModernProps = {} as ModernProps) {
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
    <div className="print-paper bg-surface shadow-xl p-12 min-h-[297mm] w-full flex flex-col text-[13px] leading-relaxed overflow-visible" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="flex justify-between items-start gap-8 mb-10">
        <div>
          <h1 className="h3 mb-2" data-accent="text" style={{ color: accent }}>
            {MODE_LABELS[draft.mode]}
          </h1>
          <p className="text-sm tabular text-ink font-medium">{draft.number}</p>
        </div>
        <table className="text-xs tabular shrink-0">
          <tbody>
            {meta.map(([k, v]) => (
              <tr key={k}>
                <td className="pr-3 py-0.5 text-slate text-right whitespace-nowrap">{k}:</td>
                <td className="py-0.5 text-ink text-right whitespace-nowrap">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* From / To / Ship */}
      <div data-pdf-break className={`grid gap-8 mb-10 ${shipToEnabled ? 'grid-cols-3' : 'grid-cols-2'}`}>
        <div className="min-w-0">
          <p className="eyebrow mb-2">From</p>
          {business.logo && <img src={business.logo} alt="" className="h-10 mb-3 object-contain" />}
          <h3 className="text-base font-semibold text-ink mb-1 break-words">{business.name}</h3>
          {business.address && <p className="text-sm text-slate whitespace-pre-line break-words">{business.address}</p>}
          {business.email && <p className="text-sm text-slate break-all">{business.email}</p>}
          {business.phone && <p className="text-sm text-slate">{business.phone}</p>}
          {business.taxId && <p className="text-xs text-slate font-mono mt-1">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>}
        </div>
        <div className="min-w-0">
          <p className="eyebrow mb-2">To</p>
          <h3 className="text-base font-semibold text-ink mb-1 break-words">{draft.client.name || '—'}</h3>
          {draft.client.address && <p className="text-sm text-slate whitespace-pre-line break-words">{draft.client.address}</p>}
          {draft.client.email && <p className="text-sm text-slate break-all">{draft.client.email}</p>}
          {draft.client.phone && <p className="text-sm text-slate">{draft.client.phone}</p>}
        </div>
        {shipToEnabled && (
          <div className="min-w-0">
            <p className="eyebrow mb-2">Ship to</p>
            <h3 className="text-base font-semibold text-ink mb-1 break-words">{draft.shipToName || '—'}</h3>
            {draft.shipToAddress && <p className="text-sm text-slate whitespace-pre-line break-words">{draft.shipToAddress}</p>}
          </div>
        )}
      </div>

      {/* Items */}
      <div className="mb-8">
        {draft.items.map((item: any, idx: number) => {
          const detail = item.customFields?.[0]?.value;
          return (
            <div key={item.id} data-pdf-break className="flex gap-4 py-4 border-b border-border">
              <span className="text-sm text-flame font-medium w-10 shrink-0">({String(idx + 1).padStart(2, '0')})</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink mb-1 break-words">{item.desc || '—'}</p>
                {detail && <p className="text-xs text-slate mb-1 whitespace-pre-line break-words leading-snug">{detail}</p>}
                <p className="text-xs text-slate">{item.qty} × {m(toMinor(item.price, draft.currency))}</p>
              </div>
              <p className="text-sm tabular font-medium text-ink whitespace-nowrap shrink-0">
                {m(Math.round(item.qty * toMinor(item.price, draft.currency)))}
              </p>
            </div>
          );
        })}
      </div>

      {/* Totals band */}
      <div data-pdf-break className="rounded-lg p-6 mb-8 totals-block" style={{ backgroundColor: `${accent}10` }}>
        <div className="space-y-2">
          <Row k="Subtotal" v={m(t.subtotal)} />
          {t.invoiceDiscount > 0 && <Row k="Discount" v={`-${m(t.invoiceDiscount)}`} />}
          {t.taxAdded > 0 && <Row k="Tax" v={m(t.taxAdded)} />}
          {t.shipping > 0 && <Row k="Shipping" v={m(t.shipping)} />}
          <div className="flex justify-between text-lg pt-2 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="tabular font-semibold whitespace-nowrap">{m(t.total)}</span>
          </div>
          {t.paid > 0 && <Row k="Paid" v={`-${m(t.paid)}`} />}
          <div className="flex justify-between text-xl pt-2 border-t-2" data-accent="border" style={{ borderColor: accent }}>
            <span className="font-semibold">{isReceipt ? 'Paid' : 'Balance due'}</span>
            <span className="tabular font-semibold whitespace-nowrap" data-accent="text" style={{ color: accent }}>
              {m(Math.max(0, t.balance))}
            </span>
          </div>
        </div>
      </div>

      {/* Footer (last child, sits at the bottom of the page in the PDF) */}
      <div data-pdf-break className="flex flex-col gap-6">
        {draft.notes && (
          <div>
            <p className="eyebrow mb-2">Notes</p>
            <p className="text-sm text-slate whitespace-pre-line break-words">{draft.notes}</p>
          </div>
        )}
        <div className="flex justify-end">
          <div className="w-60">
            <div className="h-16 flex items-end justify-center">
              {signature && <img src={signature} alt="Signature" className="max-h-16 max-w-full object-contain" />}
            </div>
            <div className="border-t border-ink pt-1.5 text-[11px] uppercase font-medium tracking-wide text-slate text-center">
              Authorized signature
            </div>
          </div>
        </div>
        {photos.length > 0 && (
          <div className="border-t border-border pt-4">
            <p className="eyebrow mb-3">Attachments</p>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((p, i) => (
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-36 object-cover rounded-lg border border-border" />
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
    <div className="flex justify-between text-sm">
      <span className="text-slate">{k}</span>
      <span className="tabular whitespace-nowrap">{v}</span>
    </div>
  );
}