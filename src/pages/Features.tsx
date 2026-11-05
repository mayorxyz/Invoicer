import { Link } from 'react-router-dom';
import {
  ArrowRight,
  FileText,
  Globe,
  Users,
  Wallet,
  Palette,
  Shield,
  CreditCard,
  Download,
  LayoutDashboard,
  Package,
  Clock,
  Building2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import InvoiceMockup from '../components/mockups/InvoiceMockup';
import EditorMockup from '../components/mockups/EditorMockup';
import DocumentsMockup from '../components/mockups/DocumentsMockup';
import ClientsMockup from '../components/mockups/ClientsMockup';
import ItemsMockup from '../components/mockups/ItemsMockup';
import ExpensesMockup from '../components/mockups/ExpensesMockup';
import TimeMockup from '../components/mockups/TimeMockup';
import SettingsMockup from '../components/mockups/SettingsMockup';
import DashboardMockup from '../components/mockups/DashboardMockup';

type Feature = {
  icon: LucideIcon;
  label: string;
  title: string;
  description: string;
  points: string[];
  mockup: ReactNode;
};

const features: Feature[] = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    title: 'Your whole business at a glance.',
    description:
      'See revenue, outstanding balances, overdue documents and recent activity the moment you open the app.',
    points: ['Revenue & outstanding totals', 'Overdue alerts', 'Recent activity'],
    mockup: <DashboardMockup />,
  },
  {
    icon: FileText,
    label: 'Editor · 8 document types',
    title: 'Invoices, quotes, receipts, and more.',
    description:
      'Invoices, quotes, receipts, credit notes, proforma invoices, purchase orders, delivery notes and statements. Convert a quote to an invoice in one click.',
    points: ['Live preview', 'Undo / redo & shortcuts', 'Quote → invoice'],
    mockup: <EditorMockup />,
  },
  {
    icon: CreditCard,
    label: 'Documents & payments',
    title: 'Record payments, track balances.',
    description:
      'Search and filter every document. Record partial payments by cash, card, transfer or mobile money. Status updates automatically: paid, partial, overdue.',
    points: ['Partial payments', 'Auto status', 'Payment QR codes'],
    mockup: <DocumentsMockup />,
  },
  {
    icon: Users,
    label: 'Clients',
    title: 'Save clients once, reuse forever.',
    description:
      'Keep a client book with contact details and per-client defaults like currency and payment terms.',
    points: ['Client defaults', 'Custom fields', 'Full history'],
    mockup: <ClientsMockup />,
  },
  {
    icon: Package,
    label: 'Items',
    title: 'A catalog of line items.',
    description:
      'Store products and services with prices and tax. Quick-add them to any document instead of retyping.',
    points: ['Quick-add', 'Saved prices & tax', 'Custom fields'],
    mockup: <ItemsMockup />,
  },
  {
    icon: Wallet,
    label: 'Expenses',
    title: 'Track what you spend.',
    description:
      'Log expenses with categories, vendors and receipt images so profitability sits next to your invoicing.',
    points: ['Categories & vendors', 'Receipt images', 'Totals by period'],
    mockup: <ExpensesMockup />,
  },
  {
    icon: Clock,
    label: 'Time tracking',
    title: 'Bill every hour.',
    description:
      'Log time per client and project with hourly rates, then turn billable hours into invoice lines.',
    points: ['Per-project rates', 'Billable totals', 'Invoice-ready'],
    mockup: <TimeMockup />,
  },
  {
    icon: Palette,
    label: 'Templates & currency',
    title: '9 templates. ~168 currencies.',
    description:
      '9 templates, 9 accent colors and adjustable font size. Multiple taxes per document (VAT, GST, WHT, custom), with print-optimized PDF output.',
    points: ['9 templates & accents', 'Multi-tax', 'Clean PDFs'],
    mockup: <InvoiceMockup />,
  },
  {
    icon: Building2,
    label: 'Profiles, privacy & backup',
    title: 'Private, offline, yours.',
    description:
      'Several business profiles, each with its own logo, tax settings and numbering. Data stays in your browser, works offline as a PWA, and exports as a JSON backup.',
    points: ['Multiple businesses', 'No account or server', 'JSON backup & restore'],
    mockup: <SettingsMockup />,
  },
];

const alsoIncluded: { icon: LucideIcon; text: string }[] = [
  { icon: Globe, text: 'Auto decimal formatting per currency' },
  { icon: Shield, text: 'No signup, no tracking' },
  { icon: Download, text: 'PDF export for any document' },
  { icon: Palette, text: 'Light, dark & system themes' },
];

export default function Features() {
  const total = features.length;

  return (
    <div className="pt-16 md:pt-[72px]">
      {/* Header */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Features
            </p>
            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[760px] mb-6">
              Everything you need to invoice. Nothing you don't.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[600px]">
              Invoicer runs entirely in your browser — no signup, no server, no monthly fee.
              Scroll to see every part of it.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stacking cards */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 pb-16 md:pb-32 [--stack-top:72px] md:[--stack-top:96px]">
          {features.map((f, i) => (
            <div
              key={f.label}
              // mb-24 md:mb-40 creates a "scroll pause" so the user can read the card 
              // before the next one slides up to completely cover it.
              className="sticky mb-24 md:mb-40 last:mb-0"
              style={{ top: 'var(--stack-top)' }}
            >
              <article className="rounded-2xl md:rounded-3xl border border-[#E5E5E3] bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-5 lg:gap-14 p-5 md:p-10 lg:p-12">
                  <div>
                    <div className="flex items-center justify-between mb-4 md:mb-5">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#111] text-white">
                          <f.icon size={16} />
                        </span>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373]">
                          {f.label}
                        </p>
                      </div>
                      <span className="text-[12px] font-medium tabular-nums text-[#A3A3A3]">
                        {String(i + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                      </span>
                    </div>
                    <h2 className="text-[clamp(1.35rem,2.6vw,2.1rem)] font-semibold leading-tight tracking-tight text-[#111] mb-3">
                      {f.title}
                    </h2>
                    <p className="text-[14px] md:text-[15px] text-[#737373] leading-relaxed mb-4 md:mb-5">
                      {f.description}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {f.points.map((p) => (
                        <li
                          key={p}
                          className="px-3 py-1.5 text-[12px] font-medium text-[#111] bg-[#F7F7F5] border border-[#E5E5E3] rounded-full"
                        >
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Mockup: clipped on small screens so the card stays within the viewport */}
                  <div className="relative rounded-xl bg-[#F7F7F5] border border-[#E5E5E3] p-3 md:p-5 max-h-[250px] sm:max-h-[320px] lg:max-h-[420px] overflow-hidden">
                    <div className="origin-top-left">{f.mockup}</div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#F7F7F5] to-transparent lg:hidden" />
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* Also included */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-20">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-6">
              Also included
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {alsoIncluded.map((a) => (
                <div
                  key={a.text}
                  className="flex items-center gap-3 p-4 border border-[#E5E5E3] rounded-xl bg-white"
                >
                  <a.icon size={18} className="text-[#111] shrink-0" />
                  <span className="text-[14px] text-[#111] font-medium">{a.text}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <ScrollReveal>
            <div className="text-center max-w-[640px] mx-auto">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#111] text-white mb-5">
                <FileText size={18} />
              </div>
              <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-4">
                From blank page to signed document in minutes.
              </h2>
              <p className="text-[15px] text-[#737373] leading-relaxed mb-8">
                Pick a document type, add your client and items, review the live preview, then save
                or export as PDF.
              </p>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-white bg-[#111] rounded-md hover:bg-[#333] transition-colors"
              >
                See How It Works
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}