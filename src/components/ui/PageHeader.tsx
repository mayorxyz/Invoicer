import React from 'react';
import { Icon } from './Icon';
import { Button } from './Button';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: string;
  };
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action, children }: PageHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight truncate">{title}</h1>
          {subtitle && <p className="text-sm text-muted mt-1 truncate">{subtitle}</p>}
        </div>
        {action && (
          <div className="flex-shrink-0">
            <Button variant="primary" onClick={action.onClick} icon={action.icon} className="w-full sm:w-auto">
              {action.label}
            </Button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
