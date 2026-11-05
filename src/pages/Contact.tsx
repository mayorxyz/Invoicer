import ScrollReveal from '../components/ui/ScrollReveal';
import { Mail, Github, Globe } from 'lucide-react';

export default function Contact() {
  return (
    <div className="pt-16 md:pt-[72px] bg-white text-[#111]">
      {/* Header */}
      <section className="border-b border-[#E4E4E4] bg-[#F7F5F0]">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8 py-16 md:py-24">
          <ScrollReveal>
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.2em] text-[#737373] mb-4">CONTACT</p>
            <h1 className="text-[clamp(2rem,4vw,3.25rem)] font-semibold leading-tight tracking-tight text-[#111] max-w-[700px] mb-6">
              Get in touch.
            </h1>
            <p className="text-[16px] md:text-[18px] text-[#737373] leading-relaxed max-w-[560px]">
              Have questions about Invoicer's local storage architecture, feature requests, or collaboration inquiries? Reach out directly.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="max-w-[1320px] mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <ScrollReveal>
              <div>
                <h2 className="text-[clamp(1.25rem,2.5vw,1.75rem)] font-semibold leading-tight tracking-tight text-[#111] mb-6">
                  Direct communication channels.
                </h2>
                <p className="text-[15px] text-[#737373] leading-relaxed mb-8">
                  Because Invoicer is a fully launched standalone client-side SPA with zero backend telemetry or server infrastructure, support inquiries and direct contact are handled through official developer channels.
                </p>
                <div className="space-y-4">
                  <div className="bg-[#F7F5F0] border border-[#E4E4E4] rounded-lg p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded bg-white border border-[#E4E4E4] flex items-center justify-center text-[#111]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[12px] font-mono uppercase tracking-wider text-[#737373]">Primary Email</p>
                      <a href="mailto:babalolamayor2@gmail.com" className="text-[15px] font-medium text-[#111] hover:underline">
                        babalolamayor2@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="bg-[#F7F5F0] border border-[#E4E4E4] rounded-lg p-6 md:p-8">
                <h3 className="text-[15px] font-semibold text-[#111] mb-6">What you can reach out about</h3>
                <div className="space-y-4">
                  {[
                    'Inquiries regarding multi-currency and multi-tax configurations',
                    'Technical feedback on client-side localStorage and PWA caching',
                    'Suggestions for new document modes or template layouts',
                    'Custom development or contract availability inquiries',
                    'General questions about running Invoicer offline',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#111] mt-2 flex-shrink-0" />
                      <span className="text-[14px] text-[#737373]">{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-[#E4E4E4]">
                  <p className="text-[13px] text-[#737373] leading-relaxed">
                    Response times may vary as Invoicer is actively maintained as an independent high-performance tool.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}