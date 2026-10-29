import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileTabs } from './components/layout/MobileTabs';
import { LedgerEditorView } from './components/editor/LedgerEditorView';
import { DocumentsPage } from './components/pages/DocumentsPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { ClientsPage } from './components/pages/ClientsPage';
import { ItemsPage } from './components/pages/ItemsPage';
import { ReportsPage } from './components/pages/ReportsPage';
import { ExpensesPage } from './components/pages/ExpensesPage';
import { TimePage } from './components/pages/TimePage';
import { SettingsPage } from './components/pages/SettingsPage';

function App() {
  const { init, state, view, toggleSidebar } = useStore();
  
  useEffect(() => {
    init();
  }, []);
  
  // Apply theme
  useEffect(() => {
    const theme = state.settings.theme;
    const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    // Persist to localStorage
    localStorage.setItem('theme', theme === 'system' ? (isDark ? 'dark' : 'light') : theme);
  }, [state.settings.theme]);
  
  // Keyboard shortcut for sidebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);
  
  const sidebarWidth = state.settings.sidebarCollapsed ? '72px' : '248px';
  
  return (
    <div className="h-dvh overflow-hidden">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      
      {/* Desktop Layout - CSS Grid */}
      <div className="hidden lg:grid h-dvh" style={{ gridTemplateColumns: `${sidebarWidth} minmax(0, 1fr)` }}>
        <Sidebar />
        <div className="flex flex-col overflow-hidden min-w-0 min-h-0 h-dvh">
          <TopBar />
          <main id="main-content" className="flex-1 overflow-hidden flex flex-col min-h-0">
            {view === 'editor' ? (
              <LedgerEditorView />
            ) : (
              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8 py-6 lg:py-8 pb-16">
                  {view === 'documents' && <DocumentsPage />}
                  {view === 'history' && <HistoryPage />}
                  {view === 'clients' && <ClientsPage />}
                  {view === 'items' && <ItemsPage />}
                  {view === 'reports' && <ReportsPage />}
                  {view === 'expenses' && <ExpensesPage />}
                  {view === 'time' && <TimePage />}
                  {view === 'settings' && <SettingsPage />}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="lg:hidden h-dvh flex flex-col">
        <TopBar />
        <main id="main-content" className="flex-1 overflow-hidden flex flex-col min-h-0">
          {view === 'editor' ? (
            <LedgerEditorView />
          ) : (
            <div className="flex-1 overflow-y-auto min-h-0 px-4 py-4 pb-32">
              {view === 'documents' && <DocumentsPage />}
              {view === 'history' && <HistoryPage />}
              {view === 'clients' && <ClientsPage />}
              {view === 'items' && <ItemsPage />}
              {view === 'reports' && <ReportsPage />}
              {view === 'expenses' && <ExpensesPage />}
              {view === 'time' && <TimePage />}
              {view === 'settings' && <SettingsPage />}
            </div>
          )}
        </main>
        <MobileTabs />
      </div>
    </div>
  );
}

export default App;
