import React from 'react';
import type { Status } from '../../types';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig: Record<Status, { label: string; className: string }> = {
  draft: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
  sent: { label: 'Sent', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  paid: { label: 'Paid', className: 'bg-success/10 text-success' },
  partial: { label: 'Partial', className: 'bg-warning/10 text-warning' },
  overdue: { label: 'Overdue', className: 'bg-danger/10 text-danger' },
  cancelled: { label: 'Cancelled', className: 'bg-muted text-muted-foreground' },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
