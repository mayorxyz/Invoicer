import type { CountryCode, CurrencyCode, LanguageCode, PaperSize } from '../types';

export interface CountryPreset {
  code: CountryCode;
  name: string;
  defaultCurrency: CurrencyCode;
  locale: string;
  dateFormat: string;
  paperSize: PaperSize;
  taxLabel: string;
  defaultTaxRate: number;
  taxInclusive: boolean;
  taxIdLabel: string;
  bankFields: string[];
  dir: 'ltr' | 'rtl';
  defaultLanguage: LanguageCode;
}

export const COUNTRIES: CountryPreset[] = [
  { code: 'US', name: 'United States', defaultCurrency: 'USD', locale: 'en-US', dateFormat: 'MM/dd/yyyy', paperSize: 'Letter', taxLabel: 'Sales Tax', defaultTaxRate: 0, taxInclusive: false, taxIdLabel: 'EIN', bankFields: ['routing', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'CA', name: 'Canada', defaultCurrency: 'CAD', locale: 'en-CA', dateFormat: 'yyyy-MM-dd', paperSize: 'Letter', taxLabel: 'GST/HST', defaultTaxRate: 0.05, taxInclusive: false, taxIdLabel: 'BN', bankFields: ['transit', 'institution', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'GB', name: 'United Kingdom', defaultCurrency: 'GBP', locale: 'en-GB', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.20, taxInclusive: false, taxIdLabel: 'VAT No.', bankFields: ['sortCode', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'IE', name: 'Ireland', defaultCurrency: 'EUR', locale: 'en-IE', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.23, taxInclusive: true, taxIdLabel: 'VAT No.', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'DE', name: 'Germany', defaultCurrency: 'EUR', locale: 'de-DE', dateFormat: 'dd.MM.yyyy', paperSize: 'A4', taxLabel: 'MwSt.', defaultTaxRate: 0.19, taxInclusive: true, taxIdLabel: 'USt-IdNr.', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'de' },
  { code: 'FR', name: 'France', defaultCurrency: 'EUR', locale: 'fr-FR', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'TVA', defaultTaxRate: 0.20, taxInclusive: true, taxIdLabel: 'N° TVA', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'fr' },
  { code: 'ES', name: 'Spain', defaultCurrency: 'EUR', locale: 'es-ES', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'IVA', defaultTaxRate: 0.21, taxInclusive: true, taxIdLabel: 'NIF', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'es' },
  { code: 'IT', name: 'Italy', defaultCurrency: 'EUR', locale: 'it-IT', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'IVA', defaultTaxRate: 0.22, taxInclusive: true, taxIdLabel: 'P. IVA', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'fr' },
  { code: 'NL', name: 'Netherlands', defaultCurrency: 'EUR', locale: 'nl-NL', dateFormat: 'dd-MM-yyyy', paperSize: 'A4', taxLabel: 'BTW', defaultTaxRate: 0.21, taxInclusive: true, taxIdLabel: 'BTW-nr.', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'PT', name: 'Portugal', defaultCurrency: 'EUR', locale: 'pt-PT', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'IVA', defaultTaxRate: 0.23, taxInclusive: true, taxIdLabel: 'NIF', bankFields: ['iban', 'bic'], dir: 'ltr', defaultLanguage: 'pt' },
  { code: 'BR', name: 'Brazil', defaultCurrency: 'BRL', locale: 'pt-BR', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'Imposto', defaultTaxRate: 0, taxInclusive: false, taxIdLabel: 'CNPJ/CPF', bankFields: ['pix'], dir: 'ltr', defaultLanguage: 'pt' },
  { code: 'MX', name: 'Mexico', defaultCurrency: 'MXN', locale: 'es-MX', dateFormat: 'dd/MM/yyyy', paperSize: 'Letter', taxLabel: 'IVA', defaultTaxRate: 0.16, taxInclusive: false, taxIdLabel: 'RFC', bankFields: ['clabe'], dir: 'ltr', defaultLanguage: 'es' },
  { code: 'IN', name: 'India', defaultCurrency: 'INR', locale: 'en-IN', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'GST', defaultTaxRate: 0.18, taxInclusive: false, taxIdLabel: 'GSTIN', bankFields: ['ifsc', 'account', 'upi'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'AE', name: 'UAE', defaultCurrency: 'AED', locale: 'ar-AE', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.05, taxInclusive: true, taxIdLabel: 'TRN', bankFields: ['iban', 'swift'], dir: 'rtl', defaultLanguage: 'ar' },
  { code: 'SA', name: 'Saudi Arabia', defaultCurrency: 'SAR', locale: 'ar-SA', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.15, taxInclusive: true, taxIdLabel: 'VAT No.', bankFields: ['iban', 'swift'], dir: 'rtl', defaultLanguage: 'ar' },
  { code: 'ZA', name: 'South Africa', defaultCurrency: 'ZAR', locale: 'en-ZA', dateFormat: 'yyyy/MM/dd', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.15, taxInclusive: true, taxIdLabel: 'VAT No.', bankFields: ['branchCode', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'NG', name: 'Nigeria', defaultCurrency: 'NGN', locale: 'en-NG', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.075, taxInclusive: false, taxIdLabel: 'TIN', bankFields: ['bank', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'KE', name: 'Kenya', defaultCurrency: 'KES', locale: 'en-KE', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.16, taxInclusive: false, taxIdLabel: 'PIN', bankFields: ['bank', 'account', 'mobile_money'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'GH', name: 'Ghana', defaultCurrency: 'GHS', locale: 'en-GH', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.125, taxInclusive: false, taxIdLabel: 'TIN', bankFields: ['bank', 'account', 'mobile_money'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'EG', name: 'Egypt', defaultCurrency: 'EGP', locale: 'ar-EG', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'VAT', defaultTaxRate: 0.14, taxInclusive: true, taxIdLabel: 'Tax ID', bankFields: ['iban', 'swift'], dir: 'rtl', defaultLanguage: 'ar' },
  { code: 'AU', name: 'Australia', defaultCurrency: 'AUD', locale: 'en-AU', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'GST', defaultTaxRate: 0.10, taxInclusive: true, taxIdLabel: 'ABN', bankFields: ['bsb', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'NZ', name: 'New Zealand', defaultCurrency: 'NZD', locale: 'en-NZ', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'GST', defaultTaxRate: 0.15, taxInclusive: true, taxIdLabel: 'IRD', bankFields: ['bank', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'SG', name: 'Singapore', defaultCurrency: 'SGD', locale: 'en-SG', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'GST', defaultTaxRate: 0.09, taxInclusive: false, taxIdLabel: 'GST Reg.', bankFields: ['bank', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'JP', name: 'Japan', defaultCurrency: 'JPY', locale: 'ja-JP', dateFormat: 'yyyy/MM/dd', paperSize: 'A4', taxLabel: 'Consumption Tax', defaultTaxRate: 0.10, taxInclusive: false, taxIdLabel: 'Invoice Issuer No.', bankFields: ['bank', 'branch', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'PH', name: 'Philippines', defaultCurrency: 'PHP', locale: 'en-PH', dateFormat: 'MM/dd/yyyy', paperSize: 'Letter', taxLabel: 'VAT', defaultTaxRate: 0.12, taxInclusive: false, taxIdLabel: 'TIN', bankFields: ['bank', 'account'], dir: 'ltr', defaultLanguage: 'en' },
  { code: 'ID', name: 'Indonesia', defaultCurrency: 'IDR', locale: 'id-ID', dateFormat: 'dd/MM/yyyy', paperSize: 'A4', taxLabel: 'PPN', defaultTaxRate: 0.11, taxInclusive: false, taxIdLabel: 'NPWP', bankFields: ['bank', 'account'], dir: 'ltr', defaultLanguage: 'en' },
];

export const CUSTOM_PRESET: CountryPreset = {
  code: 'XX', name: 'Other / Custom', defaultCurrency: 'USD', locale: 'en-US',
  dateFormat: 'yyyy-MM-dd', paperSize: 'A4', taxLabel: 'Tax', defaultTaxRate: 0,
  taxInclusive: false, taxIdLabel: 'Tax ID', bankFields: ['bank', 'account', 'swift', 'paypal', 'wise', 'freeform'],
  dir: 'ltr', defaultLanguage: 'en',
};

export const ALL_COUNTRIES = [...COUNTRIES, CUSTOM_PRESET];

export function getCountry(code: CountryCode): CountryPreset {
  return ALL_COUNTRIES.find(c => c.code === code) || CUSTOM_PRESET;
}

export const MODE_LABELS: Record<string, string> = {
  invoice: 'Invoice', quote: 'Quote / Estimate', receipt: 'Receipt',
  credit_note: 'Credit Note', proforma: 'Proforma', purchase_order: 'Purchase Order',
  delivery_note: 'Delivery Note', statement: 'Statement',
};

export const MODE_PREFIXES: Record<string, string> = {
  invoice: 'INV', quote: 'QUO', receipt: 'RCT', credit_note: 'CRN',
  proforma: 'PRO', purchase_order: 'PO', delivery_note: 'DLV', statement: 'STM',
};
