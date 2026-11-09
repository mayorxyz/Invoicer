import { Link } from 'react-router-dom';
import { ArrowRight, Check, X, Download } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';

const includedGroups: { title: string; items: string[] }[] = [
  {
    title: 'Documents',
    items: [
      'Unlimited invoices, quotes, receipts & 5 other document types',
      'PDF export (print + programmatic)',
      'Payment tracking with partial payments',
    ],
  },
  {
    title: 'Money',
    items: [
      'Around 168 currencies with automatic formatting',
      'Multi-tax support (added, included, deducted)',
      'Expense tracking with categories and receipts',
      'Time tracking with hourly rates',
    ],
  },
  {
    title: 'Organization',
    items: ['Client & saved items catalog', 'Multiple business profiles'],
  },
  {
    title: 'Look & language',
    items: [
      '9 professional templates + custom accent colors',
      'Light, dark, and system themes',
      '6 languages including Arabic (RTL)',
    ],
  },
  {
    title: 'Data & privacy',
    items: [
      'Offline-first, works without internet',
      'JSON backup & restore for data portability',
    ],
  },
];

const notIncluded = [
  'No cloud sync or multi-device access',
  'No email invoicing from the app',
  'No online payment processing (Stripe, PayPal, etc.)',
  'No team accounts or multi-user collaboration',
  'No integrations with accounting software',
  'No automated payment reminders',
  'No CSV or Excel export',
];

const compare = {
  typical: [
    'Monthly or yearly fee',
    'Feature tiers and paywalls',
    'Per-user pricing',
    'Your data on their servers',
  ],
  invoicer: [
    'Free forever',
    'Every feature included',
    'No account, no users to count',
    'Your data on your device',
  ],
};

const whyFree = [
  {
    title: 'Runs in your browser',
    text: 'Invoicer is a client-side application. There is no backend, no database, and no server to pay for.',
  },
  {
    title: 'Your data stays local',
    text: "Everything is stored in your browser's localStorage. No cloud infrastructure means no ongoing costs to pass on.",
  },
  {
    title: 'Built to be used',
    text: 'The goal is to give freelancers and small businesses a professional invoicing tool without the recurring fees.',
  },
];

const faqItems = [
  {
    question: 'Is it really free?',
    answer:
      'Yes. There are no paid tiers, no subscriptions, no hidden fees, and no usage limits. Every feature in the app is included at no cost.',
  },
  {
    question: 'Do I need a credit card to start?',
    answer:
      'No. There is no signup, no account creation, and no payment information required. Open the app and start creating documents immediately.',
  },
  {
    question: 'Will you introduce paid features later?',
    answer:
      'There are no plans for paid tiers. Invoicer is designed as a complete, free tool, not a freemium product.',
  },
  {
    question: 'Are there any usage limits?',
    answer:
      "No. You can create unlimited invoices, clients, items, expenses, and time entries. The only practical limit is your browser's localStorage capacity (typically 5–10 MB).",
  },
  {
    question: "What's the catch?",
    answer:
      'There is no catch. Because the app runs entirely in your browser with no backend, there are no server costs to pass on to you. Your data stays on your device.',
  },
];

export default function Pricing() {
  return (
    <div className="pt-16 md:pt-[72px]">
      <style>{`
        @keyframes priceRing { 0% { transform: scale(1); opacity: .5 } 100% { transform: scale(1.6); opacity: 0 } }
        .price-ring { animation: priceRing 2.4s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) { .price-ring { animation: none } }
      `}</style>

      {/* Header */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-8">
              <ScrollReveal>
                <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[760px] mb-6">
                  Free. No tiers, no subscriptions,{' '}
                  <span className="text-[#FF5A1F]">no limits.</span>
                </h1>
                <p className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[600px]">
                  Invoicer is a complete invoicing tool that runs entirely in your browser. There is
                  no paid plan, no trial period, and no account required. Everything is included.
                </p>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-4">
              <ScrollReveal delay={100}>
                <div className="relative mx-auto lg:ml-auto w-full max-w-[280px] aspect-square flex items-center justify-center">
                  <span className="price-ring absolute inset-6 rounded-full border-2 border-[#FF5A1F]" />
                  <span
                    className="price-ring absolute inset-6 rounded-full border-2 border-[#FF5A1F]"
                    style={{ animationDelay: '1.2s' }}
                  />
                  <div className="relative flex flex-col items-center justify-center w-[72%] aspect-square rounded-full bg-[#111] text-white">
                    <span className="text-[clamp(3.5rem,8vw,5rem)] font-semibold leading-none tracking-tight">
                      $0
                    </span>
                    <span className="mt-2 text-[12px] font-mono uppercase tracking-[0.2em] text-[#FF5A1F]">
                      forever
                    </span>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Plan card */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <div className="overflow-hidden rounded-2xl border border-[#E5E5E5] bg-white">
              <div className="h-1 bg-[#FF5A1F]" />
              <div className="bg-[#111] px-6 md:px-10 py-8 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] mb-3">
                    One plan
                  </p>
                  <h2 className="text-[clamp(1.4rem,3vw,2rem)] font-semibold leading-tight tracking-tight text-white">
                    Everything you need. Nothing you pay for.
                  </h2>
                </div>
                <a
                  href="https://invoicer-editor.vercel.app/"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-[14px] font-medium text-white bg-[#FF5A1F] rounded-md hover:bg-[#E84E15] transition-colors shrink-0"
                >
                  Start creating
                  <ArrowRight size={15} />
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Included */}
                <div className="lg:col-span-7 px-6 md:px-10 py-8 md:py-10 border-b lg:border-b-0 lg:border-r border-[#E5E5E5]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-6">
                    Included
                  </p>
                  <div className="space-y-7">
                    {includedGroups.map((g, gi) => (
                      <ScrollReveal key={g.title} delay={gi * 50}>
                        <h3 className="text-[13px] font-semibold text-[#111] mb-3 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                          {g.title}
                        </h3>
                        <ul className="space-y-2.5">
                          {g.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5">
                              <Check
                                size={15}
                                className="text-[#FF5A1F] mt-0.5 shrink-0"
                                strokeWidth={2.5}
                              />
                              <span className="text-[13.5px] text-[#111] leading-relaxed">
                                {item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </ScrollReveal>
                    ))}
                  </div>
                </div>

                {/* Not included */}
                <div className="lg:col-span-5 px-6 md:px-10 py-8 md:py-10 bg-[#FAFAF8]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-5">
                    Not included
                  </p>
                  <p className="text-[13px] text-[#737373] leading-relaxed mb-5">
                    Invoicer is intentionally focused. These features require a server or
                    third-party integration, which the app does not have.
                  </p>
                  <ul className="space-y-3">
                    {notIncluded.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <X size={15} className="text-[#A3A3A3] mt-0.5 shrink-0" strokeWidth={2} />
                        <span className="text-[13.5px] text-[#737373] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t border-[#E5E5E5] px-6 md:px-10 py-5 flex items-center gap-2.5 text-[13px] text-[#737373]">
                <Download size={15} className="text-[#FF5A1F] shrink-0" />
                <span>No signup. No credit card. Open the app and start.</span>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Compare */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Compared
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-10 max-w-[640px]">
              What you skip by not paying.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <ScrollReveal>
              <div className="h-full p-6 md:p-8 bg-white border border-[#E5E5E5] rounded-xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-5">
                  A typical subscription tool
                </p>
                <ul className="space-y-3">
                  {compare.typical.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[14px] text-[#737373]">
                      <X size={15} className="text-[#A3A3A3] mt-0.5 shrink-0" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={80}>
              <div className="h-full p-6 md:p-8 bg-[#111] rounded-xl border-t-4 border-[#FF5A1F]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FF5A1F] mb-5">
                  Invoicer
                </p>
                <ul className="space-y-3">
                  {compare.invoicer.map((t) => (
                    <li key={t} className="flex items-start gap-3 text-[14px] text-white">
                      <Check size={15} className="text-[#FF5A1F] mt-0.5 shrink-0" strokeWidth={2.5} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Why free */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
                  Why it's free
                </p>
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-tight text-[#111]">
                  No server. No subscription. No catch.
                </h2>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {whyFree.map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 80}>
                    <span className="block font-mono text-[12px] font-semibold text-[#FF5A1F] mb-3">
                      0{i + 1}
                    </span>
                    <h3 className="text-[15px] font-semibold text-[#111] mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[13.5px] text-[#737373] leading-relaxed">{item.text}</p>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
                  FAQ
                </p>
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-tight text-[#111] mb-4">
                  Questions about pricing.
                </h2>
                <p className="text-[14px] text-[#737373] leading-relaxed">
                  Short answers to the questions people usually ask first.
                </p>
              </ScrollReveal>
            </div>
            <div className="lg:col-span-8">
              <ScrollReveal delay={80}>
                <FAQAccordion items={faqItems} />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
          <ScrollReveal>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-white mb-4">
              Start your first invoice in under five minutes.
            </h2>
            <p className="text-[15px] text-white/60 max-w-[480px] mx-auto mb-8">
              No account, no credit card, no setup. Open the app and go.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
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
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}