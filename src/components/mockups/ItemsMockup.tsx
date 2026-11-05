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
  ChevronLeft,
  ChevronDown,
  Pencil,
  Trash2,
} from 'lucide-react';

/*
 * Responsive via CSS container queries (Tailwind v4). Reacts to its own width:
 *   < 448px  (@md)   : phone  -> compact bar, stacked toolbar, card rows
 *   >= 448px (@md)   : table with Name / Price / Actions (SKU + category under the name)
 *   >= 576px (@xl)   : SKU and Category columns
 *   >= 672px (@2xl)  : icon rail sidebar
 *   >= 768px (@3xl)  : Unit column
 *   >= 896px (@4xl)  : full labelled sidebar
 */

const mockItems = [
  { name: 'Brand Identity Design', sku: 'INV-BI-01', category: 'Design', unit: 'service', price: '$1,800.00' },
  { name: 'Logo Variations Pack', sku: 'INV-LG-02', category: 'Design', unit: 'service', price: '$450.00' },
  { name: 'Brand Guidelines Document', sku: 'INV-BG-03', category: 'Documentation', unit: 'service', price: '$150.00' },
];

const nav = [
  { label: 'Editor', icon: FileText },
  { label: 'Documents', icon: FileText, badge: '1' },
  { label: 'History', icon: Clock },
  { label: 'Clients', icon: Users },
  { label: 'Items', icon: Package, active: true },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Expenses', icon: Receipt },
  { label: 'Time', icon: Timer },
  { label: 'Settings', icon: Settings },
];

const rowGrid =
  '@md:grid-cols-[minmax(0,1fr)_auto_auto] @xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_auto_auto] @3xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.6fr)_auto_auto]';

export default function ItemsMockup() {
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
          {/* Icon rail */}
          <div className="hidden @2xl:flex @4xl:hidden w-14 bg-white border-r border-[#E5E5E5] flex-col items-center py-4 gap-3 shrink-0">
            {nav.map(({ label, icon: Icon, active }) => (
              <div
                key={label}
                title={label}
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  active
                    ? 'bg-[#F7F5F0] text-[#111] border border-[#E5E5E5]'
                    : 'text-[#737373] hover:text-[#111]'
                }`}
              >
                <Icon size={16} />
              </div>
            ))}
          </div>

          {/* Full sidebar */}
          <div className="hidden @4xl:flex w-56 bg-white border-r border-[#E5E5E5] flex-col justify-between py-4 px-3 shrink-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#737373]">
                  Workspace
                </span>
                <ChevronLeft size={14} className="text-[#737373]" />
              </div>
              <nav className="space-y-1 text-[13px] font-medium">
                {nav.map(({ label, icon: Icon, badge, active }) => (
                  <div
                    key={label}
                    className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg ${
                      active
                        ? 'bg-[#F7F7F5] text-[#111] font-semibold border border-[#E5E5E5]'
                        : 'text-[#737373] hover:bg-[#F7F7F5] hover:text-[#111] transition-colors'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={16} /> {label}
                    </span>
                    {badge && (
                      <span className="text-[11px] bg-[#E5E5E5] px-1.5 py-0.5 rounded text-[#111]">
                        {badge}
                      </span>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            <div className="space-y-4 pt-4 border-t border-[#E5E5E5]">
              <div className="p-3 bg-[#F7F7F5] rounded-xl border border-[#E5E5E5] space-y-2">
                <div className="flex items-center gap-2 text-[#737373]">
                  <Download size={14} />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#111]">
                    Data backup
                  </span>
                </div>
                <p className="text-[11px] text-[#737373]">Keep your data safe locally.</p>
                <button className="w-full py-1.5 bg-white border border-[#E5E5E5] rounded-md text-[11px] font-medium hover:bg-[#FAFAFA] flex items-center justify-center gap-1.5">
                  <Download size={12} /> Download backup
                </button>
              </div>
              <div className="flex items-center gap-2 px-1">
                <div className="w-6 h-6 shrink-0 rounded-full bg-[#111] text-white flex items-center justify-center font-bold text-[10px]">
                  Y
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold truncate">Your Business</p>
                  <p className="text-[10px] text-[#737373] truncate">billing@acme.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="flex-1 min-w-0 p-3 @md:p-6 @3xl:p-8 space-y-4 @md:space-y-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="text-[18px] @md:text-[22px] font-bold tracking-tight">Items</h1>
                <p className="text-[11px] @md:text-[12px] text-[#737373] mt-0.5 truncate">
                  3 total items in inventory
                </p>
              </div>
              <button className="shrink-0 flex items-center gap-1.5 @md:gap-2 bg-[#111] text-white px-3 @md:px-4 py-2 rounded-lg text-[12px] @md:text-[13px] font-medium hover:bg-[#333]">
                <Plus size={15} />
                <span className="@sm:hidden">Add</span>
                <span className="hidden @sm:inline">Add Item</span>
              </button>
            </div>

            {/* Toolbar */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl p-2.5 @md:p-3 flex flex-col @lg:flex-row @lg:items-center gap-2.5 @md:gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0 px-3 py-1.5 bg-[#FAFAFA] border border-[#E5E5E5] rounded-lg">
                <Search size={15} className="text-[#737373] shrink-0" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  className="min-w-0 w-full bg-transparent text-[12px] @md:text-[13px] placeholder:text-[#737373] focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-lg text-[12px] @md:text-[13px] font-medium whitespace-nowrap">
                <span>All Categories</span>
                <ChevronDown size={14} className="text-[#737373]" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-[#E5E5E5] rounded-xl overflow-hidden">
              <div
                className={`hidden @md:grid ${rowGrid} gap-x-4 px-6 py-3 border-b border-[#E5E5E5] text-[10px] font-bold uppercase tracking-wider text-[#737373]`}
              >
                <span>Name</span>
                <span className="hidden @xl:block">SKU</span>
                <span className="hidden @xl:block">Category</span>
                <span className="hidden @3xl:block">Unit</span>
                <span className="text-right">Price</span>
                <span className="text-center">Actions</span>
              </div>

              <div className="divide-y divide-[#E5E5E5]">
                {mockItems.map((item) => (
                  <div key={item.sku}>
                    {/* Phone: card */}
                    <div className="@md:hidden flex items-center justify-between gap-3 px-3 py-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold truncate">{item.name}</p>
                        <p className="text-[11px] text-[#737373] truncate">
                          <span className="font-mono">{item.sku}</span> · {item.category}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className="font-mono text-[12px] font-semibold">{item.price}</span>
                        <button aria-label="Delete item" className="p-1 text-[#737373] hover:text-rose-600">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Tablet+: row */}
                    <div
                      className={`hidden @md:grid ${rowGrid} gap-x-4 px-6 py-4 items-center text-[13px] font-medium hover:bg-[#FAFAFA] transition-colors`}
                    >
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{item.name}</p>
                        <p className="@xl:hidden text-[11px] text-[#737373] font-normal truncate">
                          <span className="font-mono">{item.sku}</span> · {item.category}
                        </p>
                      </div>
                      <span className="hidden @xl:block text-[#737373] text-xs font-mono truncate">
                        {item.sku}
                      </span>
                      <span className="hidden @xl:block text-[#737373] text-xs truncate">
                        {item.category}
                      </span>
                      <span className="hidden @3xl:block text-[#737373] text-xs capitalize">
                        {item.unit}
                      </span>
                      <span className="text-right font-mono text-xs font-semibold whitespace-nowrap">
                        {item.price}
                      </span>
                      <div className="flex items-center justify-center gap-2 text-[#737373]">
                        <button aria-label="Edit item" className="hover:text-[#111] p-1">
                          <Pencil size={13} />
                        </button>
                        <button aria-label="Delete item" className="hover:text-rose-600 p-1">
                          <Trash2 size={13} />
                        </button>
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
  );
}