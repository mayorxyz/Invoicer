import React from 'react';
import { Icon } from './Icon';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, className = '', padding = 'md' }: CardProps) {
  const paddingClasses = {
    sm: 'p-3 md:p-4',
    md: 'p-4 md:p-6',
    lg: 'p-5 md:p-8',
  };
  
  return (
    <div className={`bg-surface border border-border rounded-2xl shadow-sm ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaVariant?: 'success' | 'danger';
  sparkline?: number[];
  className?: string;
}

export function StatCard({ label, value, delta, deltaVariant = 'success', sparkline, className = '' }: StatCardProps) {
  return (
    <Card className={`flex flex-col justify-between ${className}`} padding="md">
      <div className="flex flex-col gap-1.5 md:gap-2">
        <p className="text-[11px] md:text-xs font-semibold text-muted uppercase tracking-wider truncate">{label}</p>
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg md:text-2xl font-bold tracking-tight text-foreground truncate">{value}</p>
          {delta && (
            <span className={`text-[11px] md:text-xs font-medium flex-shrink-0 ${deltaVariant === 'success' ? 'text-success' : 'text-danger'}`}>
              {delta}
            </span>
          )}
        </div>
        {sparkline && sparkline.length > 0 && (
          <div className="flex items-end h-7 md:h-8 mt-2 gap-1">
            {sparkline.map((val, i) => {
              const max = Math.max(...sparkline, 1);
              const height = (val / max) * 100;
              const isLast = i === sparkline.length - 1;
              return (
                <div
                  key={i}
                  className={`flex-1 transition-all rounded-xs ${isLast ? 'bg-accent' : 'bg-border/60'}`}
                  style={{ height: `${Math.max(height, 8)}%` }}
                />
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon = 'file', title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-10 px-4 md:py-16 md:px-6 ${className}`}>
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-3.5 md:mb-4">
        <Icon name={icon} size={28} weight="duotone" color="var(--accent)" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5">{title}</h3>
      {description && <p className="text-xs md:text-sm text-muted mb-4 max-w-xs md:max-w-sm">{description}</p>}
      {action}
    </div>
  );
}