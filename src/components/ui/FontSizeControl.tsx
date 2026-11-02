import { useSyncExternalStore } from 'react';
import { Select } from './select';

/** Paper-only font size. Persisted in localStorage. */
const KEY = 'paper.fontSize';

/** Standard Google Docs point sizes paired with their baseline scale multiplier (10.5pt = 100%) */
export const FONT_SIZES = [
  { pt: 8, scale: 0.76 },
  { pt: 9, scale: 0.86 },
  { pt: 10, scale: 0.95 },
  { pt: 10.5, scale: 1.0 }, // Google Docs default
  { pt: 11, scale: 1.05 },
  { pt: 12, scale: 1.14 },
  { pt: 14, scale: 1.33 },
  { pt: 18, scale: 1.71 },
  { pt: 24, scale: 2.28 },
] as const;

export type FontSizePt = (typeof FONT_SIZES)[number]['pt'];

const read = (): FontSizePt => {
  try {
    const v = Number(localStorage.getItem(KEY));
    return FONT_SIZES.some((f) => f.pt === v) ? (v as FontSizePt) : 10.5;
  } catch {
    return 10.5;
  }
};

let currentPt: FontSizePt = read();
const subs = new Set<() => void>();

export function setFontSize(pt: FontSizePt) {
  currentPt = pt;
  try { localStorage.setItem(KEY, String(pt)); } catch { /* ignore */ }
  subs.forEach((f) => f());
}

export function useFontSize(): FontSizePt {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => currentPt,
    () => 10.5 as FontSizePt,
  );
}

export function useFontScale(): number {
  const pt = useFontSize();
  const found = FONT_SIZES.find((f) => f.pt === pt);
  return Math.round((found?.scale ?? 1.0) * 100);
}

/** Tailwind sizes used inside templates -> px at 10.5pt (100%). */
const SIZES: [string, number][] = [
  ['text-\\[8px\\]', 8],
  ['text-\\[9px\\]', 9],
  ['text-\\[10px\\]', 10],
  ['text-\\[11px\\]', 11],
  ['text-\\[12px\\]', 12],
  ['text-\\[13px\\]', 13],
  ['text-\\[14px\\]', 14],
  ['text-xs', 12],
  ['text-sm', 14],
  ['text-base', 16],
  ['text-lg', 18],
  ['text-xl', 20],
  ['text-2xl', 24],
  ['text-3xl', 30],
  ['text-4xl', 36],
];

/** Scoped to .paper-fs, reliably scaling all font sizes and line heights proportionally. */
export const fontScaleCSS = `
  .paper-fs {
    font-size: calc(13px * var(--paper-fs, 1)) !important;
  }
  .paper-fs .print-paper {
    font-size: calc(13px * var(--paper-fs, 1)) !important;
  }
  .paper-fs table, .paper-fs th, .paper-fs td {
    font-size: inherit;
  }
  ${SIZES.map(([c, px]) => `
    .paper-fs .${c},
    .paper-fs [class*="${c.replace('\\', '')}"] {
      font-size: calc(${px}px * var(--paper-fs, 1)) !important;
    }
  `).join('\n')}
`;

export function FontSizeControl() {
  const value = useFontSize();

  return (
    <div className="flex items-center gap-2" role="group" aria-label="Template font size">
      <span className="text-[10px] uppercase font-bold text-muted hidden sm:inline-block">Size</span>
      <Select
        aria-label="Template font size"
        value={String(value)}
        onChange={(e) => setFontSize(Number(e.target.value) as FontSizePt)}
        className="h-7 min-w-[80px] text-xs border border-rule rounded-lg bg-surface text-foreground px-2 outline-none focus:ring-1 focus:ring-accent font-mono"
      >
        {FONT_SIZES.map((f) => (
          <option key={f.pt} value={f.pt}>
            {f.pt} pt
          </option>
        ))}
      </Select>
    </div>
  );
}