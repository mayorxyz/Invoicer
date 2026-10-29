import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney } from '../../lib/money';
import { MODE_LABELS } from '../../data/countries';

export function PaperModern() {
  const { draft, state } = useStore();
  if (!draft) return null;
  
  const business = state.businesses[0];
  const t = totals(draft);
  
  return (
    <div className="bg-white shadow-xl p-12 min-h-[297mm]" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="mb-12">
        <h1 className="h3 mb-2" style={{ color: draft.accent }}>
          {MODE_LABELS[draft.mode]}
        </h1>
        <p className="text-sm tabular text-ink font-medium">{draft.number}</p>
      </div>
      
      {/* From / To */}
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <p className="eyebrow mb-2">From</p>
          {business.logo && <img src={business.logo} alt="" className="h-10 mb-3" />}
          <h3 className="text-lg font-semibold text-ink mb-1">{business.name}</h3>
          <p className="text-sm text-slate whitespace-pre-line">{business.address}</p>
        </div>
        <div>
          <p className="eyebrow mb-2">To</p>
          <h3 className="text-lg font-semibold text-ink mb-1">{draft.client.name || '—'}</h3>
          <p className="text-sm text-slate whitespace-pre-line">{draft.client.address}</p>
        </div>
      </div>
      
      {/* Items */}
      <div className="mb-8">
        {draft.items.map((item, idx) => (
          <div key={item.id} className="flex gap-4 py-4 border-b border-border">
            <span className="text-sm text-flame font-medium w-8">({String(idx + 1).padStart(2, '0')})</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink mb-1">{item.desc || '—'}</p>
              <p className="text-xs text-slate">{item.qty} × {formatMoney(Math.round(item.price * 100), draft.currency)}</p>
            </div>
            <p className="text-sm tabular font-medium text-ink">
              {formatMoney(Math.round(item.qty * item.price * 100), draft.currency)}
            </p>
          </div>
        ))}
      </div>
      
      {/* Totals with peach band */}
      <div className="rounded-lg p-6 mb-8" style={{ backgroundColor: `${draft.accent}10` }}>
        <div className="space-y-2">
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
          <div className="flex justify-between text-lg pt-2 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="tabular font-semibold">{formatMoney(t.total, draft.currency)}</span>
          </div>
          <div className="flex justify-between text-xl pt-2 border-t-2" style={{ borderColor: draft.accent }}>
            <span className="font-semibold">Balance due</span>
            <span className="tabular font-semibold" style={{ color: draft.accent }}>
              {formatMoney(Math.max(0, t.balance), draft.currency)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {draft.notes && (
        <div className="mb-6">
          <p className="eyebrow mb-2">Notes</p>
          <p className="text-sm text-slate whitespace-pre-line">{draft.notes}</p>
        </div>
      )}
    </div>
  );
}
