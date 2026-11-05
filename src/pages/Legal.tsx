import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Database, EyeOff, UserX } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal';

const facts = [
  {
    icon: UserX,
    title: 'No accounts',
    text: 'There is no signup, no login, and no email registration required to access the application.',
  },
  {
    icon: Database,
    title: 'No server',
    text: 'Invoicer is a static single-page app (SPA). There is no backend database or cloud storage server.',
  },
  {
    icon: EyeOff,
    title: 'No tracking',
    text: 'No analytics scripts, tracking pixels, or third-party marketing cookies are loaded.',
  },
  {
    icon: Shield,
    title: 'Local only',
    text: 'Every document, client record, and setting is saved locally in your browser localStorage.',
  },
];

const Code = ({ children }: { children: ReactNode }) => (
  <code className="px-1.5 py-0.5 bg-white border border-[#E5E5E5] rounded text-[12.5px] break-all">
    {children}
  </code>
);

type Section = { id: string; title: string; body: ReactNode };

const privacy: Section[] = [
  {
    id: 'p-collection',
    title: 'Information collection',
    body: (
      <p>
        Invoicer does not collect or transmit personal or business information to any external
        server. You enter your business profile, client details, and line items directly into the
        client-side interface to generate your local documents.
      </p>
    ),
  },
  {
    id: 'p-storage',
    title: 'Where your data lives',
    body: (
      <>
        <p className="mb-3">
          Every invoice, quote, receipt, client, expense, time entry, and business profile you
          create is stored locally in your browser's <Code>localStorage</Code> under the key{' '}
          <Code>invoicer_v2</Code>.
        </p>
        <p>
          This data stays entirely on your device. It is cached locally via a service worker for
          offline usage and is never uploaded to a cloud database.
        </p>
      </>
    ),
  },
  {
    id: 'p-control',
    title: 'Your control over your data',
    body: (
      <ul className="space-y-3">
        {[
          [
            'Export.',
            'You can download a complete JSON backup of all your records at any time from the Settings page data section.',
          ],
          [
            'Import.',
            'You can restore a JSON backup onto another browser or device for complete data portability.',
          ],
          [
            'Delete.',
            'You can clear stored records through the app or by clearing your browser site data.',
          ],
        ].map(([k, v]) => (
          <li key={k} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F] mt-2 shrink-0" />
            <span>
              <strong className="text-[#111] font-medium">{k}</strong> {v}
            </span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    id: 'p-security',
    title: 'A note on localStorage and security',
    body: (
      <>
        <p className="mb-3">
          Data stored in <Code>localStorage</Code> is unencrypted plain JSON tied to your browser
          origin.
        </p>
        <p>
          If anyone gains physical access to an unlocked device, they can inspect browser storage.
          For sensitive business records, we recommend securing your device and regularly
          downloading JSON backups.
        </p>
      </>
    ),
  },
  {
    id: 'p-summary',
    title: 'Summary',
    body: (
      <p>
        Invoicer operates with zero server infrastructure, no user accounts, and no telemetry
        tracking. You maintain absolute custody of your financial documents on your own local
        device.
      </p>
    ),
  },
];

const terms: Section[] = [
  {
    id: 't-acceptance',
    title: 'Acceptance of terms',
    body: (
      <p>
        By accessing or running Invoicer, you agree to be bound by these terms. If you do not
        agree, you should not use the application. Because Invoicer is a standalone, client-side
        static web application with no server registration, usage is governed by local execution.
      </p>
    ),
  },
  {
    id: 't-service',
    title: 'Description of service',
    body: (
      <p>
        Invoicer is a single-page web application (SPA) built with React, TypeScript, and Tailwind
        CSS. It provides client-side functionality for generating invoices, quotes, receipts, and
        related business documents, storing all data strictly within your browser localStorage.
      </p>
    ),
  },
  {
    id: 't-responsibilities',
    title: 'Your responsibilities',
    body: (
      <p>
        You are solely responsible for the accuracy of all information entered into Invoicer,
        including business profiles, client details, tax calculations, and monetary amounts. You
        must review all documents before issuing them for commercial use.
      </p>
    ),
  },
  {
    id: 't-use',
    title: 'Acceptable use',
    body: (
      <p>
        You agree to use Invoicer only for lawful business operations. You must not use the
        software to generate fraudulent commercial records, misrepresent financial transactions, or
        violate applicable regional tax codes.
      </p>
    ),
  },
  {
    id: 't-ip',
    title: 'Intellectual property and data ownership',
    body: (
      <p>
        The Invoicer codebase, interface design, and architecture are protected by applicable
        intellectual property standards. You retain absolute and exclusive ownership of all data,
        text, and documents you input or generate within your local browser instance.
      </p>
    ),
  },
  {
    id: 't-liability',
    title: 'Limitation of liability',
    body: (
      <p>
        Invoicer is provided on an "as-is" and "as-available" basis without warranties of any kind,
        whether express or implied. The software does not provide legal, accounting, or formal tax
        counsel. Users assume full responsibility for compliance with local commercial regulations.
      </p>
    ),
  },
  {
    id: 't-modifications',
    title: 'Modifications',
    body: (
      <p>
        We reserve the right to alter code architecture, features, or these terms at any time.
        Because data is stored locally in your browser, code updates will apply to future local
        sessions without compromising existing saved localStorage data structures.
      </p>
    ),
  },
  {
    id: 't-law',
    title: 'Governing law',
    body: (
      <p>
        Any legal matters relating to the open distribution or deployment of the source repository
        shall be evaluated in accordance with standard open-source conventions and local
        jurisdictional guidelines where deployed.
      </p>
    ),
  },
  {
    id: 't-contact',
    title: 'Contact',
    body: (
      <p>
        Inquiries regarding these terms or application usage may be directed through standard
        repository channels or direct developer contact.
      </p>
    ),
  },
];

const allIds = [...privacy, ...terms].map((s) => s.id);

export default function Legal() {
  const [active, setActive] = useState(allIds[0]);

  useEffect(() => {
    const els = allIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Open directly on #privacy / #terms or a section hash
  useEffect(() => {
    const h = window.location.hash.replace('#', '');
    if (h) setTimeout(() => document.getElementById(h)?.scrollIntoView(), 50);
  }, []);

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const part = active.startsWith('t-') || active === 'Terms' ? 'Terms' : 'privacy';

  const renderSections = (list: Section[], prefix: string) =>
    list.map((s, i) => (
      <ScrollReveal key={s.id}>
        <article
          id={s.id}
          className="scroll-mt-36 py-8 border-b border-[#E5E5E5] last:border-b-0"
        >
          <h3 className="flex items-baseline gap-3 text-[17px] font-semibold text-[#111] mb-3">
            <span className="font-mono text-[12px] font-semibold text-[#FF5A1F]">
              {prefix}
              {String(i + 1).padStart(2, '0')}
            </span>
            {s.title}
          </h3>
          <div className="text-[14px] text-[#737373] leading-relaxed">{s.body}</div>
        </article>
      </ScrollReveal>
    ));

  return (
    <div className="pt-16 md:pt-[72px]">
      {/* Header */}
      <section className="bg-[#F7F5F0] border-b border-[#E4E4E4]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-14 md:py-24">
          <ScrollReveal>
            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[820px] mb-6">
              Terms and privacy.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[640px] mb-8">
              Invoicer runs entirely inside your browser, so your information stays under your
              control. Below is how data is handled and the conditions for using the software.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => goTo('privacy')}
                className="px-5 py-2.5 text-[13px] font-medium text-white bg-[#111] rounded-md hover:bg-[#333] transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => goTo('Terms')}
                className="px-5 py-2.5 text-[13px] font-medium text-[#111] bg-white border border-[#E5E5E5] rounded-md hover:border-[#111] transition-colors"
              >
                Terms
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mobile sticky switcher */}
      <div className="lg:hidden sticky top-16 md:top-[72px] z-20 bg-white/95 backdrop-blur border-b border-[#E5E5E5]">
        <div className="grid grid-cols-2">
          {[
            { id: 'privacy', label: 'Privacy' },
            { id: 'Terms', label: 'Terms' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => goTo(t.id)}
              className={`relative py-3 text-[13px] font-medium transition-colors ${
                part === t.id ? 'text-[#111]' : 'text-[#737373]'
              }`}
            >
              {t.label}
              {part === t.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF5A1F]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-16">
          {/* Desktop TOC */}
          <aside className="hidden lg:block">
            <nav className="sticky top-32 space-y-7" aria-label="Contents">
              {[
                { id: 'privacy', label: 'Privacy', list: privacy, key: 'p-' },
                { id: 'Terms', label: 'Terms', list: terms, key: 't-' },
              ].map((g) => (
                <div key={g.id}>
                  <button
                    onClick={() => goTo(g.id)}
                    className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#111] mb-3 hover:text-[#FF5A1F] transition-colors"
                  >
                    {g.label}
                  </button>
                  <ul className="border-l border-[#E5E5E5]">
                    {g.list.map((s) => (
                      <li key={s.id}>
                        <button
                          onClick={() => goTo(s.id)}
                          className={`block w-full text-left -ml-px pl-4 py-1.5 text-[13px] border-l-2 transition-colors ${
                            active === s.id
                              ? 'border-[#FF5A1F] text-[#111] font-medium'
                              : 'border-transparent text-[#737373] hover:text-[#111]'
                          }`}
                        >
                          {s.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 max-w-[780px]">
            {/* PRIVACY */}
            <div id="privacy" className="scroll-mt-36">
              <ScrollReveal>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] mb-3">
                  Part 1
                </p>
                <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-3">
                  Privacy by architecture, not by policy.
                </h2>
                <p className="text-[15px] text-[#737373] leading-relaxed mb-8">
                  Because there is no backend server collecting your financial data, your
                  information remains strictly under your control.
                </p>
              </ScrollReveal>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#E5E5E5] border border-[#E5E5E5] rounded-xl overflow-hidden mb-6">
                {facts.map((f, i) => (
                  <ScrollReveal key={f.title} delay={i * 60}>
                    <div className="bg-white p-5 md:p-6 h-full">
                      <f.icon size={18} className="text-[#FF5A1F] mb-4" />
                      <h3 className="text-[14px] font-semibold text-[#111] mb-1.5 tracking-tight">
                        {f.title}
                      </h3>
                      <p className="text-[13.5px] text-[#737373] leading-relaxed">{f.text}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              {renderSections(privacy, 'P')}
            </div>

            {/* TERMS */}
            <div id="Terms" className="scroll-mt-36 mt-16 md:mt-24 pt-12 border-t-2 border-[#111]">
              <ScrollReveal>
                <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#FF5A1F] mb-3">
                  Part 2
                </p>
                <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-[#111] mb-3">
                  Terms
                </h2>
                <p className="text-[15px] text-[#737373] leading-relaxed mb-4">
                  Conditions for using the Invoicer application codebase and local client-side
                  software.
                </p>
              </ScrollReveal>

              {renderSections(terms, 'T')}
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="bg-[#111]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-tight tracking-tight text-white mb-3">
                  True data ownership starts locally.
                </h2>
                <p className="text-[15px] text-white/60 max-w-[520px]">
                  Open Invoicer and start creating professional documents instantly with total
                  client-side privacy.
                </p>
              </div>
              <div className="lg:col-span-5">
                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    to="/editor"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-white bg-[#FF5A1F] rounded-md hover:bg-[#E84E15] transition-colors"
                  >
                    Open Editor
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    to="/faq"
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-[14px] font-medium text-white border border-white/20 rounded-md hover:bg-white/5 transition-colors"
                  >
                    Read the FAQ
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