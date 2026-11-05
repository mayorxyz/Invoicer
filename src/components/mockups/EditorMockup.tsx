import { useState } from 'react';
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
  Printer,
  Save,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Upload,
  Pencil,
  Eye,
} from 'lucide-react';

/*
 * Responsive via CSS container queries (Tailwind v4: @container, @md:, @3xl: ...).
 * The mockup reacts to ITS OWN width, not the viewport, so it fits any card or column.
 *
 *   < 448px  (@md)   : phone    -> Edit / Preview toggle, no sidebar, compact toolbar
 *   448-767px        : tablet   -> Edit / Preview toggle, template selector shown
 *   >= 672px (@2xl)  : icon sidebar appears
 *   >= 768px (@3xl)  : form + live preview side by side, font/size selectors shown
 */

const sidebarIcons = [FileText, Clock, Users, Package, BarChart3, Receipt, Timer];

const inputCls =
  'w-full min-w-0 bg-[#FAFAFA] border border-[#E5E5E5] rounded px-2.5 py-1.5 @md:px-3 @md:py-2 text-[12px] @md:text-[13px] text-[#111] focus:outline-none focus:border-[#111]';
const labelCls = 'block text-[10px] @md:text-[11px] font-semibold text-[#737373] uppercase mb-1';
const selectCls =
  'bg-[#FAFAFA] border border-[#E5E5E5] rounded px-1.5 py-1 text-[11px] @md:text-[12px] text-[#111] font-medium outline-none max-w-[120px] @xl:max-w-none';

export default function EditorMockup() {
  const [activeTab, setActiveTab] = useState<'invoice' | 'estimate' | 'receipt'>('invoice');
  const [zoom, setZoom] = useState(73);
  const [view, setView] = useState<'edit' | 'preview'>('edit');

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
          {/* Icon sidebar: only when there is room */}
          <div className="hidden @2xl:flex w-14 bg-white border-r border-[#E5E5E5] flex-col items-center py-4 gap-3 shrink-0">
            {sidebarIcons.map((Icon, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                  i === 0
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

          {/* Workspace */}
          <div className="flex-1 min-w-0 flex flex-col bg-[#F7F7F5]">
            {/* Toolbar */}
            <div className="bg-white border-b border-[#E5E5E5] px-3 @md:px-4 py-2 @md:py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <button className="px-2 py-1 text-[11px] @md:text-[12px] font-medium border border-[#E5E5E5] rounded bg-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#111]" /> Accent
                </button>
                <div className="hidden @md:block h-4 w-px bg-[#E5E5E5]" />
                <label className="hidden @md:flex items-center gap-1 text-[12px]">
                  <span className="text-[#737373]">TEMPLATE</span>
                  <select className={selectCls} defaultValue="Default">
                    <option>Default</option>
                    <option>Minimal</option>
                    <option>Corporate</option>
                  </select>
                </label>
                <label className="hidden @3xl:flex items-center gap-1 text-[12px]">
                  <span className="text-[#737373]">FONT</span>
                  <select className={selectCls} defaultValue="Template default">
                    <option>Template default</option>
                    <option>Inter</option>
                    <option>Plus Jakarta Sans</option>
                  </select>
                </label>
                <label className="hidden @3xl:flex items-center gap-1 text-[12px]">
                  <span className="text-[#737373]">SIZE</span>
                  <select className={selectCls} defaultValue="10.5 pt">
                    <option>10.5 pt</option>
                    <option>11 pt</option>
                    <option>12 pt</option>
                  </select>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button className="hidden @sm:inline-block px-2.5 py-1 text-[11px] @md:text-[12px] font-medium bg-white border border-[#E5E5E5] rounded hover:bg-[#FAFAFA]">
                  Sample
                </button>
                <button className="px-2.5 py-1 text-[11px] @md:text-[12px] font-medium text-red-600 bg-white border border-[#E5E5E5] rounded hover:bg-red-50">
                  Clear
                </button>
              </div>
            </div>

            {/* Edit / Preview switch (hidden once both fit side by side) */}
            <div className="@3xl:hidden px-3 @md:px-4 pt-3">
              <div className="grid grid-cols-2 p-1 bg-white border border-[#E5E5E5] rounded-lg">
                {(
                  [
                    { id: 'edit', label: 'Edit', icon: Pencil },
                    { id: 'preview', label: 'Preview', icon: Eye },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setView(t.id)}
                    className={`inline-flex items-center justify-center gap-1.5 py-1.5 text-[12px] font-medium rounded-md transition-colors ${
                      view === t.id ? 'bg-[#111] text-white' : 'text-[#737373]'
                    }`}
                  >
                    <t.icon size={13} />
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form + preview */}
            <div className="p-3 @md:p-4 @3xl:p-6 grid grid-cols-1 @3xl:grid-cols-2 gap-4 @3xl:gap-6 min-w-0">
              {/* Form */}
              <div
                className={`${view === 'edit' ? 'block' : 'hidden'} @3xl:block space-y-3 @md:space-y-4 min-w-0`}
              >
                <div className="bg-white border border-[#E5E5E5] rounded-lg p-3 @md:p-3.5">
                  <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <span className={labelCls}>Type</span>
                      <div className="flex bg-[#F7F7F5] p-1 rounded-md border border-[#E5E5E5]">
                        {(
                          [
                            ['invoice', 'Invoice'],
                            ['estimate', 'Estimate'],
                            ['receipt', 'Receipt'],
                          ] as const
                        ).map(([id, label]) => (
                          <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={`flex-1 min-w-0 py-1 px-1.5 text-[11px] @md:text-[12px] font-medium rounded truncate ${
                              activeTab === id ? 'bg-white text-[#111] shadow-xs' : 'text-[#737373]'
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="min-w-0">
                      <span className={labelCls}>Currency</span>
                      <div className="flex items-center justify-between gap-2 bg-white border border-[#E5E5E5] rounded-md px-3 py-1.5 text-[12px] @md:text-[13px] font-medium">
                        <span className="truncate">$ USD – US Dollar</span>
                        <ChevronRight size={14} className="rotate-90 text-[#737373] shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-[#E5E5E5] rounded-lg p-3 @md:p-4 space-y-3 @md:space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#E5E5E5]">
                    <span className="w-5 h-5 rounded-full bg-[#E5E5E5] text-[11px] font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-[12px] @md:text-[13px] font-bold uppercase tracking-wide">
                      Sender (From)
                    </span>
                  </div>

                  <div className="flex items-center gap-3 @md:gap-4 p-3 border border-dashed border-[#E5E5E5] rounded-lg bg-[#FAFAFA]">
                    <div className="w-10 h-10 @md:w-12 @md:h-12 shrink-0 bg-white border border-[#E5E5E5] rounded flex items-center justify-center text-[#737373]">
                      <Upload size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12px] @md:text-[13px] font-medium">Company Logo</p>
                      <p className="text-[10px] @md:text-[11px] text-[#737373]">
                        PNG, JPG or SVG, max 2MB
                      </p>
                      <button className="mt-1.5 px-3 py-1 bg-[#111] text-white text-[11px] font-medium rounded hover:bg-[#333]">
                        Choose File
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>Business / Sender Name *</label>
                    <input type="text" defaultValue="Acme Corporation" className={inputCls} />
                  </div>

                  <div className="grid grid-cols-1 @sm:grid-cols-2 gap-3">
                    <div className="min-w-0">
                      <label className={labelCls}>Email</label>
                      <input type="text" defaultValue="billing@acme.com" className={inputCls} />
                    </div>
                    <div className="min-w-0">
                      <label className={labelCls}>Phone</label>
                      <input type="text" defaultValue="+1 (555) 000-0000" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div
                className={`${view === 'preview' ? 'flex' : 'hidden'} @3xl:flex flex-col items-center min-w-0`}
              >
                <div className="hidden @md:flex items-center gap-3 bg-white border border-[#E5E5E5] rounded-full px-4 py-1.5 mb-3 @md:mb-4 text-[12px] text-[#737373]">
                  <button
                    aria-label="Zoom out"
                    onClick={() => setZoom(Math.max(50, zoom - 5))}
                    className="hover:text-[#111]"
                  >
                    <ZoomOut size={14} />
                  </button>
                  <span className="font-medium text-[#111] tabular-nums">{zoom}%</span>
                  <button
                    aria-label="Zoom in"
                    onClick={() => setZoom(Math.min(120, zoom + 5))}
                    className="hover:text-[#111]"
                  >
                    <ZoomIn size={14} />
                  </button>
                  <div className="h-3 w-px bg-[#E5E5E5]" />
                  <button aria-label="Previous page" className="hover:text-[#111]">
                    <ChevronLeft size={14} />
                  </button>
                  <span className="font-medium text-[#111]">1/1</span>
                  <button aria-label="Next page" className="hover:text-[#111]">
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Document */}
                <div className="w-full bg-white border border-[#E5E5E5] rounded-xl shadow-md p-4 @md:p-6 @3xl:p-8 text-[10px] @md:text-[11px] space-y-4 @md:space-y-6">
                  <div className="flex flex-wrap justify-between items-start gap-3">
                    <div className="min-w-0">
                      <p className="text-[9px] @md:text-[10px] text-[#737373] italic">
                        [Company Logo]
                      </p>
                      <h3 className="font-bold text-[12px] @md:text-[14px] mt-1">
                        Acme Corporation
                      </h3>
                      <p className="text-[#737373] leading-relaxed mt-0.5">
                        123 Innovation Way, Suite 400
                      </p>
                    </div>
                    <div className="text-right ml-auto">
                      <h2 className="text-[15px] @md:text-[18px] font-extrabold tracking-tight">
                        INVOICE
                      </h2>
                      <p className="text-[9px] @md:text-[10px] text-[#737373] font-mono mt-0.5">
                        #INV-0001
                      </p>
                      <p className="text-[9px] @md:text-[10px] text-[#737373] mt-2">
                        Date: Nov 05, 2026
                      </p>
                      <p className="text-[9px] @md:text-[10px] text-[#737373]">Terms: Custom</p>
                      <p className="text-[9px] @md:text-[10px] text-[#737373]">Due: Nov 19, 2026</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] font-bold text-[#737373] uppercase tracking-wider mb-1">
                      Bill To
                    </p>
                    <p className="font-bold text-[11px] @md:text-[12px]">Client Name</p>
                  </div>

                  <div className="border-t border-b border-[#111] py-2">
                    <div className="grid grid-cols-12 gap-1 text-[8px] @md:text-[9px] font-bold text-[#737373] uppercase">
                      <span className="col-span-6">Description</span>
                      <span className="col-span-2 text-center">Qty</span>
                      <span className="col-span-2 text-right">Rate</span>
                      <span className="col-span-2 text-right">Amount</span>
                    </div>
                  </div>
                  <div className="text-center py-3 @md:py-6 text-[#737373] italic">
                    No line items added yet.
                  </div>

                  <div className="pt-3 @md:pt-4 border-t border-[#E5E5E5] flex justify-end">
                    <div className="w-full max-w-[180px] space-y-1.5">
                      <div className="flex justify-between text-[#737373]">
                        <span>Subtotal</span>
                        <span className="text-[#111] font-medium">$0.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-[12px] @md:text-[13px] pt-2 border-t border-[#E5E5E5]">
                        <span>Total Due</span>
                        <span>$0.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action bar */}
            <div className="bg-white border-t border-[#E5E5E5] px-3 @md:px-6 py-2.5 @md:py-3 flex items-center justify-between gap-3 mt-auto">
              <div>
                <p className="text-[9px] @md:text-[10px] uppercase font-bold text-[#737373]">
                  Total
                </p>
                <p className="text-[14px] @md:text-[15px] font-extrabold">$0.00</p>
              </div>
              <div className="flex items-center gap-1.5 @md:gap-2">
                <button
                  aria-label="Print"
                  className="inline-flex items-center gap-1.5 px-2.5 @sm:px-3.5 py-2 text-[12px] font-medium bg-white border border-[#E5E5E5] rounded-md hover:bg-[#FAFAFA]"
                >
                  <Printer size={14} />
                  <span className="hidden @sm:inline">Print</span>
                </button>
                <button
                  aria-label="Download PDF"
                  className="inline-flex items-center gap-1.5 px-2.5 @sm:px-3.5 py-2 text-[12px] font-medium bg-white border border-[#E5E5E5] rounded-md hover:bg-[#FAFAFA]"
                >
                  <Download size={14} />
                  <span className="hidden @sm:inline">PDF</span>
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 @sm:px-4 py-2 text-[12px] font-medium text-white bg-[#111] rounded-md hover:bg-[#333]">
                  <Save size={14} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}