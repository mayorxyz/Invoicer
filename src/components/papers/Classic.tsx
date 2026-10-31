import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import { amountInWords } from '../../lib/words';
import { derivedStatus } from '../../lib/status';
import { MODE_LABELS } from '../../data/countries';
import { Icon } from '../ui/Icon';
import { SignaturePhotos, type PaperProps } from './shared';

export function PaperClassic({ signature = '', photos = [], accent: accentProp }: PaperProps = {}) {
  const { draft, state } = useStore();
  if (!draft) return null;
  
  const business = state.businesses[0];
  const t = totals(draft);
  const status = derivedStatus(draft);
  const locale = state.settings.locale;
  const accent = accentProp || state.settings.accent || draft.accent;
  
  return (
    <div className="bg-surface shadow-xl p-12 min-h-[297mm]" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          {business.logo && <img src={business.logo} alt="" className="h-12 mb-4" />}
          <h1 className="text-2xl font-semibold text-ink mb-2">{business.name}</h1>
          <p className="text-sm text-slate whitespace-pre-line">{business.address}</p>
          <p className="text-sm text-slate">{business.email}</p>
        </div>
        <div className="text-right">
          <p className="eyebrow mb-2">Details</p>
          <h2 className="text-4xl font-semibold mb-2" data-accent="text" style={{ color: accent }}>
            {MODE_LABELS[draft.mode]}
          </h2>
          <p className="text-sm tabular text-ink font-medium">{draft.number}</p>
        </div>
      </div>
      
      {/* Bill To */}
      <div className="mb-12 pl-4 border-l-2" data-accent="border" style={{ borderColor: accent }}>
        <p className="eyebrow mb-2">Bill to</p>
        <h3 className="text-lg font-semibold text-ink mb-1">{draft.client.name || '—'}</h3>
        <p className="text-sm text-slate whitespace-pre-line">{draft.client.address}</p>
        <p className="text-sm text-slate">{draft.client.email}</p>
      </div>
      
      {/* Items Table */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b-2 border-ink">
            <th className="text-left py-2 text-xs font-medium text-slate uppercase tracking-wide">Description</th>
            <th className="text-right py-2 text-xs font-medium text-slate uppercase tracking-wide">Qty</th>
            <th className="text-right py-2 text-xs font-medium text-slate uppercase tracking-wide">Price</th>
            <th className="text-right py-2 text-xs font-medium text-slate uppercase tracking-wide">Amount</th>
          </tr>
        </thead>
        <tbody>
          {draft.items.map(item => (
            <tr key={item.id} className="border-b border-border">
              <td className="py-3 text-sm">{item.desc || '—'}</td>
              <td className="py-3 text-sm text-right tabular">{item.qty}</td>
              <td className="py-3 text-sm text-right tabular">{formatMoney(Math.round(item.price * 100), draft.currency)}</td>
              <td className="py-3 text-sm text-right tabular font-medium">{formatMoney(Math.round(item.qty * item.price * 100), draft.currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate">Subtotal</span>
            <span className="tabular">{formatMoney(t.subtotal, draft.currency)}</span>
          </div>
          {t.invoiceDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate">Discount</span>
              <span className="tabular">-{formatMoney(t.invoiceDiscount, draft.currency)}</span>
            </div>
          )}
          {t.taxAdded > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate">Tax</span>
              <span className="tabular">{formatMoney(t.taxAdded, draft.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="tabular font-semibold">{formatMoney(t.total, draft.currency)}</span>
          </div>
          {t.paid > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate">Paid</span>
              <span className="tabular text-success">-{formatMoney(t.paid, draft.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg pt-2 border-t-2" data-accent="border" style={{ borderColor: accent }}>
            <span className="font-semibold">Balance due</span>
            <span className="tabular font-semibold" data-accent="text" style={{ color: accent }}>
              {formatMoney(Math.max(0, t.balance), draft.currency)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {draft.notes && (
        <div className="mb-8">
          <p className="eyebrow mb-2">Notes</p>
          <p className="text-sm text-slate whitespace-pre-line">{draft.notes}</p>
        </div>
      )}
      
      {/* Terms */}
      {draft.terms && (
        <div>
          <p className="eyebrow mb-2">Terms</p>
          <p className="text-xs text-slate whitespace-pre-line">{draft.terms}</p>
        </div>
      )}
      
      {/* Signature & Photos */}
      <SignaturePhotos signature={signature} photos={photos} className="mt-8" />
    </div>
  );
}
