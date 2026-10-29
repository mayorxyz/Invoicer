import type { AppState, Invoice, Client, SavedItem, Expense, TimeEntry, BusinessProfile, Settings } from '../types';
import { DEFAULT_BUSINESS, DEFAULT_SETTINGS } from './defaults';

const SCHEMA_VERSION = 2;
const KEY = 'invoicer_v2';

function read<T>(fallback: T): T {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const data = JSON.parse(raw);
    return data?.value ?? fallback;
  } catch { return fallback; }
}

function write(value: unknown): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ version: SCHEMA_VERSION, value }));
    return true;
  } catch { return false; }
}

export function loadState(): AppState {
  return read<AppState>({
    schemaVersion: SCHEMA_VERSION,
    invoices: [], clients: [], savedItems: [], expenses: [], timeEntries: [],
    businesses: [DEFAULT_BUSINESS],
    activeBusinessId: DEFAULT_BUSINESS.id,
    settings: DEFAULT_SETTINGS,
  });
}

export function saveState(state: AppState): boolean {
  return write(state);
}

export function exportBackup(state: AppState): string {
  return JSON.stringify(state, null, 2);
}

export function importBackup(json: string): AppState | null {
  try {
    const data = JSON.parse(json);
    if (!data || typeof data !== 'object') return null;
    // Handle v1 migration
    if (!data.schemaVersion || data.schemaVersion < 2) {
      return migrateV1(data);
    }
    return data as AppState;
  } catch { return null; }
}

function migrateV1(old: Record<string, unknown>): AppState {
  const invoices = (Array.isArray(old.invoices) ? old.invoices : []) as Invoice[];
  const clients = (Array.isArray(old.clients) ? old.clients : []) as Client[];
  const savedItems = (Array.isArray(old.savedItems) ? old.savedItems : []) as SavedItem[];

  // Migrate invoices from v1 (kobo, vatOn, whtRate) to v2 (minor units, taxes[])
  const migratedInvoices = invoices.map(inv => {
    const v1 = inv as unknown as Record<string, unknown>;
    const taxes = [];
    if (v1.vatOn) {
      taxes.push({ id: 'vat', label: 'VAT', rate: (v1.vatRate as number) || 0.075, type: 'added' as const, applyTo: 'taxable_only' as const, enabled: true });
    }
    if ((v1.whtRate as number) > 0) {
      taxes.push({ id: 'wht', label: 'WHT', rate: (v1.whtRate as number) / 100, type: 'deducted' as const, applyTo: 'all' as const, enabled: true });
    }
    const items = (Array.isArray(v1.items) ? v1.items : []).map((item: Record<string, unknown>) => ({
      ...item,
      taxIds: item.taxable ? ['vat'] : [],
      customFields: [],
    }));
    return {
      ...inv,
      taxes,
      pricingMode: 'exclusive' as const,
      paymentInstructions: [],
      milestones: [],
      customFields: [],
      versions: [],
      documentLanguage: 'en' as const,
      paperSize: 'A4' as const,
      businessId: DEFAULT_BUSINESS.id,
      items,
    };
  });

  return {
    schemaVersion: SCHEMA_VERSION,
    invoices: migratedInvoices as unknown as Invoice[],
    clients: clients.map(c => ({ ...c, taxId: (c as unknown as Record<string, unknown>).tin as string | undefined })),
    savedItems,
    expenses: [],
    timeEntries: [],
    businesses: [DEFAULT_BUSINESS],
    activeBusinessId: DEFAULT_BUSINESS.id,
    settings: DEFAULT_SETTINGS,
  };
}

export function wipeAll(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

export function isLocalStorageAvailable(): boolean {
  try { localStorage.setItem('__test__', '1'); localStorage.removeItem('__test__'); return true; } catch { return false; }
}

export async function downscaleImage(file: File, maxWidth: number = 300): Promise<string> {
  if (file.size > 2 * 1024 * 1024) throw new Error('File too large (max 2MB)');
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
