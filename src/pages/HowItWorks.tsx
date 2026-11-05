import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Settings,
  Users,
  FileText,
  Palette,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import ScrollReveal from '../components/ui/ScrollReveal';
import FAQAccordion from '../components/ui/FAQAccordion';
import SettingsMockup from '../components/mockups/SettingsMockup';
import ClientsMockup from '../components/mockups/ClientsMockup';
import EditorMockup from '../components/mockups/EditorMockup';
import InvoiceMockup from '../components/mockups/InvoiceMockup';
import DocumentsMockup from '../components/mockups/DocumentsMockup';
import DashboardMockup from '../components/mockups/DashboardMockup';

type Step = {
  icon: LucideIcon;
  short: string;
  badge: string;
  title: string;
  description: string;
  actions: string[];
  tip: string;
  mockup: ReactNode;
};

const steps: Step[] = [
  {
    icon: Settings,
    short: 'Set up',
    badge: 'One-time setup',
    title: 'Set up your business profile',
    description:
      'Everything you enter here is reused on every document, so you only do this once. It takes about two minutes.',
    actions: [
      'Open Settings and enter your business name, address, email, phone and logo.',
      'Choose your default currency. Over 160 currencies are supported, and decimals format automatically.',
      'Add your tax profiles (VAT, GST, WHT or a custom label) and choose whether each is added, included in the price, or deducted.',
      'Set your numbering prefix and default payment terms so new documents are numbered and dated for you.',
      'Running more than one business? Create another profile. Each keeps its own logo, taxes, currency and numbering.',
    ],
    tip: 'Changed something later, like a new logo or tax rate? Edit it in Settings. New documents use it immediately. Documents you already saved keep their original details.',
    mockup: <SettingsMockup />,
  },
  {
    icon: Users,
    short: 'Clients & items',
    badge: 'Build your catalog',
    title: 'Save your clients and items',
    description:
      'Add people and products once, then pick them from a list instead of retyping them on every invoice.',
    actions: [
      'Open Clients and add a client with name, address and contact details.',
      'Optionally give a client its own defaults, such as currency and payment terms. They apply whenever you pick that client.',
      'Open Items and save the products or services you sell, with price, unit and tax.',
      'Attach custom fields to a client or item if you need extra details on your documents.',
    ],
    tip: 'You can also type a one-off client or line item straight into a document without saving it to the catalog.',
    mockup: <ClientsMockup />,
  },
  {
    icon: FileText,
    short: 'Create',
    badge: 'Draft in minutes',
    title: 'Create a document',
    description:
      'The editor supports 8 document types and shows a live preview as you type, so you always see what the client will get.',
    actions: [
      'Pick a type: invoice, quote, receipt, credit note, proforma invoice, purchase order, delivery note or statement.',
      'Choose a saved client. Currency and terms fill in from their defaults.',
      'Add line items by quick-adding saved items or typing new ones. Quantity, discounts, taxes and totals calculate automatically.',
      'Check the live preview. Use undo and redo if you make a mistake, and keyboard shortcuts to move faster.',
      'Made a quote? Convert it to an invoice with one click once the client accepts.',
    ],
    tip: 'Your work saves in the browser as you go, so closing the tab will not lose a draft.',
    mockup: <EditorMockup />,
  },
  {
    icon: Palette,
    short: 'Customize',
    badge: 'Match your brand',
    title: 'Customize how it looks',
    description:
      'Make the document look like your business, not a generic template. Changes show in the preview instantly.',
    actions: [
      'Switch between 9 built-in templates to find the layout you like.',
      'Pick one of 9 accent colors and adjust the font size.',
      'Add a signature, notes, payment instructions and an optional payment QR code.',
      'Use light, dark or system theme for the app itself. This does not change the printed document.',
    ],
    tip: 'Pick your template and accent once and save them as defaults so every new document starts the way you want.',
    mockup: <InvoiceMockup />,
  },
  {
    icon: CreditCard,
    short: 'Send & get paid',
    badge: 'Export & payments',
    title: 'Export it and record payments',
    description:
      'Download a clean PDF to send, then track what has been paid and what is still owed.',
    actions: [
      'Click download to get a print-ready PDF in A4 or Letter. The print styles are built to keep the layout clean.',
      'Send the PDF by email or messaging app, or print it.',
      'When money arrives, open the document and record a payment: cash, card, bank transfer or mobile money.',
      'Partial payments are fine. The status updates by itself to partial, paid or overdue.',
    ],
    tip: 'Use Documents to search and filter by status, so overdue invoices are easy to find and follow up.',
    mockup: <DocumentsMockup />,
  },
  {
    icon: ShieldCheck,
    short: 'Track & back up',
    badge: 'Offline & private',
    title: 'Track your business and keep it safe',
    description:
      'The dashboard summarizes revenue and outstanding balances. Expenses and time tracking sit alongside it.',
    actions: [
      'Open the Dashboard to see totals, overdue documents and recent activity.',
      'Log expenses with category, vendor and a receipt image. Log billable hours per client and project.',
      'Install Invoicer as an app (PWA) from your browser menu. After the first load it works fully offline.',
      'Open Settings and export a JSON backup regularly. To move to another device or restore, import that file.',
    ],
    tip: 'Your data lives only in this browser. Clearing site data or switching browsers removes it unless you have a backup, so export one after important changes.',
    mockup: <DashboardMockup />,
  },
];

const quickAnswers: { q: string; a: string }[] = [
  { q: 'Change my currency', a: 'Settings sets the default. A client or a single document can override it.' },
  { q: 'Add or change a tax', a: 'Add tax profiles in Settings, then apply them per document or per item.' },
  { q: 'Switch business', a: 'Use the business profile switcher. Each business has separate numbering and defaults.' },
  { q: 'Turn a quote into an invoice', a: 'Open the quote and use the convert action. Items and client carry over.' },
  { q: 'Move to a new device', a: 'Export a JSON backup in Settings, then import it on the other device.' },
  { q: 'Work without internet', a: 'Load the app once, then it runs offline. Installing it as a PWA is optional.' },
];

const faqItems = [
  {
    question: 'How long does initial setup take?',
    answer:
      'About two minutes. Enter your business details and tax preferences in Settings and you can create documents straight away.',
  },
  {
    question: 'Do I need an internet connection?',
    answer:
      'Only for the first load. After that the app works fully offline and saves everything in your browser.',
  },
  {
    question: 'Can I manage multiple businesses?',
    answer:
      'Yes. Create several business profiles, each with its own logo, tax settings, currency and document numbering, and switch between them.',
  },
  {
    question: 'Where is my data stored, and is it safe?',
    answer:
      'Only in your browser on your device. There are no accounts and no servers, so nothing is uploaded. Export a JSON backup from Settings to protect against cleared browser data.',
  },
  {
    question: 'Will I lose my documents if I clear my browser data?',
    answer:
      'Yes, unless you have a backup. Export a JSON backup regularly and import it to restore your data.',
  },
  {
    question: 'Can I edit a document after saving it?',
    answer:
      'Yes. Open it from Documents, change what you need and save again. Recorded payments and status update with it.',
  },
];

const flow = ['Set up', 'Add clients', 'Create', 'Export & track'];

export default function Guide() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('[data-step]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    els.forEach((el) => io.observe(el));

    const onScroll = () => {
      const el = stepsRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const p = (window.innerHeight * 0.4 - rect.top) / total;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const goTo = (i: number) =>
    document.getElementById(`step-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  return (
    <div className="pt-16 md:pt-[72px] bg-[#F7F5F0] text-[#111]">
      <style>{`
        @keyframes guideGlow { 0%,100% { background:#fff; color:#111; border-color:#E4E4E4 } 20%,35% { background:#111; color:#fff; border-color:#111 } }
        @keyframes guideDot { 0% { left:0; opacity:0 } 10% { opacity:1 } 90% { opacity:1 } 100% { left:100%; opacity:0 } }
        .guide-chip { animation: guideGlow 6s ease-in-out infinite; }
        .guide-dot { animation: guideDot 6s linear infinite; }
        @media (prefers-reduced-motion: reduce) { .guide-chip, .guide-dot { animation: none } }
      `}</style>

      {/* Header */}
      <section className="border-b border-[#E4E4E4] bg-white">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-28">
          <ScrollReveal>
            <h1 className="text-[clamp(2.25rem,4.5vw,3.75rem)] font-semibold leading-[1.08] tracking-tight max-w-[760px] mb-6">
              How to use Invoicer, step by step.
            </h1>
            <p className="text-[16px] md:text-[19px] text-[#737373] leading-relaxed max-w-[620px] mb-10">
              From first setup to your first paid invoice. Each step below explains what to do, what
              happens automatically, and how to change things later.
            </p>

            {/* Animated flow */}
            <div className="relative">
              <div className="hidden md:block absolute left-[6%] right-[6%] top-1/2 h-px bg-[#E4E4E4]">
                <span className="guide-dot absolute -top-[3px] w-[7px] h-[7px] rounded-full bg-[#FF5A1F]" />
              </div>
              <ol className="relative grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {flow.map((f, i) => (
                  <li
                    key={f}
                    className="guide-chip flex items-center justify-center gap-2 px-4 py-3 text-[13px] font-medium border rounded-full bg-white"
                    style={{ animationDelay: `${i * 1.2}s` }}
                  >
                    <span className="font-mono text-[11px] opacity-60">0{i + 1}</span>
                    {f}
                  </li>
                ))}
              </ol>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Steps */}
      <section className="border-b border-[#E4E4E4]">
        {/* Mobile progress bar */}
        <div className="lg:hidden sticky top-16 md:top-[72px] z-20 bg-white/95 backdrop-blur border-b border-[#E4E4E4]">
          <div className="px-5 py-3 flex items-center justify-between text-[12px] font-mono">
            <span className="text-[#737373]">
              Step {active + 1} of {steps.length}
            </span>
            <span className="font-semibold">{steps[active].short}</span>
          </div>
          <div className="h-[2px] bg-[#E4E4E4]">
            <div className="h-full bg-[#FF5A1F] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16">
            {/* Desktop sticky nav */}
            <aside className="hidden lg:block">
              <div className="sticky top-32">
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#737373] mb-5">
                  Contents
                </p>
                <div className="relative pl-5">
                  <div className="absolute left-0 top-1 bottom-1 w-px bg-[#E4E4E4]">
                    <div
                      className="w-px bg-[#FF5A1F] transition-[height] duration-150"
                      style={{ height: `${progress * 100}%` }}
                    />
                  </div>
                  <ul className="space-y-1">
                    {steps.map((s, i) => (
                      <li key={s.short}>
                        <button
                          onClick={() => goTo(i)}
                          className={`flex items-center gap-3 w-full text-left py-2 text-[14px] transition-colors ${
                            active === i ? 'text-[#111] font-semibold' : 'text-[#737373] hover:text-[#111]'
                          }`}
                        >
                          <span className="font-mono text-[11px]">0{i + 1}</span>
                          {s.short}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Step list */}
            <div ref={stepsRef} className="space-y-14 md:space-y-24">
              {steps.map((s, i) => (
                <article
                  key={s.title}
                  id={`step-${i}`}
                  data-step={i}
                  className="scroll-mt-32"
                >
                  <ScrollReveal>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#111] text-white">
                        <s.icon size={17} />
                      </span>
                      <span className="text-[13px] font-mono font-semibold px-2.5 py-1 bg-white border border-[#E4E4E4] rounded">
                        0{i + 1}
                      </span>
                      <span className="text-[12px] font-mono font-medium uppercase tracking-[0.15em] text-[#FF5A1F]">
                        {s.badge}
                      </span>
                    </div>
                    <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold leading-tight tracking-tight mb-3">
                      {s.title}
                    </h2>
                    <p className="text-[15px] md:text-[16px] text-[#737373] leading-relaxed max-w-[620px] mb-6">
                      {s.description}
                    </p>
                  </ScrollReveal>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8 items-start">
                    <div>
                      <ol className="space-y-3 mb-5">
                        {s.actions.map((a, j) => (
                          <ScrollReveal key={a} delay={j * 70}>
                            <li className="flex gap-3 p-4 bg-white border border-[#E4E4E4] rounded-xl">
                              <span className="shrink-0 w-6 h-6 rounded-full bg-[#F7F5F0] border border-[#E4E4E4] text-[11px] font-mono font-semibold flex items-center justify-center">
                                {j + 1}
                              </span>
                              <span className="text-[14px] leading-relaxed">{a}</span>
                            </li>
                          </ScrollReveal>
                        ))}
                      </ol>
                      <ScrollReveal delay={120}>
                        <div className="flex gap-3 p-4 rounded-xl bg-[#FFF4EE] border border-[#FFD9C7]">
                          <Lightbulb size={18} className="shrink-0 text-[#FF5A1F] mt-0.5" />
                          <p className="text-[13px] leading-relaxed text-[#111]">{s.tip}</p>
                        </div>
                      </ScrollReveal>
                    </div>

                    <ScrollReveal delay={100}>
                      <div className="relative p-2 md:p-4 bg-white border border-[#E4E4E4] rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-h-[280px] sm:max-h-[360px] xl:max-h-[520px] overflow-hidden">
                        {s.mockup}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent" />
                      </div>
                    </ScrollReveal>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quick answers */}
      <section className="bg-white border-b border-[#E4E4E4]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Quick answers
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight mb-8 max-w-[560px]">
              How do I…
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {quickAnswers.map((x, i) => (
              <ScrollReveal key={x.q} delay={i * 50}>
                <div className="h-full p-5 border border-[#E4E4E4] rounded-xl bg-[#F7F5F0]">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-[#059669]" />
                    <h3 className="text-[14px] font-semibold">{x.q}</h3>
                  </div>
                  <p className="text-[13px] text-[#737373] leading-relaxed">{x.a}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F7F5F0] border-b border-[#E4E4E4]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">FAQ</p>
                <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-semibold leading-tight tracking-tight mb-4">
                  Questions about workflow and data.
                </h2>
                <p className="text-[15px] text-[#737373] leading-relaxed">
                  How Invoicer behaves offline, where your data lives, and how to protect it.
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
      <section className="bg-[#151517] text-white">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-28 text-center">
          <ScrollReveal>
            <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-[12px] font-mono text-white/80 mb-6">
              READY TO START?
            </div>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-tight tracking-tight mb-4">
              Create your first document.
            </h2>
            <p className="text-[16px] text-white/60 max-w-[480px] mx-auto mb-8 leading-relaxed">
              No signup and no subscription. Set up your profile and send your first invoice in minutes.
            </p>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 px-7 py-4 text-[14px] font-semibold text-[#151517] bg-white rounded-md hover:bg-white/90 transition-colors"
            >
              Explore All Features
              <ArrowRight size={16} />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}