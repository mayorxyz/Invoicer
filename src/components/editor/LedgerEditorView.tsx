import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Icon } from '../ui/Icon';
import { totals, formatMoney, toMinor, fromMinor } from '../../lib/money';
import { today, addDays, formatDateLocale } from '../../lib/dates';
import type { Mode, Item } from '../../types';
import { v4 as uuid } from 'uuid';
import { SignaturePad } from './SignaturePad';
import { PhotoUploader } from './PhotoUploader';
import { downloadInvoicePdf } from '../../lib/downloadInvoicePdf';

const INPUT =
  'w-full min-w-0 bg-surface border border-rule rounded-lg px-3 py-2 text-base sm:text-sm outline-none transition-shadow focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)]';

const ACCENTS = [
  { value: '#1F3FD1', label: 'Deep Blue' },
  { value: '#059669', label: 'Emerald' },
  { value: '#D97706', label: 'Amber' },
  { value: '#DC2626', label: 'Crimson' },
  { value: '#7C3AED', label: 'Violet' },
  { value: '#111827', label: 'Onyx' },
];

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

export function LedgerEditorView() {
  const { draft, newDraft, updateDraft, saveDraft, state, updateSettings } = useStore();
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [shipToEnabled, setShipToEnabled] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>('');
  const [accentOpen, setAccentOpen] = useState(false);

  useEffect(() => {
    if (!draft) newDraft('invoice');
  }, []);

  if (!draft) return null;

  const accent = state.settings.accent || '#1F3FD1';
  const business = state.businesses[0];
  const t = totals(draft);
  const setBiz = (patch: Record<string, unknown>) => useStore.getState().updateBusiness(patch as any);

  const handleLoadSample = () => {
    updateDraft({
      ...draft,
      mode: 'invoice' as Mode,
      number: 'INV-2026-089',
      issueDate: today(),
      dueDate: addDays(today(), 30),
      currency: 'USD',
      client: {
        id: uuid(),
        name: 'Aetheria Systems LLC',
        email: 'accounts@aetheria.com',
        phone: '+1 (555) 882-1920',
        address: '450 Innovation Parkway\nAustin, TX 78701',
      },
      items: [
        { id: uuid(), desc: 'UI/UX Design System Refactoring', qty: 1, unit: 'service', price: 2800, taxable: true, taxIds: [], customFields: [{ id: uuid(), label: 'Details', value: 'Component library creation, dark mode design tokens, and accessibility testing' }] },
        { id: uuid(), desc: 'Frontend React Development', qty: 40, unit: 'hrs', price: 85, taxable: true, taxIds: [], customFields: [{ id: uuid(), label: 'Details', value: 'Implementation of high-performance dashboard view with Tailwind CSS' }] },
        { id: uuid(), desc: 'Cloud Infrastructure Setup', qty: 1, unit: 'service', price: 1200, taxable: true, taxIds: [], customFields: [{ id: uuid(), label: 'Details', value: 'AWS architecture automation and CI/CD deployment pipeline configuration' }] },
      ],
      discType: 'percent' as const,
      discVal: 10,
      taxes: [{ id: uuid(), label: 'Tax', rate: 0.085, type: 'added' as const, applyTo: 'all' as const, enabled: true }],
      shipping: 150,
      payments: [{ id: uuid(), date: today(), amount: 500, method: 'transfer' as const }],
      notes: 'Thank you for partnering with Nexus Digital! Payment can be wired directly to our Chase Account #9928-1123.',
      customFields: [{ id: uuid(), label: 'PO Number', value: 'PO-99120' }],
    });
    setBiz({
      name: 'Nexus Digital Solutions',
      email: 'billing@nexusdigital.io',
      phone: '+1 (555) 234-5678',
      taxId: 'US-99381023',
      address: '100 Technology Plaza, Floor 8\nSan Francisco, CA 94105',
    });
  };

  const handleClear = () => {
    if (!confirm('Clear all fields? This cannot be undone.')) return;
    updateDraft({
      ...draft,
      number: 'INV-00104',
      issueDate: today(),
      dueDate: addDays(today(), 30),
      client: { id: '', name: '', email: '', phone: '', address: '' },
      items: [{ id: uuid(), desc: '', qty: 1, unit: 'each', price: 0, taxable: true, taxIds: [] }],
      discType: 'percent' as const,
      discVal: 0,
      taxes: [],
      shipping: 0,
      payments: [],
      notes: '',
      customFields: [],
      shipToName: '',
      shipToAddress: '',
    });
    setBiz({ name: '', email: '', phone: '', taxId: '', address: '', logo: '' });
    setSignature('');
    setPhotos([]);
    setShipToEnabled(false);
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = `${draft.number}-${draft.client.name || 'client'}`;
    window.print();
    setTimeout(() => { document.title = originalTitle; }, 100);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    setDownloadError('');
    try {
      const paperElement = document.querySelector('.print-paper') as HTMLElement;
      if (!paperElement) throw new Error('Paper element not found');
      await downloadInvoicePdf(paperElement, draft.number, draft.client.name);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setDownloadError('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveExport = () => {
    saveDraft();
    const exportData = {
      type: draft.mode,
      number: draft.number,
      total: fromMinor(t.total, draft.currency),
      date: draft.issueDate,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.mode}_${draft.number || 'document'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const termDays = (terms: string) =>
    terms === 'Net 15' ? 15 : terms === 'Net 30' ? 30 : terms === 'Net 60' ? 60 : 0;

  const handlePaymentTermsChange = (terms: string) => {
    updateDraft({ dueDate: addDays(draft.issueDate, termDays(terms)) });
  };

  const updateItem = (id: string, patch: Partial<Item>) => {
    updateDraft({ items: draft.items.map(i => (i.id === id ? { ...i, ...patch } : i)) });
  };

  const addItem = () => {
    updateDraft({ items: [...draft.items, { id: uuid(), desc: '', qty: 1, unit: 'each', price: 0, taxable: true, taxIds: [] }] });
  };

  const removeItem = (id: string) => {
    if (draft.items.length > 1) updateDraft({ items: draft.items.filter(i => i.id !== id) });
  };

  const getPaymentTerms = () => {
    const days = Math.round((new Date(draft.dueDate).getTime() - new Date(draft.issueDate).getTime()) / 86400000);
    if (days === 0) return 'Due on Receipt';
    if (days === 15) return 'Net 15';
    if (days === 30) return 'Net 30';
    if (days === 60) return 'Net 60';
    return 'Custom';
  };

  const poNumber = draft.customFields?.find(f => f.label === 'PO Number')?.value || '';

  const bar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 sm:gap-6 font-mono">
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold text-muted">Total</div>
              <div className="text-sm md:text-base font-bold text-foreground whitespace-nowrap">{formatMoney(t.total, draft.currency)}</div>
            </div>
            <div className="h-8 w-px bg-rule shrink-0" />
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--accent)' }}>Balance Due</div>
              <div className="text-base md:text-lg font-extrabold whitespace-nowrap" style={{ color: 'var(--accent)' }}>{formatMoney(Math.max(0, t.balance), draft.currency)}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:items-start">
            <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 bg-background text-foreground border border-rule rounded-lg text-xs font-semibold px-3 h-10 hover:bg-background/80 transition-colors">
              <Icon name="printer" size={16} />
              <span>Print</span>
            </button>
            <div className="flex flex-col gap-1 min-w-0">
              <button onClick={handleDownloadPDF} disabled={isDownloading} className="inline-flex items-center justify-center gap-2 bg-background text-foreground border border-rule rounded-lg text-xs font-semibold px-3 h-10 hover:bg-background/80 transition-colors disabled:opacity-50">
                {isDownloading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <Icon name="download" size={16} />}
                <span>{isDownloading ? 'Wait...' : 'PDF'}</span>
              </button>
              {downloadError && <span className="text-xs text-danger">{downloadError}</span>}
            </div>
            <button onClick={handleSaveExport} className="inline-flex items-center justify-center gap-2 text-white rounded-lg text-xs font-semibold px-3 h-10 shadow-md hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--accent)' }}>
              <Icon name="download" size={16} />
              <span>Save</span>
            </button>
          </div>
        </div>
  );

  return (
    <div className="ledger-ed flex flex-col h-full min-h-0 bg-background" style={{ ['--accent' as any]: accent }}>
      {/* Softer borders in both themes + print safety */}
      <style>{`
        .ledger-ed .border-rule { border-color: color-mix(in srgb, currentColor 11%, transparent); }
        .ledger-ed .bg-rule { background-color: color-mix(in srgb, currentColor 14%, transparent); }
        .ledger-ed .border-rule\\/50 { border-color: color-mix(in srgb, currentColor 7%, transparent); }
        .ledger-ed .scroll-thin { scrollbar-width: thin; }
        .ledger-ed .no-bar { scrollbar-width: none; }
        .ledger-ed .no-bar::-webkit-scrollbar { display: none; }
        @media print {
          .ledger-ed, .ledger-ed .pane { overflow: visible !important; height: auto !important; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="shrink-0 bg-surface border-b border-rule print-hide">
        <div className="h-10 px-3 md:px-6 flex items-center gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setAccentOpen(o => !o)}
              className="flex items-center gap-1.5 h-7 px-2 rounded-lg border border-rule text-xs font-medium hover:bg-background"
              aria-label="Accent colour"
            >
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: accent }} />
              <span className="hidden sm:inline">Accent</span>
            </button>
            {accentOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setAccentOpen(false)} />
                <div className="absolute left-0 top-9 z-20 bg-surface border border-rule rounded-xl shadow-lg p-2 flex gap-2">
                  {ACCENTS.map(c => (
                    <button
                      key={c.value}
                      onClick={() => { updateSettings({ accent: c.value }); setAccentOpen(false); }}
                      className="w-6 h-6 rounded-full transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c.value,
                        boxShadow: accent === c.value ? `0 0 0 2px var(--surface, #fff), 0 0 0 4px ${c.value}` : 'none',
                      }}
                      title={c.label}
                      aria-label={c.label}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => updateSettings({ theme: state.settings.theme === 'dark' ? 'light' : 'dark' })}
            className="p-1.5 hover:bg-background rounded-lg transition-colors"
            aria-label="Toggle theme"
          >
            <Icon name={state.settings.theme === 'dark' ? 'sun' : 'moon'} size={16} />
          </button>
          <div className="ml-auto flex items-center gap-1.5">
            <button onClick={handleLoadSample} className="text-xs font-semibold px-2.5 h-7 border border-rule hover:bg-background rounded-lg transition-colors whitespace-nowrap">
              Sample
            </button>
            <button onClick={handleClear} className="text-xs font-medium px-2.5 h-7 text-danger hover:bg-danger-bg rounded-lg transition-colors" title="Clear all fields">
              Clear
            </button>
          </div>
        </div>

        {/* Mobile tab switch */}
        <div className="lg:hidden px-3 pb-2">
          <div className="grid grid-cols-2 bg-background rounded-xl p-1 gap-1">
            {(['form', 'preview'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setMobileTab(tab)}
                className={`h-8 text-sm font-medium rounded-lg transition-all ${
                  mobileTab === tab ? 'bg-surface text-foreground shadow-sm border border-rule' : 'text-muted'
                }`}
              >
                {tab === 'form' ? 'Form' : 'Preview'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main: mobile scrolls as one page, desktop = two independent panes (preview stays fixed) */}
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pane">
        <div className="lg:flex lg:h-full min-w-0">
          {/* Form pane */}
          <div
            className={`pane lg:w-1/2 lg:h-full lg:overflow-y-auto scroll-thin lg:border-r border-rule min-w-0 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-5 print-hide ${
              mobileTab === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
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
                <select
                  value={draft.currency}
                  onChange={e => updateDraft({ currency: e.target.value })}
                  className="bg-background border border-rule rounded-lg px-2.5 py-1.5 text-xs font-semibold font-mono outline-none"
                >
                  <option value="NGN">₦ NGN</option>
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                </select>
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
                  <input
                    type="date"
                    value={draft.issueDate}
                    onChange={e => {
                      const d = e.target.value;
                      updateDraft({ issueDate: d, dueDate: addDays(d, termDays(getPaymentTerms())) });
                    }}
                    className={`${INPUT} font-mono`}
                  />
                </Field>
                <Field label="Payment Terms">
                  <select value={getPaymentTerms()} onChange={e => handlePaymentTermsChange(e.target.value)} className={INPUT}>
                    <option value="Net 15">Net 15 Days</option>
                    <option value="Net 30">Net 30 Days</option>
                    <option value="Net 60">Net 60 Days</option>
                    <option value="Due on Receipt">Due on Receipt</option>
                    <option value="Custom">Custom</option>
                  </select>
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
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
                    <select value={draft.discType} onChange={e => updateDraft({ discType: e.target.value as 'percent' | 'fixed' })} className={`${INPUT} !w-auto`}>
                      <option value="percent">%</option>
                      <option value="fixed">Fixed</option>
                    </select>
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
          </div>

          {/* Preview pane: own scroll on desktop so it stays put while the form scrolls */}
          <div
            className={`pane lg:w-1/2 lg:h-full lg:overflow-y-auto scroll-thin min-w-0 p-3 sm:p-4 md:p-6 lg:p-8 print-hide ${
              mobileTab === 'form' ? 'hidden lg:block' : ''
            }`}
            style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 6%, var(--background))' }}
          >
            <div className="print-paper max-w-[800px] mx-auto bg-surface border border-rule rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 text-foreground">
              {/* Header */}
              <div className="invoice-header flex flex-row justify-between items-start gap-4 md:gap-6 border-b border-rule pb-5 md:pb-6">
                <div className="from-block min-w-0 max-w-[58%] space-y-2 md:space-y-3">
                  {business.logo ? (
                    <img src={business.logo} alt="Logo" className="h-10 md:h-12 max-w-[160px] object-contain" />
                  ) : (
                    <div className="text-xs font-mono italic text-muted print:hidden">[Company Logo]</div>
                  )}
                  {business.name ? (
                    <div className="from-value text-sm md:text-base font-bold break-words">{business.name}</div>
                  ) : (
                    <div className="text-sm md:text-base font-bold print:hidden">Acme Corporation</div>
                  )}
                  {business.address ? (
                    <div className="from-value text-xs whitespace-pre-line leading-relaxed break-words">{business.address}</div>
                  ) : (
                    <div className="text-xs text-muted whitespace-pre-line leading-relaxed print:hidden">123 Innovation Way, Suite 400</div>
                  )}
                  {(business.email || business.phone) && (
                    <div className="from-value text-xs mt-1 break-all">
                      {business.email}{business.email && business.phone ? ' • ' : ''}{business.phone}
                    </div>
                  )}
                  {business.taxId && <div className="from-value text-[11px] font-mono">TAX ID: {business.taxId}</div>}
                </div>
                <div className="invoice-meta ml-auto shrink-0 text-right space-y-2">
                  <div className="invoice-accent text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase" style={{ color: 'var(--accent)' }}>
                    {draft.mode === 'invoice' ? 'INVOICE' : draft.mode === 'quote' ? 'ESTIMATE' : 'RECEIPT'}
                  </div>
                  <div className="text-[11px] md:text-xs font-mono space-y-1">
                    <div className="font-bold">#{draft.number}</div>
                    <div>Date: {formatDateLocale(draft.issueDate, 'en-US', 'MMM dd, yyyy')}</div>
                    <div>Terms: {getPaymentTerms()}</div>
                    <div>Due: {formatDateLocale(draft.dueDate, 'en-US', 'MMM dd, yyyy')}</div>
                    {poNumber && <div>PO #: {poNumber}</div>}
                  </div>
                </div>
              </div>

              {/* Recipients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div className="border-l-2 pl-3 py-0.5 min-w-0" style={{ borderColor: 'var(--accent)' }}>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-1">Bill To</div>
                  {draft.client.name ? (
                    <div className="font-bold text-foreground break-words">{draft.client.name}</div>
                  ) : (
                    <div className="font-bold text-foreground print:hidden">Client Name</div>
                  )}
                  {draft.client.address && <div className="text-muted whitespace-pre-line break-words">{draft.client.address}</div>}
                  {(draft.client.email || draft.client.phone) && (
                    <div className="text-muted mt-1 break-all">
                      {draft.client.email}{draft.client.email && draft.client.phone ? ' • ' : ''}{draft.client.phone}
                    </div>
                  )}
                </div>
                {shipToEnabled && (
                  <div className="border-l-2 border-rule pl-3 py-0.5 min-w-0">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-1">Ship To</div>
                    <div className="font-bold text-foreground break-words">{draft.shipToName || 'Recipient Name'}</div>
                    <div className="text-muted whitespace-pre-line break-words">{draft.shipToAddress || 'Shipping Address'}</div>
                  </div>
                )}
              </div>

              {/* Items */}
              <div className="overflow-x-auto -mx-1">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-rule">
                      <th className="text-left py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted">Description</th>
                      <th className="text-center py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted w-12 md:w-16">Qty</th>
                      <th className="text-right py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted w-20 md:w-24">Rate</th>
                      <th className="text-right py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted w-24 md:w-28">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {draft.items.length === 0 || draft.items.every(i => !i.desc && i.price === 0) ? (
                      <tr>
                        <td colSpan={4} className="text-center py-8 italic text-muted">No line items added yet.</td>
                      </tr>
                    ) : (
                      draft.items.map(item => (
                        <tr key={item.id} className="border-b border-rule/50">
                          <td className="py-3 px-2 md:px-4">
                            <div className="font-semibold text-foreground break-words">{item.desc || 'Untitled Item'}</div>
                            {item.customFields?.[0]?.value && <div className="text-[11px] text-muted mt-0.5 break-words">{item.customFields[0].value}</div>}
                          </td>
                          <td className="py-3 px-2 md:px-4 text-center text-muted font-mono">{item.qty}</td>
                          <td className="py-3 px-2 md:px-4 text-right text-muted font-mono whitespace-nowrap">{formatMoney(toMinor(item.price, draft.currency), draft.currency)}</td>
                          <td className="py-3 px-2 md:px-4 text-right font-semibold text-foreground font-mono whitespace-nowrap">{formatMoney(Math.round(item.qty * toMinor(item.price, draft.currency)), draft.currency)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="border-t border-rule pt-4 flex flex-col xl:flex-row print:flex-row gap-6 break-inside-avoid totals-block">
                <div className="flex-1 min-w-0 text-xs space-y-2 notes-block">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted">Notes & Terms</div>
                  <div className="text-[11px] text-muted whitespace-pre-line leading-relaxed break-words">{draft.notes || 'Thank you for your business!'}</div>
                  {signature && (
                    <div className="pt-4">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-2">Authorized Signature</div>
                      <img src={signature} alt="Signature" className="h-12 max-w-[160px] border-b border-rule pb-2" />
                    </div>
                  )}
                </div>
                <div className="xl:w-64 print:w-64 text-xs font-mono space-y-2">
                  <div className="flex justify-between gap-3"><span className="text-muted">Subtotal:</span><span className="text-foreground">{formatMoney(t.subtotal, draft.currency)}</span></div>
                  {t.invoiceDiscount > 0 && (
                    <div className="flex justify-between gap-3"><span className="text-muted">Discount:</span><span className="text-foreground">-{formatMoney(t.invoiceDiscount, draft.currency)}</span></div>
                  )}
                  {t.taxAdded > 0 && (
                    <div className="flex justify-between gap-3"><span className="text-muted">Tax:</span><span className="text-foreground">{formatMoney(t.taxAdded, draft.currency)}</span></div>
                  )}
                  {t.shipping > 0 && (
                    <div className="flex justify-between gap-3"><span className="text-muted">Shipping:</span><span className="text-foreground">{formatMoney(t.shipping, draft.currency)}</span></div>
                  )}
                  <div className="flex justify-between gap-3 border-t border-rule pt-2 font-bold text-sm text-foreground"><span>Total:</span><span>{formatMoney(t.total, draft.currency)}</span></div>
                  {t.paid > 0 && (
                    <div className="flex justify-between gap-3"><span className="text-muted">Amount Paid:</span><span className="text-foreground">-{formatMoney(t.paid, draft.currency)}</span></div>
                  )}
                  <div
                    className="invoice-accent flex justify-between gap-3 font-bold text-base p-2.5 rounded-lg"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}
                  >
                    <span>Balance Due:</span>
                    <span>{formatMoney(Math.max(0, t.balance), draft.currency)}</span>
                  </div>
                </div>
              </div>

              {photos.length > 0 && (
                <div className="border-t border-rule pt-4">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-3">Attached Photos / Receipts</div>
                  <div className="flex flex-wrap gap-3">
                    {photos.map((photo, idx) => (
                      <img key={idx} src={photo} alt={`Attachment ${idx + 1}`} className="w-24 h-24 object-cover border border-rule rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="lg:hidden bg-surface border-t border-rule px-3 py-3 pb-[calc(5.25rem+env(safe-area-inset-bottom,0px))] print-hide">
          {bar}
        </div>
      </div>

      <footer className="hidden lg:block shrink-0 bg-surface border-t border-rule px-6 py-3 print-hide">
        {bar}
      </footer>
    </div>
  );
}