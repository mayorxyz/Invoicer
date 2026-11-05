import {
  FileText,
  Clock,
  Users,
  Package,
  BarChart3,
  Receipt,
  Timer,
  Settings,
  Download,
  Sun,
  Plus,
  Search,
  ChevronDown,
  DollarSign,
  Check,
  Clock3,
  AlertTriangle,
} from 'lucide-react';

/*
 * Responsive via CSS container queries (Tailwind v4). Reacts to its own width:
 *   < 448px  (@md)   : phone  -> compact bar, 2x2 stats, search + filters stacked, card rows
 *   >= 448px (@md)   : table header + columns (Issued hidden)
 *   >= 672px (@2xl)  : icon sidebar + Issued column
 *   >= 768px (@3xl)  : stats in a single row of 4
 */

const sidebarIcons = [FileText, FileText, Clock, Users, Package, BarChart3, Receipt, Timer];

const stats = [
  { label: 'Invoiced', value: '$0.00', icon: DollarSign, color: 'text-[#111]', iconColor: '' },
  { label: 'Paid', value: '$0.00', icon: Check, color: 'text-emerald-600', iconColor: 'text-emerald-600' },
  { label: 'Outstanding', value: '$0.00', icon: Clock3, color: 'text-amber-500', iconColor: 'text-amber-500' },
  { label: 'Overdue', value: '$0.00', icon: AlertTriangle, color: 'text-rose-500', iconColor: 'text-rose-500' },
];

const doc = {
  number: 'INV-0001',
  client: '—',
  issued: 'Nov 5, 2026',
  due: 'Nov 19, 2026',
  total: '$0.00',
  status: 'Draft',
};

const cols =
  '@md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_auto_auto] @2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto]';

export default function DocumentsMockup() {
  return (
    <div className="@container w-full min-w-0">
      <div className="bg-[#FAFAFA] border border-[#E5E5E5] rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] text-[#111] text-left">
        {/* Top bar */}
        <div className="h-12 @md:h-14 bg-white border-b border-[#E5E5E5] px-3 @md:px-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 shrink-0 bg-[#FF5A1F] text-white rounded-md flex items-center justify-center font-bold text-[12px]">
              ↗
            </div>
            <span className="font-semibold text-[14px] @md:text-[15px] tracking-tight truncate">
              Invoicer
            </span>
          </div>
          <div className="flex items-center gap-2 @md:gap-3 shrink-0">
            <button
              aria-label="Toggle theme"
              className="w-8 h-8 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] hover:text-[#111] bg-white transition-colors"
            >
              <Sun size={15} />
            </button>
            <div className="flex items-center gap-1.5 bg-[#111] text-white px-3 @md:px-3.5 py-1.5 rounded-lg text-[12px] @md:text-[13px] font-medium">
              <span className="@sm:hidden">New</span>
              <span className="hidden @sm:inline">New invoice</span>
              <Plus size={14} />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Icon sidebar */}
          <div className="hidden @2xl:flex w-14 bg-white border-r border-[#E5E5E5] flex-col items-center py-4 gap-3 shrink-0">
            {sidebarIcons.map((Icon, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  i === 1
                    ? 'bg-[#F7F5F0] text-[#111] border border-[#E5E5E5]'
                    : 'text-[#737373] hover:text-[#111]'
                }`}
              >
                <Icon size={16} />
              </div>
            ))}
            <div className="mt-auto w-9 h-9 rounded-lg text-[#737373] flex items-center justify-center">
              <Settings size={16} />
            </div>
            <div className="w-9 h-9 rounded-lg text-[#737373] flex items-center justify-center">
              <Download size={16} />
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0 p-3 @md:p-6 @3xl:p-8 space-y-4 @md:space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[18px] @md:text-[22px] font-bold tracking-tight">Documents</h1>
                <p className="text-[11px] @md:text-[12px] text-[#737373] mt-0.5">1 total</p>
              </div>
              <button className="shrink-0 flex items-center gap-1.5 @md:gap-2 bg-[#111] text-white px-3 @md:px-4 py-2 rounded-lg text-[12px] @md:text-[13px] font-medium hover:bg-[#333]">
                <Plus size={15} />
                <span className="@sm:hidden">New</span>
                <span className="hidden @sm:inline">New Document</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 @3xl:grid-cols-4 gap-2.5 @md:gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="min-w-0 bg-white border border-[#E5E5E5] rounded-xl p-3 @md:p-4"
                >
                  <div className="flex items-center justify-between gap-2 text-[#737373] mb-1.5 @md:mb-2">
                    <span className="text-[10px] @md:text-[11px] font-semibold uppercase tracking-wider truncate">
                      {s.label}
                    </span>
                    <s.icon size={14} className={`shrink-0 ${s.iconColor}`} />
                  </div>
                  <p className={`text-[16px] @md:text-[20px] font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Search + filters */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-2.5 @md:p-3 flex flex-col @lg:flex-row @lg:items-center gap-2.5 @md:gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-1.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
                <Search size={15} className="text-[#737373] shrink-0" />
                <input
                  type="text"
                  placeholder="Search by number or client..."
                  className="min-w-0 w-full bg-transparent text-[12px] @md:text-[13px] placeholder:text-[#737373] focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 @lg:flex gap-2">
                {['All Status', 'All Types'].map((l) => (
                  <div
                    key={l}
                    className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[12px] @md:text-[13px] font-medium whitespace-nowrap"
                  >
                    <span>{l}</span>
                    <ChevronDown size={14} className="text-[#737373]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
              {/* Header */}
              <div
                className={`hidden @md:grid ${cols} gap-x-4 px-6 py-3 border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]`}
              >
                <span>Number</span>
                <span>Client</span>
                <span className="hidden @2xl:block">Issued</span>
                <span>Due</span>
                <span className="text-right">Total</span>
                <span className="text-center">Status</span>
              </div>

              {/* Phone: card */}
              <div className="@md:hidden px-3 py-3 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-medium">{doc.number}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#111] text-white">
                    {doc.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[12px] text-[#737373]">
                  <span>Client: {doc.client}</span>
                  <span className="font-mono font-medium text-[#111]">{doc.total}</span>
                </div>
                <p className="text-[11px] text-[#737373]">
                  Issued {doc.issued} · Due {doc.due}
                </p>
              </div>

              {/* Tablet+: row */}
              <div
                className={`hidden @md:grid ${cols} gap-x-4 px-6 py-4 items-center text-[13px] font-medium`}
              >
                <span className="font-mono text-xs truncate">{doc.number}</span>
                <span className="text-[#737373] truncate">{doc.client}</span>
                <span className="hidden @2xl:block text-[#737373] text-xs">{doc.issued}</span>
                <span className="text-[#737373] text-xs">{doc.due}</span>
                <span className="text-right font-mono text-xs">{doc.total}</span>
                <div className="flex justify-center">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#111] text-white">
                    {doc.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}