import type { Invoice, Status } from '../types';
import { today } from './dates';
import { totals } from './money';

export function derivedStatus(inv: Invoice, now?: string): Status {
  const currentDate = now || today();
  if (inv.status === 'cancelled') return 'cancelled';
  const t = totals(inv);
  if (t.payable > 0 && t.balance <= 0 && t.paid > 0) return 'paid';
  if (t.paid > 0 && t.balance > 0) return 'partial';
  if (inv.dueDate < currentDate && t.balance > 0 && inv.mode !== 'quote' && inv.mode !== 'proforma') return 'overdue';
  return inv.status;
}
