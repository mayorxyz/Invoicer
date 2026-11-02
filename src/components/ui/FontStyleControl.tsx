import React, { useEffect, useSyncExternalStore } from 'react';
import { fontScaleCSS, useFontScale } from './FontSizeControl';
import { Select } from './select';

/** Paper-only font family. 'template' = keep whatever each template defines. */
const KEY = 'paper.fontStyle';

export const FONT_STYLES = [
  { id: 'template', label: 'Template default', stack: '', google: '' },
  
  // --- Modern & Geometric Sans-Serif ---
  { id: 'inter', label: 'Inter', stack: '"Inter", system-ui, sans-serif', google: 'Inter:wght@400;500;600;700;900' },
  { id: 'jakarta', label: 'Plus Jakarta Sans', stack: '"Plus Jakarta Sans", system-ui, sans-serif', google: 'Plus+Jakarta+Sans:wght@400;500;600;700;800' },
  { id: 'poppins', label: 'Poppins', stack: '"Poppins", system-ui, sans-serif', google: 'Poppins:wght@400;500;600;700;800' },
  { id: 'roboto', label: 'Roboto', stack: '"Roboto", system-ui, sans-serif', google: 'Roboto:wght@400;500;700;900' },
  { id: 'montserrat', label: 'Montserrat', stack: '"Montserrat", system-ui, sans-serif', google: 'Montserrat:wght@400;500;600;700;800' },
  { id: 'open-sans', label: 'Open Sans', stack: '"Open Sans", system-ui, sans-serif', google: 'Open+Sans:wght@400;600;700;800' },
  { id: 'lato', label: 'Lato', stack: '"Lato", system-ui, sans-serif', google: 'Lato:wght@400;700;900' },
  { id: 'work-sans', label: 'Work Sans', stack: '"Work Sans", system-ui, sans-serif', google: 'Work+Sans:wght@400;500;600;700' },
  { id: 'DM-sans', label: 'DM Sans', stack: '"DM Sans", system-ui, sans-serif', google: 'DM+Sans:wght@400;500;700' },
  { id: 'outfit', label: 'Outfit', stack: '"Outfit", system-ui, sans-serif', google: 'Outfit:wght@400;500;600;700' },
  { id: 'lexend', label: 'Lexend', stack: '"Lexend", system-ui, sans-serif', google: 'Lexend:wght@400;500;600;700' },
  { id: 'nunito', label: 'Nunito', stack: '"Nunito", system-ui, sans-serif', google: 'Nunito:wght@400;600;700;800' },
  { id: 'quicksand', label: 'Quicksand', stack: '"Quicksand", system-ui, sans-serif', google: 'Quicksand:wght@400;500;600;700' },
  { id: 'raleway', label: 'Raleway', stack: '"Raleway", system-ui, sans-serif', google: 'Raleway:wght@400;500;600;700' },
  { id: 'figtree', label: 'Figtree', stack: '"Figtree", system-ui, sans-serif', google: 'Figtree:wght@400;500;600;700;800' },
  { id: 'manrope', label: 'Manrope', stack: '"Manrope", system-ui, sans-serif', google: 'Manrope:wght@400;500;600;700;800' },
  { id: 'red-hat-display', label: 'Red Hat Display', stack: '"Red Hat Display", system-ui, sans-serif', google: 'Red+Hat+Display:wght@400;500;700;900' },
  { id: 'sora', label: 'Sora', stack: '"Sora", system-ui, sans-serif', google: 'Sora:wght@400;600;700' },
  { id: 'space-grotesk', label: 'Space Grotesk', stack: '"Space Grotesk", system-ui, sans-serif', google: 'Space+Grotesk:wght@400;500;700' },
  { id: 'epilogue', label: 'Epilogue', stack: '"Epilogue", system-ui, sans-serif', google: 'Epilogue:wght@400;600;700;900' },
  { id: 'bebas-neue', label: 'Bebas Neue (Display)', stack: '"Bebas Neue", sans-serif', google: 'Bebas+Neue' },
  { id: 'cabin', label: 'Cabin', stack: '"Cabin", system-ui, sans-serif', google: 'Cabin:wght@400;500;700' },
  { id: 'karla', label: 'Karla', stack: '"Karla", system-ui, sans-serif', google: 'Karla:wght@400;500;700' },
  { id: 'exo2', label: 'Exo 2', stack: '"Exo 2", system-ui, sans-serif', google: 'Exo+2:wght@400;500;700' },
  { id: 'ubuntu', label: 'Ubuntu', stack: '"Ubuntu", system-ui, sans-serif', google: 'Ubuntu:wght@400;500;700' },
  { id: 'oxygen', label: 'Oxygen', stack: '"Oxygen", system-ui, sans-serif', google: 'Oxygen:wght@400;700' },
  { id: 'titillium-web', label: 'Titillium Web', stack: '"Titillium Web", system-ui, sans-serif', google: 'Titillium+Web:wght@400;600;700' },
  { id: 'barlow', label: 'Barlow', stack: '"Barlow", system-ui, sans-serif', google: 'Barlow:wght@400;500;700' },
  { id: 'sen', label: 'Sen', stack: '"Sen", system-ui, sans-serif', google: 'Sen:wght@400;700' },
  { id: 'inter-tight', label: 'Inter Tight', stack: '"Inter Tight", system-ui, sans-serif', google: 'Inter+Tight:wght@400;500;700' },

  // --- Editorial & Classic Serif ---
  { id: 'lora', label: 'Lora', stack: '"Lora", Georgia, serif', google: 'Lora:wght@400;500;600;700' },
  { id: 'playfair', label: 'Playfair Display', stack: '"Playfair Display", Georgia, serif', google: 'Playfair+Display:wght@400;500;600;700;900' },
  { id: 'merriweather', label: 'Merriweather', stack: '"Merriweather", Georgia, serif', google: 'Merriweather:wght@400;700;900' },
  { id: 'cormorant', label: 'Cormorant Garamond', stack: '"Cormorant Garamond", Georgia, serif', google: 'Cormorant+Garamond:wght@400;500;600;700' },
  { id: 'libre-baskerville', label: 'Libre Baskerville', stack: '"Libre Baskerville", Georgia, serif', google: 'Libre+Baskerville:wght@400;700' },
  { id: 'cinzel', label: 'Cinzel', stack: '"Cinzel", Georgia, serif', google: 'Cinzel:wght@400;600;700' },
  { id: 'bodoni', label: 'Bodoni Moda', stack: '"Bodoni Moda", Georgia, serif', google: 'Bodoni+Moda:wght@400;500;700' },
  { id: 'fraunces', label: 'Fraunces', stack: '"Fraunces", Georgia, serif', google: 'Fraunces:wght@400;500;600;700' },
  { id: 'cardo', label: 'Cardo', stack: '"Cardo", Georgia, serif', google: 'Cardo:wght@400;700' },
  { id: 'pt-serif', label: 'PT Serif', stack: '"PT Serif", Georgia, serif', google: 'PT+Serif:wght@400;700' },
  { id: 'EB-garamond', label: 'EB Garamond', stack: '"EB Garamond", Georgia, serif', google: 'EB+Garamond:wght@400;500;700' },
  { id: 'crimson-pro', label: 'Crimson Pro', stack: '"Crimson Pro", Georgia, serif', google: 'Crimson+Pro:wght@400;500;700' },
  { id: 'vollkorn', label: 'Vollkorn', stack: '"Vollkorn", Georgia, serif', google: 'Vollkorn:wght@400;600;700' },
  { id: 'newsreader', label: 'Newsreader', stack: '"Newsreader", Georgia, serif', google: 'Newsreader:wght@400;500;700' },
  { id: 'alegreya', label: 'Alegreya', stack: '"Alegreya", Georgia, serif', google: 'Alegreya:wght@400;500;700' },
  { id: 'zilla-slab', label: 'Zilla Slab', stack: '"Zilla Slab", Georgia, serif', google: 'Zilla+Slab:wght@400;500;700' },

  // --- Technical & Monospace ---
  { id: 'jetbrains', label: 'JetBrains Mono', stack: '"JetBrains Mono", ui-monospace, monospace', google: 'JetBrains+Mono:wght@400;500;700' },
  { id: 'fira-code', label: 'Fira Code', stack: '"Fira Code", ui-monospace, monospace', google: 'Fira+Code:wght@400;500;700' },
  { id: 'space-mono', label: 'Space Mono', stack: '"Space Mono", ui-monospace, monospace', google: 'Space+Mono:wght@400;700' },
  { id: 'ibm-plex', label: 'IBM Plex Mono', stack: '"IBM Plex Mono", ui-monospace, monospace', google: 'IBM+Plex+Mono:wght@400;500;700' },
  { id: 'source-code', label: 'Source Code Pro', stack: '"Source Code Pro", ui-monospace, monospace', google: 'Source+Code+Pro:wght@400;500;700' },
  { id: 'inconsolata', label: 'Inconsolata', stack: '"Inconsolata", ui-monospace, monospace', google: 'Inconsolata:wght@400;500;700' },
  { id: 'roboto-mono', label: 'Roboto Mono', stack: '"Roboto Mono", ui-monospace, monospace', google: 'Roboto+Mono:wght@400;500;700' },
  { id: 'ubuntu-mono', label: 'Ubuntu Mono', stack: '"Ubuntu Mono", ui-monospace, monospace', google: 'Ubuntu+Mono:wght@400;700' },
  { id: 'Courier-prime', label: 'Courier Prime', stack: '"Courier Prime", ui-monospace, monospace', google: 'Courier+Prime:wght@400;700' },
  { id: 'red-hat-mono', label: 'Red Hat Mono', stack: '"Red Hat Mono", ui-monospace, monospace', google: 'Red+Hat+Mono:wght@400;500;700' },

  // --- Creative Scripts, Handwriting & Display ---
  { id: 'dancing-script', label: 'Dancing Script', stack: '"Dancing Script", cursive', google: 'Dancing+Script:wght@400;600;700' },
  { id: 'great-vibes', label: 'Great Vibes', stack: '"Great Vibes", cursive', google: 'Great+Vibes' },
  { id: 'sacramento', label: 'Sacramento', stack: '"Sacramento", cursive', google: 'Sacramento' },
  { id: 'caveat', label: 'Caveat', stack: '"Caveat", cursive', google: 'Caveat:wght@400;600;700' },
  { id: 'parisienne', label: 'Parisienne', stack: '"Parisienne", cursive', google: 'Parisienne' },
  { id: 'allura', label: 'Allura', stack: '"Allura", cursive', google: 'Allura' },
  { id: 'pacifico', label: 'Pacifico', stack: '"Pacifico", cursive', google: 'Pacifico' },
  { id: 'satisfy', label: 'Satisfy', stack: '"Satisfy", cursive', google: 'Satisfy' },

  // --- System Fallbacks ---
  { id: 'georgia', label: 'Georgia', stack: 'Georgia, "Times New Roman", serif', google: '' },
  { id: 'arial', label: 'Arial', stack: 'Arial, Helvetica, sans-serif', google: '' },
  { id: 'system-sans', label: 'System Sans', stack: 'system-ui, -apple-system, sans-serif', google: '' },
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
    let s = document.getElementById('paper-typography-css') as HTMLStyleElement | null;
    if (!s) {
      s = document.createElement('style');
      s.id = 'paper-typography-css';
      document.head.appendChild(s);
    }
    s.textContent = `${fontScaleCSS}\n${fontStyleCSS}`;
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

  const classes = ['paper-fs', font.stack ? 'paper-ff' : ''].filter(Boolean).join(' ');
  const style = {
    '--paper-fs': scale / 100,
    ...(font.stack ? { '--paper-ff': font.stack } : {}),
  } as React.CSSProperties;

  return <div className={classes} style={style}>{children}</div>;
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