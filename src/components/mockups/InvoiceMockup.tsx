/*
 * Responsive via CSS container queries (Tailwind v4). Reacts to its own width:
 *   < 384px  (@sm)  : phone  -> stacked header, single-column bill-to, qty x rate under item
 *   >= 384px (@sm)  : two-column bill-to, right-aligned dates, fixed-width totals
 *   >= 448px (@md)  : Qty / Rate columns, item detail lines
 *   >= 672px (@2xl) : roomy "paper" padding
 */

const items = [
  { desc: 'Brand identity design', detail: 'Complete visual identity system', qty: '1', rate: '$1,800.00', amount: '$1,800.00' },
  { desc: 'Logo variations', detail: 'Primary, secondary, and icon marks', qty: '3', rate: '$150.00', amount: '$450.00' },
  { desc: 'Brand guidelines document', detail: 'Usage specifications and examples', qty: '1', rate: '$150.00', amount: '$150.00' },
];

const th = 'text-[9px] @md:text-[10px] font-semibold text-[#737373] uppercase tracking-[0.15em]';

export default function InvoiceMockup() {
  return (
    <div className="@container w-full min-w-0">
      <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden text-left">
        <div className="p-4 @md:p-6 @2xl:p-10 max-w-[640px] mx-auto">
          {/* Header */}
          <div className="flex flex-col @sm:flex-row @sm:items-start @sm:justify-between gap-4 mb-6 @md:mb-10">
            <div>
              <h3 className="text-[18px] @md:text-[22px] font-semibold text-[#111] tracking-tight">
                Invoice
              </h3>
              <p className="text-[11px] @md:text-[12px] text-[#737373] mt-1 @md:mt-1.5 font-medium">
                INV-2026-001
              </p>
            </div>
            <div className="@sm:text-right min-w-0">
              <p className="text-[13px] @md:text-[14px] font-semibold text-[#111]">Your Studio LLC</p>
              <p className="text-[10px] @md:text-[11px] text-[#737373] mt-1 @md:mt-1.5 leading-[1.6]">
                123 Design Street, Suite 400
                <br />
                San Francisco, CA 94102
                <br />
                hello@yourstudio.com
              </p>
            </div>
          </div>

          {/* Bill to + dates */}
          <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4 @md:gap-6 mb-6 @md:mb-8 pb-6 @md:pb-8 border-b border-[#E5E5E5]">
            <div>
              <p className={`${th} mb-2`}>Bill To</p>
              <p className="text-[12px] @md:text-[13px] font-semibold text-[#111]">Northstar Studio</p>
              <p className="text-[10px] @md:text-[11px] text-[#737373] mt-1 @md:mt-1.5 leading-[1.6]">
                Attn: Sarah Chen
                <br />
                456 Creative Avenue
                <br />
                Portland, OR 97201
              </p>
            </div>
            <div className="flex gap-6 @sm:block @sm:text-right">
              <div className="@sm:mb-3">
                <p className={th}>Issue Date</p>
                <p className="text-[11px] @md:text-[12px] text-[#111] mt-0.5 font-medium">
                  January 15, 2026
                </p>
              </div>
              <div>
                <p className={th}>Due Date</p>
                <p className="text-[11px] @md:text-[12px] text-[#111] mt-0.5 font-medium">
                  February 14, 2026
                </p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="mb-6 @md:mb-8">
            <div className="grid grid-cols-12 gap-2 pb-3 border-b border-[#111]">
              <p className={`col-span-7 @md:col-span-5 ${th}`}>Description</p>
              <p className={`hidden @md:block @md:col-span-2 ${th} text-center`}>Qty</p>
              <p className={`hidden @md:block @md:col-span-2 ${th} text-right`}>Rate</p>
              <p className={`col-span-5 @md:col-span-3 ${th} text-right`}>Amount</p>
            </div>
            {items.map((item) => (
              <div
                key={item.desc}
                className="grid grid-cols-12 gap-2 py-3 @md:py-3.5 border-b border-[#E5E5E5]"
              >
                <div className="col-span-7 @md:col-span-5 min-w-0">
                  <p className="text-[11px] @md:text-[12px] font-medium text-[#111]">{item.desc}</p>
                  <p className="text-[10px] text-[#737373] mt-0.5 hidden @md:block">{item.detail}</p>
                  <p className="text-[10px] text-[#737373] mt-0.5 @md:hidden tabular-nums">
                    {item.qty} × {item.rate}
                  </p>
                </div>
                <p className="hidden @md:block @md:col-span-2 text-[12px] text-[#737373] text-center tabular-nums">
                  {item.qty}
                </p>
                <p className="hidden @md:block @md:col-span-2 text-[12px] text-[#737373] text-right tabular-nums">
                  {item.rate}
                </p>
                <p className="col-span-5 @md:col-span-3 text-[11px] @md:text-[12px] font-medium text-[#111] text-right tabular-nums">
                  {item.amount}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full @sm:w-[220px] space-y-2 @md:space-y-2.5">
              <div className="flex justify-between text-[11px] @md:text-[12px]">
                <span className="text-[#737373]">Subtotal</span>
                <span className="text-[#111] font-medium tabular-nums">$2,400.00</span>
              </div>
              <div className="flex justify-between text-[11px] @md:text-[12px]">
                <span className="text-[#737373]">Tax (0%)</span>
                <span className="text-[#111] font-medium tabular-nums">$0.00</span>
              </div>
              <div className="flex justify-between text-[14px] @md:text-[15px] font-semibold pt-3 border-t border-[#E5E5E5]">
                <span className="text-[#111]">Total Due</span>
                <span className="text-[#111] tabular-nums">$2,400.00</span>
              </div>
            </div>
          </div>

          {/* Payment info + status */}
          <div className="mt-6 @md:mt-10 pt-5 @md:pt-6 border-t border-[#E5E5E5]">
            <div className="flex flex-col @sm:flex-row @sm:items-end justify-between gap-3 @md:gap-4">
              <div>
                <p className={`${th} mb-1.5`}>Payment Method</p>
                <p className="text-[11px] @md:text-[12px] text-[#111]">
                  Bank transfer to Your Studio LLC
                </p>
                <p className="text-[10px] @md:text-[11px] text-[#737373] mt-0.5">
                  Net 30 days from issue date
                </p>
              </div>
              <span className="inline-flex items-center self-start @sm:self-auto px-3 py-1.5 text-[10px] @md:text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                Paid
              </span>
            </div>
            <p className="text-[10px] @md:text-[11px] text-[#737373] mt-5 @md:mt-6 italic">
              Thank you for your business.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}