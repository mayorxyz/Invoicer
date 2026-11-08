import React, { useMemo } from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { SampleBanner } from '../components/ui/SampleBanner';
import { formatMoney } from '../lib/money';
import { derivedStatus } from '../lib/status';

export function ReportsPage() {
  const { state, dismissDemo } = useStore();
  const isDemo = !state.settings.demoDismissed && state.invoices.length === 0;

  // Calculate report statistics
  const stats = useMemo(() => {
    const invoices = state.invoices;
    
    // Revenue by month
    const revenueByMonth: Record<string, number> = {};
    invoices.forEach(inv => {
      const status = inv.status || derivedStatus(inv);
      if (status === 'cancelled') return;
      const month = inv.issueDate.substring(0, 7); // YYYY-MM
      const total = inv.items.reduce((sum, item) => sum + (item.qty * item.price), 0);
      revenueByMonth[month] = (revenueByMonth[month] || 0) + total;
    });

    // Total statistics (respects invoice status, excludes cancelled)
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;

    invoices.forEach(inv => {
      const status = inv.status || derivedStatus(inv);
      const total = inv.items.reduce((s, item) => s + item.qty * item.price, 0);
      const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
      const balance = Math.max(0, total - paid);

      // Exclude cancelled invoices from all dashboard stats entirely
      if (status === 'cancelled') return;

      totalInvoiced += total;

      if (status === 'paid') {
        // If manually marked as paid, the entire invoice total counts as paid
        totalPaid += total;
      } else {
        // Otherwise, only count actual recorded payments
        totalPaid += paid;
        // The remaining balance is outstanding
        totalOutstanding += balance;

        if (status === 'overdue') {
          totalOverdue += balance;
        }
      }
    });

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
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
      amount,
    }));
  }, [stats.revenueByMonth]);

  const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

  // Unified stat items for consistent desktop/mobile rendering
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
        <div className="space-y-4 md:space-y-6">
          {/* Statistics Section: Unified Desktop/Mobile Grid */}
          <div>
            {/* Desktop 4-col Grid */}
            <div className="hidden lg:grid grid-cols-4 gap-4">
              {statItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-surface border border-border/80 rounded-xl px-4 py-3 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-bold tracking-wider text-muted">{item.label}</span>
                    <span className="text-sm text-muted/80">{item.icon}</span>
                  </div>
                  <span className={`text-lg font-bold mt-2 truncate ${item.color}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Mobile 2x2 Grid */}
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

          {/* Charts & Data Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Revenue Trend Chart */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground">Revenue Trend</h3>
                  <p className="text-xs text-muted mt-0.5">Gross revenue over the last 6 months</p>
                </div>
              </div>
              
              <div className="relative h-48 md:h-64 w-full">
                {/* Y-axis grid lines */}
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-muted pointer-events-none">
                  {[1, 0.75, 0.5, 0.25, 0].map((tick, i) => (
                    <div key={i} className="flex items-center w-full">
                      <span className="w-12 md:w-16 text-right pr-2 md:pr-3 tabular-nums text-[10px] md:text-xs">
                        {formatMoney(Math.round(maxAmount * tick), state.settings.homeCurrency)}
                      </span>
                      <div className="flex-1 border-t border-border/30 border-dashed" />
                    </div>
                  ))}
                </div>
                
                {/* Bars */}
                <div className="absolute inset-0 pl-14 md:pl-20 flex items-end justify-between gap-2 md:gap-4 pt-6 pb-6">
                  {chartData.map((data, i) => {
                    const heightPercent = maxAmount > 0 ? (data.amount / maxAmount) * 100 : 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <div className="relative w-full flex flex-col justify-end h-full">
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-foreground text-background text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-sm">
                            {formatMoney(data.amount, state.settings.homeCurrency)}
                          </div>
                          <div
                            className="w-full bg-accent/80 hover:bg-accent rounded-t-md transition-all duration-300 relative overflow-hidden"
                            style={{ height: `${Math.max(heightPercent, 2)}%` }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                          </div>
                        </div>
                        <span className="text-[10px] md:text-xs text-muted font-medium truncate w-full text-center">
                          {data.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Top Clients List */}
            <div className="lg:col-span-1 bg-surface border border-border rounded-xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-sm md:text-base font-semibold text-foreground">Top Clients</h3>
                  <p className="text-xs text-muted mt-0.5">By total invoiced amount</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {stats.topClients.length > 0 ? stats.topClients.map((client, i) => {
                  const maxClientRevenue = stats.topClients[0]?.total || 1;
                  const percentage = (client.total / maxClientRevenue) * 100;
                  
                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between text-xs md:text-sm gap-2 mb-1.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/10 text-accent text-[10px] font-bold flex items-center justify-center">
                            {i + 1}
                          </span>
                          <span className="font-medium text-foreground truncate">{client.name}</span>
                        </div>
                        <span className="text-muted tabular-nums font-semibold flex-shrink-0 text-xs md:text-sm">
                          {formatMoney(client.total, state.settings.homeCurrency)}
                        </span>
                      </div>
                      <div className="w-full bg-background border border-border/40 rounded-full h-1.5 md:h-2 overflow-hidden">
                        <div
                          className="bg-accent h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center py-8 text-muted text-sm">No client data available yet.</div>
                )}
              </div>
            </div>

          </div>
        </div>
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