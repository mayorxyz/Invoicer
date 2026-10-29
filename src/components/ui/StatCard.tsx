import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
  };
  icon?: string;
}

export function StatCard({ label, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 md:p-5">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs font-medium text-muted uppercase tracking-wide">{label}</p>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <span className="text-accent text-sm">{icon}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-foreground tabular-nums">{value}</p>
        {change && (
          <span className={`text-xs font-medium ${
            change.trend === 'up' ? 'text-success' : 
            change.trend === 'down' ? 'text-danger' : 
            'text-muted'
          }`}>
            {change.value}
          </span>
        )}
      </div>
    </div>
  );
}
