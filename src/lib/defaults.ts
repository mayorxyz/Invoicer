import type { BusinessProfile, Settings, Mode } from '../types';
import { MODE_PREFIXES } from '../data/countries';

const allModes: Mode[] = ['invoice', 'quote', 'receipt', 'credit_note', 'proforma', 'purchase_order', 'delivery_note', 'statement'];

export const DEFAULT_BUSINESS: BusinessProfile = {
  id: 'default',
  name: '',
  logo: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  taxId: '',
  taxIdLabel: 'Tax ID',
  regNumber: '',
  country: 'US',
  paymentInstructions: [],
  signature: '',
  numberPrefix: Object.fromEntries(allModes.map(m => [m, MODE_PREFIXES[m]])) as Record<Mode, string>,
  numberPadding: 4,
  counter: Object.fromEntries(allModes.map(m => [m, 0])) as Record<Mode, number>,
  defaultCurrency: 'USD',
  defaultTaxes: [],
  defaultPricingMode: 'exclusive',
  defaultDueDays: 14,
  defaultNotes: 'Thank you for your business!',
  defaultTerms: 'Payment is due within the specified period.',
  defaultTemplate: 'classic',
  defaultAccent: '#1F3FD1',
  defaultPaperSize: 'A4',
  defaultLanguage: 'en',
};

export const DEFAULT_SETTINGS: Settings = {
  schemaVersion: 2,
  language: 'en',
  theme: 'system',
  accent: '#1F3FD1',
  locale: 'en-US',
  dateFormat: 'yyyy-MM-dd',
  firstDayOfWeek: 1,
  homeCurrency: 'USD',
  country: 'US',
  completedFirstRun: false,
  sidebarCollapsed: false,
  demoDismissed: false,
};

export const APP_NAME = 'Invoicer';

export const ACCENT_PALETTE = [
  '#1F3FD1', '#059669', '#D97706', '#DC2626', '#7C3AED',
  '#0891B2', '#BE185D', '#4F46E5',
];

export const UNITS = ['hrs', 'days', 'pcs', 'kg', 'm', 'service', 'lot', 'box', 'each'];

export const PAYMENT_METHODS = [
  { id: 'transfer', label: 'Bank Transfer' },
  { id: 'cash', label: 'Cash' },
  { id: 'card', label: 'Card' },
  { id: 'online', label: 'Online' },
  { id: 'mobile_money', label: 'Mobile Money' },
  { id: 'other', label: 'Other' },
] as const;
