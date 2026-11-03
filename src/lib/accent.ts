import { ACCENT_NONE } from './defaults';

export type AccentValue = string | 'none' | null | undefined;

/**
 * Resolves the effective accent color for a paper template.
 *
 * The first candidate that is a non-empty string wins. A value of ACCENT_NONE
 * ('none') is a valid answer and is never skipped in favour of a later
 * candidate.
 */
export function resolveAccent(
  accentProp: AccentValue,
  settingsAccent: AccentValue,
  draftAccent: AccentValue,
): string {
  const candidates = [accentProp, settingsAccent, draftAccent];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c;
  }
  return ACCENT_NONE;
}

/** Fill colour for accent-painted surfaces. None means no fill at all. */
export function accentFill(accent: AccentValue): string {
  return !accent || accent === ACCENT_NONE ? 'transparent' : accent;
}

/** Line/border colour for accent-painted rules. None means no colour. */
export function accentLine(accent: AccentValue): string {
  return !accent || accent === ACCENT_NONE ? 'transparent' : accent;
}

function channelToLinear(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(color: string): number {
  let hex = color.trim().replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  if (!/^[0-9a-f]{6}$/i.test(hex)) return 0;
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

/**
 * Readable text colour for text drawn on an accent-filled area.
 * None keeps the paper's fixed dark text colour.
 */
export function contrastText(accent: AccentValue, darkText = '#1a1a1a'): string {
  if (!accent || accent === ACCENT_NONE) return darkText;
  return relativeLuminance(accent) > 0.55 ? darkText : '#ffffff';
}
