export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  decimals: number;
  locale: string;
}

export const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', decimals: 2, locale: 'en-US' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', decimals: 2, locale: 'de-DE' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', decimals: 2, locale: 'en-GB' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', decimals: 0, locale: 'ja-JP' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', decimals: 2, locale: 'en-CA' },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', decimals: 2, locale: 'en-AU' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', decimals: 2, locale: 'en-NZ' },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', decimals: 2, locale: 'de-CH' },
  SEK: { code: 'SEK', name: 'Swedish Krona', symbol: 'kr', decimals: 2, locale: 'sv-SE' },
  NOK: { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', decimals: 2, locale: 'nb-NO' },
  DKK: { code: 'DKK', name: 'Danish Krone', symbol: 'kr', decimals: 2, locale: 'da-DK' },
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹', decimals: 2, locale: 'en-IN' },
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', decimals: 2, locale: 'pt-BR' },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', decimals: 2, locale: 'es-MX' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R', decimals: 2, locale: 'en-ZA' },
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', decimals: 2, locale: 'en-NG' },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', decimals: 2, locale: 'en-KE' },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵', decimals: 2, locale: 'en-GH' },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', decimals: 2, locale: 'ar-EG' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', decimals: 2, locale: 'ar-AE' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', decimals: 2, locale: 'ar-SA' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', decimals: 2, locale: 'en-SG' },
  PHP: { code: 'PHP', name: 'Philippine Peso', symbol: '₱', decimals: 2, locale: 'en-PH' },
  IDR: { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', decimals: 0, locale: 'id-ID' },
  KWD: { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KD', decimals: 3, locale: 'ar-KW' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', decimals: 2, locale: 'zh-CN' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩', decimals: 0, locale: 'ko-KR' },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿', decimals: 2, locale: 'th-TH' },
  PLN: { code: 'PLN', name: 'Polish Zloty', symbol: 'zł', decimals: 2, locale: 'pl-PL' },
  CZK: { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', decimals: 2, locale: 'cs-CZ' },
  HUF: { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', decimals: 0, locale: 'hu-HU' },
  TRY: { code: 'TRY', name: 'Turkish Lira', symbol: '₺', decimals: 2, locale: 'tr-TR' },
  ILS: { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', decimals: 2, locale: 'he-IL' },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: '$', decimals: 2, locale: 'es-AR' },
  COP: { code: 'COP', name: 'Colombian Peso', symbol: '$', decimals: 2, locale: 'es-CO' },
  CLP: { code: 'CLP', name: 'Chilean Peso', symbol: '$', decimals: 0, locale: 'es-CL' },
  PEN: { code: 'PEN', name: 'Peruvian Sol', symbol: 'S/', decimals: 2, locale: 'es-PE' },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

export function getCurrency(code: string): CurrencyInfo {
  return CURRENCIES[code] || { code, name: code, symbol: code, decimals: 2, locale: 'en-US' };
}
