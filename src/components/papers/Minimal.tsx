import React from 'react';
import { useStore } from '../../store/useStore';
import { totals, formatMoney } from '../../lib/money';
import { MODE_LABELS } from '../../data/countries';

export function PaperMinimal() {
  const { draft, state } = useStore();
  if (!draft) return null;
  
  const business = state.businesses[0];
  const t = totals(draft);
  
  return (
    <div className="bg-white shadow-xl p-16 min-h-[297mm]" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div className="mb-16">
        <h1 className="text-5xl font-semibold text-ink mb-4">
          {MODE_LABELS[draft.mode]}
        </h1>
        <p className="text-base tabular text-slate">{draft.number}</p>
      </div>
      
      {/* From / To */}
      <div className="grid grid-cols-2 gap-12 mb-16">
        <div>
          <p className="text-xs text-slate uppercase tracking-wide mb-3">From</p>
          {business.logo && <img src={business.logo} alt="" className="h-8 mb-4" />}
          <p className="text-base text-ink">{business.name}</p>
          <p className="text-sm text-slate whitespace-pre-line mt-2">{business.address}</p>
        </div>
        <div>
          <p className="text-xs text-slate uppercase tracking-wide mb-3">To</p>
          <p className="text-base text-ink">{draft.client.name || '—'}</p>
          <p className="text-sm text-slate whitespace-pre-line mt-2">{draft.client.address}</p>
        </div>
      </div>
      
      {/* Items */}
      <div className="mb-16">
        {draft.items.map((item, idx) => (
          <div key={item.id} className="flex justify-between items-baseline py-4 border-b border-border">
            <div className="flex-1">
              <p className="text-base text-ink">{item.desc || '—'}</p>
              <p className="text-sm text-slate mt-1">{item.qty} × {formatMoney(Math.round(item.price * 100), draft.currency)}</p>
            </div>
            <p className="text-base tabular text-ink ml-8">
              {formatMoney(Math.round(item.qty * item.price * 100), draft.currency)}
            </p>
          </div>
        ))}
      </div>
      
      {/* Totals */}
      <div className="flex justify-end mb-16">
        <div className="w-72 space-y-3">
          <div className="flex justify-between text-base">
            <span className="text-slate">Subtotal</span>
            <span className="tabular">{formatMoney(t.subtotal, draft.currency)}</span>
          </div>
          {t.invoiceDiscount > 0 && (
            <div className="flex justify-between text-base">
              <span className="text-slate">Discount</span>
              <span className="tabular">-{formatMoney(t.invoiceDiscount, draft.currency)}</span>
            </div>
          )}
          {t.taxAdded > 0 && (
            <div className="flex justify-between text-base">
              <span className="text-slate">Tax</span>
              <span className="tabular">{formatMoney(t.taxAdded, draft.currency)}</span>
            </div>
          )}
          <div className="flex justify-between text-2xl pt-4 border-t border-border">
            <span className="font-semibold">Total</span>
            <span className="tabular font-semibold">{formatMoney(t.total, draft.currency)}</span>
          </div>
          <div className="flex justify-between text-3xl pt-4 border-t-2" style={{ borderColor: draft.accent }}>
            <span className="font-semibold">Balance due</span>
            <span className="tabular font-semibold" style={{ color: draft.accent }}>
              {formatMoney(Math.max(0, t.balance), draft.currency)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Notes */}
      {draft.notes && (
        <div>
          <p className="text-xs text-slate uppercase tracking-wide mb-3">Notes</p>
          <p className="text-sm text-slate whitespace-pre-line">{draft.notes}</p>
        </div>
      )}
    </div>
  );
}
