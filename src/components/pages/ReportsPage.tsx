import React, { useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader } from '../ui/PageHeader';
import { StatCard } from '../ui/StatCard';
import { EmptyState } from '../ui/EmptyState';
import { SampleBanner } from '../ui/SampleBanner';
import { formatMoney } from '../../lib/money';
import { derivedStatus } from '../../lib/status';

export function ReportsPage() {
  const { state, dismissDemo } = useStore();
  const isDemo = !state.settings.demoDismissed && state.invoices.length === 0;

  // Calculate report statistics
  const stats = useMemo(() => {
    const invoices = state.invoices;
    
    // Revenue by month
    const revenueByMonth: Record<string, number> = {};
    invoices.forEach(inv => {
      const month = inv.issueDate.substring(0, 7); // YYYY-MM
      const total = inv.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + total;
    });

    // Total statistics
    const totalInvoiced = invoices.reduce((sum, inv) => {
      return sum + inv.items.reduce((s, item) => s + (item.qty * item.price), 0);
    }, 0);

    const totalPaid = invoices.reduce((sum, inv) => {
      return sum + inv.payments.reduce((s, p) => s + p.amount, 0);
    }, 0);

    const totalOutstanding = totalInvoiced - totalPaid;

    // Overdue
    const overdueInvoices = invoices.filter(inv => derivedStatus(inv) === 'overdue');
    const totalOverdue = overdueInvoices.reduce((sum, inv) => {
      const total = inv.items.reduce((s, item) => s + (item.qty * item.price), 0);
      const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
      return sum + (total - paid);
    }, 0);

    // Top clients
    const clientRevenue: Record<string, { name: string; total: number }> = {};
    invoices.forEach(inv => {
      const total = inv.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      if (!clientRevenue[inv.clientId]) {
        clientRevenue[inv.clientId] = { name: inv.client.name, total: 0 };
      }
      clientRevenue[inv.clientId].total += total;
    });

    const topClients = Object.values(clientRevenue)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return {
      revenueByMonth,
      totalInvoiced,
      totalPaid,
      totalOutstanding,
      totalOverdue,
      topClients,
    };
  }, [state.invoices]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const months = Object.entries(stats.revenueByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6); // Last 6 months

    return months.map(([month, amount]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      amount,
    }));
  }, [stats.revenueByMonth]);

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  const statItems = [
    { label: 'Total Invoiced', value: formatMoney(stats.totalInvoiced, state.settings.homeCurrency), color: 'text-foreground', icon: '$' },
    { label: 'Total Paid', value: formatMoney(stats.totalPaid, state.settings.homeCurrency), color: 'text-emerald-600 dark:text-emerald-400', icon: '✓' },
    { label: 'Outstanding', value: formatMoney(stats.totalOutstanding, state.settings.homeCurrency), color: 'text-amber-600 dark:text-amber-400', icon: '⏱' },
    { label: 'Overdue', value: formatMoney(stats.totalOverdue, state.settings.homeCurrency), color: 'text-rose-600 dark:text-rose-400', icon: '⚠' },
  ];

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader
        title="Reports"
        subtitle="Financial overview and analytics"
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {state.invoices.length > 0 ? (
        <>
          {/* Statistics Section: Desktop StatCards vs Mobile 2x2 Grid */}
          <div className="mb-4">
            {/* Desktop StatCards */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              <StatCard
                label="Total Invoiced"
                value={formatMoney(stats.totalInvoiced, state.settings.homeCurrency)}
                icon="$"
              />
              <StatCard
                label="Total Paid"
                value={formatMoney(stats.totalPaid, state.settings.homeCurrency)}
                icon="✓"
                className="text-emerald-600 dark:text-emerald-400"
              />
              <StatCard
                label="Outstanding"
                value={formatMoney(stats.totalOutstanding, state.settings.homeCurrency)}
                icon="⏱"
                className="text-amber-600 dark:text-amber-400"
              />
              <StatCard
                label="Overdue"
                value={formatMoney(stats.totalOverdue, state.settings.homeCurrency)}
                icon="⚠"
                className="text-rose-600 dark:text-rose-400"
              />
            </div>

            {/* Mobile Compact 2x2 Grid */}
            <div className="lg:hidden grid grid-cols-2 gap-2">
              {statItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-surface border border-border/80 rounded-xl px-3 py-2.5 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted">{item.label}</span>
                    <span className="text-xs text-muted/80">{item.icon}</span>
                  </div>
                  <span className={`text-xs md:text-sm font-bold mt-1 truncate ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart Container */}
          <div className="bg-surface border border-border rounded-lg p-4 md:p-6 mb-4 shadow-sm">
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-4">Revenue (Last 6 Months)</h3>
            <div className="flex items-end justify-between gap-1.5 md:gap-3 h-36 md:h-48 pt-2">
              {chartData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full">
                  <div className="w-full flex flex-col justify-end h-full">
                    <div
                      className="w-full bg-accent rounded-t transition-all hover:opacity-80 min-h-[4px]"
                      style={{ height: `${Math.max((data.amount / maxAmount) * 100, 3)}%` }}
                      title={formatMoney(data.amount, state.settings.homeCurrency)}
                    />
                  </div>
                  <span className="text-[10px] md:text-xs text-muted truncate">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients Container */}
          <div className="bg-surface border border-border rounded-lg p-4 md:p-6 shadow-sm">
            <h3 className="text-sm md:text-base font-semibold text-foreground mb-4">Top Clients</h3>
            <div className="space-y-3.5">
              {stats.topClients.map((client, i) => {
                const maxClientRevenue = stats.topClients[0]?.total || 1;
                const percentage = (client.total / maxClientRevenue) * 100;
                
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs md:text-sm gap-2">
                      <span className="font-medium text-foreground truncate">{client.name}</span>
                      <span className="text-muted tabular-nums font-medium flex-shrink-0 text-xs">
                        {formatMoney(client.total, state.settings.homeCurrency)}
                      </span>
                    </div>
                    <div className="w-full bg-background border border-border/40 rounded-full h-1.5 md:h-2 overflow-hidden">
                      <div
                        className="bg-accent h-full rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <EmptyState
          icon="chart-bar"
          title="No data available"
          description="Create some documents to see reports and analytics"
        />
      )}
    </div>
  );
}