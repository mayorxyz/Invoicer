import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Shield,
  WifiOff,
  Wallet,
  Check,
  Download,
  Lock,
} from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';
import InvoiceMockup from '../components/mockups/InvoiceMockup';
import DashboardMockup from '../components/mockups/DashboardMockup';
import EditorMockup from '../components/mockups/EditorMockup';
import ClientsMockup from '../components/mockups/ClientsMockup';
import SettingsMockup from '../components/mockups/SettingsMockup';

function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, seen] as const;
}

const ticker = [
  'Invoices',
  'Quotes',
  'Receipts',
  'Credit notes',
  'Proforma invoices',
  'Purchase orders',
  'Delivery notes',
  'Statements',
  '~168 currencies',
  '6 languages',
  'Multi-tax',
  '9 templates',
];

const pillars = [
  {
    icon: Shield,
    title: 'Private by design',
    desc: 'No server and no account. Your data stays in your browser, on your device.',
  },
  {
    icon: WifiOff,
    title: 'Works offline',
    desc: 'Load it once and it runs anywhere, with or without internet.',
  },
  {
    icon: Wallet,
    title: 'Free, no limits',
    desc: 'No tiers or trials. Unlimited documents, clients and exports.',
  },
];

const tour = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    title: 'See your money at a glance.',
    desc: 'Revenue, outstanding balances and overdue documents the moment you open the app.',
    view: <DashboardMockup />,
  },
  {
    id: 'editor',
    label: 'Editor',
    title: 'Build a document in minutes.',
    desc: 'Pick a type, add items, and watch totals and the live preview update as you type.',
    view: <EditorMockup />,
  },
  {
    id: 'invoice',
    label: 'Result',
    title: 'Clean, print-ready output.',
    desc: '9 templates, your accent color and logo, exported as a crisp PDF.',
    view: <InvoiceMockup />,
  },
  {
    id: 'clients',
    label: 'Clients',
    title: 'Save people once, reuse forever.',
    desc: 'A client book with per-client currency and payment terms that fill in for you.',
    view: <ClientsMockup />,
  },
  {
    id: 'settings',
    label: 'Settings',
    title: 'Set up once, in two minutes.',
    desc: 'Business profile, taxes, numbering and backups. Multiple businesses supported.',
    view: <SettingsMockup />,
  },
];

const steps = [
  { num: '01', title: 'Set up', desc: 'Add your business details and defaults once.' },
  { num: '02', title: 'Choose', desc: 'Pick a document type and a saved client.' },
  { num: '03', title: 'Add items', desc: 'Totals, tax and discounts calculate live.' },
  { num: '04', title: 'Export', desc: 'Download a PDF and record payments.' },
];

const faqItems = [
  {
    question: 'Is Invoicer really free?',
    answer:
      'Yes. There are no paid tiers, subscriptions, trials or usage limits. Every feature is included.',
  },
  {
    question: 'Do I need to create an account?',
    answer:
      'No. There is no signup, email verification or login. Open the app and start creating documents.',
  },
  {
    question: 'Where is my data stored?',
    answer:
      "Entirely in your browser's localStorage. Nothing is sent to a server or stored in the cloud.",
  },
  {
    question: 'Does the app work offline?',
    answer:
      'Yes. After the first load the app is cached and runs fully offline. You can create, edit and export without a connection.',
  },
];

export default function Home() {
  const [active, setActive] = useState(0);
  const [stepsRef, stepsSeen] = useInView<HTMLDivElement>(0.3);
  const current = tour[active];

  return (
    <div className="pt-16 md:pt-[72px]">
      <style>{`
        @keyframes homeMarquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes homeFloat { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
        .home-marquee { animation: homeMarquee 40s linear infinite; }
        .home-float { animation: homeFloat 5s ease-in-out infinite; }
        .home-marquee-wrap:hover .home-marquee { animation-play-state: paused; }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 pt-14 md:pt-24 pb-12 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-6">
              <p
                className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4 hero-animate"
                style={{ animationDelay: '0s' }}
              >
                Free · Offline · Private
              </p>
              <h1
                className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-tight text-[#111] mb-6 hero-animate"
                style={{ animationDelay: '0.08s' }}
              >
                Invoices, quotes and receipts.
                <br className="hidden md:block" />
                No signup. No server. No fees.
              </h1>
              <p
                className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[520px] mb-8 hero-animate"
                style={{ animationDelay: '0.16s' }}
              >
                Create professional documents in minutes, right in your browser. Your data never
                leaves your device.
              </p>
              <div
                className="flex flex-wrap gap-3 mb-8 hero-animate"
                style={{ animationDelay: '0.24s' }}
              >
                <a
                  href="https://invoicer-editor.vercel.app/"
                  className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-white bg-[#111] rounded-md hover:bg-[#333] transition-colors"
                >
                  Start creating, it's free
                  <ArrowRight size={15} />
                </a>
                <Link
                  to="/guide"
                  className="inline-flex items-center gap-2 px-5 py-3 text-[14px] font-medium text-[#111] bg-white border border-[#E5E5E5] rounded-md hover:border-[#111] transition-colors"
                >
                  See how it works
                </Link>
              </div>
              <ul
                className="flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-[#525252] hero-animate"
                style={{ animationDelay: '0.32s' }}
              >
                {['No account', 'No credit card', 'Works offline'].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <Check size={14} className="text-[#059669]" strokeWidth={2.5} />
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="lg:col-span-6 relative hero-mockup-animate"
              style={{ animationDelay: '0.4s' }}
            >
              <InvoiceMockup />
              <div className="home-float absolute -top-3 right-2 md:-right-3 flex items-center gap-2 px-3 py-2 bg-white border border-[#E5E5E5] rounded-full shadow-md text-[12px] font-medium">
                <Lock size={13} /> Stored on your device
              </div>
              <div
                className="home-float absolute -bottom-3 left-2 md:-left-3 flex items-center gap-2 px-3 py-2 bg-[#111] text-white rounded-full shadow-md text-[12px] font-medium"
                style={{ animationDelay: '1.2s' }}
              >
                <Download size={13} /> PDF ready
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <section className="border-y border-[#E5E5E5] bg-white overflow-hidden home-marquee-wrap">
        <div className="home-marquee flex w-max py-4">
          {[...ticker, ...ticker].map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-6 pr-6 text-[13px] font-medium text-[#525252] whitespace-nowrap"
            >
              {t}
              <span className="w-1 h-1 rounded-full bg-[#D4D4D4]" />
            </span>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Why Invoicer
            </p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[640px] mb-10 md:mb-12">
              Three decisions most tools won't make.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 80}>
                <div className="pt-6 border-t border-[#E5E5E5]">
                  <p.icon size={18} className="text-[#111] mb-4" />
                  <h3 className="text-[15px] font-semibold text-[#111] mb-2">{p.title}</h3>
                  <p className="text-[14px] text-[#737373] leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal delay={200}>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-10 text-[13px] font-medium text-[#111] hover:opacity-70 transition-opacity"
            >
              Why we built it this way <ArrowRight size={14} />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Product tour */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Take a look
            </p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[640px] mb-8">
              See the product before you use it.
            </h2>
          </ScrollReveal>

          <div
            className="flex gap-1 mb-6 border-b border-[#E5E5E5] overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0"
            role="tablist"
            aria-label="Product tour"
          >
            {tour.map((t, i) => (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={active === i}
                aria-controls={`panel-${t.id}`}
                tabIndex={active === i ? 0 : -1}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    setActive((i + 1) % tour.length);
                  } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setActive((i - 1 + tour.length) % tour.length);
                  }
                }}
                className={`relative shrink-0 px-4 py-3 text-[13px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563eb] ${
                  active === i ? 'text-[#111]' : 'text-[#737373] hover:text-[#111]'
                }`}
              >
                {t.label}
                {active === i && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#111]" />
                )}
              </button>
            ))}
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-6 lg:gap-12 items-start"
            role="tabpanel"
            id={`panel-${current.id}`}
            aria-labelledby={`tab-${current.id}`}
          >
            <div key={`t-${current.id}`} className="tab-panel-animate">
              <h3 className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold tracking-tight text-[#111] mb-3">
                {current.title}
              </h3>
              <p className="text-[14px] md:text-[15px] text-[#737373] leading-relaxed mb-5">
                {current.desc}
              </p>
              <Link
                to="/features"
                className="inline-flex items-center gap-2 text-[13px] font-medium text-[#111] hover:opacity-70 transition-opacity"
              >
                See every feature <ArrowRight size={14} />
              </Link>
            </div>
            <div
              key={`m-${current.id}`}
              className="tab-panel-animate min-w-0 max-h-[300px] sm:max-h-[420px] lg:max-h-[560px] overflow-hidden rounded-xl"
            >
              {current.view}
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 md:mb-14">
            <ScrollReveal>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
                Process
              </p>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[640px]">
                From blank page to finished document in four steps.
              </h2>
            </ScrollReveal>
            <Link
              to="/guide"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[#111] hover:opacity-70 transition-opacity shrink-0"
            >
              Read the full guide <ArrowRight size={14} />
            </Link>
          </div>

          <div ref={stepsRef} className="relative">
            <div className="hidden lg:block absolute top-[18px] left-[12.5%] right-[12.5%] h-px bg-[#E5E5E5]">
              <div
                className="h-px bg-[#111] transition-[width] duration-[1600ms] ease-out"
                style={{ width: stepsSeen ? '100%' : '0%' }}
              />
            </div>
            <div className="lg:hidden absolute top-2 bottom-2 left-[18px] w-px bg-[#E5E5E5]">
              <div
                className="w-px bg-[#111] transition-[height] duration-[1600ms] ease-out"
                style={{ height: stepsSeen ? '100%' : '0%' }}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-6">
              {steps.map((s, i) => (
                <div key={s.num} className="relative pl-12 lg:pl-0 lg:text-center">
                  <div
                    className="absolute left-0 top-0 w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-500 lg:relative lg:mx-auto lg:mb-4"
                    style={{
                      background: stepsSeen ? '#111' : '#fff',
                      color: stepsSeen ? '#fff' : '#111',
                      borderColor: stepsSeen ? '#111' : '#E5E5E5',
                      transitionDelay: `${i * 350}ms`,
                    }}
                  >
                    <span className="text-[12px] font-semibold">{s.num}</span>
                  </div>
                  <h3 className="text-[15px] font-semibold text-[#111] mb-1.5">{s.title}</h3>
                  <p className="text-[13px] text-[#737373] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explore: snippets from other pages */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Explore
            </p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[640px] mb-10 md:mb-12">
              Everything else, one click away.
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Features */}
            <ScrollReveal className="md:col-span-3">
              <Link
                to="/features"
                className="group flex flex-col h-full p-6 md:p-8 bg-white border border-[#E5E5E5] rounded-2xl hover:border-[#111] transition-colors"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-3">
                  Features
                </p>
                <h3 className="text-[18px] font-semibold tracking-tight text-[#111] mb-4">
                  Built for real invoicing work.
                </h3>
                <ul className="space-y-2 mb-6 text-[14px] text-[#525252]">
                  {[
                    '8 document types, quote to invoice in one click',
                    '~168 currencies and multi-tax support',
                    'Clients, items, expenses and time tracking',
                    '6 languages, including right-to-left Arabic',
                  ].map((t) => (
                    <li key={t} className="flex gap-2.5">
                      <Check size={15} className="text-[#059669] mt-0.5 shrink-0" strokeWidth={2.5} />
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-[#111]">
                  Browse all features
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>

            {/* Guide */}
            <ScrollReveal className="md:col-span-3" delay={80}>
              <Link
                to="/guide"
                className="group flex flex-col h-full p-6 md:p-8 bg-white border border-[#E5E5E5] rounded-2xl hover:border-[#111] transition-colors"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-3">
                  User guide
                </p>
                <h3 className="text-[18px] font-semibold tracking-tight text-[#111] mb-4">
                  Set up in two minutes.
                </h3>
                <ul className="space-y-2 mb-6 text-[14px] text-[#525252]">
                  {[
                    'Add your business profile and tax defaults',
                    'Save clients and items for quick reuse',
                    'Export PDFs, record payments, back up your data',
                    'Install it as an app and use it offline',
                  ].map((t, i) => (
                    <li key={t} className="flex gap-2.5">
                      <span className="font-mono text-[11px] text-[#A3A3A3] mt-1 w-4 shrink-0">
                        0{i + 1}
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-[#111]">
                  Read the guide
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>

            {/* Privacy */}
            <ScrollReveal className="md:col-span-2" delay={60}>
              <Link
                to="/privacy"
                className="group flex flex-col h-full p-6 bg-[#111] rounded-2xl hover:bg-[#1A1A1A] transition-colors"
              >
                <Lock size={18} className="text-white mb-4" />
                <h3 className="text-[16px] font-semibold text-white mb-2">Your data stays yours.</h3>
                <p className="text-[13px] text-white/60 leading-relaxed mb-5">
                  No server, no tracking, no uploads. Everything lives in your browser.
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-white">
                  How we handle data
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>

            {/* About */}
            <ScrollReveal className="md:col-span-2" delay={120}>
              <Link
                to="/about"
                className="group flex flex-col h-full p-6 bg-white border border-[#E5E5E5] rounded-2xl hover:border-[#111] transition-colors"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-3">
                  Built for
                </p>
                <h3 className="text-[16px] font-semibold text-[#111] mb-2">
                  Freelancers, consultants and small teams.
                </h3>
                <p className="text-[13px] text-[#737373] leading-relaxed mb-5">
                  Focused on invoicing, honest about what it doesn't do.
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-[#111]">
                  About Invoicer
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>

            {/* FAQ */}
            <ScrollReveal className="md:col-span-2" delay={180}>
              <Link
                to="/faq"
                className="group flex flex-col h-full p-6 bg-white border border-[#E5E5E5] rounded-2xl hover:border-[#111] transition-colors"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-3">
                  Questions
                </p>
                <h3 className="text-[16px] font-semibold text-[#111] mb-2">
                  Backups, devices, limits.
                </h3>
                <p className="text-[13px] text-[#737373] leading-relaxed mb-5">
                  Quick answers to what people ask first, like moving to a new device.
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-[13px] font-medium text-[#111]">
                  View all questions
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
                  Quick answers
                </p>
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-4">
                  The things people ask first.
                </h2>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#111] hover:opacity-70 transition-opacity"
                >
                  View all questions <ArrowRight size={14} />
                </Link>
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

      {/* Closing CTA */}
      <section className="bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-28 text-center">
          <ScrollReveal>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-white mb-6">
              Skip the signup.
              <br />
              Start your first invoice.
            </h2>
            <p className="text-[15px] text-white/60 max-w-[520px] mx-auto mb-8">
              No account, no credit card, no setup. Open the app and create a professional document
              in minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://invoicer-editor.vercel.app/"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-[#111] bg-white rounded-md hover:bg-white/90 transition-colors"
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