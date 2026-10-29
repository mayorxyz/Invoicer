export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function addDays(date: string, n: number): string {
  const d = new Date(date + 'T00:00:00');
  d.setDate(d.getDate() + n);
  return toDateStr(d);
}

export function subtractDays(date: string, n: number): string {
  return addDays(date, -n);
}

export function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDate(date: string, fmt: string = 'yyyy-MM-dd'): string {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  if (isNaN(d.getTime())) return date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthsFull = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return fmt
    .replace('yyyy', String(year)).replace('yy', String(year).slice(-2))
    .replace('MMMM', monthsFull[d.getMonth()]).replace('MMM', months[d.getMonth()])
    .replace('MM', month).replace('dd', day);
}

export function formatDateLocale(date: string, locale: string, fmt?: string): string {
  if (!date) return '';
  const d = new Date(date + 'T00:00:00');
  if (isNaN(d.getTime())) return date;
  if (fmt && fmt !== 'locale') return formatDate(date, fmt);
  try {
    return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
  } catch {
    return formatDate(date);
  }
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / (1000 * 60 * 60 * 24));
}

export function nextRecurrence(date: string, interval: 'weekly' | 'monthly' | 'quarterly' | 'yearly'): string {
  const d = new Date(date + 'T00:00:00');
  switch (interval) {
    case 'weekly': d.setDate(d.getDate() + 7); break;
    case 'monthly': d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'yearly': d.setFullYear(d.getFullYear() + 1); break;
  }
  return toDateStr(d);
}
