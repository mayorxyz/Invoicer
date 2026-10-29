import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { useStore } from '../../store/useStore';
import { exportBackup } from '../../lib/storage';

const primaryTabs = [
  { id: 'editor', label: 'Editor', icon: 'pencil-simple' },
  { id: 'documents', label: 'Documents', icon: 'files' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'reports', label: 'Reports', icon: 'chart-bar' },
];

const secondaryMenuItems = [
  { id: 'history', label: 'History', icon: 'clock-counter-clockwise' },
  { id: 'items', label: 'Items', icon: 'package' },
  { id: 'expenses', label: 'Expenses', icon: 'receipt' },
  { id: 'time', label: 'Time', icon: 'timer' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
];

export function MobileTabs() {
  const { state, view, setView } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isMoreActive = secondaryMenuItems.some((item) => item.id === view);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleBackup = () => {
    const json = exportBackup(state);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMenuOpen(false);
  };

  const currentBusiness = state.businesses[0];

  return (
    <>
      {/* Dim backdrop when menu opens */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Popup Bottom Sheet Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-14 right-2 left-2 bg-surface/95 backdrop-blur-md border border-border rounded-2xl shadow-xl z-50 lg:hidden overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150 max-w-md mx-auto"
        >
          {/* Business Profile Header */}
          <div className="px-3 py-2 border-b border-border/60 flex items-center gap-2.5 bg-background-subtle/40">
            <div className="w-7 h-7 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold flex-shrink-0">
              {currentBusiness?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate leading-tight">
                {currentBusiness?.name || 'Your Business'}
              </p>
              <p className="text-[10px] text-muted truncate leading-tight">
                {currentBusiness?.email || 'No email configured'}
              </p>
            </div>
          </div>

          {/* Compact Menu Links */}
          <div className="p-1.5 flex flex-col gap-0.5 max-h-[45vh] overflow-y-auto [scrollbar-width:none]">
            <p className="text-[9px] font-bold text-muted/70 px-2 py-1 uppercase tracking-wider">
              Workspace Tools
            </p>
            {secondaryMenuItems.map((item) => {
              const isActive = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id as any);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-accent/10 text-accent font-semibold'
                      : 'text-foreground hover:bg-background-subtle/80'
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size={16}
                    weight={isActive ? 'fill' : 'regular'}
                    color={isActive ? 'var(--accent)' : 'currentColor'}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="my-1 border-t border-border/50" />

            {/* Compact Backup Action */}
            <button
              onClick={handleBackup}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-foreground hover:bg-background-subtle/80 transition-colors w-full"
            >
              <Icon name="download" size={16} className="text-muted" />
              <div className="text-left flex-1 min-w-0">
                <p className="text-xs font-medium leading-tight">Download Backup</p>
                <p className="text-[9px] text-muted leading-tight">
                  {state.settings.lastBackupDate
                    ? `Last: ${state.settings.lastBackupDate}`
                    : 'No backup yet'}
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Slim Fixed Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-md border-t border-border flex items-center justify-around py-1 px-1 z-40 lg:hidden no-print shadow-sm h-12">
        {primaryTabs.map((tab) => {
          const isActive = view === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setView(tab.id as any);
                setMenuOpen(false);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full rounded-md transition-colors ${
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon
                name={tab.icon}
                size={18}
                weight={isActive ? 'fill' : 'regular'}
                color={isActive ? 'var(--accent)' : 'currentColor'}
              />
              <span className="text-[9px] leading-tight tracking-tight mt-0.5">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          className={`flex flex-col items-center justify-center flex-1 h-full rounded-md transition-colors ${
            isMoreActive || menuOpen
              ? 'text-accent font-semibold'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Icon
            name="dots-three"
            size={18}
            weight={isMoreActive || menuOpen ? 'fill' : 'regular'}
            color={isMoreActive || menuOpen ? 'var(--accent)' : 'currentColor'}
          />
          <span className="text-[9px] leading-tight tracking-tight mt-0.5">
            More
          </span>
        </button>
      </nav>
    </>
  );
}