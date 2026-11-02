import React, { useEffect, useSyncExternalStore } from 'react';
import { fontScaleCSS, useFontScale } from './FontSizeControl';
import { Select } from './select';

/** Paper-only font family. 'template' = keep whatever each template defines. */
const KEY = 'paper.fontStyle';

export const FONT_STYLES = [
  { id: 'template', label: 'Template default', stack: '', google: '' },
  { id: 'inter', label: 'Inter', stack: '"Inter", system-ui, sans-serif', google: 'Inter:wght@400;500;600;700;900' },
  { id: 'jakarta', label: 'Plus Jakarta Sans', stack: '"Plus Jakarta Sans", system-ui, sans-serif', google: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  { id: 'poppins', label: 'Poppins', stack: '"Poppins", system-ui, sans-serif', google: 'Poppins:wght@400;500;600;700;800' },
  { id: 'lora', label: 'Lora (serif)', stack: '"Lora", Georgia, serif', google: 'Lora:wght@400;500;600;700' },
  { id: 'playfair', label: 'Playfair Display', stack: '"Playfair Display", Georgia, serif', google: 'Playfair+Display:wght@400;500;600;700;900' },
  { id: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", serif', google: '' },
  { id: 'arial', label: 'Arial', stack: 'Arial, Helvetica, sans-serif', google: '' },
  { id: 'jetbrains', label: 'JetBrains Mono', stack: '"JetBrains Mono", ui-monospace, monospace', google: 'JetBrains+Mono:wght@400;500;700' },
] as const;

export type FontStyleId = (typeof FONT_STYLES)[number]['id'];

const read = (): FontStyleId => {
  try {
    const v = localStorage.getItem(KEY);
    return FONT_STYLES.some((f) => f.id === v) ? (v as FontStyleId) : 'template';
  } catch {
    return 'template';
  }
};

let current: FontStyleId = read();
const subs = new Set<() => void>();

export function setFontStyle(id: FontStyleId) {
  current = id;
  try { localStorage.setItem(KEY, id); } catch { /* ignore */ }
  subs.forEach((f) => f());
}

export function useFontStyle(): FontStyleId {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => current,
    () => 'template' as FontStyleId,
  );
}

/** font-mono elements (figures) are left alone. Remove ":not(.font-mono)" to override those too. */
const fontStyleCSS = '.paper-ff, .paper-ff *:not(.font-mono){font-family:var(--paper-ff) !important}';

/**
 * Wrap every rendered paper (preview sheets, measuring copy, PDF export) in this.
 * With both options on default it adds no classes and changes nothing.
 */
export function PaperTypography({ children }: { children: React.ReactNode }) {
  const scale = useFontScale();
  const styleId = useFontStyle();
  const font = FONT_STYLES.find((f) => f.id === styleId)!;

  useEffect(() => {
    if (!document.getElementById('paper-typography-css')) {
      const s = document.createElement('style');
      s.id = 'paper-typography-css';
      s.textContent = `${fontScaleCSS}\n${fontStyleCSS}`;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    if (!font.google) return;
    const id = `paper-font-${font.id}`;
    if (document.getElementById(id)) return;
    const l = document.createElement('link');
    l.id = id;
    l.rel = 'stylesheet';
    l.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    document.head.appendChild(l);
  }, [font]);

  const classes = [scale !== 100 ? 'paper-fs' : '', font.stack ? 'paper-ff' : ''].filter(Boolean).join(' ');
  const style = {
    ...(scale !== 100 ? { '--paper-fs': scale / 100 } : {}),
    ...(font.stack ? { '--paper-ff': font.stack } : {}),
  } as React.CSSProperties;

  return <div className={classes || undefined} style={style}>{children}</div>;
}

export function FontStyleControl() {
  const value = useFontStyle();

  useEffect(() => {
    const id = 'paper-fonts-all';
    if (document.getElementById(id)) return;
    const families = FONT_STYLES
      .filter((f) => f.google)
      .map((f) => `family=${f.google}`)
      .join('&');
    if (!families) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    document.head.appendChild(link);
  }, []);

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Template font style">
      <span className="text-[10px] uppercase font-bold text-muted hidden sm:inline-block">Font</span>
      <Select
        aria-label="Template font style"
        value={value}
        onChange={(e) => setFontStyle(e.target.value as FontStyleId)}
        className="h-7 min-w-[104px] max-w-[10rem] text-xs border border-rule rounded-lg bg-surface text-foreground px-2 outline-none focus:ring-1 focus:ring-accent"
      >
        {FONT_STYLES.map((f) => (
          <option key={f.id} value={f.id}>
            <span style={{ fontFamily: f.stack || undefined }}>{f.label}</span>
          </option>
        ))}
      </Select>
    </div>
  );
}