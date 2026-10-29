import React from 'react';
import { Icon } from './Icon';
import { Button } from './Button';

interface EmptyStateProps {
  icon: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4 text-center">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mb-3.5 md:mb-4 shadow-sm">
        <Icon name={icon} size={28} className="text-muted" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-1.5">{title}</h3>
      {description && (
        <p className="text-xs md:text-sm text-muted max-w-xs md:max-w-md mb-5 leading-relaxed">{description}</p>
      )}
      {action && (
        <Button variant="primary" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}