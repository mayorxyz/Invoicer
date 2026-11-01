import { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Icon } from '../../components/ui/Icon';
import { totals, formatMoney, fromMinor } from '../../lib/money';
import { today, addDays } from '../../lib/dates';
import type { Mode, Template } from '../../types';
import { v4 as uuid } from 'uuid';
import { downloadInvoicePdf } from '../../lib/downloadInvoicePdf';
import { EditorForm } from './EditorForm';
import { Select } from '../../components/ui/Select';
import { PaperDefault } from '../../components/papers/Default';
import { PaperClassic } from '../../components/papers/Classic';
import { PaperModern } from '../../components/papers/Modern';
import { PaperMinimal } from '../../components/papers/Minimal';
import { PaperCorporate } from '../../components/papers/Corporate';
import { Paperformal as PaperFormal } from '../../components/papers/formal';
import { PaperFramed } from '../../components/papers/Framed';
import { PaperRetro } from '../../components/papers/Retro';
import { PaperSidebar } from '../../components/papers/Sidebar';
import { PaperSplit } from '../../components/papers/Split';
import { PaperModernClean } from '../../components/papers/ModernClean';

const ACCENTS = [
  { value: '#1F3FD1', label: 'Deep Blue' },
  { value: '#059669', label: 'Emerald' },
  { value: '#D97706', label: 'Amber' },
  { value: '#DC2626', label: 'Crimson' },
  { value: '#7C3AED', label: 'Violet' },
  { value: '#111827', label: 'Onyx' },
];

const termDays = (terms: string) =>
  terms === 'Net 15' ? 15 : terms === 'Net 30' ? 30 : terms === 'Net 60' ? 60 : 0;

export function LedgerEditorView() {
  const { draft, newDraft, updateDraft, saveDraft, state, updateSettings } = useStore();
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [shipToEnabled, setShipToEnabled] = useState(false);
  const [signature, setSignature] = useState<string>('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>('');
  const [accentOpen, setAccentOpen] = useState(false);
  const [template, setTemplate] = useState<Template>('default');
  const [splitPercent, setSplitPercent] = useState(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const moveSplit = (clientX: number) => {
    const bounds = splitContainerRef.current?.getBoundingClientRect();
    if (!bounds || bounds.width === 0) return;
    const percent = ((clientX - bounds.left) / bounds.width) * 100;
    setSplitPercent(Math.min(75, Math.max(25, percent)));
  };

  useEffect(() => {
    if (!draft) newDraft('invoice');
  }, []);

  if (!draft) return null;

  const accent = state.settings.accent || '#1F3FD1';
  const business = state.businesses[0];
  const t = totals(draft);
  const setBiz = (patch: Record<string, unknown>) => useStore.getState().updateBusiness(patch as any);

  const getPaymentTerms = () => {
    const days = Math.round((new Date(draft.dueDate).getTime() - new Date(draft.issueDate).getTime()) / 86400000);
    if (days === 0) return 'Due on Receipt';
    if (days === 15) return 'Net 15';
    if (days === 30) return 'Net 30';
    if (days === 60) return 'Net 60';
    return 'Custom';
  };
  const paymentTerms = getPaymentTerms();
  const poNumber = draft.customFields?.find(f => f.label === 'PO Number')?.value || '';

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
      const paperElement = previewRef.current;
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

  const paperProps = { draft, business, totals: t, accent, shipToEnabled, signature, photos, paymentTerms, poNumber };

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
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-muted hidden sm:inline-block">Template</span>
            <Select
              aria-label="Template"
              value={template}
              onChange={e => setTemplate(e.target.value as Template)}
              className="h-7 min-w-[92px] text-xs border border-rule rounded-lg bg-surface text-foreground px-2 outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="default">Default</option>
              <option value="classic">Classic</option>
              <option value="modern">Modern</option>
              <option value="minimal">Minimal</option>
              <option value="corporate">Corporate</option>
              <option value="formal">Formal</option>
              <option value="framed">Framed</option>
              <option value="retro">Retro</option>
              <option value="sidebar">Sidebar</option>
              <option value="split">Split</option>
              <option value="modernclean">Modern Clean</option>
            </Select>
          </div>
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

      {/* Main */}
      <div className="flex-1 min-h-0 overflow-y-auto lg:overflow-hidden pane">
        <div
          ref={splitContainerRef}
          className="lg:grid lg:h-full min-w-0"
          style={{ gridTemplateColumns: `${splitPercent}fr 12px ${100 - splitPercent}fr` }}
        >
          {/* Form pane */}
          <div
            className={`pane lg:h-full lg:overflow-y-auto no-bar min-w-0 p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 md:space-y-5 print-hide ${
              mobileTab === 'preview' ? 'hidden lg:block' : ''
            }`}
          >
            <EditorForm
              draft={draft}
              business={business}
              updateDraft={updateDraft}
              setBiz={setBiz}
              shipToEnabled={shipToEnabled}
              setShipToEnabled={setShipToEnabled}
              signature={signature}
              setSignature={setSignature}
              photos={photos}
              setPhotos={setPhotos}
              paymentTerms={paymentTerms}
              onPaymentTermsChange={terms => updateDraft({ dueDate: addDays(draft.issueDate, termDays(terms)) })}
              onIssueDateChange={d => updateDraft({ issueDate: d, dueDate: addDays(d, termDays(paymentTerms)) })}
              poNumber={poNumber}
            />
          </div>

          <div
            role="separator"
            aria-label="Resize editor and preview panels"
            aria-orientation="vertical"
            aria-valuemin={25}
            aria-valuemax={75}
            aria-valuenow={Math.round(splitPercent)}
            tabIndex={0}
            className={`hidden lg:flex items-center justify-center cursor-col-resize touch-none select-none hover:bg-background-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
              isDraggingSplit ? 'bg-background-subtle' : ''
            }`}
            onPointerDown={event => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              setIsDraggingSplit(true);
              moveSplit(event.clientX);
            }}
            onPointerMove={event => {
              if (isDraggingSplit) moveSplit(event.clientX);
            }}
            onPointerUp={() => setIsDraggingSplit(false)}
            onPointerCancel={() => setIsDraggingSplit(false)}
            onKeyDown={event => {
              if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                const delta = event.key === 'ArrowLeft' ? -2 : 2;
                setSplitPercent(current => Math.min(75, Math.max(25, current + delta)));
              }
            }}
          >
            <span className="h-10 w-1 rounded-full bg-border" />
          </div>

          {/* Preview pane */}
          <div
            ref={previewRef}
            className={`pane lg:h-full lg:overflow-y-auto scroll-thin min-w-0 p-3 sm:p-4 md:p-6 lg:p-8 print-hide ${
              mobileTab === 'form' ? 'hidden lg:block' : ''
            }`}
            style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 6%, var(--background))' }}
          >
            {template === 'default' ? <PaperDefault {...paperProps} />
              : template === 'classic' ? <PaperClassic {...paperProps} />
              : template === 'modern' ? <PaperModern {...paperProps} />
              : template === 'corporate' ? <PaperCorporate {...paperProps} />
              : template === 'formal' ? <PaperFormal {...paperProps} />
              : template === 'framed' ? <PaperFramed {...paperProps} />
              : template === 'retro' ? <PaperRetro {...paperProps} />
              : template === 'sidebar' ? <PaperSidebar {...paperProps} />
              : template === 'split' ? <PaperSplit {...paperProps} />
              : template === 'modernclean' ? <PaperModernClean {...paperProps} />
              : <PaperMinimal {...paperProps} />}
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