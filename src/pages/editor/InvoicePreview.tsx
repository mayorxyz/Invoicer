import { formatMoney, toMinor } from '../../lib/money';
import { formatDateLocale } from '../../lib/dates';
import type { Draft, Business, Totals } from './editorTypes';

export interface InvoicePreviewProps {
  draft: Draft;
  business: Business;
  totals: Totals;
  shipToEnabled: boolean;
  signature: string;
  photos: string[];
  paymentTerms: string;
  poNumber: string;
}

export function InvoicePreview({
  draft, business, totals: t, shipToEnabled, signature, photos, paymentTerms, poNumber,
}: InvoicePreviewProps) {
  return (
    <div className="print-paper max-w-[800px] mx-auto bg-surface border border-rule rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-4 sm:p-6 md:p-10 space-y-6 md:space-y-8 text-foreground">
      {/* Header */}
      <div className="invoice-header flex flex-row justify-between items-start gap-4 md:gap-6 border-b border-rule pb-5 md:pb-6">
        <div className="from-block min-w-0 max-w-[58%] space-y-2 md:space-y-3">
          {business.logo ? (
            <img src={business.logo} alt="Logo" className="h-10 md:h-12 max-w-[160px] object-contain" />
          ) : (
            <div className="text-xs font-mono italic text-muted print:hidden">[Company Logo]</div>
          )}
          {business.name ? (
            <div className="from-value text-sm md:text-base font-bold break-words">{business.name}</div>
          ) : (
            <div className="text-sm md:text-base font-bold print:hidden">Acme Corporation</div>
          )}
          {business.address ? (
            <div className="from-value text-xs whitespace-pre-line leading-relaxed break-words">{business.address}</div>
          ) : (
            <div className="text-xs text-muted whitespace-pre-line leading-relaxed print:hidden">123 Innovation Way, Suite 400</div>
          )}
          {(business.email || business.phone) && (
            <div className="from-value text-xs mt-1 break-all">
              {business.email}{business.email && business.phone ? ' • ' : ''}{business.phone}
            </div>
          )}
          {business.taxId && <div className="from-value text-[11px] font-mono">TAX ID: {business.taxId}</div>}
        </div>
        <div className="invoice-meta ml-auto shrink-0 text-right space-y-2">
          <div className="invoice-accent text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase" style={{ color: 'var(--accent)' }}>
            {draft.mode === 'invoice' ? 'INVOICE' : draft.mode === 'quote' ? 'ESTIMATE' : 'RECEIPT'}
          </div>
          <div className="text-[11px] md:text-xs font-mono space-y-1">
            <div className="font-bold">#{draft.number}</div>
            <div>Date: {formatDateLocale(draft.issueDate, 'en-US', 'MMM dd, yyyy')}</div>
            <div>Terms: {paymentTerms}</div>
            <div>Due: {formatDateLocale(draft.dueDate, 'en-US', 'MMM dd, yyyy')}</div>
            {poNumber && <div>PO #: {poNumber}</div>}
          </div>
        </div>
      </div>

      {/* Recipients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
        <div className="border-l-2 pl-3 py-0.5 min-w-0" style={{ borderColor: 'var(--accent)' }}>
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-1">Bill To</div>
          {draft.client.name ? (
            <div className="font-bold text-foreground break-words">{draft.client.name}</div>
          ) : (
            <div className="font-bold text-foreground print:hidden">Client Name</div>
          )}
          {draft.client.address && <div className="text-muted whitespace-pre-line break-words">{draft.client.address}</div>}
          {(draft.client.email || draft.client.phone) && (
            <div className="text-muted mt-1 break-all">
              {draft.client.email}{draft.client.email && draft.client.phone ? ' • ' : ''}{draft.client.phone}
            </div>
          )}
        </div>
        {shipToEnabled && (
          <div className="border-l-2 border-rule pl-3 py-0.5 min-w-0">
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-1">Ship To</div>
            <div className="font-bold text-foreground break-words">{draft.shipToName || 'Recipient Name'}</div>
            <div className="text-muted whitespace-pre-line break-words">{draft.shipToAddress || 'Shipping Address'}</div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-rule">
              <th className="text-left py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted">Description</th>
              <th className="text-center py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted w-12 md:w-16">Qty</th>
              <th className="text-right py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted w-20 md:w-24">Rate</th>
              <th className="text-right py-2.5 px-2 md:px-4 text-[10px] uppercase font-bold tracking-wider text-muted w-24 md:w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {draft.items.length === 0 || draft.items.every(i => !i.desc && i.price === 0) ? (
              <tr>
                <td colSpan={4} className="text-center py-8 italic text-muted">No line items added yet.</td>
              </tr>
            ) : (
              draft.items.map(item => (
                <tr key={item.id} className="border-b border-rule/50">
                  <td className="py-3 px-2 md:px-4">
                    <div className="font-semibold text-foreground break-words">{item.desc || 'Untitled Item'}</div>
                    {item.customFields?.[0]?.value && <div className="text-[11px] text-muted mt-0.5 break-words">{item.customFields[0].value}</div>}
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center text-muted font-mono">{item.qty}</td>
                  <td className="py-3 px-2 md:px-4 text-right text-muted font-mono whitespace-nowrap">{formatMoney(toMinor(item.price, draft.currency), draft.currency)}</td>
                  <td className="py-3 px-2 md:px-4 text-right font-semibold text-foreground font-mono whitespace-nowrap">{formatMoney(Math.round(item.qty * toMinor(item.price, draft.currency)), draft.currency)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="border-t border-rule pt-4 flex flex-col xl:flex-row print:flex-row gap-6 break-inside-avoid totals-block">
        <div className="flex-1 min-w-0 text-xs space-y-2 notes-block">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted">Notes & Terms</div>
          <div className="text-[11px] text-muted whitespace-pre-line leading-relaxed break-words">{draft.notes || 'Thank you for your business!'}</div>
          {signature && (
            <div className="pt-4">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-2">Authorized Signature</div>
              <img src={signature} alt="Signature" className="h-12 max-w-[160px] border-b border-rule pb-2" />
            </div>
          )}
        </div>
        <div className="xl:w-64 print:w-64 text-xs font-mono space-y-2">
          <div className="flex justify-between gap-3"><span className="text-muted">Subtotal:</span><span className="text-foreground">{formatMoney(t.subtotal, draft.currency)}</span></div>
          {t.invoiceDiscount > 0 && (
            <div className="flex justify-between gap-3"><span className="text-muted">Discount:</span><span className="text-foreground">-{formatMoney(t.invoiceDiscount, draft.currency)}</span></div>
          )}
          {t.taxAdded > 0 && (
            <div className="flex justify-between gap-3"><span className="text-muted">Tax:</span><span className="text-foreground">{formatMoney(t.taxAdded, draft.currency)}</span></div>
          )}
          {t.shipping > 0 && (
            <div className="flex justify-between gap-3"><span className="text-muted">Shipping:</span><span className="text-foreground">{formatMoney(t.shipping, draft.currency)}</span></div>
          )}
          <div className="flex justify-between gap-3 border-t border-rule pt-2 font-bold text-sm text-foreground"><span>Total:</span><span>{formatMoney(t.total, draft.currency)}</span></div>
          {t.paid > 0 && (
            <div className="flex justify-between gap-3"><span className="text-muted">Amount Paid:</span><span className="text-foreground">-{formatMoney(t.paid, draft.currency)}</span></div>
          )}
          <div
            className="invoice-accent flex justify-between gap-3 font-bold text-base p-2.5 rounded-lg"
            style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 10%, transparent)', color: 'var(--accent)', border: '1px solid color-mix(in srgb, var(--accent) 20%, transparent)' }}
          >
            <span>Balance Due:</span>
            <span>{formatMoney(Math.max(0, t.balance), draft.currency)}</span>
          </div>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="border-t border-rule pt-4">
          <div className="text-[10px] uppercase font-bold tracking-wider text-muted mb-3">Attached Photos / Receipts</div>
          <div className="flex flex-wrap gap-3">
            {photos.map((photo, idx) => (
              <img key={idx} src={photo} alt={`Attachment ${idx + 1}`} className="w-24 h-24 object-cover border border-rule rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
