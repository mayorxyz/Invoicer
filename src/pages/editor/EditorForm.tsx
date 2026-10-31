import React from 'react';
import { v4 as uuid } from 'uuid';
import { Icon } from '../../components/ui/Icon';
import { today } from '../../lib/dates';
import type { Mode, Item } from '../../types';
import { SignaturePad } from './SignaturePad';
import { PhotoUploader } from './PhotoUploader';
import type { Draft, Business } from './editorTypes';
import { Select } from '../../components/ui/Select';

export const INPUT =
  'w-full min-w-0 bg-surface border border-rule rounded-lg px-3 py-2 text-base sm:text-sm outline-none transition-shadow focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)]';

const MODE_LABEL: Record<string, string> = { invoice: 'Invoice', quote: 'Estimate', receipt: 'Receipt' };

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label className="text-xs font-medium text-muted mb-1 block truncate">{label}</label>
      {children}
    </div>
  );
}

function Card({
  n, title, action, children,
}: { n: number; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-rule rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
      <header className="px-4 py-3 md:px-5 border-b border-rule flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="w-5 h-5 shrink-0 rounded-full grid place-items-center text-[11px] font-mono font-bold"
            style={{ background: 'color-mix(in srgb, var(--accent) 14%, transparent)', color: 'var(--accent)' }}
          >
            {n}
          </span>
          <h3 className="text-xs uppercase font-bold tracking-wider truncate">{title}</h3>
        </div>
        {action}
      </header>
      <div className="p-4 md:p-5">{children}</div>
    </section>
  );
}

export interface EditorFormProps {
  draft: Draft;
  business: Business;
  updateDraft: (patch: Partial<Draft>) => void;
  setBiz: (patch: Record<string, unknown>) => void;
  shipToEnabled: boolean;
  setShipToEnabled: (v: boolean) => void;
  signature: string;
  setSignature: (v: string) => void;
  photos: string[];
  setPhotos: (v: string[]) => void;
  paymentTerms: string;
  onPaymentTermsChange: (terms: string) => void;
  onIssueDateChange: (date: string) => void;
  poNumber: string;
}

export function EditorForm({
  draft, business, updateDraft, setBiz,
  shipToEnabled, setShipToEnabled,
  signature, setSignature, photos, setPhotos,
  paymentTerms, onPaymentTermsChange, onIssueDateChange, poNumber,
}: EditorFormProps) {
  const updateItem = (id: string, patch: Partial<Item>) => {
    updateDraft({ items: draft.items.map(i => (i.id === id ? { ...i, ...patch } : i)) });
  };

  const addItem = () => {
    updateDraft({ items: [...draft.items, { id: uuid(), desc: '', qty: 1, unit: 'each', price: 0, taxable: true, taxIds: [] }] });
  };

  const removeItem = (id: string) => {
    if (draft.items.length > 1) updateDraft({ items: draft.items.filter(i => i.id !== id) });
  };

  return (
    <>
      {/* Type & currency */}
      <div className="bg-surface border border-rule rounded-2xl p-3 md:p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline text-xs uppercase font-bold tracking-wider text-muted">Type</span>
          <div className="inline-flex bg-background rounded-lg p-0.5 border border-rule">
            {(['invoice', 'quote', 'receipt'] as Mode[]).map(mode => (
              <button
                key={mode}
                onClick={() => updateDraft({ mode })}
                className={`px-3 py-1.5 text-xs rounded-md transition-all ${
                  draft.mode === mode ? 'bg-surface text-foreground font-semibold shadow-sm' : 'text-muted font-medium hover:text-foreground'
                }`}
              >
                {MODE_LABEL[mode]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-xs uppercase font-bold tracking-wider text-muted">Currency</span>
          <Select
            value={draft.currency}
            onChange={e => updateDraft({ currency: e.target.value })}
            className="w-auto font-mono text-xs font-semibold py-1.5"
          >
            <option value="NGN">₦ NGN</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </Select>
        </div>
      </div>

      {/* 1 Sender */}
      <Card n={1} title="Sender (From)">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 border border-dashed border-rule rounded-xl bg-background/40">
            <div className="w-14 h-14 shrink-0 border border-rule bg-surface rounded-lg grid place-items-center overflow-hidden">
              {business.logo ? (
                <img src={business.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <Icon name="image" size={22} className="text-muted" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold">Company Logo</div>
              <p className="text-xs text-muted">PNG, JPG or SVG, max 2MB</p>
              <div className="flex items-center gap-3 mt-1.5">
                <label className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer text-white" style={{ backgroundColor: 'var(--accent)' }}>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) { alert('File too large (max 2MB)'); return; }
                      const reader = new FileReader();
                      reader.onload = ev => setBiz({ logo: ev.target?.result as string });
                      reader.readAsDataURL(file);
                    }}
                  />
                  Choose File
                </label>
                {business.logo && (
                  <button onClick={() => setBiz({ logo: '' })} className="text-xs text-danger hover:underline">Remove</button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Business / Sender Name *" className="col-span-2">
              <input type="text" value={business.name} onChange={e => setBiz({ name: e.target.value })} placeholder="Acme Corporation" className={INPUT} />
            </Field>
            <Field label="Email">
              <input type="email" value={business.email} onChange={e => setBiz({ email: e.target.value })} placeholder="billing@acme.com" className={INPUT} />
            </Field>
            <Field label="Phone">
              <input type="text" value={business.phone} onChange={e => setBiz({ phone: e.target.value })} placeholder="+1 (555) 000-0000" className={INPUT} />
            </Field>
            <Field label="Tax / Business ID" className="col-span-2">
              <input type="text" value={business.taxId || ''} onChange={e => setBiz({ taxId: e.target.value })} placeholder="TAX-99823412" className={`${INPUT} font-mono`} />
            </Field>
            <Field label="Street Address" className="col-span-2">
              <textarea value={business.address} onChange={e => setBiz({ address: e.target.value })} placeholder="123 Innovation Way, Suite 400" rows={2} className={`${INPUT} resize-none`} />
            </Field>
          </div>
        </div>
      </Card>

      {/* 2 Meta */}
      <Card n={2} title="Document Meta">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          <Field label="Doc Number *">
            <input type="text" value={draft.number} onChange={e => updateDraft({ number: e.target.value })} className={`${INPUT} font-mono font-semibold`} />
          </Field>
          <Field label="Issue Date">
            <input type="date" value={draft.issueDate} onChange={e => onIssueDateChange(e.target.value)} className={`${INPUT} font-mono`} />
          </Field>
          <Field label="Payment Terms">
            <Select value={paymentTerms} onChange={e => onPaymentTermsChange(e.target.value)} className={INPUT}>
              <option value="Net 15">Net 15 Days</option>
              <option value="Net 30">Net 30 Days</option>
              <option value="Net 60">Net 60 Days</option>
              <option value="Due on Receipt">Due on Receipt</option>
              <option value="Custom">Custom</option>
            </Select>
          </Field>
          <Field label="Due Date">
            <input type="date" value={draft.dueDate} onChange={e => updateDraft({ dueDate: e.target.value })} className={`${INPUT} font-mono`} />
          </Field>
          <Field label="PO Number (Optional)" className="col-span-2">
            <input
              type="text"
              value={poNumber}
              onChange={e => {
                const cf = draft.customFields || [];
                const i = cf.findIndex(f => f.label === 'PO Number');
                if (i >= 0) {
                  const next = [...cf];
                  next[i] = { ...next[i], value: e.target.value };
                  updateDraft({ customFields: next });
                } else {
                  updateDraft({ customFields: [...cf, { id: uuid(), label: 'PO Number', value: e.target.value }] });
                }
              }}
              placeholder="PO-88391"
              className={`${INPUT} font-mono`}
            />
          </Field>
        </div>
      </Card>

      {/* 3 Client */}
      <Card
        n={3}
        title="Client & Recipient"
        action={
          <label className="flex items-center gap-2 cursor-pointer shrink-0">
            <input type="checkbox" checked={shipToEnabled} onChange={e => setShipToEnabled(e.target.checked)} className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent)' }} />
            <span className="text-xs font-medium text-muted">Ship To</span>
          </label>
        }
      >
        <div className={`grid grid-cols-1 gap-5 ${shipToEnabled ? 'xl:grid-cols-2' : ''}`}>
          <div className="space-y-3 min-w-0">
            <h4 className="text-xs uppercase font-bold tracking-wide" style={{ color: 'var(--accent)' }}>Bill To</h4>
            <Field label="Client / Company Name *">
              <input type="text" value={draft.client.name} onChange={e => updateDraft({ client: { ...draft.client, name: e.target.value } })} placeholder="Global Services Ltd" className={INPUT} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Email">
                <input type="email" value={draft.client.email} onChange={e => updateDraft({ client: { ...draft.client, email: e.target.value } })} placeholder="accounts@client.com" className={INPUT} />
              </Field>
              <Field label="Phone">
                <input type="text" value={draft.client.phone} onChange={e => updateDraft({ client: { ...draft.client, phone: e.target.value } })} placeholder="+1 (555) 999-1122" className={INPUT} />
              </Field>
            </div>
            <Field label="Billing Address">
              <textarea value={draft.client.address} onChange={e => updateDraft({ client: { ...draft.client, address: e.target.value } })} placeholder="742 Evergreen Terrace" rows={2} className={`${INPUT} resize-none`} />
            </Field>
          </div>

          {shipToEnabled && (
            <div className="space-y-3 min-w-0">
              <h4 className="text-xs uppercase font-bold tracking-wide text-muted">Ship To</h4>
              <Field label="Recipient Name">
                <input type="text" value={draft.shipToName || ''} onChange={e => updateDraft({ shipToName: e.target.value })} placeholder="Warehouse #4" className={INPUT} />
              </Field>
              <Field label="Shipping Address">
                <textarea value={draft.shipToAddress || ''} onChange={e => updateDraft({ shipToAddress: e.target.value })} placeholder="800 Logistics Blvd, Dock B" rows={2} className={`${INPUT} resize-none`} />
              </Field>
            </div>
          )}
        </div>
      </Card>

      {/* 4 Items */}
      <Card
        n={4}
        title="Line Items & Services"
        action={
          <button onClick={addItem} className="flex items-center gap-1 text-xs font-semibold shrink-0" style={{ color: 'var(--accent)' }}>
            <Icon name="plus" size={16} />
            Add
          </button>
        }
      >
        <div className="space-y-3">
          {draft.items.map((item, idx) => (
            <div key={item.id} className="border border-rule rounded-xl p-3 bg-background/30">
              <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 md:col-span-6 min-w-0">
                  <input type="text" value={item.desc} onChange={e => updateItem(item.id, { desc: e.target.value })} placeholder={`Item ${idx + 1} / Service Name`} className={`${INPUT} font-semibold`} />
                </div>
                <div className="col-span-4 md:col-span-2 min-w-0">
                  <input type="number" value={item.qty} onChange={e => updateItem(item.id, { qty: parseFloat(e.target.value) || 0 })} placeholder="Qty" min="0" step="any" className={`${INPUT} font-mono`} />
                </div>
                <div className="col-span-8 md:col-span-4 flex gap-1.5 min-w-0">
                  <input type="number" value={item.price} onChange={e => updateItem(item.id, { price: parseFloat(e.target.value) || 0 })} placeholder="Rate" min="0" step="any" className={`${INPUT} font-mono flex-1`} />
                  <button onClick={() => removeItem(item.id)} className="shrink-0 w-9 grid place-items-center text-muted hover:text-danger rounded-lg hover:bg-danger-bg transition-colors" title="Delete row" aria-label="Delete row">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
                <div className="col-span-12">
                  <textarea
                    value={item.customFields?.[0]?.value || ''}
                    onChange={e => {
                      const cf = item.customFields || [];
                      const next = cf.length
                        ? cf.map((f, i) => (i === 0 ? { ...f, value: e.target.value } : f))
                        : [{ id: uuid(), label: 'Details', value: e.target.value }];
                      updateItem(item.id, { customFields: next });
                    }}
                    placeholder="Additional details (optional)"
                    rows={1}
                    className={`${INPUT} text-muted resize-none`}
                  />
                </div>
              </div>
            </div>
          ))}
          <button onClick={addItem} className="w-full border border-dashed border-rule rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors">
            <Icon name="plus-circle" size={16} color="var(--accent)" />
            Add Item Row
          </button>
        </div>
      </Card>

      {/* 5 Financial */}
      <Card n={5} title="Financial Details & Adjustments">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Discount">
            <div className="flex gap-1.5">
              <input type="number" value={draft.discVal} onChange={e => updateDraft({ discVal: parseFloat(e.target.value) || 0 })} placeholder="0" className={`${INPUT} font-mono flex-1`} />
              <Select value={draft.discType} onChange={e => updateDraft({ discType: e.target.value as 'percent' | 'fixed' })} className="w-auto min-w-0 bg-surface border border-rule rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)]">
                <option value="percent">%</option>
                <option value="fixed">Fixed</option>
              </Select>
            </div>
          </Field>
          <Field label="Tax Rate (%)">
            <input
              type="number"
              value={draft.taxes[0]?.rate ? +(draft.taxes[0].rate * 100).toFixed(4) : 0}
              onChange={e => {
                const rate = (parseFloat(e.target.value) || 0) / 100;
                if (draft.taxes.length > 0) {
                  const taxes = [...draft.taxes];
                  taxes[0] = { ...taxes[0], rate };
                  updateDraft({ taxes });
                } else {
                  updateDraft({ taxes: [{ id: uuid(), label: 'Tax', rate, type: 'added', applyTo: 'all', enabled: true }] });
                }
              }}
              placeholder="0"
              className={`${INPUT} font-mono`}
            />
          </Field>
          <Field label="Shipping Fee">
            <input type="number" value={draft.shipping} onChange={e => updateDraft({ shipping: parseFloat(e.target.value) || 0 })} placeholder="0.00" className={`${INPUT} font-mono`} />
          </Field>
          <Field label="Amount Previously Paid">
            <input
              type="number"
              value={draft.payments[0]?.amount || 0}
              onChange={e => {
                const amount = parseFloat(e.target.value) || 0;
                if (draft.payments.length > 0) {
                  const payments = [...draft.payments];
                  payments[0] = { ...payments[0], amount };
                  updateDraft({ payments });
                } else {
                  updateDraft({ payments: [{ id: uuid(), date: today(), amount, method: 'transfer' }] });
                }
              }}
              placeholder="0.00"
              className={`${INPUT} font-mono`}
            />
          </Field>
        </div>
      </Card>

      {/* 6 Notes */}
      <Card n={6} title="Notes, Signature & Photos">
        <div className="space-y-4">
          <Field label="Notes / Terms & Conditions">
            <textarea value={draft.notes} onChange={e => updateDraft({ notes: e.target.value })} placeholder="Thank you for your business! Payment is due within 30 days via bank transfer..." rows={3} className={`${INPUT} resize-none`} />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SignaturePad value={signature} onChange={setSignature} onClear={() => setSignature('')} />
            <PhotoUploader photos={photos} onChange={setPhotos} />
          </div>
        </div>
      </Card>
    </>
  );
}
