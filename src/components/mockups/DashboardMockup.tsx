import { LayoutDashboard, FileText, Users, Settings, Bell } from 'lucide-react';

/*
 * Responsive via CSS container queries (Tailwind v4). Reacts to its own width:
 *   < 448px  (@md)  : phone  -> stacked invoice rows, month pill hidden, compact cards
 *   >= 448px (@md)  : table header + 12-column rows
 *   >= 672px (@2xl) : sidebar appears
 */

const invoices = [
  { id: 'INV-2026-001', client: 'Northstar Studio', amount: '$2,400.00', status: 'Paid', date: 'Jan 15, 2026' },
  { id: 'INV-2026-002', client: 'Fieldwork Creative', amount: '$1,850.00', status: 'Pending', date: 'Jan 12, 2026' },
  { id: 'INV-2026-003', client: 'Form & Function', amount: '$3,200.00', status: 'Draft', date: 'Jan 10, 2026' },
  { id: 'INV-2026-004', client: 'Meridian Labs', amount: '$950.00', status: 'Paid', date: 'Jan 8, 2026' },
];

const cards = [
  { label: 'Total Revenue', value: '$8,400.00', sub: 'This month', trend: '+12%' },
  { label: 'Outstanding', value: '$1,850.00', sub: '1 invoice', trend: null },
  { label: 'Drafts', value: '1', sub: 'Ready to send', trend: null },
];

const nav = [
  { icon: LayoutDashboard, label: 'Dashboard', active: true },
  { icon: FileText, label: 'Invoices', active: false },
  { icon: Users, label: 'Clients', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
    Draft: 'bg-gray-50 text-gray-600 border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center px-2 @md:px-2.5 py-0.5 text-[10px] @md:text-[11px] font-medium border rounded-full whitespace-nowrap ${
        colors[status] || colors.Draft
      }`}
    >
      {status}
    </span>
  );
}

export default function DashboardMockup() {
  return (
    <div className="@container w-full min-w-0">
      <div className="bg-white rounded-lg border border-[#E5E5E5] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden text-left">
        <div className="flex">
          {/* Sidebar */}
          <div className="hidden @2xl:flex flex-col w-[180px] shrink-0 border-r border-[#E5E5E5] bg-[#FAFAFA] p-4">
            <div className="flex items-center gap-2.5 mb-8 px-2">
              <div className="w-7 h-7 bg-[#111] rounded-md flex items-center justify-center shrink-0">
                <span className="text-[11px] font-bold text-white">I</span>
              </div>
              <span className="text-[13px] font-semibold text-[#111]">Invoicer</span>
            </div>
            <nav className="space-y-0.5">
              {nav.map((item) => (
                <div
                  key={item.label}
                  className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[12px] font-medium transition-colors ${
                    item.active
                      ? 'bg-[#111] text-white'
                      : 'text-[#737373] hover:text-[#111] hover:bg-[#F0F0F0]'
                  }`}
                >
                  <item.icon size={14} strokeWidth={item.active ? 2 : 1.5} />
                  {item.label}
                </div>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 px-2">
                <div className="w-6 h-6 rounded-full bg-[#E5E5E5] shrink-0" />
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#111] truncate">Your Studio</p>
                  <p className="text-[10px] text-[#737373]">Pro plan</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 px-3 @md:px-6 py-3 @md:py-3.5 border-b border-[#E5E5E5]">
              <div className="min-w-0">
                <h3 className="text-[13px] @md:text-[14px] font-semibold text-[#111]">Dashboard</h3>
                <p className="text-[10px] @md:text-[11px] text-[#737373] mt-0.5 truncate">
                  Overview of your invoicing activity
                </p>
              </div>
              <div className="flex items-center gap-2.5 @md:gap-3 shrink-0">
                <div className="hidden @md:flex items-center px-3 py-1.5 border border-[#E5E5E5] rounded-md">
                  <span className="text-[11px] text-[#737373]">Jan 2026</span>
                </div>
                <Bell size={15} className="text-[#737373]" />
                <div className="w-7 h-7 rounded-full bg-[#E5E5E5]" />
              </div>
            </div>

            {/* Summary cards */}
            <div className="px-3 @md:px-6 py-4 @md:py-5 grid grid-cols-2 @lg:grid-cols-3 gap-2.5 @md:gap-4">
              {cards.map((card, i) => (
                <div
                  key={card.label}
                  className={`min-w-0 p-3 @md:p-4 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] ${
                    i === 0 ? 'col-span-2 @lg:col-span-1' : ''
                  }`}
                >
                  <p className="text-[10px] @md:text-[11px] text-[#737373] font-medium uppercase tracking-wider truncate">
                    {card.label}
                  </p>
                  <div className="flex flex-wrap items-baseline gap-x-2 mt-1.5">
                    <p className="text-[17px] @md:text-[22px] font-semibold text-[#111] tabular-nums">
                      {card.value}
                    </p>
                    {card.trend && (
                      <span className="text-[11px] font-medium text-emerald-600">{card.trend}</span>
                    )}
                  </div>
                  <p className="text-[10px] @md:text-[11px] text-[#737373] mt-1">{card.sub}</p>
                </div>
              ))}
            </div>

            {/* Invoice table */}
            <div className="px-3 @md:px-6 pb-4 @md:pb-5">
              <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
                <div className="px-3 @md:px-4 py-3 bg-[#FAFAFA] border-b border-[#E5E5E5] flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-[#737373] uppercase tracking-wider">
                    Recent Invoices
                  </p>
                  <span className="text-[11px] text-[#737373]">4 total</span>
                </div>

                <div className="hidden @md:grid grid-cols-12 gap-2 px-4 py-2 bg-[#FAFAFA]/50 border-b border-[#E5E5E5]">
                  <p className="col-span-5 text-[10px] font-semibold text-[#737373] uppercase tracking-wider">Client</p>
                  <p className="col-span-3 text-[10px] font-semibold text-[#737373] uppercase tracking-wider">Invoice</p>
                  <p className="col-span-2 text-[10px] font-semibold text-[#737373] uppercase tracking-wider text-right">Amount</p>
                  <p className="col-span-2 text-[10px] font-semibold text-[#737373] uppercase tracking-wider text-right">Status</p>
                </div>

                <div className="divide-y divide-[#E5E5E5]">
                  {invoices.map((inv) => (
                    <div key={inv.id}>
                      {/* Phone: stacked */}
                      <div className="@md:hidden flex items-center justify-between gap-3 px-3 py-3">
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-[#111] truncate">{inv.client}</p>
                          <p className="text-[11px] text-[#737373] truncate">
                            {inv.id} · {inv.date}
                          </p>
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className="text-[12px] font-medium text-[#111] tabular-nums">
                            {inv.amount}
                          </span>
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>

                      {/* Tablet+: columns */}
                      <div className="hidden @md:grid grid-cols-12 gap-2 px-4 py-3 items-center">
                        <p className="col-span-5 text-[13px] font-medium text-[#111] truncate">{inv.client}</p>
                        <p className="col-span-3 text-[12px] text-[#737373] tabular-nums truncate">{inv.id}</p>
                        <p className="col-span-2 text-[13px] font-medium text-[#111] text-right tabular-nums">
                          {inv.amount}
                        </p>
                        <div className="col-span-2 flex justify-end">
                          <StatusBadge status={inv.status} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}