import React, { useState } from 'react';
import { Icon } from './Icon';

interface AccordionSectionProps {
  index: string;
  title: string;
  completed?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AccordionSection({ index, title, completed = false, children, defaultOpen = false }: AccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={handleToggle}
        onTouchEnd={handleToggle}
        className="w-full flex items-center gap-2.5 md:gap-3 py-3 px-3.5 md:py-4 md:px-4 hover:bg-background-subtle/60 transition-colors text-left cursor-pointer touch-manipulation select-none"
        aria-expanded={isOpen}
      >
        <span className="text-xs md:text-sm font-semibold text-accent font-mono">({index})</span>
        <h3 className="flex-1 text-xs md:text-sm font-semibold text-foreground truncate">{title}</h3>
        {completed && (
          <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-success flex items-center justify-center flex-shrink-0">
            <Icon name="check" size={14} weight="bold" color="white" />
          </div>
        )}
        <Icon
          name="caret-down"
          size={18}
          className={`text-muted transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-3.5 pb-4 pt-1 md:px-4 md:pb-5 text-xs md:text-sm text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  );
}

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ children, className = '' }: AccordionProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}