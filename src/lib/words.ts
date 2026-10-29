import type { CurrencyCode, LanguageCode } from '../types';

const ones = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const tens = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

function twoDigits(n: number): string {
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10); const o = n % 10;
  return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
}

function threeDigits(n: number): string {
  if (n < 100) return twoDigits(n);
  const h = Math.floor(n / 100); const rest = n % 100;
  const hStr = `${ones[h]} hundred`;
  return rest === 0 ? hStr : `${hStr} and ${twoDigits(rest)}`;
}

function groups(n: number): string {
  if (n === 0) return 0 as unknown as string;
  const parts: string[] = [];
  const b = Math.floor(n / 1e9); const m = Math.floor((n % 1e9) / 1e6);
  const th = Math.floor((n % 1e6) / 1000); const r = n % 1000;
  if (b > 0) parts.push(`${threeDigits(b)} billion`);
  if (m > 0) parts.push(`${threeDigits(m)} million`);
  if (th > 0) parts.push(`${threeDigits(th)} thousand`);
  if (r > 0) parts.push(threeDigits(r));
  return parts.join(', ') as unknown as string;
}

const currencyNames: Record<string, [string, string]> = {
  USD: ['dollars', 'cents'], EUR: ['euros', 'cents'], GBP: ['pounds', 'pence'],
  NGN: ['naira', 'kobo'], INR: ['rupees', 'paise'], CAD: ['dollars', 'cents'],
  AUD: ['dollars', 'cents'], BRL: ['reais', 'centavos'], MXN: ['pesos', 'centavos'],
  ZAR: ['rand', 'cents'], KES: ['shillings', 'cents'], GHS: ['cedis', 'pesewas'],
  JPY: ['yen', 'sen'], SGD: ['dollars', 'cents'], PHP: ['pesos', 'centavos'],
  AED: ['dirhams', 'fils'], SAR: ['riyals', 'halalas'],
};

const esOnes = ['','uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve'];
const esTens = ['','','veinte','treinta','cuarenta','cincuenta','sesenta','setenta','ochenta','noventa'];
function esTwoDigits(n: number): string {
  if (n < 20) return esOnes[n];
  const t = Math.floor(n / 10); const o = n % 10;
  return o === 0 ? esTens[t] : `${esTens[t]} y ${esOnes[o]}`;
}
function esThreeDigits(n: number): string {
  if (n < 100) return esTwoDigits(n);
  if (n === 100) return 'cien';
  const h = Math.floor(n / 100); const rest = n % 100;
  const hundreds = ['','ciento','doscientos','trescientos','cuatrocientos','quinientos','seiscientos','setecientos','ochocientos','novecientos'];
  return rest === 0 ? hundreds[h] : `${hundreds[h]} ${esTwoDigits(rest)}`;
}

const frOnes = ['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
const frTens = ['','','vingt','trente','quarante','cinquante','soixante','soixante','quatre-vingt','quatre-vingt'];
function frTwoDigits(n: number): string {
  if (n < 20) return frOnes[n];
  if (n >= 70 && n < 80) return `soixante-${frOnes[n - 60]}`;
  if (n >= 80 && n < 100) return n === 80 ? 'quatre-vingts' : `quatre-vingt-${frOnes[n - 80]}`;
  const t = Math.floor(n / 10); const o = n % 10;
  return o === 0 ? frTens[t] : o === 1 ? `${frTens[t]} et un` : `${frTens[t]}-${frOnes[o]}`;
}
function frThreeDigits(n: number): string {
  if (n < 100) return frTwoDigits(n);
  const h = Math.floor(n / 100); const rest = n % 100;
  const hStr = h === 1 ? 'cent' : `${frOnes[h]} cents`;
  return rest === 0 ? hStr : h === 1 ? `cent ${frTwoDigits(rest)}` : `${frOnes[h]} cent ${frTwoDigits(rest)}`;
}

export function amountInWords(minor: number, currency: CurrencyCode, lang: LanguageCode = 'en'): string {
  if (minor <= 0) return '';
  const names = currencyNames[currency] || [currency.toLowerCase(), 'cents'];
  const decimals = [ 'JPY', 'IDR', 'KRW', 'HUF', 'CLP' ].includes(currency) ? 0 : 2;
  const factor = Math.pow(10, decimals);
  const mainUnit = Math.floor(minor / factor);
  const subUnit = decimals > 0 ? minor % factor : 0;

  if (lang === 'es') {
    const parts: string[] = [];
    const m = Math.floor(mainUnit / 1e6); const th = Math.floor((mainUnit % 1e6) / 1000); const r = mainUnit % 1000;
    if (m > 0) parts.push(m === 1 ? 'un millón' : `${esThreeDigits(m)} millones`);
    if (th > 0) parts.push(th === 1 ? 'mil' : `${esThreeDigits(th)} mil`);
    if (r > 0) parts.push(esThreeDigits(r));
    let result = parts.join(' ') || 'cero';
    result = `${result.charAt(0).toUpperCase()}${result.slice(1)} ${names[0]}`;
    if (subUnit > 0) result += ` y ${esThreeDigits(subUnit)} ${names[1]}`;
    return `${result} solos`;
  }

  if (lang === 'fr') {
    const parts: string[] = [];
    const b = Math.floor(mainUnit / 1e9); const m = Math.floor((mainUnit % 1e9) / 1e6);
    const th = Math.floor((mainUnit % 1e6) / 1000); const r = mainUnit % 1000;
    if (b > 0) parts.push(b === 1 ? 'un milliard' : `${frThreeDigits(b)} milliards`);
    if (m > 0) parts.push(m === 1 ? 'un million' : `${frThreeDigits(m)} millions`);
    if (th > 0) parts.push(th === 1 ? 'mille' : `${frThreeDigits(th)} mille`);
    if (r > 0) parts.push(frThreeDigits(r));
    let result = parts.join(' ') || 'zéro';
    result = `${result.charAt(0).toUpperCase()}${result.slice(1)} ${names[0]}`;
    if (subUnit > 0) result += ` et ${frThreeDigits(subUnit)} ${names[1]}`;
    return `${result} seulement`;
  }

  if (lang === 'pt') {
    const parts: string[] = [];
    const m = Math.floor(mainUnit / 1e6); const th = Math.floor((mainUnit % 1e6) / 1000); const r = mainUnit % 1000;
    if (m > 0) parts.push(m === 1 ? 'um milhão' : `${esThreeDigits(m)} milhões`);
    if (th > 0) parts.push(th === 1 ? 'mil' : `${esThreeDigits(th)} mil`);
    if (r > 0) parts.push(esThreeDigits(r));
    let result = parts.join(' ') || 'zero';
    result = `${result.charAt(0).toUpperCase()}${result.slice(1)} ${names[0]}`;
    if (subUnit > 0) result += ` e ${esThreeDigits(subUnit)} ${names[1]}`;
    return `${result} apenas`;
  }

  if (lang === 'de') {
    const parts: string[] = [];
    const b = Math.floor(mainUnit / 1e9); const m = Math.floor((mainUnit % 1e9) / 1e6);
    const th = Math.floor((mainUnit % 1e6) / 1000); const r = mainUnit % 1000;
    if (b > 0) parts.push(`${threeDigits(b)} Milliarden`);
    if (m > 0) parts.push(`${threeDigits(m)} Millionen`);
    if (th > 0) parts.push(`${threeDigits(th)} tausend`);
    if (r > 0) parts.push(threeDigits(r));
    let result = parts.join(' ') || 'null';
    result = `${result.charAt(0).toUpperCase()}${result.slice(1)} ${names[0]}`;
    if (subUnit > 0) result += ` und ${threeDigits(subUnit)} ${names[1]}`;
    return `${result} nur`;
  }

  // English default
  const g = groups(mainUnit);
  let result = typeof g === 'string' ? g : String(g);
  if (!result || result === '0') result = 'zero';
  result = `${result.charAt(0).toUpperCase()}${result.slice(1)} ${names[0]}`;
  if (subUnit > 0) {
    const sg = groups(subUnit);
    result += ` and ${typeof sg === 'string' ? sg : String(sg)} ${names[1]}`;
  }
  return `${result} only`;
}
