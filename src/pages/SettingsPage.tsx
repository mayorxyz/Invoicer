import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { BusinessProfile } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { Icon } from '../components/ui/Icon';
import { Select } from '../components/ui/Select';
import { ACCENT_PALETTE, ACCENT_NONE } from '../lib/defaults';
import { CURRENCY_LIST } from '../data/currencies';
import { ALL_COUNTRIES } from '../data/countries';
import { SUPPORTED_LANGUAGES } from '../i18n';
import { SignaturePad } from './editor/SignaturePad';
import { downscaleImage } from '../lib/storage';
import { addDays } from '../lib/dates';

const sections = [
  { id: 'business', label: 'Business Profile', icon: 'buildings' },
  { id: 'defaults', label: 'Document Defaults', icon: 'sliders' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'language', label: 'Language & Region', icon: 'globe' },
  { id: 'data', label: 'Data & Backup', icon: 'database' },
  { id: 'about', label: 'Shortcuts & About', icon: 'info' },
];

function FieldLabel({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
      <Icon name={icon} size={14} className="text-muted" />
      {children}
    </label>
  );
}

function SaveButton({ onClick, children = 'Save' }: { onClick: () => void; children?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center justify-center gap-1.5 h-9 px-5 rounded-lg text-xs font-semibold shadow-sm hover:opacity-90 hover:shadow-md active:scale-[0.97] transition-all duration-150 bg-[var(--color-foreground)] text-[var(--color-background)]"
    >
      <Icon name="check" size={14} />
      {children}
    </button>
  );
}

export function SettingsPage() {
  const { state, draft, updateDraft, updateSettings, updateBusiness, dismissDemo, loadSampleData, wipeAll, importData } = useStore();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('business');
  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);

  const business = state.businesses[0] || ({} as BusinessProfile);
  const currentSectionMeta = sections.find(s => s.id === activeSection);

  // Local drafts so edits are only persisted when the user presses Save.
  const [businessForm, setBusinessForm] = useState<BusinessProfile>(business);
  const [defaultsForm, setDefaultsForm] = useState<Partial<BusinessProfile>>({
    defaultCurrency: business.defaultCurrency || state.settings.homeCurrency,
    defaultDueDays: business.defaultDueDays ?? 14,
    defaultTemplate: business.defaultTemplate || 'default',
    defaultLanguage: business.defaultLanguage || 'en',
    defaultNotes: business.defaultNotes || '',
  });

  useEffect(() => {
    setBusinessForm(state.businesses[0]);
  }, [state.businesses[0]]);

  useEffect(() => {
    const b = state.businesses[0];
    setDefaultsForm({
      defaultCurrency: b.defaultCurrency || state.settings.homeCurrency,
      defaultDueDays: b.defaultDueDays ?? 14,
      defaultTemplate: b.defaultTemplate || 'default',
      defaultLanguage: b.defaultLanguage || 'en',
      defaultNotes: b.defaultNotes || '',
    });
  }, [state.businesses[0], state.settings.homeCurrency]);

  const updateBusinessForm = (patch: Partial<BusinessProfile>) => {
    setBusinessForm((prev) => ({ ...prev, ...patch }));
  };

  const handleSaveBusiness = () => {
    updateBusiness(businessForm);
    toast('success', 'Business profile saved.');
  };

  const handleSaveDefaults = () => {
    const dueDays = Number(defaultsForm.defaultDueDays) || 0;
    updateBusiness({
      defaultCurrency: defaultsForm.defaultCurrency,
      defaultDueDays: dueDays,
      defaultTemplate: defaultsForm.defaultTemplate,
      defaultLanguage: defaultsForm.defaultLanguage,
      defaultNotes: defaultsForm.defaultNotes,
    });
    // Keep the document currently open in the editor in sync with the new defaults.
    if (draft) {
      updateDraft({
        currency: defaultsForm.defaultCurrency || draft.currency,
        template: defaultsForm.defaultTemplate || draft.template,
        documentLanguage: defaultsForm.defaultLanguage || draft.documentLanguage,
        dueDate: addDays(draft.issueDate, dueDays),
        ...(draft.notes ? {} : { notes: defaultsForm.defaultNotes || '' }),
      });
    }
    toast('success', 'Document defaults saved.');
  };

  const handleWipeData = () => {
    wipeAll();
    setWipeConfirmOpen(false);
    toast('success', 'All data has been cleared.');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo' | 'signature') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const label = field === 'logo' ? 'Logo' : 'Signature';
    try {
      const dataUrl = field === 'signature'
        ? await downscaleImage(file, 600)
        : await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve(event.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
      updateBusinessForm({ [field]: dataUrl });
      toast('info', `${label} ready. Press Save to apply.`);
    } catch {
      toast('error', `Failed to load ${field}.`);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (field: 'logo' | 'signature') => {
    updateBusinessForm({ [field]: '' });
    toast('info', `${field === 'logo' ? 'Logo' : 'Signature'} removed. Press Save to apply.`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'business':
        return (
          <div className="space-y-6">
            {/* Logo & Signature */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldLabel icon="image">Business Logo</FieldLabel>
                <div className="flex items-center gap-4">
                  {businessForm.logo ? (
                    <img src={businessForm.logo} alt="Logo" className="h-16 w-16 object-contain rounded-lg border border-border bg-surface" />
                  ) : (
                    <div className="h-16 w-16 rounded-lg border border-dashed border-border flex items-center justify-center text-muted">
                      <Icon name="image" size={20} />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} className="hidden" id="logo-upload" />
                    <label htmlFor="logo-upload" className="cursor-pointer text-xs font-medium text-accent hover:underline">
                      {businessForm.logo ? 'Change Logo' : 'Upload Logo'}
                    </label>
                    {businessForm.logo && (
                      <button onClick={() => handleRemoveImage('logo')} className="text-xs text-danger hover:underline text-left">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <FieldLabel icon="pen">Default Signature</FieldLabel>
                <div className="flex items-stretch gap-3">
                  <div className="flex-1 min-w-0">
                    <SignaturePad
                      value={businessForm.signature || ''}
                      onChange={(v) => updateBusinessForm({ signature: v })}
                      onClear={() => updateBusinessForm({ signature: '' })}
                      height={96}
                      label="Sign here"
                      hint="Draw your signature, or upload an image."
                    />
                  </div>
                  <div className="flex flex-col gap-2 justify-center shrink-0">
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'signature')} className="hidden" id="sig-upload" />
                    <label htmlFor="sig-upload" className="cursor-pointer text-xs font-medium text-accent hover:underline whitespace-nowrap">
                      {businessForm.signature ? 'Change' : 'Upload'}
                    </label>
                    {businessForm.signature && (
                      <button onClick={() => handleRemoveImage('signature')} className="text-xs text-danger hover:underline text-left">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FieldLabel icon="buildings">Business Name</FieldLabel>
                <input type="text" value={businessForm.name || ''} onChange={(e) => updateBusinessForm({ name: e.target.value })} className="w-full text-xs md:text-sm" placeholder="e.g. Acme Corp" />
              </div>
              <div>
                <FieldLabel icon="globe">Website</FieldLabel>
                <input type="text" value={businessForm.website || ''} onChange={(e) => updateBusinessForm({ website: e.target.value })} className="w-full text-xs md:text-sm" placeholder="https://example.com" />
              </div>
              <div>
                <FieldLabel icon="flag">Country</FieldLabel>
                <Select value={businessForm.country || ''} onChange={(e) => updateBusinessForm({ country: e.target.value })} className="w-full text-xs md:text-sm">
                  <option value="">Select Country</option>
                  {ALL_COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                </Select>
              </div>
              <div>
                <FieldLabel icon="envelope">Email</FieldLabel>
                <input type="email" value={businessForm.email || ''} onChange={(e) => updateBusinessForm({ email: e.target.value })} className="w-full text-xs md:text-sm" placeholder="contact@company.com" />
              </div>
              <div>
                <FieldLabel icon="phone">Phone</FieldLabel>
                <input type="text" value={businessForm.phone || ''} onChange={(e) => updateBusinessForm({ phone: e.target.value })} className="w-full text-xs md:text-sm" placeholder="+1 (555) 000-0000" />
              </div>
              <div className="md:col-span-2">
                <FieldLabel icon="map-pin">Address</FieldLabel>
                <textarea value={businessForm.address || ''} onChange={(e) => updateBusinessForm({ address: e.target.value })} rows={2} className="w-full text-xs md:text-sm resize-none" placeholder="Street address, City, State, Zip" />
              </div>
            </div>

            {/* Tax & Registration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
              <div>
                <FieldLabel icon="receipt">Tax ID Label</FieldLabel>
                <input type="text" value={businessForm.taxIdLabel || ''} onChange={(e) => updateBusinessForm({ taxIdLabel: e.target.value })} className="w-full text-xs md:text-sm" placeholder="e.g. VAT No." />
              </div>
              <div className="md:col-span-2">
                <FieldLabel icon="receipt">Tax ID</FieldLabel>
                <input type="text" value={businessForm.taxId || ''} onChange={(e) => updateBusinessForm({ taxId: e.target.value })} className="w-full text-xs md:text-sm" placeholder="XX-XXXXXXX" />
              </div>
              <div className="md:col-span-3">
                <FieldLabel icon="receipt">Registration / Company Number</FieldLabel>
                <input type="text" value={businessForm.registrationNumber || ''} onChange={(e) => updateBusinessForm({ registrationNumber: e.target.value })} className="w-full text-xs md:text-sm" placeholder="Optional" />
              </div>
            </div>

            {/* Bank Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
              <div className="md:col-span-2">
                <FieldLabel icon="bank">Bank Name</FieldLabel>
                <input type="text" value={businessForm.bankName || ''} onChange={(e) => updateBusinessForm({ bankName: e.target.value })} className="w-full text-xs md:text-sm" placeholder="e.g. Chase Bank" />
              </div>
              <div>
                <FieldLabel icon="bank">Account Number</FieldLabel>
                <input type="text" value={businessForm.bankAccount || ''} onChange={(e) => updateBusinessForm({ bankAccount: e.target.value })} className="w-full text-xs md:text-sm" />
              </div>
              <div>
                <FieldLabel icon="bank">Routing / IBAN / SWIFT</FieldLabel>
                <input type="text" value={businessForm.bankRouting || ''} onChange={(e) => updateBusinessForm({ bankRouting: e.target.value })} className="w-full text-xs md:text-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/50">
              <p className="text-[11px] text-muted">These details pre-fill the editor but stay saved even if changed there.</p>
              <SaveButton onClick={handleSaveBusiness}>Save</SaveButton>
            </div>
          </div>
        );

      case 'defaults':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FieldLabel icon="currency-dollar">Default Currency</FieldLabel>
                <Select value={defaultsForm.defaultCurrency || state.settings.homeCurrency} onChange={(e) => setDefaultsForm(f => ({ ...f, defaultCurrency: e.target.value }))} className="w-full text-xs md:text-sm">
                  {CURRENCY_LIST.map(curr => <option key={curr.code} value={curr.code}>{curr.code} — {curr.name}</option>)}
                </Select>
              </div>
              <div>
                <FieldLabel icon="calendar">Default Due Days</FieldLabel>
                <input type="number" value={defaultsForm.defaultDueDays ?? 14} onChange={(e) => setDefaultsForm(f => ({ ...f, defaultDueDays: parseInt(e.target.value) || 0 }))} className="w-full text-xs md:text-sm" />
              </div>
              <div>
                <FieldLabel icon="layout">Default Template</FieldLabel>
                <Select value={defaultsForm.defaultTemplate || 'default'} onChange={(e) => setDefaultsForm(f => ({ ...f, defaultTemplate: e.target.value as BusinessProfile['defaultTemplate'] }))} className="w-full text-xs md:text-sm">
                  {['default', 'minimal', 'corporate', 'formal', 'framed', 'retro', 'sidebar', 'split', 'modernclean'].map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </Select>
              </div>
              <div>
                <FieldLabel icon="translate">Default Document Language</FieldLabel>
                <Select value={defaultsForm.defaultLanguage || 'en'} onChange={(e) => setDefaultsForm(f => ({ ...f, defaultLanguage: e.target.value as BusinessProfile['defaultLanguage'] }))} className="w-full text-xs md:text-sm">
                  {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                </Select>
              </div>
            </div>
            <div>
              <FieldLabel icon="note">Default Notes</FieldLabel>
              <textarea value={defaultsForm.defaultNotes || ''} onChange={(e) => setDefaultsForm(f => ({ ...f, defaultNotes: e.target.value }))} rows={3} className="w-full text-xs md:text-sm resize-none" placeholder="Thank you for your business!" />
            </div>
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-border/50">
              <p className="text-[11px] text-muted">Applied to every new document created from now on.</p>
              <SaveButton onClick={handleSaveDefaults}>Save</SaveButton>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <FieldLabel icon="palette">UI Theme</FieldLabel>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'light', icon: 'sun' },
                  { id: 'dark', icon: 'moon' },
                  { id: 'system', icon: 'desktop' },
                ] as const).map(({ id: theme, icon }) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updateSettings({ theme })}
                    className={`h-10 px-3 rounded-lg text-xs font-medium transition-all duration-200 capitalize flex items-center justify-center gap-1.5 active:scale-[0.97] ${
                      state.settings.theme === theme
                        ? 'bg-accent text-accent-contrast shadow-xs'
                        : 'bg-surface border border-border text-foreground hover:bg-background-subtle'
                    }`}
                  >
                    <Icon name={icon} size={14} />
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <FieldLabel icon="drop">UI Accent Color</FieldLabel>
              <div className="flex gap-2.5 flex-wrap">
                {ACCENT_PALETTE.map(color => {
                  const isNone = color === ACCENT_NONE;
                  const isBlack = color === '#111827';
                  const isSelected = state.settings.accent === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateSettings({ accent: color })}
                      className={`w-9 h-9 rounded-full transition-all duration-200 relative flex items-center justify-center overflow-hidden ${
                        isSelected ? 'ring-2 ring-offset-2 ring-accent scale-105' : 'hover:scale-105'
                      }`}
                      style={{
                        backgroundColor: isNone ? 'transparent' : color,
                        border: isNone ? '1.5px solid var(--border, #cbd5e1)' : 'none',
                      }}
                      title={isNone ? 'None' : isBlack ? 'Black' : color}
                      aria-label={`Select accent color ${isNone ? 'None' : isBlack ? 'Black' : color}`}
                    >
                      {isNone && <div className="absolute w-full h-[1.5px] bg-muted/80 rotate-45 pointer-events-none" />}
                      {isSelected && !isNone && <Icon name="check" size={14} className="text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-4">
            <div>
              <FieldLabel icon="translate">UI Language</FieldLabel>
              <Select value={state.settings.language} onChange={(e) => updateSettings({ language: e.target.value as any })} className="w-full text-xs md:text-sm">
                {SUPPORTED_LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel icon="calendar">Date Format</FieldLabel>
              <Select value={state.settings.dateFormat || 'MM/DD/YYYY'} onChange={(e) => updateSettings({ dateFormat: e.target.value })} className="w-full text-xs md:text-sm">
                <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (UK/EU)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              </Select>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-4">
            <div className="bg-background-subtle/70 border border-border/80 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <Icon name="database" size={16} className="text-muted" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Data Backup</p>
                  <p className="text-[11px] text-muted mt-0.5">
                    {state.settings.lastBackupDate ? `Last backup: ${state.settings.lastBackupDate}` : 'No backup recorded yet.'}
                  </p>
                </div>
              </div>
              <DataBackupControls
                state={state}
                updateSettings={updateSettings}
                importData={importData}
                dismissDemo={dismissDemo}
                loadSampleData={loadSampleData}
                toast={toast}
              />
            </div>

            <div className="bg-danger/5 border border-danger/20 rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <Icon name="warning" size={16} className="text-danger mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-danger">Danger Zone</p>
                  <p className="text-[11px] text-danger/80 mt-0.5">
                    Permanently remove all local data, saved clients, items, and settings. This cannot be undone.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWipeConfirmOpen(true)}
                className="h-9 px-4 bg-danger text-white rounded-lg text-xs font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-150 w-fit inline-flex items-center gap-1.5"
              >
                <Icon name="trash" size={14} />
                Delete All Data
              </button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-foreground">Invoicer App</h3>
              <p className="text-xs text-muted mt-0.5">Version 1.0.0</p>
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-2">
                <Icon name="keyboard" size={14} className="text-muted" />
                Keyboard Shortcuts
              </p>
              <div className="space-y-1 divide-y divide-border/60 bg-background-subtle/30 rounded-lg p-3">
                {[
                  { keys: 'Ctrl/Cmd + B', action: 'Toggle sidebar', icon: 'sidebar' },
                  { keys: 'Ctrl/Cmd + S', action: 'Save document draft', icon: 'floppy-disk' },
                  { keys: 'Esc', action: 'Close dialogs / Cancel', icon: 'x' },
                ].map((shortcut, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-xs">
                    <span className="flex items-center gap-2 text-foreground font-medium">
                      <Icon name={shortcut.icon} size={14} className="text-muted" />
                      {shortcut.action}
                    </span>
                    <kbd className="px-2 py-1 bg-surface border border-border/80 rounded font-mono text-[11px] text-muted shadow-2xs">
                      {shortcut.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-background-subtle/70 border border-border/80 rounded-xl p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1">
                <Icon name="shield-check" size={14} className="text-muted" />
                Privacy Notice
              </p>
              <p className="text-xs text-muted leading-relaxed">
                No external account required. Your workspace data stays entirely in your browser's local storage.
                We do not track, collect, or transmit your business data to any server.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader title="Settings" subtitle="Manage workspace preferences and defaults" />

      {/* Mobile Horizontal Section Scroll Chips */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-3 -mx-3 px-3 [scrollbar-width:none]">
        {sections.map(section => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-[0.97] ${
                isActive
                  ? 'bg-accent text-accent-contrast font-semibold shadow-xs'
                  : 'bg-surface border border-border/80 text-foreground hover:bg-background-subtle'
              }`}
            >
              <Icon name={section.icon} size={14} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 items-start">
        {/* Desktop Sidebar Navigation (sticky) */}
        <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-6 self-start">
          <nav className="bg-surface border border-border/80 rounded-xl overflow-hidden shadow-xs">
            {sections.map(section => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`relative w-full flex items-center gap-2.5 px-3.5 py-3 text-left text-xs font-medium transition-all duration-200 ease-out border-b border-border/50 last:border-0 ${
                    isActive
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground hover:bg-background-subtle hover:pl-4'
                  }`}
                >
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-accent transition-all duration-200 ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                    }`}
                  />
                  <Icon name={section.icon} size={16} color={isActive ? 'var(--accent)' : 'currentColor'} />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Active Section Content */}
        <div className="lg:col-span-3">
          <div className="bg-surface border border-border/80 rounded-2xl lg:rounded-xl p-4 md:p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-4 pb-2.5 border-b border-border/60">
              <Icon name={currentSectionMeta?.icon || 'gear'} size={18} className="text-accent" />
              <h2 className="text-sm md:text-base font-semibold text-foreground">
                {currentSectionMeta?.label}
              </h2>
            </div>
            <div key={activeSection} className="section-enter">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        open={wipeConfirmOpen}
        onClose={() => setWipeConfirmOpen(false)}
        onConfirm={handleWipeData}
        title="Delete All Data"
        description="Are you sure you want to wipe all local data? This action cannot be undone."
        confirmLabel="Delete Everything"
        variant="danger"
      />
    </div>
  );
}

function DataBackupControls({
  state,
  updateSettings,
  importData,
  dismissDemo,
  loadSampleData,
  toast,
}: {
  state: any;
  updateSettings: (s: any) => void;
  importData: (json: string) => boolean;
  dismissDemo: () => void;
  loadSampleData: () => void;
  toast: (type: 'success' | 'error' | 'info' | 'warning', message: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownload = () => {
    const data = JSON.stringify(state, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoicer-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    updateSettings({ lastBackupDate: new Date().toISOString().split('T')[0] });
    toast('success', 'Backup downloaded successfully');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importData(text);
        if (success) {
          toast('success', 'Backup restored successfully! All data loaded.');
        } else {
          toast('error', 'Invalid backup file format.');
        }
      } catch (err) {
        toast('error', 'Failed to read backup file.');
      }
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  const secondaryBtn =
    'h-9 px-4 bg-surface border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-background-subtle active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2';

  return (
    <div className="flex flex-col gap-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        className="hidden"
      />
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleDownload}
          className="h-9 px-4 bg-accent text-accent-contrast rounded-lg text-xs font-semibold hover:opacity-90 active:scale-[0.97] transition-all duration-150 flex items-center justify-center gap-2"
        >
          <Icon name="download" size={14} />
          <span>Download Backup</span>
        </button>

        <button type="button" onClick={() => fileInputRef.current?.click()} className={secondaryBtn}>
          <Icon name="upload" size={14} />
          <span>Restore Backup</span>
        </button>

        {!state.settings.demoDismissed && (
          <button type="button" onClick={dismissDemo} className={secondaryBtn}>
            <Icon name="eraser" size={14} />
            <span>Clear Sample Data</span>
          </button>
        )}

        {state.settings.demoDismissed && state.invoices?.length === 0 && (
          <button type="button" onClick={loadSampleData} className={secondaryBtn}>
            <Icon name="flask" size={14} />
            <span>Load Sample Data</span>
          </button>
        )}
      </div>
      <p className="text-[11px] text-muted">
        Backups include all your documents, expenses, catalog items, clients, and time tracker history.
      </p>
    </div>
  );
}