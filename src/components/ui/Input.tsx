import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helper?: string;
  prefix?: string;
}

export function Input({ label, error, helper, prefix, className = '', id, ...props }: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-foreground font-medium text-xs md:text-sm">
        {label}
      </label>
      <div className="relative w-full">
        {prefix && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted text-xs md:text-sm pointer-events-none">
            {prefix}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full bg-surface border rounded-lg text-xs md:text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent transition-all h-10 md:h-11 px-3.5 ${
            prefix ? 'pl-9 md:pl-10' : ''
          } ${error ? 'border-danger focus:ring-danger' : 'border-border hover:border-border-strong'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-[11px] md:text-xs text-danger">{error}</p>}
      {helper && !error && <p className="text-[11px] md:text-xs text-muted">{helper}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}

export function Select({ label, error, helper, children, className = '', id, ...props }: SelectProps) {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={selectId} className="text-foreground font-medium text-xs md:text-sm">
        {label}
      </label>
      <div className="relative w-full">
        <select
          id={selectId}
          className={`w-full bg-surface border rounded-lg text-xs md:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent transition-all appearance-none cursor-pointer h-10 md:h-11 px-3.5 pr-8 ${
            error ? 'border-danger focus:ring-danger' : 'border-border hover:border-border-strong'
          } ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-[11px] md:text-xs text-danger">{error}</p>}
      {helper && !error && <p className="text-[11px] md:text-xs text-muted">{helper}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helper?: string;
}

export function Textarea({ label, error, helper, className = '', id, ...props }: TextareaProps) {
  const textareaId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={textareaId} className="text-foreground font-medium text-xs md:text-sm">
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`w-full bg-surface border rounded-lg text-xs md:text-sm text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-1 focus:ring-accent transition-all resize-none p-3 ${
          error ? 'border-danger focus:ring-danger' : 'border-border hover:border-border-strong'
        } ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="text-[11px] md:text-xs text-danger">{error}</p>}
      {helper && !error && <p className="text-[11px] md:text-xs text-muted">{helper}</p>}
    </div>
  );
}