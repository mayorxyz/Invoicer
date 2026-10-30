import React from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { SampleBanner } from '../components/ui/SampleBanner';
import { formatDateLocale } from '../lib/dates';

export function HistoryPage() {
  const { state, dismissDemo } = useStore();
  const isDemo = !state.settings.demoDismissed && state.invoices.length === 0;

  // For now, show a simple activity log based on documents
  const activities = state.invoices.map(inv => ({
    id: inv.id,
    type: 'created',
    description: `Created ${inv.mode} ${inv.number}`,
    timestamp: inv.createdAt,
    documentNumber: inv.number,
  }));

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-20 lg:pb-8">
      <PageHeader
        title="History"
        subtitle="Activity log"
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {activities.length > 0 ? (
        <div className="bg-surface border border-border rounded-lg shadow-sm">
          <div className="divide-y divide-border">
            {activities.map(activity => (
              <div key={activity.id} className="p-3.5 md:p-4 flex items-start gap-3 md:gap-4">
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-accent text-xs md:text-sm font-bold">•</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm font-medium text-foreground truncate">{activity.description}</p>
                  <p className="text-[11px] md:text-xs text-muted mt-0.5">
                    {formatDateLocale(activity.timestamp.split('T')[0], state.settings.locale)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState
          icon="history"
          title="No activity yet"
          description="Your activity history will appear here"
        />
      )}
    </div>
  );
}