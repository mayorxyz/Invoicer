import type { Mode, BusinessProfile } from '../types';
import { MODE_PREFIXES } from '../data/countries';

export function formatNumber(prefix: string, n: number, pad: number): string {
  return `${prefix}-${String(n).padStart(pad, '0')}`;
}

export function nextNumber(business: BusinessProfile, mode: Mode): { number: string; counter: Record<Mode, number> } {
  const prefix = business.numberPrefix[mode] || MODE_PREFIXES[mode] || 'DOC';
  const newCount = (business.counter[mode] || 0) + 1;
  const number = formatNumber(prefix, newCount, business.numberPadding || 4);
  return { number, counter: { ...business.counter, [mode]: newCount } };
}

export function isDuplicateNumber(number: string, all: { number: string }[]): boolean {
  return all.filter(i => i.number === number).length > 1;
}
