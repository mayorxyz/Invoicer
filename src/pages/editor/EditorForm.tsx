import React from 'react';
import { v4 as uuid } from 'uuid';
import { Icon } from '../../components/ui/Icon';
import { today } from '../../lib/dates';
import type { Mode, Item } from '../../types';
import { SignaturePad } from './SignaturePad';
import { PhotoUploader } from './PhotoUploader';
import type { Draft, Business } from './editorTypes';
import { Select } from '../../components/ui/Select';
import { NumberInput } from '../../components/ui/NumberInput';
import { DatePicker } from '../../components/ui/DatePicker';
import { CURRENCY_LIST } from '../../data/currencies';
import { ALL_COUNTRIES } from '../../data/countries';
import { useStore } from '../../store/useStore';

export const INPUT =
  'w-full min-w-0 bg-surface border border-border rounded-md px-3 py-2 text-sm font-medium hover:border-[var(--border-strong)] focus:border-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed';

const COMPACT_SELECT =
  'bg-background border border-rule rounded-md px-2 py-1.5 text-xs font-medium text-muted hover:text-foreground focus:border-[var(--accent)] outline-none cursor-pointer min-w-0';

const MODE_LABEL: Record<string, string> = { invoice: 'Invoice', quote: 'Estimate', receipt: 'Receipt' };

// Static Container Query Styles extracted outside component to prevent re-creation on render
const CONTAINER_STYLES = `
  .form-grid-two { display: grid; gap: 0.75rem; grid-template-columns: 1fr; min-width: 0; }
  @container (min-width: 32rem) {
    .form-grid-two { grid-template-columns: repeat(2, 1fr); }
    .form-span-two { grid-column: span 2; }
  }
  .form-meta-grid { display: grid; gap: 0.75rem; grid-template-columns: 1fr; min-width: 0; }
  @container (min-width: 32rem) {
    .form-meta-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @container (min-width: 48rem) {
    .form-meta-grid { grid-template-columns: repeat(3, 1fr); }
    .form-meta-span { grid-column: span 2; }
  }
  .form-client-grid { display: grid; gap: 1.25rem; grid-template-columns: 1fr; min-width: 0; }
  @container (min-width: 48rem) {
    .form-client-grid.has-ship-to { grid-template-columns: repeat(2, 1fr); }
  }
  .form-item-grid { display: grid; gap: 0.5rem; grid-template-columns: 1fr; min-width: 0; }
  @container (min-width: 32rem) {
    .form-item-grid { grid-template-columns: 2fr 1fr 1.5fr; }
    .form-item-desc { grid-column: span 2; }
  }
  @container (min-width: 48rem) {
    .form-item-grid { grid-template-columns: 2fr 1fr 1.5fr 2fr; }
    .form-item-details { grid-column: span 4; }
  }
  .attachment-grid { display: grid; gap: 1rem; grid-template-columns: 1fr; min-width: 0; }
  @container (min-width: 48rem) {
    .attachment-grid { grid-template-columns: repeat(2, 1fr); }
  }
`;

function AutoGrowTextarea({ className = '', value, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = React.useRef<HTMLTextAreaElement>(null);
  const resize = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, []);
  React.useLayoutEffect(resize, [value, resize]);
  return (
    <textarea
      {...props}
      ref={ref}
      value={value}
      rows={1}
      onInput={e => {
        resize();
        props.onInput?.(e);
      }}
      className={`${className} overflow-hidden`}
    />
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full min-w-0 ${className}`}>
      <label className="text-xs font-medium text-muted mb-1 block truncate">{label}</label>
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
}

function Card({
  n, title, action, children,
}: { n: number; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-surface border border-rule rounded-2xl overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.04)] w-full min-w-0">
      <header className="px-4 py-3 @[32rem]:px-5 border-b border-rule flex flex-col @[32rem]:flex-row items-stretch @[32rem]:items-center justify-between gap-3 min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span
            className="w-5 h-5 shrink-0 rounded-full grid place-items-center text-[11px] font-mono font-bold"
            style={{ background: 'color-mix(in srgb, var(--color-foreground) 12%, transparent)', color: 'var(--color-foreground)' }}
          >
            {n}
          </span>
          <h3 className="text-xs uppercase font-bold tracking-wider truncate">{title}</h3>
        </div>
        {action && <div className="w-full @[32rem]:w-auto min-w-0">{action}</div>}
      </header>
      <div className="p-4 @[32rem]:p-5 min-w-0">{children}</div>
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
  selectedClientId?: string;
  setSelectedClientId?: (id: string | undefined) => void;
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
    if (draft.items.length > 1) {
      updateDraft({ items: draft.items.filter(i => i.id !== id) });
    } else {
      updateDraft({
        items: [{ id, desc: '', qty: 1, unit: 'each', price: 0, taxable: true, taxIds: [], customFields: [] }],
      });
    }
  };

  const { state } = useStore();
  const savedClients = state.clients || [];
  const catalogItems = state.savedItems || [];
  
  const pickSavedClient = (id: string) => {
    if (!id) {
      updateDraft({ clientId: undefined });
      return;
    }
    const c = savedClients.find((x: any) => x.id === id);
    if (!c) return;
    updateDraft({
      clientId: c.id,
      client: {
        ...draft.client,
        name: c.name ?? '',
        email: c.email ?? '',
        phone: c.phone ?? '',
        address: c.address ?? '',
      },
    });
  };

  const addSavedItemRow = (savedItemId: string) => {
    if (!savedItemId) return;
    const item = catalogItems.find((x: any) => x.id === savedItemId);
    if (!item) return;

    const newItem: Item = {
      id: uuid(),
      desc: item.desc || item.name || '',
      qty: 1,
      unit: item.unit || 'each',
      price: item.price || 0,
      taxable: item.taxable ?? true,
      taxIds: item.taxIds || [],
    };

    const first = draft.items[0];
    const onlyBlankRow = draft.items.length === 1 && !first.desc && !first.price;
    updateDraft({
      items: onlyBlankRow ? [{ ...newItem, id: first.id }] : [...draft.items, newItem],
    });
  };

  return (
    <>
      <style>{CONTAINER_STYLES}</style>

      <div className="@container w-full min-w-0 space-y-4">
        {/* Type & currency */}
        <div className="bg-surface border border-rule rounded-2xl p-3 @[32rem]:p-4 flex flex-col @[32rem]:flex-row items-stretch @[32rem]:items-center justify-between gap-3 w-full min-w-0">
          <div className="flex flex-col @[32rem]:flex-row items-stretch @[32rem]:items-center gap-2 w-full @[32rem]:w-auto min-w-0">
            <span className="hidden @[32rem]:inline text-xs uppercase font-bold tracking-wider text-muted shrink-0">Type</span>
            <div className="flex bg-background rounded-lg p-0.5 border border-rule w-full @[32rem]:w-auto min-w-0">
              {(['invoice', 'quote', 'receipt'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => updateDraft({ mode })}
                  className={`flex-1 px-2 @[32rem]:px-3 py-1.5 text-xs rounded-md transition-all text-center truncate ${
                    draft.mode === mode ? 'bg-surface text-foreground font-semibold shadow-sm' : 'text-muted font-medium hover:text-foreground'
                  }`}
                >
                  {MODE_LABEL[mode]}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col @[32rem]:flex-row items-stretch @[32rem]:items-center gap-2 w-full @[32rem]:w-auto min-w-0">
            <span className="hidden @[32rem]:inline text-xs uppercase font-bold tracking-wider text-muted shrink-0">Currency</span>
            <Select
              value={draft.currency}
              onChange={e => updateDraft({ currency: e.target.value })}
              className="w-full @[32rem]:w-[210px] font-mono text-xs font-semibold min-w-0"
            >
              {CURRENCY_LIST.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.code} — {curr.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* 1 Sender */}
        <Card n={1} title="Sender (From)">
          <div className="space-y-4 w-full min-w-0">
            <div className="flex items-center gap-3 p-3 border border-dashed border-rule rounded-xl bg-background/40 flex-wrap min-w-0">
              <div className="w-14 h-14 shrink-0 border border-rule bg-surface rounded-lg grid place-items-center overflow-hidden">
                {business.logo ? (
                  <img src={business.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Icon name="image" size={22} className="text-muted" />
                )}
              </div>
              <div className="flex-1 min-w-[140px]">
                <div className="text-xs font-semibold">Company Logo</div>
                <p className="text-xs text-muted">PNG, JPG or SVG, max 2MB</p>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <label className="text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer" style={{ backgroundColor: 'var(--color-foreground)', color: 'var(--color-background)' }}>
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

            <div className="form-grid-two w-full min-w-0">
              <Field label="Business / Sender Name *" className="form-span-two">
                <input type="text" value={business.name} onChange={e => setBiz({ name: e.target.value })} placeholder="Acme Corporation" className={INPUT} />
              </Field>
              <Field label="Email">
                <input type="email" value={business.email} onChange={e => setBiz({ email: e.target.value })} placeholder="billing@acme.com" className={INPUT} />
              </Field>
              <Field label="Phone">
                <input type="text" value={business.phone} onChange={e => setBiz({ phone: e.target.value })} placeholder="+1 (555) 000-0000" className={INPUT} />
              </Field>
              <Field label="Tax / Business ID" className="form-span-two">
                <input type="text" value={business.taxId || ''} onChange={e => setBiz({ taxId: e.target.value })} placeholder="TAX-99823412" className={`${INPUT} font-mono`} />
              </Field>
              <Field label="Street Address" className="form-span-two">
                <textarea value={business.address} onChange={e => setBiz({ address: e.target.value })} placeholder="123 Innovation Way, Suite 400" rows={2} className={`${INPUT} resize-none`} />
              </Field>
            </div>
          </div>
        </Card>

        {/* 2 Meta */}
        <Card n={2} title="Document Meta">
          <div className="form-meta-grid w-full min-w-0">
            <Field label="Doc Number *">
              <input type="text" value={draft.number} onChange={e => updateDraft({ number: e.target.value })} className={`${INPUT} font-mono font-semibold`} />
            </Field>
            <Field label="Issue Date">
              <DatePicker value={draft.issueDate} onChange={onIssueDateChange} ariaLabel="Issue date" className={INPUT} />
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
              <DatePicker value={draft.dueDate} onChange={date => updateDraft({ dueDate: date })} ariaLabel="Due date" className={INPUT} />
            </Field>
            <Field label="PO Number (Optional)" className="form-meta-span">
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
            <div className="flex flex-col @[32rem]:flex-row items-stretch @[32rem]:items-center gap-2 @[32rem]:gap-3 w-full @[32rem]:w-auto shrink-0 min-w-0">
              {savedClients.length > 0 && (
                <Select
                  value={draft.clientId ?? ''}
                  onChange={e => pickSavedClient(e.target.value)}
                  className={`${COMPACT_SELECT} flex-1 @[32rem]:min-w-[160px]`}
                >
                  <option value="">Select Client…</option>
                  {savedClients.map((c: any) => (
                    <option key={c.id} value={c.id}>
                      {c.name}{c.email ? ` (${c.email})` : ''}
                    </option>
                  ))}
                </Select>
              )}
              <label className="flex items-center justify-center @[32rem]:justify-start gap-2 cursor-pointer shrink-0 h-9 px-3 rounded-md border border-rule bg-background hover:bg-background-subtle transition-colors whitespace-nowrap">
                <input type="checkbox" checked={shipToEnabled} onChange={e => setShipToEnabled(e.target.checked)} className="w-4 h-4 rounded shrink-0" style={{ accentColor: 'var(--accent)' }} />
                <span className="text-xs font-medium text-muted">Ship To</span>
              </label>
            </div>
          }
        >
          <div className={`form-client-grid w-full min-w-0 ${shipToEnabled ? 'has-ship-to' : ''}`}>
            <div className="space-y-3 w-full min-w-0">
              <h4 className="text-xs uppercase font-bold tracking-wide" style={{ color: 'var(--color-foreground)' }}>Bill To</h4>

              <Field label="Client / Company Name *">
                <input type="text" value={draft.client.name} onChange={e => updateDraft({ client: { ...draft.client, name: e.target.value } })} placeholder="Global Services Ltd" className={INPUT} />
              </Field>
              <div className="form-grid-two w-full min-w-0">
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
              <div className="space-y-3 w-full min-w-0">
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
            <div className="flex flex-col @[32rem]:flex-row items-stretch @[32rem]:items-center gap-2 @[32rem]:gap-3 w-full @[32rem]:w-auto shrink-0 min-w-0">
              {catalogItems.length > 0 && (
                <Select
                  value=""
                  onChange={e => addSavedItemRow(e.target.value)}
                  className={`${COMPACT_SELECT} flex-1 @[32rem]:min-w-[160px]`}
                >
                  <option value="">+ Quick add item…</option>
                  {catalogItems.map((si: any) => (
                    <option key={si.id} value={si.id}>
                      {si.name || si.desc}
                    </option>
                  ))}
                </Select>
              )}
              <button 
                onClick={addItem} 
                className="flex items-center justify-center gap-1.5 text-xs font-semibold h-9 px-3 rounded-md border border-rule bg-background hover:bg-background-subtle transition-colors shrink-0 whitespace-nowrap" 
                style={{ color: 'var(--color-foreground)' }}
              >
                <Icon name="plus" size={16} className="shrink-0" />
                <span>Add</span>
              </button>
            </div>
          }
        >
          <div className="space-y-3 w-full min-w-0">
            {draft.items.map((item, idx) => (
              <div key={item.id} className="border border-rule rounded-xl p-3 bg-background/30 w-full min-w-0">
                <div className="form-item-grid w-full min-w-0">
                  <div className="form-item-desc w-full min-w-0">
                    <input type="text" value={item.desc} onChange={e => updateItem(item.id, { desc: e.target.value })} placeholder={`Item ${idx + 1} / Service Name`} className={`${INPUT} font-semibold`} />
                  </div>
                  <div className="form-item-qty w-full min-w-0">
                    <NumberInput value={item.qty} onChange={v => updateItem(item.id, { qty: v })} placeholder="Qty" min="0" step="any" className={`${INPUT} font-mono`} />
                  </div>
                  <div className="form-item-rate flex gap-1.5 w-full min-w-0">
                    <NumberInput value={item.price} onChange={v => updateItem(item.id, { price: v })} placeholder="Rate" min="0" step="any" className={`${INPUT} font-mono flex-1`} />
                    <button onClick={() => removeItem(item.id)} className="shrink-0 w-9 h-9 grid place-items-center text-muted hover:text-danger rounded-lg hover:bg-danger-bg transition-colors" title="Delete row" aria-label="Delete row">
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                  <div className="form-item-details w-full min-w-0">
                    <AutoGrowTextarea
                      value={item.customFields?.[0]?.value || ''}
                      onChange={e => {
                        const cf = item.customFields || [];
                        const next = cf.length
                          ? cf.map((f, i) => (i === 0 ? { ...f, value: e.target.value } : f))
                          : [{ id: uuid(), label: 'Details', value: e.target.value }];
                        updateItem(item.id, { customFields: next });
                      }}
                      placeholder="Additional details (optional)"
                      className={`${INPUT} text-muted resize-none`}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button onClick={addItem} className="w-full border border-dashed border-rule rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-muted hover:text-foreground transition-colors">
              <Icon name="plus-circle" size={16} color="var(--color-foreground)" />
              Add Item Row
            </button>
          </div>
        </Card>

        {/* 5 Financial */}
        <Card n={5} title="Financial Details & Adjustments">
          <div className="form-grid-two w-full min-w-0">
            <Field label="Discount">
              <div className="flex gap-1.5 w-full min-w-0">
                <NumberInput value={draft.discVal} onChange={v => updateDraft({ discVal: v })} placeholder="0" className={`${INPUT} font-mono flex-1`} />
                <Select value={draft.discType} onChange={e => updateDraft({ discType: e.target.value as 'percent' | 'fixed' })} className="w-24 bg-surface border border-rule rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--accent)] shrink-0">
                  <option value="percent">%</option>
                  <option value="fixed">Fixed</option>
                </Select>
              </div>
            </Field>
            <Field label="Tax Rate (%)">
              <NumberInput
                value={draft.taxes[0]?.rate ? +(draft.taxes[0].rate * 100).toFixed(4) : 0}
                onChange={(value) => {
                  const rate = value / 100;
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
              <NumberInput value={draft.shipping} onChange={v => updateDraft({ shipping: v })} placeholder="0.00" className={`${INPUT} font-mono`} />
            </Field>
            <Field label="Amount Previously Paid">
              <NumberInput
                value={draft.payments[0]?.amount || 0}
                onChange={(amount) => {
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
            <Field label="Name of Bank">
              <input
                type="text"
                value={draft.bankName || ''}
                onChange={e => updateDraft({ bankName: e.target.value })}
                placeholder="e.g. Chase Bank"
                className={`${INPUT} font-mono`}
              />
            </Field>
            <Field label="Account Number">
              <input
                type="text"
                value={draft.bankAccount || ''}
                onChange={e => updateDraft({ bankAccount: e.target.value })}
                placeholder="1234567890"
                className={`${INPUT} font-mono`}
              />
            </Field>
            <Field label="Routing Number" className="form-span-two">
              <input
                type="text"
                value={draft.bankRouting || ''}
                onChange={e => updateDraft({ bankRouting: e.target.value })}
                placeholder="098765432"
                className={`${INPUT} font-mono`}
              />
            </Field>
          </div>
        </Card>

        {/* 6 Notes */}
        <Card n={6} title="Notes, Signature & Photos">
          <div className="space-y-4 w-full min-w-0">
            <Field label="Notes / Terms & Conditions">
              <textarea value={draft.notes} onChange={e => updateDraft({ notes: e.target.value })} placeholder="Thank you for your business! Payment is due within 30 days via bank transfer..." rows={3} className={`${INPUT} resize-none`} />
            </Field>
            <div className="attachment-grid w-full min-w-0">
              <div className="w-full min-w-0"><SignaturePad value={signature} onChange={setSignature} onClear={() => setSignature('')} /></div>
              <div className="w-full min-w-0"><PhotoUploader photos={photos} onChange={setPhotos} /></div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}