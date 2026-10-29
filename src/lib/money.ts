import type { CurrencyCode, Invoice, Item, Payment, Tax } from '../types';
import { CURRENCIES } from '../data/currencies';

export function getDecimals(currency: CurrencyCode): number {
  const c = CURRENCIES[currency];
  return c?.decimals ?? 2;
}

export function toMinor(amount: number, currency: CurrencyCode): number {
  if (isNaN(amount) || amount < 0) return 0;
  const d = getDecimals(currency);
  return Math.round(amount * Math.pow(10, d));
}

export function fromMinor(minor: number, currency: CurrencyCode): number {
  const d = getDecimals(currency);
  return minor / Math.pow(10, d);
}

export function lineTotal(item: Item, currency: CurrencyCode): number {
  return Math.round(item.qty * toMinor(item.price, currency));
}

export function subtotal(items: Item[], currency: CurrencyCode): number {
  return items.reduce((sum, item) => sum + lineTotal(item, currency), 0);
}

export function lineDiscountAmount(lineMinor: number, discount?: { type: 'percent' | 'fixed'; value: number }, currency?: CurrencyCode): number {
  if (!discount) return 0;
  if (discount.type === 'percent') {
    const capped = Math.min(Math.max(discount.value, 0), 100);
    return Math.round(lineMinor * capped / 100);
  }
  if (currency) {
    return Math.min(toMinor(discount.value, currency), lineMinor);
  }
  return Math.min(Math.round(discount.value * 100), lineMinor);
}

export function invoiceDiscountAmount(sub: number, type: 'percent' | 'fixed', val: number, currency: CurrencyCode): number {
  if (type === 'percent') {
    const capped = Math.min(Math.max(val, 0), 100);
    return Math.round(sub * capped / 100);
  }
  const fixedMinor = toMinor(val, currency);
  return Math.min(fixedMinor, sub);
}

export function computeTax(taxableAmount: number, tax: Tax): number {
  if (!tax.enabled || tax.rate <= 0) return 0;
  return Math.round(taxableAmount * tax.rate);
}

export function paidMinor(payments: Payment[], currency: CurrencyCode): number {
  return payments.reduce((sum, p) => sum + toMinor(p.amount, currency), 0);
}

export interface TotalsResult {
  subtotal: number;
  lineDiscounts: number;
  afterLineDiscount: number;
  invoiceDiscount: number;
  netBeforeTax: number;
  taxes: { label: string; amount: number; type: string }[];
  taxAdded: number;
  taxIncluded: number;
  taxDeducted: number;
  shipping: number;
  total: number;
  payable: number;
  paid: number;
  balance: number;
}

export function totals(inv: Invoice): TotalsResult {
  const cur = inv.currency;
  const sub = subtotal(inv.items, cur);

  // Line discounts
  let lineDiscounts = 0;
  const lineNet: number[] = [];
  for (const item of inv.items) {
    const lt = lineTotal(item, cur);
    const ld = lineDiscountAmount(lt, item.discount, cur);
    lineDiscounts += ld;
    lineNet.push(lt - ld);
  }
  const afterLineDiscount = sub - lineDiscounts;

  // Invoice-level discount
  const invoiceDiscount = invoiceDiscountAmount(afterLineDiscount, inv.discType, inv.discVal, cur);
  const netBeforeTax = afterLineDiscount - invoiceDiscount;

  // Compute taxes
  const enabledTaxes = inv.taxes.filter(t => t.enabled && t.rate > 0);
  const taxResults: { label: string; amount: number; type: string }[] = [];
  let taxAdded = 0, taxIncluded = 0, taxDeducted = 0;

  if (inv.pricingMode === 'exclusive') {
    for (const tax of enabledTaxes) {
      let taxableBase: number;
      if (tax.applyTo === 'taxable_only') {
        taxableBase = inv.items.reduce((sum, item, i) => {
          if (!item.taxable) return sum;
          return sum + lineNet[i];
        }, 0);
        // Apply pro-rata invoice discount
        if (afterLineDiscount > 0) {
          taxableBase = Math.round(taxableBase * (netBeforeTax / afterLineDiscount));
        }
      } else {
        taxableBase = netBeforeTax;
      }
      const amount = computeTax(taxableBase, tax);
      taxResults.push({ label: tax.label, amount, type: tax.type });
      if (tax.type === 'added') taxAdded += amount;
      else if (tax.type === 'included') taxIncluded += amount;
      else if (tax.type === 'deducted') taxDeducted += amount;
    }
  } else {
    // Inclusive: prices already include tax
    for (const tax of enabledTaxes) {
      if (tax.type !== 'included') {
        let taxableBase = tax.applyTo === 'taxable_only'
          ? inv.items.reduce((sum, item, i) => item.taxable ? sum + lineNet[i] : sum, 0)
          : netBeforeTax;
        if (afterLineDiscount > 0) taxableBase = Math.round(taxableBase * (netBeforeTax / afterLineDiscount));
        const amount = computeTax(taxableBase, tax);
        taxResults.push({ label: tax.label, amount, type: tax.type });
        if (tax.type === 'added') taxAdded += amount;
        else if (tax.type === 'deducted') taxDeducted += amount;
      } else {
        // Extract included tax from net
        let taxableBase = tax.applyTo === 'taxable_only'
          ? inv.items.reduce((sum, item, i) => item.taxable ? sum + lineNet[i] : sum, 0)
          : netBeforeTax;
        if (afterLineDiscount > 0) taxableBase = Math.round(taxableBase * (netBeforeTax / afterLineDiscount));
        const amount = Math.round(taxableBase - taxableBase / (1 + tax.rate));
        taxResults.push({ label: tax.label, amount, type: 'included' });
        taxIncluded += amount;
      }
    }
  }

  const shippingMinor = toMinor(inv.shipping, cur);
  const total = netBeforeTax + taxAdded + shippingMinor;
  const payable = total - taxDeducted;
  const paid = paidMinor(inv.payments, cur);
  const balance = payable - paid;

  return {
    subtotal: sub, lineDiscounts, afterLineDiscount, invoiceDiscount,
    netBeforeTax, taxes: taxResults, taxAdded, taxIncluded, taxDeducted,
    shipping: shippingMinor, total, payable, paid, balance,
  };
}

export function formatMoney(minor: number, currency: CurrencyCode, locale?: string): string {
  const amount = fromMinor(minor, currency);
  const decimals = getDecimals(currency);
  const loc = locale || 'en-US';
  try {
    return new Intl.NumberFormat(loc, {
      style: 'currency', currency,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(decimals)}`;
  }
}

export function convertMinor(minor: number, rate: number): number {
  if (rate <= 0) return minor;
  return Math.round(minor * rate);
}
