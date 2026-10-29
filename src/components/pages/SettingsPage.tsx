import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader } from '../ui/PageHeader';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';
import { Icon } from '../ui/Icon';
import { ACCENT_PALETTE } from '../../lib/defaults';
import { CURRENCY_LIST } from '../../data/currencies';
import { ALL_COUNTRIES } from '../../data/countries';
import { SUPPORTED_LANGUAGES } from '../../i18n';

const sections = [
  { id: 'business', label: 'Business Profile', icon: 'buildings' },
  { id: 'defaults', label: 'Defaults', icon: 'sliders' },
  { id: 'numbering', label: 'Numbering', icon: 'hash' },
  { id: 'taxes', label: 'Taxes', icon: 'percent' },
  { id: 'payment', label: 'Payment Details', icon: 'credit-card' },
  { id: 'appearance', label: 'Appearance', icon: 'palette' },
  { id: 'language', label: 'Language & Region', icon: 'globe' },
  { id: 'data', label: 'Data & Backup', icon: 'database' },
  { id: 'shortcuts', label: 'Shortcuts', icon: 'keyboard' },
  { id: 'about', label: 'About', icon: 'info' },
];

export function SettingsPage() {
  const { state, updateSettings, updateBusiness, dismissDemo, loadSampleData, wipeAll } = useStore();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('business');
  const [wipeConfirmOpen, setWipeConfirmOpen] = useState(false);

  const business = state.businesses[0] || { name: '', email: '', phone: '', address: '' };
  const currentSectionMeta = sections.find(s => s.id === activeSection);

  const handleWipeData = () => {
    wipeAll();
    setWipeConfirmOpen(false);
    toast('success', 'All data has been cleared.');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'business':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Business Name</label>
              <input
                type="text"
                value={business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
              <input
                type="email"
                value={business.email}
                onChange={(e) => updateBusiness({ email: e.target.value })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
                placeholder="contact@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Phone</label>
              <input
                type="text"
                value={business.phone}
                onChange={(e) => updateBusiness({ phone: e.target.value })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Address</label>
              <textarea
                value={business.address}
                onChange={(e) => updateBusiness({ address: e.target.value })}
                rows={3}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground resize-none"
                placeholder="Street address, City, Country"
              />
            </div>
          </div>
        );

      case 'defaults':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Default Currency</label>
              <select
                value={state.settings.homeCurrency}
                onChange={(e) => updateSettings({ homeCurrency: e.target.value })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
              >
                {CURRENCY_LIST.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} — {curr.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Country</label>
              <select
                value={state.settings.country}
                onChange={(e) => updateSettings({ country: e.target.value })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
              >
                {ALL_COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">Theme</label>
              <div className="grid grid-cols-3 gap-2">
                {(['light', 'dark', 'system'] as const).map(theme => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => updateSettings({ theme })}
                    className={`h-10 px-3 rounded-lg text-xs font-medium transition-all capitalize ${
                      state.settings.theme === theme
                        ? 'bg-accent text-accent-contrast shadow-xs'
                        : 'bg-surface border border-border text-foreground hover:bg-background-subtle'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-2">Accent Color</label>
              <div className="flex gap-2.5 flex-wrap">
                {ACCENT_PALETTE.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => updateSettings({ accent: color })}
                    className={`w-9 h-9 rounded-lg transition-all ${
                      state.settings.accent === color ? 'ring-2 ring-offset-2 ring-accent scale-105' : 'hover:scale-100'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select accent color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'language':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">UI Language</label>
              <select
                value={state.settings.language}
                onChange={(e) => updateSettings({ language: e.target.value as any })}
                className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );

      case 'data':
        return (
          <div className="space-y-4">
            <div className="bg-background-subtle/70 border border-border/80 rounded-xl p-3.5 md:p-4 flex flex-col gap-3">
              <p className="text-xs text-muted leading-relaxed">
                Data is stored locally in this browser session. Export backups regularly to prevent potential loss.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const data = JSON.stringify(state, null, 2);
                    const blob = new Blob([data], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                    updateSettings({ lastBackupDate: new Date().toISOString() });
                    toast('success', 'Backup downloaded successfully');
                  }}
                  className="h-9 px-4 bg-accent text-accent-contrast rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Icon name="download" size={14} />
                  <span>Download Backup</span>
                </button>

                {!state.settings.demoDismissed && (
                  <button
                    type="button"
                    onClick={dismissDemo}
                    className="h-9 px-4 bg-surface border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-background-subtle transition-colors"
                  >
                    Clear Sample Data
                  </button>
                )}

                {state.settings.demoDismissed && state.invoices.length === 0 && (
                  <button
                    type="button"
                    onClick={loadSampleData}
                    className="h-9 px-4 bg-surface border border-border text-foreground rounded-lg text-xs font-semibold hover:bg-background-subtle transition-colors"
                  >
                    Load Sample Data
                  </button>
                )}
              </div>
            </div>

            <div className="bg-danger/5 border border-danger/20 rounded-xl p-3.5 md:p-4 flex flex-col gap-3">
              <div>
                <p className="text-xs font-semibold text-danger">Danger Zone</p>
                <p className="text-[11px] text-danger/80 mt-0.5">
                  Permanently remove all local data, saved clients, items, and settings.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setWipeConfirmOpen(true)}
                className="h-9 px-4 bg-danger text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity w-fit"
              >
                Delete All Data
              </button>
            </div>
          </div>
        );

      case 'shortcuts':
        return (
          <div className="space-y-1 divide-y divide-border/60">
            {[
              { keys: 'Ctrl/Cmd + K', action: 'Command palette' },
              { keys: 'Ctrl/Cmd + B', action: 'Toggle sidebar' },
              { keys: 'Ctrl/Cmd + S', action: 'Save document' },
              { keys: 'Ctrl/Cmd + P', action: 'Print document' },
              { keys: 'Esc', action: 'Close dialogs' },
            ].map((shortcut, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 text-xs">
                <span className="text-foreground font-medium">{shortcut.action}</span>
                <kbd className="px-2 py-1 bg-background border border-border/80 rounded font-mono text-[11px] text-muted shadow-2xs">
                  {shortcut.keys}
                </kbd>
              </div>
            ))}
          </div>
        );

      case 'about':
        return (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-foreground">Invoicer App</h3>
              <p className="text-xs text-muted mt-0.5">Version 1.0.0</p>
            </div>
            <div className="bg-background-subtle/70 border border-border/80 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-foreground mb-1">Privacy Notice</p>
              <p className="text-xs text-muted leading-relaxed">
                No external account required. Your workspace data stays in your browser's local storage.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8 text-muted text-xs">
            This section is coming soon.
          </div>
        );
    }
  };

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader title="Settings" subtitle="Manage workspace preferences" />

      {/* Mobile Horizontal Section Scroll Chips */}
      <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-3 -mx-3 px-3 [scrollbar-width:none]">
        {sections.map(section => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
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
        {/* Desktop Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-1">
          <nav className="bg-surface border border-border/80 rounded-xl overflow-hidden shadow-xs">
            {sections.map(section => {
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-left text-xs font-medium transition-colors border-b border-border/50 last:border-0 ${
                    isActive
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground hover:bg-background-subtle'
                  }`}
                >
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
            {renderSection()}
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