import { useSyncExternalStore } from 'react';
import { Select } from './select';

/** Paper-only font scale. Persisted in localStorage, no store changes needed. */
const KEY = 'paper.fontScale';
export const FONT_SCALES = [85, 90, 100, 110, 125] as const;

const read = (): number => {
  try {
    const v = Number(localStorage.getItem(KEY));
    return (FONT_SCALES as readonly number[]).includes(v) ? v : 100;
  } catch {
    return 100;
  }
};

let scale = read();
const subs = new Set<() => void>();

export function setFontScale(v: number) {
  scale = v;
  try { localStorage.setItem(KEY, String(v)); } catch { /* ignore */ }
  subs.forEach((f) => f());
}

export function useFontScale(): number {
  return useSyncExternalStore(
    (cb) => { subs.add(cb); return () => { subs.delete(cb); }; },
    () => scale,
    () => 100,
  );
}

/** Tailwind sizes used inside templates -> px at 100%. Ordered small to large so larger wins on ties. */
const SIZES: [string, number][] = [
  ['text-[9px]', 9], ['text-[10px]', 10], ['text-[11px]', 11], ['text-[12px]', 12],
  ['text-[13px]', 13], ['text-[14px]', 14],
  ['text-xs', 12], ['text-sm', 14], ['text-base', 16], ['text-lg', 18],
  ['text-xl', 20], ['text-2xl', 24], ['text-3xl', 30], ['text-4xl', 36],
];

/** Scoped to .paper-fs, so the app UI is never affected. */
export const fontScaleCSS = SIZES
  .map(([c, px]) => `.paper-fs [class*="${c}"]{font-size:calc(${px}px * var(--paper-fs,1)) !important}`)
  .join('\n');

export function FontSizeControl() {
  const current = useFontScale();
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Template font size">
      <span className="text-[10px] uppercase font-bold text-muted hidden sm:inline-block">Size</span>
      <Select
        aria-label="Template font size"
        value={String(current)}
        onChange={(e) => setFontScale(Number(e.target.value))}
        className="h-7 min-w-[76px] text-xs border border-rule rounded-lg bg-surface text-foreground px-2 outline-none focus:ring-1 focus:ring-accent"
      >
        {FONT_SCALES.map((s) => (
          <option key={s} value={s}>{s}%</option>
        ))}
      </Select>
    </div>
  );
}