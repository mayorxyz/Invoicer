import React from 'react';
import { LogoMark } from '../ui/Icon';
import { Button, IconButton } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { APP_NAME } from '../../lib/defaults';
import { useStore } from '../../store/useStore';

export function TopBar() {
  const { state, updateSettings, newDraft, setView } = useStore();
  
  const toggleTheme = () => {
    const current = state.settings.theme;
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    updateSettings({ theme: next });
  };
  
  return (
    <header className="border-b border-border bg-surface sticky top-0 z-40 no-print px-3 md:px-5" style={{ height: '52px' }}>
      <div className="h-full flex items-center justify-between gap-3 min-w-0">
        <div className="flex items-center min-w-0" style={{ gap: '8px' }}>
          <LogoMark size={26} />
          <h1 className="text-foreground font-semibold truncate text-sm md:text-base">{APP_NAME}</h1>
        </div>
        
        <div className="flex items-center gap-2 min-w-0 flex-shrink">
          <IconButton
            icon={state.settings.theme === 'dark' ? 'moon' : state.settings.theme === 'light' ? 'sun' : 'monitor'}
            onClick={toggleTheme}
            style={{ width: '32px', height: '32px' }}
            aria-label="Toggle theme"
          />
          
          <Button
            variant="primary"
            arrow
            onClick={() => {
              newDraft('invoice');
              setView('editor');
            }}
            className="flex-shrink-0 text-xs md:text-sm font-medium"
            style={{ height: '34px', paddingLeft: '12px', paddingRight: '8px' }}
          >
            <span className="hidden sm:inline">New invoice</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </header>
  );
}