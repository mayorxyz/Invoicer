import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';

const categories = [
  {
    id: 'general',
    label: 'General',
    blurb: 'What Invoicer is and who it is for.',
    items: [
      {
        question: 'What is Invoicer?',
        answer:
          'Invoicer is a free, offline-capable invoicing application that runs entirely in your browser. There is no backend, no server, and no account required. You create invoices, quotes, receipts, and other business documents, and all of your data stays on your device.',
      },
      {
        question: 'Who is Invoicer for?',
        answer:
          'Freelancers, consultants, contractors, and small businesses who need a professional invoicing tool without monthly fees, mandatory accounts, or cloud dependency. If you just want to create documents and get paid, Invoicer is built for you.',
      },
      {
        question: 'Is Invoicer really free?',
        answer:
          'Yes. There are no paid tiers, no subscriptions, no trials, and no usage limits. Every feature, including unlimited documents, around 168 currencies, 9 templates, and expense and time tracking, is included at no cost.',
      },
    ],
  },
  {
    id: 'getting-started',
    label: 'Getting started',
    blurb: 'Setup, accounts and connectivity.',
    items: [
      {
        question: 'Do I need to create an account?',
        answer:
          'No. There is no signup, no email verification, and no login. Open the app and start creating documents immediately.',
      },
      {
        question: 'How do I get started?',
        answer:
          'When you first open Invoicer, a short setup wizard walks you through choosing your country, currency, tax setup, and business details. After that, you can create your first invoice in under a minute.',
      },
      {
        question: 'Do I need an internet connection?',
        answer:
          'Only for the first load. After that, a service worker caches the application and it runs fully offline. You can create, edit, and export documents without any internet connection.',
      },
    ],
  },
  {
    id: 'features',
    label: 'Features',
    blurb: 'Documents, currencies, taxes, tracking and more.',
    items: [
      {
        question: 'What document types can I create?',
        answer:
          'Eight: invoices, quotes (estimates), receipts, credit notes, proforma invoices, purchase orders, delivery notes, and statements. You can also convert a quote into an invoice with a single click.',
      },
      {
        question: 'Can I customize how my invoices look?',
        answer:
          'Yes. Choose from 9 professional templates, 9 accent colors, and adjustable font sizing. Upload your logo, configure light/dark/system themes, and every document is print-optimized for clean PDF output.',
      },
      {
        question: 'How many currencies are supported?',
        answer:
          "Around 168 currencies with automatic decimal formatting based on each currency's standard. Each document can use its own currency, exchange rate, and home currency.",
      },
      {
        question: 'Can I apply multiple taxes?',
        answer:
          'Yes. You can add multiple tax rates per document, each with its own label (VAT, GST, WHT, etc.), rate, and type: added, included, or deducted. Line items can also be marked as taxable or tax-exempt.',
      },
      {
        question: 'Can I track expenses and time?',
        answer:
          'Yes. The Expenses page lets you record costs by category and vendor with receipt images. The Time page lets you log billable hours per client and project with hourly rates.',
      },
      {
        question: 'Can I manage multiple businesses?',
        answer:
          'Yes. You can create and switch between multiple business profiles, each with its own logo, tax settings, currency, defaults, and document numbering.',
      },
      {
        question: 'Can I record payments and track balances?',
        answer:
          'Yes. Record partial payments across multiple methods (cash, card, transfer, mobile money, etc.). Document statuses update automatically (paid, partial, overdue) based on the balance due.',
      },
    ],
  },
  {
    id: 'data-privacy',
    label: 'Data & privacy',
    blurb: 'Where your data lives and how to protect it.',
    items: [
      {
        question: 'Where is my data stored?',
        answer:
          "Entirely in your browser's localStorage. Nothing is sent to a server, nothing is stored in the cloud, and nothing is shared with third parties. Your data stays on your device.",
      },
      {
        question: 'Can I access my data on another device?',
        answer:
          'Not automatically. Because there is no cloud, data lives on the device where it was created. You can export a full JSON backup from Settings and import it on another browser or device.',
      },
      {
        question: 'What happens if I clear my browser data?',
        answer:
          'All invoices, clients, and settings will be lost unless you have exported a JSON backup first. We recommend backing up regularly from the Settings page.',
      },
      {
        question: 'Is Invoicer private?',
        answer:
          'Yes, by architecture and not just by policy. Because there is no server and no account system, there is nothing to leak. No analytics, no tracking, no data transmission. Your information never leaves your browser.',
      },
    ],
  },
  {
    id: 'limitations',
    label: 'Limitations',
    blurb: 'What Invoicer deliberately does not do.',
    items: [
      {
        question: 'Can I email invoices directly from the app?',
        answer:
          'No. Invoicer has no email integration. You download or print the PDF and send it from your own email client.',
      },
      {
        question: 'Can I accept online payments through Invoicer?',
        answer:
          'No. There is no Stripe, PayPal, or payment gateway integration. You can add payment instructions (bank details, QR codes, pay links) and record payments manually once received.',
      },
      {
        question: 'Does Invoicer integrate with accounting software?',
        answer:
          'No. There are no integrations with QuickBooks, Xero, or any other tool. Invoicer is a standalone application.',
      },
      {
        question: 'Is there a native mobile app?',
        answer:
          'No native iOS or Android app exists. Invoicer is a responsive web application and can be installed as a Progressive Web App (PWA) on mobile devices for an app-like experience.',
      },
      {
        question: 'Can multiple people use the same Invoicer data?',
        answer:
          'No. There are no team accounts or multi-user features. Each browser has its own isolated data. Share access by exporting and importing a JSON backup.',
      },
    ],
  },
];

const popular = [
  'Is Invoicer really free?',
  'Where is my data stored?',
  'What happens if I clear my browser data?',
  'Do I need an internet connection?',
];

export default function FAQ() {
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      categories
        .map((c) => ({
          ...c,
          items: q
            ? c.items.filter(
                (i) => i.question.toLowerCase().includes(q) || i.answer.toLowerCase().includes(q)
              )
            : c.items,
        }))
        .filter((c) => c.items.length > 0),
    [q]
  );

  const resultCount = filtered.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="pt-16 md:pt-[72px]">
      {/* Header + search */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[760px] mb-6">
              Answers to the questions you'll actually have.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[600px] mb-8">
              Straight answers about what Invoicer is, what it can do, and, just as importantly, what
              it doesn't do.
            </p>

            <div className="relative max-w-[560px]">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3A3A3] pointer-events-none"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, e.g. backup, currency, offline"
                aria-label="Search frequently asked questions"
                className="w-full pl-11 pr-11 py-3.5 text-[15px] text-[#111] bg-white border border-[#E5E5E5] rounded-xl outline-none focus:border-[#FF5A1F] focus:ring-2 focus:ring-[#FF5A1F]/20 transition"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#737373] hover:text-[#111]"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {q ? (
              <p className="mt-3 text-[13px] text-[#737373]" aria-live="polite">
                {resultCount} {resultCount === 1 ? 'result' : 'results'} for "{query}"
              </p>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-[12px] font-mono uppercase tracking-wider text-[#A3A3A3]">
                  Popular
                </span>
                {popular.map((p) => (
                  <button
                    key={p}
                    onClick={() => setQuery(p.replace('?', ''))}
                    className="px-3 py-1.5 text-[12px] text-[#525252] bg-white border border-[#E5E5E5] rounded-full hover:border-[#FF5A1F] hover:text-[#111] transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </ScrollReveal>
        </div>
      </section>

      {/* Sections */}
      {filtered.length === 0 ? (
        <section>
          <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-20 text-center">
            <p className="text-[18px] font-semibold text-[#111] mb-2">No matches for "{query}".</p>
            <p className="text-[14px] text-[#737373] mb-6">
              Try a shorter word, or browse all questions.
            </p>
            <button
              onClick={() => setQuery('')}
              className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#111] rounded-md hover:bg-[#333] transition-colors"
            >
              Clear search
            </button>
          </div>
        </section>
      ) : (
        filtered.map((cat, idx) => (
          <section
            key={cat.id}
            id={cat.id}
            className={idx % 2 === 1 ? 'bg-[#F7F7F5]' : ''}
          >
            <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                <div className="lg:col-span-4">
                  <div className="lg:sticky lg:top-40">
                    <ScrollReveal>
                      <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-tight text-[#111] mb-2">
                        {cat.label}.
                      </h2>
                      <p className="text-[14px] text-[#737373] leading-relaxed">{cat.blurb}</p>
                    </ScrollReveal>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <ScrollReveal delay={80}>
                    <FAQAccordion key={`${cat.id}-${q}`} items={cat.items} />
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </section>
        ))
      )}

      {/* Still have questions */}
      <section className="bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-white mb-3">
                  Still have a question?
                </h2>
                <p className="text-[15px] text-white/60 max-w-[520px] mb-5">
                  The best way to understand Invoicer is to use it. There's no signup. Open the app
                  and see for yourself, or read the step-by-step guide first.
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
                  {[
                    { to: '/guide', label: 'User guide' },
                    { to: '/pricing', label: 'Pricing' },
                    { to: '/privacy', label: 'Privacy' },
                  ].map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="inline-flex items-center gap-1.5 text-white/80 hover:text-[#FF5A1F] transition-colors"
                    >
                      {l.label} <ArrowRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <a
                    href="https://invoicer-editor.vercel.app/"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-white bg-[#FF5A1F] rounded-md hover:bg-[#E84E15] transition-colors"
                  >
                    Open the app
                    <ArrowRight size={15} />
                  </a>
                  <Link
                    to="/features"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-white border border-white/20 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Explore features
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}