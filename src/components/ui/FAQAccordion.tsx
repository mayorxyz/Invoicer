import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-[#E5E5E5]">
      {items.map((item, index) => (
        <div key={index}>
          <button
            className="w-full flex items-center justify-between py-5 md:py-6 text-left group"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
          >
            <span className="text-[15px] md:text-[16px] font-medium text-[#111] pr-8">
              {item.question}
            </span>
            <ChevronDown
              size={18}
              className={`flex-shrink-0 text-[#737373] transition-transform duration-200 ${
                openIndex === index ? 'rotate-180' : ''
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'max-h-96 pb-5 md:pb-6' : 'max-h-0'
            }`}
          >
            <p className="text-[14px] md:text-[15px] text-[#737373] leading-relaxed pr-8">
              {item.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
