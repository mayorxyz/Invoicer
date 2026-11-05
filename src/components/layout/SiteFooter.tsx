import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

type NavLink = { to: string; label: string; external?: boolean };

const navigationColumns: { label: string; links: NavLink[] }[] = [
  {
    label: 'Product',
    links: [
      { to: '/features', label: 'Features' },
      { to: '/how-it-works', label: 'How It Works' },
      { to: '/pricing', label: 'Pricing' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { to: '/faq', label: 'FAQ' },
      { to: '/legal', label: 'Legal' },
    ],
  },
  {
    label: 'Company',
    links: [
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { to: 'https://x.com/mayor_1st', label: 'X', external: true },
      { to: 'https://www.linkedin.com/in/babalola-mayor-a819742a0/', label: 'LinkedIn', external: true },
    ],
  },
];

export default function SiteFooter() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-[#0f0f0f] text-white relative overflow-hidden">
      {/* Large INVOICER watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[clamp(8rem,20vw,20rem)] font-bold text-white/[0.03] tracking-tighter">
          INVOICER
        </h1>
      </div>

      <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-12 md:py-16 relative z-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-10">
          {/* Newsletter Column */}
          <div className="lg:col-span-4">
            <h3 className="text-[24px] md:text-[28px] font-semibold tracking-tight text-white mb-2">
              Don't miss out
            </h3>
            <p className="text-[13px] md:text-[14px] text-white/60 leading-relaxed mb-6 max-w-[320px]">
              Enter your email for news and updates
            </p>
            <form onSubmit={handleSubmit} className="relative max-w-[360px]">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-[48px] px-5 pr-12 bg-white rounded-lg text-[14px] text-[#111] placeholder:text-[#737373] border-0 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                aria-label="Email address for newsletter"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center text-[#111] hover:translate-x-[3px] transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
            </form>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
            {navigationColumns.map((column) => (
              <div key={column.label}>
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white mb-4">
                  {column.label}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-[13px] text-white/60 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Status: Up</span>
            </div>
            <span className="text-white/40">&copy; {new Date().getFullYear()} Invoicer. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}