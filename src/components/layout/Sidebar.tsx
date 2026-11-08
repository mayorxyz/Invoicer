import React, { useCallback } from 'react';
import { Icon } from '../ui/Icon';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Dialog';
import { useStore, VIEW_PATHS } from '../../store/useStore';
import { exportBackup } from '../../lib/storage';

const navItems = [
  { id: 'editor', label: 'Editor', icon: 'pencil-simple' },
  { id: 'documents', label: 'Documents', icon: 'files' },
  { id: 'history', label: 'History', icon: 'clock-counter-clockwise' },
  { id: 'clients', label: 'Clients', icon: 'users' },
  { id: 'items', label: 'Items', icon: 'package' },
  { id: 'reports', label: 'Reports', icon: 'chart-bar' },
  { id: 'expenses', label: 'Expenses', icon: 'receipt' },
  { id: 'time', label: 'Time', icon: 'timer' },
  { id: 'settings', label: 'Settings', icon: 'gear' },
] as const;

const SIDEBAR_WIDTH = {
  expanded: 240,
  collapsed: 64,
} as const;

export function Sidebar() {
  const { state, view, setView, toggleSidebar, updateSettings } = useStore();

  const collapsed = state.settings.sidebarCollapsed;
  const business = state.businesses[0];

  const businessName = business?.name || 'Your Business';
  const businessEmail = business?.email || 'No email';
  const businessInitial = businessName.charAt(0).toUpperCase();

  const handleBackup = useCallback(() => {
    try {
      const json = exportBackup(state);
      const blob = new Blob([json], {
        type: 'application/json;charset=utf-8',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = `backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;

      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      updateSettings({ lastBackupDate: new Date().toISOString().slice(0, 10) });

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (error) {
      console.error('Failed to export backup:', error);
    }
  }, [state, updateSettings]);

  const renderTooltip = (
    content: string,
    children: React.ReactNode,
  ) => {
    if (!collapsed) return children;

    return (
      <Tooltip content={content} position="right">
        {children}
      </Tooltip>
    );
  };

  return (
    <aside
      aria-label="Main sidebar"
      className={[
        'sidebar-shell',
        'sticky top-0 z-30',
        'flex h-dvh shrink-0 flex-col',
        'overflow-hidden',
        'border-r border-border',
        'bg-surface',
        'text-foreground',
        'transition-[width] duration-200 ease-out',
        'no-print select-none',
      ].join(' ')}
      style={{
        width: collapsed
          ? SIDEBAR_WIDTH.collapsed
          : SIDEBAR_WIDTH.expanded,
      }}
    >
      {/* Unified sidebar header */}
      <header
        className={[
          'flex h-14 shrink-0 items-center',
          'border-b border-border/70',
          collapsed
            ? 'justify-center px-2'
            : 'justify-between px-4',
        ].join(' ')}
      >
        {!collapsed && (
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-contrast">
              <Icon name="files" size={16} weight="bold" />
            </div>

            <span className="truncate text-sm font-semibold tracking-tight">
              Workspace
            </span>
          </div>
        )}

        <Tooltip
          content={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          position="right"
        >
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={
              collapsed ? 'Expand sidebar' : 'Collapse sidebar'
            }
            aria-expanded={!collapsed}
            className={[
              'flex h-8 w-8 shrink-0 items-center justify-center',
              'rounded-lg text-muted',
              'transition-colors duration-150',
              'hover:bg-background-subtle hover:text-foreground',
              'focus-visible:outline-none',
              'focus-visible:ring-2 focus-visible:ring-accent',
            ].join(' ')}
          >
            <Icon
              name={collapsed ? 'chevron-right' : 'chevron-left'}
              size={17}
            />
          </button>
        </Tooltip>
      </header>

      {/* Scrollable navigation */}
      <div className="sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        <nav
          aria-label="Workspace navigation"
          className="px-2.5 pb-3 pt-4"
        >
          {!collapsed && (
            <p className="mb-2 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted/75">
              Workspace
            </p>
          )}

          <div className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = view === item.id;
              const href = VIEW_PATHS[item.id];

              const link = (
                <a
                  key={item.id}
                  href={href}
                  onClick={(e) => {
                    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    setView(item.id as any);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={collapsed ? item.label : undefined}
                  className={[
                    'sidebar-nav-item group relative',
                    'flex h-9 w-full items-center',
                    'rounded-md border border-transparent',
                    'text-[13px] font-medium',
                    'transition-colors duration-150',
                    'focus-visible:outline-none',
                    'focus-visible:ring-2 focus-visible:ring-accent',
                    collapsed
                      ? 'justify-center px-0'
                      : 'gap-2.5 px-2.5',
                    isActive
                      ? 'bg-background-subtle text-foreground'
                      : 'text-muted hover:bg-background-subtle/70 hover:text-foreground',
                  ].join(' ')}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-2 left-0 top-2 w-[2px] rounded-r-full bg-accent"
                    />
                  )}

                  <span
                    className={[
                      'flex shrink-0 items-center justify-center',
                      'transition-colors duration-150',
                      isActive
                        ? 'text-accent'
                        : 'text-muted group-hover:text-foreground',
                    ].join(' ')}
                  >
                    <Icon
                      name={item.icon}
                      size={18}
                      weight={isActive ? 'fill' : 'regular'}
                    />
                  </span>

                  {!collapsed && (
                    <span className="min-w-0 flex-1 truncate text-left">
                      {item.label}
                    </span>
                  )}

                  {!collapsed &&
                    item.id === 'documents' &&
                    state.invoices.length > 0 && (
                      <span
                        className={[
                          'ml-auto shrink-0 text-[11px] tabular-nums',
                          isActive ? 'text-foreground' : 'text-muted',
                        ].join(' ')}
                      >
                        {state.invoices.length}
                      </span>
                    )}

                  {collapsed &&
                    item.id === 'documents' &&
                    state.invoices.length > 0 && (
                      <span
                        aria-label={`${state.invoices.length} documents`}
                        className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent"
                      />
                    )}
                 </a>
              );

              if (collapsed) {
                return (
                  <React.Fragment key={item.id}>
                    {renderTooltip(item.label, link)}
                  </React.Fragment>
                );
              }

              return link;
            })}
          </div>
        </nav>
      </div>

            {/* Redesigned Integrated Footer */}
      <footer className="sidebar-footer shrink-0 border-t border-border/50 p-3">
        {!collapsed ? (
          <div className="space-y-3">
            {/* Elegant Backup Widget */}
            <div className="group rounded-xl border border-border/60 bg-background-subtle/40 p-3 transition-all hover:border-border hover:bg-background-subtle/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent/20">
                  <Icon name="download" size={16} weight="bold" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-foreground">Data Backup</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted">
                    {state.settings.lastBackupDate
                      ? `Last backup: ${state.settings.lastBackupDate}`
                      : 'Export your data locally'}
                  </p>
                </div>
              </div>
              
              {/* FIX: Native button with explicit flex classes to prevent wrapper span issues */}
              <button
                type="button"
                onClick={handleBackup}
                className="flex w-full items-center justify-center gap-2 rounded-md border border-border/60 bg-surface px-3 text-[12px] font-medium text-foreground transition-all hover:bg-accent/10 hover:text-accent hover:border-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                style={{ height: '32px' }}
              >
                <Icon name="download" size={14} className="shrink-0" />
                <span>Download .json</span>
              </button>
            </div>

            {/* Business Profile (Clickable to Settings) */}
            <button
              type="button"
              onClick={() => setView('settings')}
              className="group flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-background-subtle/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-contrast shadow-sm">
                {businessInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">
                  {businessName}
                </p>
                <p className="truncate text-[11px] text-muted">
                  {businessEmail}
                </p>
              </div>
              <Icon 
                name="gear" 
                size={14} 
                className="text-muted shrink-0 opacity-0 transition-opacity group-hover:opacity-100" 
              />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-1">
            <Tooltip content="Download backup" position="right">
              <button
                type="button"
                onClick={handleBackup}
                aria-label="Download backup"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-background-subtle hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Icon name="download" size={18} className="shrink-0" />
              </button>
            </Tooltip>

            <Tooltip content={businessName} position="right">
              <button
                type="button"
                onClick={() => setView('settings')}
                aria-label={businessName}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-contrast shadow-sm transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                {businessInitial}
              </button>
            </Tooltip>
          </div>
        )}
      </footer>
    </aside>
  );
}