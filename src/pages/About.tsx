import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, WifiOff, Database, Gift, Target, X, Check } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';

/* ---------- helpers ---------- */

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

function CountUp({ to, prefix = '' }: { to: number; prefix?: string }) {
  const [ref, seen] = useInView<HTMLSpanElement>();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!seen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(to);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1200);
      setVal(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return (
    <span ref={ref}>
      {prefix}
      {val}
    </span>
  );
}

/* ---------- data ---------- */

const stats: { value: React.ReactNode; label: string }[] = [
  { value: '0', label: 'Accounts needed' },
  { value: '0', label: 'Servers holding your data' },
  { value: <CountUp to={168} prefix="~" />, label: 'Currencies' },
  { value: <CountUp to={8} />, label: 'Document types' },
];

const typicalFlow = [
  'Sign up with your email',
  'Verify your account',
  'Pick a plan',
  'Enter billing details',
  'Connect your bank',
  'Accept the terms',
];

const answers: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Shield,
    title: 'Private by architecture',
    description:
      "Not by policy, by design. There is no server to send your data to. Everything stays in your browser's localStorage, on your device, under your control.",
  },
  {
    icon: WifiOff,
    title: 'Offline-first',
    description:
      'After the first load, a service worker caches the app. Create, edit and export invoices with no connection: on a plane, in a café, or in a dead zone.',
  },
  {
    icon: Database,
    title: 'Data sovereignty',
    description:
      'Your invoices, clients and business details never leave your browser. Export a JSON backup anytime and restore it on another device. No vendor lock-in.',
  },
  {
    icon: Gift,
    title: 'Free, without limits',
    description:
      'No tiers, no trials, no "upgrade to unlock." Every feature is included: unlimited documents, ~168 currencies, 9 templates, expense and time tracking.',
  },
  {
    icon: Target,
    title: 'Focused, not bloated',
    description:
      'Eight document types, multi-tax, multi-currency, client management and PDF export. Not project management, not accounting, not a CRM. Just invoicing, done well.',
  },
];

const principles: { title: string; description: string }[] = [
  {
    title: 'Privacy by architecture',
    description:
      "Privacy isn't a setting you toggle. It's the shape of the product. A client-side app with no backend cannot leak what it never receives.",
  },
  {
    title: 'Zero friction',
    description:
      'No signup, no email verification, no onboarding course. Open the app and create your first document in under a minute.',
  },
  {
    title: 'Honest about limits',
    description:
      "We don't pretend to be what we aren't. No email invoicing, no cloud sync, no payment processing. What you see is what the app does.",
  },
  {
    title: 'Print-first output',
    description:
      'Every document is designed to look as good on paper as on screen. Clean typography, proper pagination and 9 templates built for real clients.',
  },
];

const does = [
  'Runs fully offline after the first load',
  '8 document types, ~168 currencies, multi-tax',
  'Client and item catalog, expenses, time tracking',
  'Clean PDF export and JSON backup',
  'Multiple business profiles in one app',
];

const doesnt = [
  'Email invoicing: download and send from your own client',
  'Cloud sync: data lives on one device at a time',
  'Online payment processing: record payments manually',
  'Team accounts or multi-user collaboration',
  'Integrations with accounting software or banks',
  'Automated recurring invoices',
];

const audiences = [
  {
    title: 'Freelancers',
    text: 'Bill clients for projects or hourly work without paying a monthly subscription for the privilege.',
  },
  {
    title: 'Consultants',
    text: 'Create quotes that convert into invoices, with consistent branding across every document.',
  },
  {
    title: 'Contractors',
    text: 'Produce professional purchase orders, delivery notes and invoices on site, even offline.',
  },
  {
    title: 'Small businesses',
    text: 'Keep billing organized across clients, currencies and tax regimes without a full accounting suite.',
  },
];

/* ---------- page ---------- */

export default function About() {
  const [flowRef, flowSeen] = useInView<HTMLDivElement>(0.35);

  return (
    <div className="pt-16 md:pt-[72px]">
      {/* Header + stats */}
      <section className="bg-[#F7F7F5]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-12 md:pb-16">
          <ScrollReveal>
            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[820px] mb-6">
              Invoicing shouldn't require an account, a subscription, or an internet connection.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[640px]">
              Invoicer is a free, offline, client-side invoicing tool built for freelancers and
              small businesses who want their data to stay on their own device.
            </p>
          </ScrollReveal>
        </div>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 pb-16 md:pb-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden">
            {stats.map((s, i) => (
              <ScrollReveal key={s.label} delay={i * 70}>
                <div className="bg-white p-5 md:p-8 h-full">
                  <div className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-[#111] tabular-nums leading-none mb-2">
                    {s.value}
                  </div>
                  <div className="text-[12px] md:text-[13px] text-[#737373]">{s.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* The problem */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            <div className="lg:col-span-4">
              <ScrollReveal>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
                  The problem
                </p>
                <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-semibold leading-tight tracking-tight text-[#111] mb-5">
                  Most invoicing tools ask for too much before giving anything back.
                </h2>
                <p className="text-[15px] text-[#737373] leading-relaxed">
                  You need to send a document, not adopt a platform. Invoicing should be simple,
                  private and free.
                </p>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-8" ref={flowRef}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Typical */}
                <div className="p-6 border border-[#E5E5E5] rounded-xl">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-5">
                    A typical tool
                  </p>
                  <ol className="space-y-3 mb-5">
                    {typicalFlow.map((t, i) => (
                      <li key={t} className="flex items-center gap-3 text-[14px] text-[#737373]">
                        <span className="w-5 text-[11px] font-mono">0{i + 1}</span>
                        <span className="relative inline-block">
                          {t}
                          <span
                            className="absolute left-0 top-1/2 h-px bg-[#111] transition-[width] duration-500"
                            style={{
                              width: flowSeen ? '100%' : '0%',
                              transitionDelay: `${i * 250 + 300}ms`,
                            }}
                          />
                        </span>
                      </li>
                    ))}
                  </ol>
                  <p className="text-[13px] text-[#525252] pt-4 border-t border-[#E5E5E5]">
                    Then create your first invoice, stored on someone else's server.
                  </p>
                </div>

                {/* Invoicer */}
                <div className="p-6 rounded-xl bg-[#111] text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50 mb-5">
                    Invoicer
                  </p>
                  <ol className="space-y-3 mb-5">
                    {['Open the app', 'Create your invoice'].map((t, i) => (
                      <li
                        key={t}
                        className="flex items-center gap-3 text-[14px] transition-all duration-500"
                        style={{
                          opacity: flowSeen ? 1 : 0.2,
                          transform: flowSeen ? 'none' : 'translateX(8px)',
                          transitionDelay: `${typicalFlow.length * 250 + 500 + i * 300}ms`,
                        }}
                      >
                        <Check size={15} className="text-[#4ADE80]" />
                        {t}
                      </li>
                    ))}
                  </ol>
                  <p className="text-[13px] text-white/60 pt-4 border-t border-white/10">
                    Saved on your device. Nothing to sign up for.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our answer: stacking cards */}
      <section className="bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-16 md:py-24 [--stack-top:72px] md:[--stack-top:96px]">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-4 px-1">
              Our answer
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-white max-w-[640px] mb-10 md:mb-14 px-1">
              A tool shaped around five decisions.
            </h2>
          </ScrollReveal>

          {answers.map((a, i) => (
            <div
              key={a.title}
              className="sticky mb-5 md:mb-8 last:mb-0"
              style={{ top: `calc(var(--stack-top) + ${i * 12}px)` }}
            >
              <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-10 p-6 md:p-10 rounded-2xl border border-white/10 bg-[#1A1A1A] shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
                <div className="flex items-center md:flex-col md:items-start gap-4 md:w-[140px] shrink-0">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-[#111]">
                    <a.icon size={18} />
                  </span>
                  <span className="font-mono text-[12px] text-white/40">
                    0{i + 1} / 0{answers.length}
                  </span>
                </div>
                <div>
                  <h3 className="text-[clamp(1.2rem,2.2vw,1.6rem)] font-semibold text-white mb-3 tracking-tight">
                    {a.title}
                  </h3>
                  <p className="text-[14px] md:text-[15px] text-white/60 leading-relaxed max-w-[620px]">
                    {a.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section>
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
              Principles
            </p>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-10 md:mb-12 max-w-[640px]">
              The decisions we keep coming back to.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {principles.map((p, i) => (
              <PrincipleItem key={p.title} index={i} {...p} />
            ))}
          </div>
        </div>
      </section>

      {/* Does / doesn't */}
<section className="bg-[#F7F7F5]">
  <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
    <ScrollReveal>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
        Scope
      </p>
      <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-4 max-w-[640px]">
        Honest about what Invoicer does and doesn't do.
      </h2>
      <p className="text-[14px] md:text-[15px] text-[#737373] leading-relaxed max-w-[620px] mb-10 md:mb-12">
        The choices that make Invoicer private, offline and free also mean it can't do some
        things server-based tools can. If you need those, Invoicer isn't the right fit, and
        that's okay.
      </p>
    </ScrollReveal>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
      <ScrollReveal>
        <div className="pt-6 border-t border-[#E5E5E5]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#059669] mb-4">
            Does
          </p>
          <ul className="space-y-4">
            {does.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#111] leading-relaxed">
                <Check size={15} className="text-[#059669] mt-0.5 shrink-0" strokeWidth={2.5} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="pt-6 border-t border-[#E5E5E5]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#737373] mb-4">
            Doesn't
          </p>
          <ul className="space-y-4">
            {doesnt.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-[#525252] leading-relaxed">
                <X size={15} className="text-[#A3A3A3] mt-0.5 shrink-0" strokeWidth={2} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </ScrollReveal>
    </div>
  </div>
</section>

{/* Who it's for */}
<section>
  <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
    <ScrollReveal>
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">
        Who it's for
      </p>
      <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-10 md:mb-12 max-w-[640px]">
        Built for people who just want to invoice.
      </h2>
    </ScrollReveal>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
      {audiences.map((a, i) => (
        <ScrollReveal key={a.title} delay={i * 80}>
          <div className="pt-6 border-t border-[#E5E5E5]">
            <span className="block font-mono text-[11px] text-[#A3A3A3] mb-4">0{i + 1}</span>
            <h3 className="text-[16px] font-semibold text-[#111] mb-2 tracking-tight">
              {a.title}
            </h3>
            <p className="text-[14px] text-[#737373] leading-relaxed">{a.text}</p>
          </div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>

      {/* CTA */}
      <section className="bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24 text-center">
          <ScrollReveal>
            <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-white mb-4">
              No account. No setup. Just invoicing.
            </h2>
            <p className="text-[15px] text-white/60 max-w-[480px] mx-auto mb-8">
              Open the app and create your first document in under five minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-[#111] bg-white rounded-md hover:bg-white/90 transition-colors"
              >
                Open the app
                <ArrowRight size={15} />
              </Link>
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

function PrincipleItem({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  const [ref, seen] = useInView<HTMLDivElement>(0.4);
  return (
    <div ref={ref}>
      <div className="h-px bg-[#E5E5E5] mb-6">
        <div
          className="h-px bg-[#111] transition-[width] duration-700"
          style={{ width: seen ? '100%' : '0%', transitionDelay: `${index * 100}ms` }}
        />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-[12px] font-semibold text-[#737373]">0{index + 1}</span>
        <h3 className="text-[15px] font-semibold text-[#111]">{title}</h3>
      </div>
      <p className="text-[14px] text-[#737373] leading-relaxed max-w-[480px]">{description}</p>
    </div>
  );
}