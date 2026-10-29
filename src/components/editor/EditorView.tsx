import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Accordion, AccordionSection } from '../ui/Accordion';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { Segmented } from '../ui/Segmented';
import { Icon } from '../ui/Icon';
import { totals, formatMoney } from '../../lib/money';
import { today, addDays } from '../../lib/dates';
import { getCountry, MODE_LABELS } from '../../data/countries';
import { CURRENCY_LIST } from '../../data/currencies';
import { ACCENT_PALETTE, UNITS } from '../../lib/defaults';
import type { Mode, Status, PaperSize } from '../../types';
import { PreviewStage } from './PreviewStage';

export function EditorView() {
  const { draft, newDraft, updateDraft, saveDraft, state } = useStore();
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');

  const business = state.businesses[0];
  const country = getCountry(state.settings.country);

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 px-4">
        <div className="w-20 h-20 rounded-lg bg-flame-tint flex items-center justify-center mb-6">
          <Icon name="file-text" size={48} weight="duotone" color="var(--flame)" />
        </div>
        <h2 className="h4 text-ink mb-2 text-center">Create your first invoice</h2>
        <p className="text-slate mb-6 text-center max-w-md">
          Get started by creating a new invoice, quote, or receipt. Your data stays in your browser.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button variant="primary" arrow onClick={() => newDraft('invoice')}>
            Create invoice
          </Button>
          <Button variant="secondary" onClick={() => newDraft('quote')}>
            Create quote
          </Button>
        </div>
      </div>
    );
  }

  const t = totals(draft);
  const completedSections = {
    business: !!business.name,
    document: !!draft.number && !!draft.issueDate,
    client: !!draft.client.name,
    items: draft.items.some(i => i.desc && i.price > 0),
    taxes: true,
    payments: true,
    notes: true,
    appearance: true,
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full pb-28 lg:pb-0">
      {/* Form Column */}
      <div className={`flex-1 lg:max-w-[480px] overflow-y-auto ${mobileTab === 'preview' ? 'hidden lg:block' : ''}`}>
        {/* Greeting Row */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <h2 className="h5 text-ink truncate">
                {draft.client.name ? `${draft.client.name}` : 'New document'}
              </h2>
              <p className="text-sm text-slate truncate">
                {draft.number} • {MODE_LABELS[draft.mode]} • Last saved {new Date(draft.updatedAt).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={saveDraft}>Save</Button>
              <Button variant="primary" arrow onClick={() => window.print()}>Download PDF</Button>
            </div>
          </div>
          <Segmented
            options={[
              { value: 'invoice', label: 'Invoice' },
              { value: 'quote', label: 'Quote' },
              { value: 'receipt', label: 'Receipt' },
            ]}
            value={draft.mode}
            onChange={(v) => updateDraft({ mode: v as Mode })}
          />
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-border rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-flame transition-all duration-300"
            style={{ width: `${(Object.values(completedSections).filter(Boolean).length / Object.keys(completedSections).length) * 100}%` }}
          />
        </div>

        {/* Accordion Form */}
        <Accordion>
          <AccordionSection index="01" title="Business" completed={completedSections.business} defaultOpen>
            <div className="space-y-3">
              <Input label="Business name" value={business.name} onChange={e => useStore.getState().updateBusiness({ name: e.target.value })} />
              <Input label="Email" type="email" value={business.email} onChange={e => useStore.getState().updateBusiness({ email: e.target.value })} />
              <Textarea label="Address" value={business.address} onChange={e => useStore.getState().updateBusiness({ address: e.target.value })} rows={2} />
            </div>
          </AccordionSection>

          <AccordionSection index="02" title="Document" completed={completedSections.document}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Number" value={draft.number} onChange={e => updateDraft({ number: e.target.value })} />
              <Select label="Currency" value={draft.currency} onChange={e => updateDraft({ currency: e.target.value })}>
                {CURRENCY_LIST.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
              </Select>
              <Input label="Issue date" type="date" value={draft.issueDate} onChange={e => updateDraft({ issueDate: e.target.value })} />
              <Input label="Due date" type="date" value={draft.dueDate} onChange={e => updateDraft({ dueDate: e.target.value })} />
            </div>
          </AccordionSection>

          <AccordionSection index="03" title="Client" completed={completedSections.client}>
            <div className="space-y-3">
              <Input label="Client name" value={draft.client.name} onChange={e => updateDraft({ client: { ...draft.client, name: e.target.value } })} />
              <Input label="Email" type="email" value={draft.client.email} onChange={e => updateDraft({ client: { ...draft.client, email: e.target.value } })} />
              <Textarea label="Address" value={draft.client.address} onChange={e => updateDraft({ client: { ...draft.client, address: e.target.value } })} rows={2} />
            </div>
          </AccordionSection>

          <AccordionSection index="04" title="Items" completed={completedSections.items}>
            <div className="space-y-2">
              {draft.items.map((item, idx) => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-2">
                  <Input label={idx === 0 ? 'Description' : ''} value={item.desc} onChange={e => {
                    const items = [...draft.items];
                    items[idx] = { ...item, desc: e.target.value };
                    updateDraft({ items });
                  }} className="flex-1" />
                  <div className="flex gap-2">
                    <Input label={idx === 0 ? 'Qty' : ''} type="number" value={item.qty} onChange={e => {
                      const items = [...draft.items];
                      items[idx] = { ...item, qty: parseFloat(e.target.value) || 0 };
                      updateDraft({ items });
                    }} className="w-full sm:w-20" />
                    <Input label={idx === 0 ? 'Price' : ''} type="number" prefix={CURRENCY_LIST.find(c => c.code === draft.currency)?.symbol} value={item.price} onChange={e => {
                      const items = [...draft.items];
                      items[idx] = { ...item, price: parseFloat(e.target.value) || 0 };
                      updateDraft({ items });
                    }} className="w-full sm:w-32" />
                  </div>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={() => updateDraft({ items: [...draft.items, { id: crypto.randomUUID(), desc: '', qty: 1, unit: 'each', price: 0, taxable: true, taxIds: [] }] })}>
                + Add item
              </Button>
            </div>
          </AccordionSection>

          <AccordionSection index="05" title="Taxes and discounts" completed={completedSections.taxes}>
            <div className="space-y-3">
              <Input label="Discount (%)" type="number" value={draft.discVal} onChange={e => updateDraft({ discVal: parseFloat(e.target.value) || 0 })} />
              <Input label="Shipping" type="number" prefix={CURRENCY_LIST.find(c => c.code === draft.currency)?.symbol} value={draft.shipping} onChange={e => updateDraft({ shipping: parseFloat(e.target.value) || 0 })} />
            </div>
          </AccordionSection>

          <AccordionSection index="06" title="Payments" completed={completedSections.payments}>
            <p className="text-sm text-slate">No payments recorded yet.</p>
          </AccordionSection>

          <AccordionSection index="07" title="Notes and terms" completed={completedSections.notes}>
            <div className="space-y-3">
              <Textarea label="Notes" value={draft.notes} onChange={e => updateDraft({ notes: e.target.value })} rows={3} />
              <Textarea label="Terms" value={draft.terms} onChange={e => updateDraft({ terms: e.target.value })} rows={3} />
            </div>
          </AccordionSection>

          <AccordionSection index="08" title="Appearance" completed={completedSections.appearance}>
            <div className="space-y-3">
              <div>
                <label className="text-[13px] font-medium text-ink mb-2 block">Template</label>
                <Segmented
                  options={[
                    { value: 'classic', label: 'Classic' },
                    { value: 'modern', label: 'Modern' },
                    { value: 'minimal', label: 'Minimal' },
                  ]}
                  value={draft.template}
                  onChange={(v) => updateDraft({ template: v as any })}
                />
              </div>
              <div>
                <label className="text-[13px] font-medium text-ink mb-2 block">Accent color</label>
                <div className="flex gap-2 flex-wrap">
                  {ACCENT_PALETTE.map(color => (
                    <button
                      key={color}
                      onClick={() => updateDraft({ accent: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${draft.accent === color ? 'border-ink scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[13px] font-medium text-ink mb-2 block">Paper size</label>
                <Segmented
                  options={[
                    { value: 'A4', label: 'A4' },
                    { value: 'Letter', label: 'Letter' },
                  ]}
                  value={draft.paperSize}
                  onChange={(v) => updateDraft({ paperSize: v as PaperSize })}
                />
              </div>
            </div>
          </AccordionSection>
        </Accordion>
      </div>

      {/* Preview Column */}
      <div className={`flex-1 ${mobileTab === 'form' ? 'hidden lg:block' : ''}`}>
        <PreviewStage />
      </div>

      {/* Sticky Totals Bar */}
      <div className="fixed bottom-12 lg:bottom-0 left-0 right-0 bg-white border-t border-border p-4 lg:hidden no-print z-10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex gap-4 text-sm">
            <div>
              <p className="text-xs text-slate">Total</p>
              <p className="tabular font-medium">{formatMoney(t.total, draft.currency)}</p>
            </div>
            <div>
              <p className="text-xs text-slate">Balance</p>
              <p className="tabular font-medium text-flame">{formatMoney(Math.max(0, t.balance), draft.currency)}</p>
            </div>
          </div>
          <Button variant="primary" size="sm" arrow onClick={() => window.print()}>
            Download
          </Button>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border flex lg:hidden no-print z-20">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileTab === 'form' ? 'text-flame border-b-2 border-flame' : 'text-slate'}`}
        >
          Form
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${mobileTab === 'preview' ? 'text-flame border-b-2 border-flame' : 'text-slate'}`}
        >
          Preview
        </button>
      </div>
    </div>
  );
}