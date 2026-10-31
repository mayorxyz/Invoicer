// v2 types — country-neutral, multi-tax, multi-document
export type CurrencyCode = string; // ISO 4217
export type CountryCode = string; // ISO 3166-1 alpha-2
export type LanguageCode = 'en' | 'es' | 'fr' | 'pt' | 'de' | 'ar';
export type DocumentLanguage = LanguageCode;

export type Status = 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
export type Mode =
  | 'invoice' | 'quote' | 'receipt' | 'credit_note'
  | 'proforma' | 'purchase_order' | 'delivery_note' | 'statement';
export type TaxType = 'added' | 'included' | 'deducted';
export type TaxApplyTo = 'all' | 'taxable_only';
export type DiscType = 'percent' | 'fixed';
export type PaymentMethod = 'transfer' | 'cash' | 'card' | 'online' | 'mobile_money' | 'other';
export type Template = 'default' | 'classic' | 'modern' | 'minimal';
export type PaperSize = 'A4' | 'Letter';
export type PricingMode = 'exclusive' | 'inclusive';
export type Interval = 'weekly' | 'monthly' | 'quarterly' | 'yearly';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Tax {
  id: string;
  label: string;       // e.g. "VAT", "GST", "WHT"
  rate: number;        // e.g. 0.075 = 7.5%
  type: TaxType;       // added (to total), included (in price), deducted (from payable)
  applyTo: TaxApplyTo;
  enabled: boolean;
}

export interface LineDiscount {
  type: DiscType;
  value: number;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface Milestone {
  id: string;
  label: string;
  percent: number;     // 0-100
  dueDate: string;
  amount: number;      // minor units
}

export interface LateFeeRule {
  type: 'percent_per_month' | 'flat';
  value: number;
}

export interface EarlyPaymentDiscount {
  percent: number;     // e.g. 2 for 2%
  days: number;        // e.g. 10 for net 10
  netDays: number;     // e.g. 30 for net 30
}

export interface Item {
  id: string;
  desc: string;
  qty: number;
  unit: string;
  price: number;        // in major units as typed
  taxable: boolean;
  taxIds: string[];     // which taxes apply to this line
  discount?: LineDiscount;
  sku?: string;
  customFields?: CustomField[];
}

export interface Client {
  id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  taxId?: string;       // generic tax ID (VAT No, GSTIN, EIN, etc.)
  taxIdLabel?: string;  // label for the tax ID
  notes?: string;
  tags?: string[];
  archived?: boolean;
  defaults?: {
    currency?: CurrencyCode;
    paymentTerms?: number;
    language?: DocumentLanguage;
    taxProfile?: Tax[];
  };
  customFields?: CustomField[];
}

export interface PaymentInstruction {
  id: string;
  type: 'bank' | 'mobile_money' | 'paypal' | 'wise' | 'stripe' | 'paystack' | 'flutterwave' | 'razorpay' | 'mercado_pago' | 'other';
  label: string;
  details: string;      // free-form details
  qrData?: string;      // for QR code generation
}

export interface Payment {
  id: string;
  date: string;
  amount: number;       // major units
  method: PaymentMethod;
  ref?: string;
  note?: string;
}

export interface Recurring {
  interval: Interval;
  nextDate: string;
  endDate?: string;
  paused?: boolean;
}

export interface DocumentVersion {
  timestamp: string;
  data: string; // JSON snapshot
}

export interface Invoice {
  id: string;
  number: string;
  mode: Mode;
  issueDate: string;
  dueDate: string;
  supplyDate?: string;
  placeOfSupply?: string;
  currency: CurrencyCode;
  exchangeRate?: number;
  homeCurrency?: CurrencyCode;
  status: Status;
  clientId: string;
  client: Client;
  businessId: string;
  items: Item[];
  taxes: Tax[];
  pricingMode: PricingMode;
  discType: DiscType;
  discVal: number;
  shipping: number;
  payments: Payment[];
  paymentInstructions: PaymentInstruction[];
  milestones: Milestone[];
  lateFee?: LateFeeRule;
  earlyPaymentDiscount?: EarlyPaymentDiscount;
  notes: string;
  terms: string;
  payLink: string;
  payLinkProvider?: string;
  template: Template;
  accent: string;
  paperSize: PaperSize;
  documentLanguage: DocumentLanguage;
  customFields: CustomField[];
  recurring?: Recurring;
  reverseCharge?: boolean;
  zeroRated?: boolean;
  shipToName?: string;
  shipToAddress?: string;
  versions: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  taxId?: string;
  taxIdLabel?: string;
  regNumber?: string;
  country: CountryCode;
  paymentInstructions: PaymentInstruction[];
  signature?: string;
  numberPrefix: Record<Mode, string>;
  numberPadding: number;
  counter: Record<Mode, number>;
  defaultCurrency: CurrencyCode;
  defaultTaxes: Tax[];
  defaultPricingMode: PricingMode;
  defaultDueDays: number;
  defaultNotes: string;
  defaultTerms: string;
  defaultTemplate: Template;
  defaultAccent: string;
  defaultPaperSize: PaperSize;
  defaultLanguage: DocumentLanguage;
}

export interface Expense {
  id: string;
  date: string;
  vendor: string;
  category: string;
  amount: number;
  currency: CurrencyCode;
  tax?: number;
  receiptImage?: string;
  note?: string;
}

export interface TimeEntry {
  id: string;
  clientId: string;
  project: string;
  description: string;
  startTime: string;
  endTime?: string;
  rate: number;
  currency: CurrencyCode;
}

export interface Settings {
  schemaVersion: number;
  language: LanguageCode;
  theme: ThemeMode;
  accent: string;
  locale: string;
  dateFormat: string;
  firstDayOfWeek: 0 | 1 | 6;
  homeCurrency: CurrencyCode;
  country: CountryCode;
  lastBackupDate?: string;
  completedFirstRun: boolean;
  sidebarCollapsed: boolean;
  demoDismissed: boolean;
}

export interface SavedItem {
  id: string;
  name: string;
  price: number;
  unit: string;
  sku?: string;
  category?: string;
  defaultTaxIds?: string[];
}

export interface AppState {
  schemaVersion: number;
  invoices: Invoice[];
  clients: Client[];
  savedItems: SavedItem[];
  expenses: Expense[];
  timeEntries: TimeEntry[];
  businesses: BusinessProfile[];
  activeBusinessId: string;
  settings: Settings;
}
