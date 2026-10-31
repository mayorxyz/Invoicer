import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { SampleBanner } from '../components/ui/SampleBanner';
import { SamplePill } from '../components/ui/SamplePill';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Icon } from '../components/ui/Icon';
import { Select } from '../components/ui/Select';
import { formatMoney } from '../lib/money';
import { formatDateLocale } from '../lib/dates';
import { derivedStatus } from '../lib/status';
import type { Invoice } from '../types';

export function DocumentsPage() {
  const store = useStore();
  const { state, dismissDemo, newDraft, setView, loadDraftFromInvoice } = store;
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number } | null>(null);

  const isDemo = !state.settings.demoDismissed && state.invoices.length === 0;

  // Close menu on scroll/resize so it never floats away from its badge
  useEffect(() => {
    if (!activeDropdownId) return;
    const close = () => setActiveDropdownId(null);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [activeDropdownId]);

  // Calculate statistics
  const stats = useMemo(() => {
    const invoices = state.invoices;
    const totalInvoiced = invoices.reduce((sum, inv) => {
      const total = inv.items.reduce((s, item) => s + item.qty * item.price, 0);
      return sum + total;
    }, 0);

    const totalPaid = invoices.reduce((sum, inv) => {
      return sum + inv.payments.reduce((s, p) => s + p.amount, 0);
    }, 0);

    const totalOutstanding = totalInvoiced - totalPaid;

    const overdueInvoices = invoices.filter(inv => {
      const status = inv.status || derivedStatus(inv);
      return status === 'overdue';
    });

    const totalOverdue = overdueInvoices.reduce((sum, inv) => {
      const total = inv.items.reduce((s, item) => s + item.qty * item.price, 0);
      const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
      return sum + (total - paid);
    }, 0);

    return {
      invoiced: totalInvoiced,
      paid: totalPaid,
      outstanding: totalOutstanding,
      overdue: totalOverdue,
    };
  }, [state.invoices]);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return state.invoices.filter(inv => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesNumber = inv.number.toLowerCase().includes(query);
        const matchesClient = inv.client.name.toLowerCase().includes(query);
        if (!matchesNumber && !matchesClient) return false;
      }

      if (statusFilter !== 'all') {
        const status = inv.status || derivedStatus(inv);
        if (status !== statusFilter) return false;
      }

      if (typeFilter !== 'all') {
        if (inv.mode !== typeFilter) return false;
      }

      return true;
    });
  }, [state.invoices, searchQuery, statusFilter, typeFilter]);

  const handleNewDocument = () => {
    newDraft('invoice');
    setView('editor');
  };

  const handleRowClick = (invoice: Invoice) => {
    loadDraftFromInvoice(invoice);
    setView('editor');
  };

  const handleStatusChange = (invoice: Invoice, newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const updatedInvoice = {
      ...invoice,
      status: newStatus as any,
    };

    if (typeof (store as any).updateInvoice === 'function') {
      (store as any).updateInvoice(updatedInvoice);
    } else if (typeof (store as any).saveInvoice === 'function') {
      (store as any).saveInvoice(updatedInvoice);
    } else {
      console.warn('No explicit invoice update function found on store');
    }

    setActiveDropdownId(null);
  };

  const availableStatuses = ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'];

  const renderStatusSelector = (inv: Invoice) => {
    const currentStatus = inv.status || derivedStatus(inv);
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (activeDropdownId === inv.id) {
            setActiveDropdownId(null);
            return;
          }
          const rect = e.currentTarget.getBoundingClientRect();
          const menuH = 240;
          const openUp = rect.bottom + menuH > window.innerHeight;
          setMenuPos({
            top: openUp ? rect.top - menuH - 8 : rect.bottom + 8,
            left: Math.max(8, rect.right - 160),
          });
          setActiveDropdownId(inv.id);
        }}
        className="cursor-pointer focus:outline-none transition-transform active:scale-95"
        title="Click to change status"
      >
        <StatusBadge status={currentStatus} />
      </button>
    );
  };

  const columns = [
    {
      key: 'number',
      label: 'Number',
      render: (inv: Invoice) => (
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs md:text-sm font-medium text-foreground">{inv.number}</span>
          {isDemo && <SamplePill />}
        </div>
      ),
    },
    {
      key: 'client',
      label: 'Client',
      render: (inv: Invoice) => <span className="truncate block text-xs md:text-sm text-foreground">{inv.client.name || '—'}</span>,
    },
    {
      key: 'issueDate',
      label: 'Issued',
      render: (inv: Invoice) => <span className="text-xs md:text-sm text-muted">{formatDateLocale(inv.issueDate, state.settings.locale)}</span>,
    },
    {
      key: 'dueDate',
      label: 'Due',
      render: (inv: Invoice) => <span className="text-xs md:text-sm text-muted">{formatDateLocale(inv.dueDate, state.settings.locale)}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      render: (inv: Invoice) => {
        const total = inv.items.reduce((sum, item) => sum + item.qty * item.price, 0);
        return <span className="text-xs md:text-sm font-medium text-foreground">{formatMoney(total, inv.currency)}</span>;
      },
      className: 'text-right',
    },
    {
      key: 'status',
      label: 'Status',
      render: (inv: Invoice) => renderStatusSelector(inv),
    },
  ];

  const statItems = [
    { label: 'Invoiced', value: formatMoney(stats.invoiced, state.settings.homeCurrency), color: 'text-foreground', icon: '$' },
    { label: 'Paid', value: formatMoney(stats.paid, state.settings.homeCurrency), color: 'text-emerald-600 dark:text-emerald-400', icon: '✓' },
    { label: 'Outstanding', value: formatMoney(stats.outstanding, state.settings.homeCurrency), color: 'text-amber-600 dark:text-amber-400', icon: '⏱' },
    { label: 'Overdue', value: formatMoney(stats.overdue, state.settings.homeCurrency), color: 'text-rose-600 dark:text-rose-400', icon: '⚠' },
  ];

  const menuInvoice = activeDropdownId
    ? state.invoices.find(i => i.id === activeDropdownId)
    : null;

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader
        title="Documents"
        subtitle={`${state.invoices.length} total`}
        action={{
          label: 'New Document',
          onClick: handleNewDocument,
          icon: 'plus',
        }}
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {/* Statistics Section */}
      <div className="mb-4">
        <div className="hidden lg:grid grid-cols-4 gap-4">
          <StatCard
            label="Invoiced"
            value={formatMoney(stats.invoiced, state.settings.homeCurrency)}
            icon="$"
          />
          <StatCard
            label="Paid"
            value={formatMoney(stats.paid, state.settings.homeCurrency)}
            icon="✓"
            className="text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            label="Outstanding"
            value={formatMoney(stats.outstanding, state.settings.homeCurrency)}
            icon="⏱"
            className="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            label="Overdue"
            value={formatMoney(stats.overdue, state.settings.homeCurrency)}
            icon="⚠"
            className="text-rose-600 dark:text-rose-400"
          />
        </div>

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

      {/* Filters Toolbar */}
      <div className="bg-surface border border-border rounded-lg p-3 mb-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
              <Icon name="magnifying-glass" size={15} />
            </span>
            <input
              type="text"
              placeholder="Search by number or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:flex-initial px-3 py-1.5 bg-background border border-border rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="flex-1 md:flex-initial px-3 py-1.5 bg-background border border-border rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            >
              <option value="all">All Types</option>
              <option value="invoice">Invoice</option>
              <option value="quote">Quote</option>
              <option value="receipt">Receipt</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Data Table / Mobile Cards / Empty State */}
      {filteredInvoices.length > 0 ? (
        <>
          {/* Desktop Data Table */}
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <DataTable
              columns={columns}
              data={filteredInvoices}
              onRowClick={handleRowClick}
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="lg:hidden flex flex-col gap-2">
            {filteredInvoices.map((inv) => {
              const total = inv.items.reduce((sum, item) => sum + item.qty * item.price, 0);
              return (
                <div
                  key={inv.id}
                  onClick={() => handleRowClick(inv)}
                  className="p-3 bg-surface border border-border/80 rounded-xl transition-all cursor-pointer shadow-xs hover:border-border flex flex-col gap-2 relative"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-foreground">{inv.number}</span>
                        {isDemo && <SamplePill />}
                      </div>
                      <p className="text-xs text-muted truncate mt-0.5">{inv.client.name || 'No client'}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-foreground block">
                        {formatMoney(total, inv.currency)}
                      </span>
                      <span className="text-[10px] text-muted capitalize">{inv.mode || 'invoice'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50 text-[11px] text-muted">
                    <div className="flex items-center gap-3">
                      <span>Issued: {formatDateLocale(inv.issueDate, state.settings.locale)}</span>
                      <span>Due: {formatDateLocale(inv.dueDate, state.settings.locale)}</span>
                    </div>
                    {renderStatusSelector(inv)}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyState
          icon="file-text"
          title="No documents found"
          description={searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? 'Try adjusting your search or filters' : 'Create your first document to get started'}
          action={!searchQuery && statusFilter === 'all' && typeFilter === 'all' ? {
            label: 'Create Document',
            onClick: handleNewDocument,
          } : undefined}
        />
      )}

      {/* Status menu: rendered on document.body so no parent can clip or scroll it */}
      {menuInvoice && menuPos &&
        createPortal(
          <>
            <div
              className="fixed inset-0 z-[100] bg-black/20"
              onClick={(e) => { e.stopPropagation(); setActiveDropdownId(null); }}
            />
            <div
              className="fixed z-[101] w-40 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden py-1"
              style={{ top: menuPos.top, left: menuPos.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-3 py-1.5 text-[10px] font-bold text-muted uppercase tracking-wider border-b border-border/50">
                Change Status
              </p>
              {availableStatuses.map((st) => {
                const current = menuInvoice.status || derivedStatus(menuInvoice);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={(e) => handleStatusChange(menuInvoice, st, e)}
                    className={`w-full text-left px-3 py-2 text-xs capitalize flex items-center justify-between cursor-pointer ${
                      current === st
                        ? 'bg-accent/10 font-semibold text-accent'
                        : 'text-foreground hover:bg-background-subtle'
                    }`}
                  >
                    <span>{st}</span>
                    {current === st && <Icon name="check" size={14} color="var(--accent)" />}
                  </button>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </div>
  );
}