import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/features', label: 'Features' },
  { path: '/how-it-works', label: 'How It Works' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/about', label: 'About' },
  { path: '/faq', label: 'FAQ' },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 md:bg-[#F7F7F5]/80 md:backdrop-blur-xl md:border-b md:border-[#E5E5E5]/60 md:shadow-sm'
            : 'bg-transparent md:bg-white/40 md:backdrop-blur-md'
        }`}
      >
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 h-16 md:h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-[17px] font-semibold tracking-tight text-[#111] hover:opacity-70 transition-opacity"
          >
            Invoicer
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[13px] font-medium tracking-wide transition-colors relative group ${
                  location.pathname === link.path
                    ? 'text-[#111]'
                    : 'text-[#737373] hover:text-[#111]'
                }`}
              >
                {link.label}
                {/* Active state indicator */}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#111] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://invoicer-editor.vercel.app/"
              className="inline-flex items-center px-4 py-2 text-[13px] font-semibold text-white bg-[#111] rounded-md hover:bg-[#333] transition-colors"
            >
              Open App
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2 text-[#111] hover:bg-[#E5E5E5]/50 rounded-md transition-colors"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileOpen}
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Menu Panel */}
          <nav
            className="absolute top-16 left-0 right-0 bg-[#F7F7F5]/95 backdrop-blur-xl border-b border-[#E5E5E5] shadow-xl"
            aria-label="Mobile navigation"
          >
            <div className="px-5 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-3 text-[14px] font-medium rounded-md transition-colors ${
                    location.pathname === link.path
                      ? 'text-[#111] bg-white'
                      : 'text-[#737373] hover:text-[#111] hover:bg-white/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Mobile CTA */}
              <div className="pt-4 border-t border-[#E5E5E5] mt-4">
                <a
                  href="https://invoicer-editor.vercel.app/"
                  className="block w-full text-center px-4 py-3 text-[14px] font-semibold text-white bg-[#111] rounded-md hover:bg-[#333] transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Open App
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}