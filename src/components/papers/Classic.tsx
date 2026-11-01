import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { MODE_LABELS } from '../../data/countries';
import type { PaperProps } from './shared';

type ClassicProps = PaperProps & {
  shipToEnabled?: boolean;
  paymentTerms?: string;
  poNumber?: string;
};

export function PaperClassic({
  signature = '',
  photos = [],
  accent: accentProp,
  shipToEnabled = false,
  paymentTerms = '',
  poNumber: poProp,
}: ClassicProps = {} as ClassicProps) {
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
        <div className="min-w-0 flex-1">
          {business.logo && <img src={business.logo} alt="" className="h-12 mb-4 object-contain" />}
          <h1 className="text-2xl font-semibold text-ink mb-2 break-words">{business.name}</h1>
          {business.address && <p className="text-sm text-slate whitespace-pre-line break-words">{business.address}</p>}
          {business.email && <p className="text-sm text-slate break-all">{business.email}</p>}
          {business.phone && <p className="text-sm text-slate">{business.phone}</p>}
          {business.taxId && (
            <p className="text-xs text-slate font-mono mt-1">{business.taxIdLabel || 'Tax ID'}: {business.taxId}</p>
          )}
        </div>
        <div className="text-right shrink-0 max-w-[260px]">
          <p className="eyebrow mb-2">Details</p>
          <h2 className="text-4xl font-semibold mb-2" data-accent="text" style={{ color: accent }}>
            {MODE_LABELS[draft.mode]}
          </h2>
          <p className="text-sm tabular text-ink font-medium mb-2">{draft.number}</p>
          <table className="ml-auto text-xs tabular">
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
      </div>

      {/* Bill To / Ship To */}
      <div data-pdf-break className="mb-10 grid grid-cols-2 gap-8">
        <div className="pl-4 border-l-2 min-w-0" data-accent="border" style={{ borderColor: accent }}>
          <p className="eyebrow mb-2">Bill to</p>
          <h3 className="text-lg font-semibold text-ink mb-1 break-words">{draft.client.name || '—'}</h3>
          {draft.client.address && <p className="text-sm text-slate whitespace-pre-line break-words">{draft.client.address}</p>}
          {draft.client.email && <p className="text-sm text-slate break-all">{draft.client.email}</p>}
          {draft.client.phone && <p className="text-sm text-slate">{draft.client.phone}</p>}
        </div>
        {shipToEnabled && (
          <div className="pl-4 border-l-2 border-border min-w-0">
            <p className="eyebrow mb-2">Ship to</p>
            <h3 className="text-lg font-semibold text-ink mb-1 break-words">{draft.shipToName || '—'}</h3>
            {draft.shipToAddress && <p className="text-sm text-slate whitespace-pre-line break-words">{draft.shipToAddress}</p>}
          </div>
        )}
      </div>

      {/* Items Table */}
      <table className="w-full table-fixed mb-8">
        <colgroup>
          <col />
          <col style={{ width: '64px' }} />
          <col style={{ width: '110px' }} />
          <col style={{ width: '120px' }} />
        </colgroup>
        <thead>
          <tr className="border-b-2 border-ink">
            <th className="text-left py-2 text-xs font-medium text-slate uppercase tracking-wide">Description</th>
            <th className="text-right py-2 text-xs font-medium text-slate uppercase tracking-wide">Qty</th>
            <th className="text-right py-2 text-xs font-medium text-slate uppercase tracking-wide">Price</th>
            <th className="text-right py-2 text-xs font-medium text-slate uppercase tracking-wide">Amount</th>
          </tr>
        </thead>
        <tbody>
          {draft.items.map((item: any) => {
            const detail = item.customFields?.[0]?.value;
            return (
              <tr key={item.id} data-pdf-break className="border-b border-border align-top">
                <td className="py-3 pr-3 text-sm">
                  <div className="break-words">{item.desc || '—'}</div>
                  {detail && <div className="text-xs text-slate mt-1 whitespace-pre-line break-words leading-snug">{detail}</div>}
                </td>
                <td className="py-3 text-sm text-right tabular">{item.qty}</td>
                <td className="py-3 text-sm text-right tabular whitespace-nowrap">{m(toMinor(item.price, draft.currency))}</td>
                <td className="py-3 text-sm text-right tabular font-medium whitespace-nowrap">{m(Math.round(item.qty * toMinor(item.price, draft.currency)))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div data-pdf-break className="flex justify-end mb-10">
        <div className="w-72 space-y-2">
          <Row k="Subtotal" v={m(t.subtotal)} />
          {t.invoiceDiscount > 0 && <Row k="Discount" v={`-${m(t.invoiceDiscount)}`} />}
          {t.taxAdded > 0 && <Row k="Tax" v={m(t.taxAdded)} />}
          {t.shipping > 0 && <Row k="Shipping" v={m(t.shipping)} />}
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="tabular font-semibold whitespace-nowrap">{m(t.total)}</span>
          </div>
          {t.paid > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate">Paid</span>
              <span className="tabular text-success whitespace-nowrap">-{m(t.paid)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg pt-2 border-t-2" data-accent="border" style={{ borderColor: accent }}>
            <span className="font-semibold">{isReceipt ? 'Paid' : 'Balance due'}</span>
            <span className="tabular font-semibold whitespace-nowrap" data-accent="text" style={{ color: accent }}>
              {m(Math.max(0, t.balance))}
            </span>
          </div>
        </div>
      </div>

      {/* Footer (last child: sits at the bottom of the page in the PDF) */}
      <div data-pdf-break className="flex flex-col gap-6">
        {draft.notes && (
          <div>
            <p className="eyebrow mb-2">Notes</p>
            <p className="text-sm text-slate whitespace-pre-line break-words">{draft.notes}</p>
          </div>
        )}
        {draft.terms && (
          <div>
            <p className="eyebrow mb-2">Terms</p>
            <p className="text-xs text-slate whitespace-pre-line break-words">{draft.terms}</p>
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
                <img key={i} src={p} alt={`Attachment ${i + 1}`} className="w-full h-36 object-cover rounded border border-border" />
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