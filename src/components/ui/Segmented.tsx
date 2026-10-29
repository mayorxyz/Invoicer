import React from 'react';

interface SegmentedOption {
  value: string;
  label: string;
  count?: number;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Segmented({ options, value, onChange, className = '' }: SegmentedProps) {
  return (
    <div className={`inline-flex bg-surface rounded-pill p-1 gap-1 ${className}`}>
      {options.map(option => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 text-sm font-medium rounded-pill transition-all duration-150 ${
            value === option.value
              ? 'bg-white border border-border shadow-sm text-ink'
              : 'text-slate hover:text-ink'
          }`}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1 text-xs text-slate">({option.count})</span>
          )}
        </button>
      ))}
    </div>
  );
}

interface PillProps {
  status: 'draft' | 'sent' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  children: React.ReactNode;
  className?: string;
}

export function Pill({ status, children, className = '' }: PillProps) {
  const statusClasses = {
    draft: 'bg-surface text-slate',
    sent: 'bg-info-tint text-info',
    paid: 'bg-success-tint text-success',
    partial: 'bg-warning-tint text-warning',
    overdue: 'bg-danger-tint text-danger',
    cancelled: 'bg-surface text-slate',
  };
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-xs font-medium ${statusClasses[status]} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

interface BadgeProps {
  value: string;
  variant?: 'success' | 'danger' | 'warning' | 'info';
  className?: string;
}

export function Badge({ value, variant = 'success', className = '' }: BadgeProps) {
  const variantClasses = {
    success: 'bg-success-tint text-success',
    danger: 'bg-danger-tint text-danger',
    warning: 'bg-warning-tint text-warning',
    info: 'bg-info-tint text-info',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-pill text-xs font-medium ${variantClasses[variant]} ${className}`}>
      {value}
    </span>
  );
}
