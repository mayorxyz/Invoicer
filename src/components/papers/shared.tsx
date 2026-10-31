import { formatMoney } from '../../lib/money';

export interface PaperProps {
  draft?: any;
  business?: any;
  totals?: any;
  accent?: string;
  shipToEnabled?: boolean;
  signature?: string;
  photos?: string[];
  paymentTerms?: string;
  poNumber?: string;
}

export function SignaturePhotos({
  signature = '', photos = [], className = '',
}: { signature?: string; photos?: string[]; className?: string }) {
  if (!signature && photos.length === 0) return null;
  return (
    <div className={`space-y-6 ${className}`}>
      {photos.length > 0 && (
        <div>
          <p className="eyebrow mb-2">Attachments</p>
          <div className="flex flex-wrap gap-2">
            {photos.map((p, i) => (
              <img key={i} src={p} alt={`Attachment ${i + 1}`} className="h-24 w-24 object-cover rounded border border-border" />
            ))}
          </div>
        </div>
      )}
      {signature && (
        <div className="w-56">
          <img src={signature} alt="Signature" className="h-14 object-contain" />
          <div className="border-t border-ink mt-1 pt-1 text-xs text-slate">Authorized signature</div>
        </div>
      )}
    </div>
  );
}

export const poOf = (d: any) => d.customFields?.find((f: any) => f.label === 'PO Number')?.value || '';
export const otherFields = (d: any) => (d.customFields || []).filter((f: any) => f.label !== 'PO Number' && f.value);

export function SenderBlock({ b }: { b: any }) {
  return (
    <>
      {b.logo && <img src={b.logo} alt="" className="h-12 mb-3 object-contain" />}
      <h1 className="text-xl font-semibold text-ink">{b.name}</h1>
      <p className="text-sm text-slate whitespace-pre-line">{b.address}</p>
      <p className="text-sm text-slate">{[b.email, b.phone].filter(Boolean).join(' • ')}</p>
      {b.taxId && <p className="text-xs text-slate font-mono">{b.taxIdLabel || 'Tax ID'}: {b.taxId}</p>}
    </>
  );
}

export function MetaBlock({ d, terms, po }: { d: any; terms: string; po: string }) {
  const rows = [
    ['Date', d.issueDate],
    d.mode !== 'receipt' && ['Terms', terms],
    d.mode !== 'receipt' && ['Due', d.dueDate],
    po && ['PO #', po],
    ...otherFields(d).map((f: any) => [f.label, f.value]),
  ].filter(Boolean) as string[][];
  return <div className="text-sm tabular text-slate space-y-0.5">{rows.map(([k, v]) => <p key={k}>{k}: {v}</p>)}</div>;
}

export function PartiesBlock({ d, shipTo }: { d: any; shipTo: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div data-pdf-break>
        <p className="eyebrow mb-1">Bill to</p>
        <p className="font-semibold text-ink">{d.client.name || '—'}</p>
        <p className="text-sm text-slate whitespace-pre-line">{d.client.address}</p>
        <p className="text-sm text-slate">{[d.client.email, d.client.phone].filter(Boolean).join(' • ')}</p>
      </div>
      {shipTo && (
        <div data-pdf-break>
          <p className="eyebrow mb-1">Ship to</p>
          <p className="font-semibold text-ink">{d.shipToName}</p>
          <p className="text-sm text-slate whitespace-pre-line">{d.shipToAddress}</p>
        </div>
      )}
    </div>
  );
}

export function ItemDesc({ item }: { item: any }) {
  const detail = item.customFields?.[0]?.value;
  return (
    <>
      <div>{item.desc || '—'}</div>
      {detail && <div className="text-xs text-slate whitespace-pre-line">{detail}</div>}
    </>
  );
}

export function TotalsRows({ d, t, accent }: any) {
  const cur = d.currency, m = (n: number) => formatMoney(n, cur);
  const row = (k: string, v: string, cls = '') => (
    <div className={`flex justify-between text-sm ${cls}`}><span className="text-slate">{k}</span><span className="tabular">{v}</span></div>
  );
  return (
    <div className="space-y-2">
      {row('Subtotal', m(t.subtotal))}
      {t.invoiceDiscount > 0 && row('Discount', `-${m(t.invoiceDiscount)}`)}
      {t.taxAdded > 0 && row('Tax', m(t.taxAdded))}
      {d.shipping > 0 && row('Shipping', m(Math.round(d.shipping * 100)))}
      <div className="flex justify-between text-sm pt-2 border-t border-border font-semibold"><span>Total</span><span className="tabular">{m(t.total)}</span></div>
      {t.paid > 0 && row('Paid', `-${m(t.paid)}`)}
      <div className="flex justify-between text-lg pt-2 border-t-2 font-semibold" style={{ borderColor: accent }}>
        <span>{d.mode === 'receipt' ? 'Paid in full' : 'Balance due'}</span>
        <span className="tabular" style={{ color: accent }}>{m(Math.max(0, t.balance))}</span>
      </div>
    </div>
  );
}

export function FooterBlock({ d, signature, photos }: { d: any; signature: string; photos: string[] }) {
  return (
    <div data-pdf-bottom data-pdf-break className="space-y-6">
      {d.notes && <div><p className="eyebrow mb-1">Notes</p><p className="text-sm text-slate whitespace-pre-line">{d.notes}</p></div>}
      {!!photos.length && (
        <div className="flex flex-wrap gap-2">
          {photos.map((p, i) => <img key={i} src={p} alt="" className="h-24 w-24 object-cover rounded" />)}
        </div>
      )}
      {signature && (
        <div className="w-56">
          <img src={signature} alt="" className="h-14 object-contain" />
          <div className="border-t border-ink mt-1 pt-1 text-xs text-slate">Authorized signature</div>
        </div>
      )}
    </div>
  );
}