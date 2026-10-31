import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { SampleBanner } from '../components/ui/SampleBanner';
import { SamplePill } from '../components/ui/SamplePill';
import { ExpenseDialog } from '../components/ui/ExpenseDialog';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { Icon } from '../components/ui/Icon';
import { Select } from '../components/ui/Select';
import { formatMoney } from '../lib/money';
import { formatDateLocale } from '../lib/dates';
import { v4 as uuid } from 'uuid';
import type { Expense } from '../types';

export function ExpensesPage() {
  const { state, dismissDemo, addExpense, deleteExpense } = useStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const isDemo = !state.settings.demoDismissed && state.expenses.length === 0;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(state.expenses.map(exp => exp.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [state.expenses]);

  // Calculate statistics
  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonthStr = `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`;

    const thisMonth = state.expenses
      .filter(exp => exp.date.startsWith(currentMonth))
      .reduce((sum, exp) => sum + exp.amount, 0);

    const lastMonthTotal = state.expenses
      .filter(exp => exp.date.startsWith(lastMonthStr))
      .reduce((sum, exp) => sum + exp.amount, 0);

    // Top category
    const categoryTotals: Record<string, number> = {};
    state.expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    const topCategory = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)[0];

    // Total expenses
    const totalExpenses = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);

    return {
      thisMonth,
      lastMonth: lastMonthTotal,
      topCategory: topCategory ? topCategory[0] : '—',
      totalExpenses,
    };
  }, [state.expenses]);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return state.expenses.filter(exp => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesVendor = exp.vendor.toLowerCase().includes(query);
        const matchesCategory = exp.category.toLowerCase().includes(query);
        if (!matchesVendor && !matchesCategory) return false;
      }

      if (categoryFilter !== 'all' && exp.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [state.expenses, searchQuery, categoryFilter]);

  const handleAddExpense = () => {
    setEditingExpense(undefined);
    setDialogOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setDialogOpen(true);
  };

  const handleDeleteExpense = (expense: Expense) => {
    setExpenseToDelete(expense);
    setDeleteConfirmOpen(true);
  };

  const handleSaveExpense = (expenseData: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      deleteExpense(editingExpense.id);
    }
    addExpense({
      id: uuid(),
      ...expenseData,
    });
    toast('success', editingExpense ? 'Expense updated successfully' : 'Expense added successfully');
  };

  const handleConfirmDelete = () => {
    if (expenseToDelete) {
      deleteExpense(expenseToDelete.id);
      toast('success', 'Expense deleted', {
        label: 'Undo',
        onClick: () => {
          addExpense(expenseToDelete);
        },
      });
      setExpenseToDelete(null);
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (exp: Expense) => <span className="text-xs md:text-sm text-muted">{formatDateLocale(exp.date, state.settings.locale)}</span>,
    },
    {
      key: 'vendor',
      label: 'Vendor',
      render: (exp: Expense) => (
        <div className="min-w-0">
          <div className="font-medium text-xs md:text-sm truncate text-foreground">{exp.vendor}</div>
          {isDemo && <SamplePill />}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (exp: Expense) => <span className="text-xs md:text-sm text-muted truncate">{exp.category}</span>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (exp: Expense) => <span className="text-xs md:text-sm font-medium text-foreground">{formatMoney(exp.amount * 100, exp.currency)}</span>,
      className: 'text-right',
    },
    {
      key: 'actions',
      label: '',
      render: (exp: Expense) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditExpense(exp);
            }}
            className="p-1.5 hover:bg-background-subtle rounded-md transition-colors text-muted hover:text-foreground cursor-pointer"
            title="Edit"
            aria-label={`Edit expense from ${exp.vendor}`}
          >
            <Icon name="pencil-simple" size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteExpense(exp);
            }}
            className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors cursor-pointer"
            title="Delete"
            aria-label={`Delete expense from ${exp.vendor}`}
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const statItems = [
    { label: 'This Month', value: formatMoney(stats.thisMonth * 100, state.settings.homeCurrency), icon: '$' },
    { label: 'Last Month', value: formatMoney(stats.lastMonth * 100, state.settings.homeCurrency), icon: '←' },
    { label: 'Top Category', value: stats.topCategory, icon: '#' },
    { label: 'Total', value: formatMoney(stats.totalExpenses * 100, state.settings.homeCurrency), icon: 'Σ' },
  ];

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader
        title="Expenses"
        subtitle={`${state.expenses.length} total`}
        action={{
          label: 'Add Expense',
          onClick: handleAddExpense,
          icon: 'plus',
        }}
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {/* Statistics Section: Desktop Cards vs Mobile 2x2 Grid */}
      <div className="mb-4">
        {/* Desktop StatCards */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          <StatCard
            label="This Month"
            value={formatMoney(stats.thisMonth * 100, state.settings.homeCurrency)}
            icon="$"
          />
          <StatCard
            label="Last Month"
            value={formatMoney(stats.lastMonth * 100, state.settings.homeCurrency)}
            icon="←"
          />
          <StatCard
            label="Top Category"
            value={stats.topCategory}
            icon="#"
          />
          <StatCard
            label="Total"
            value={formatMoney(stats.totalExpenses * 100, state.settings.homeCurrency)}
            icon="Σ"
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
              <span className="text-xs md:text-sm font-bold mt-1 truncate text-foreground">
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
              placeholder="Search expenses by vendor or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs md:text-sm"
            aria-label="Filter expenses by category"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
        </div>
      </div>

      {/* Data Table / Mobile Cards / Empty State */}
      {filteredExpenses.length > 0 ? (
        <>
          {/* Desktop Data Table */}
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <DataTable
              columns={columns}
              data={filteredExpenses}
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="lg:hidden flex flex-col gap-2">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                onClick={() => handleEditExpense(exp)}
                className="p-3 bg-surface border border-border/80 rounded-xl transition-all cursor-pointer shadow-xs hover:border-border flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">{exp.vendor}</span>
                      {isDemo && <SamplePill />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted">
                      <span>{formatDateLocale(exp.date, state.settings.locale)}</span>
                      {exp.category && <span>• {exp.category}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-semibold text-foreground block">
                      {formatMoney(exp.amount * 100, exp.currency)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditExpense(exp);
                    }}
                    className="p-1.5 hover:bg-background-subtle rounded-md text-muted hover:text-foreground transition-colors"
                    aria-label={`Edit expense from ${exp.vendor}`}
                  >
                    <Icon name="pencil-simple" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExpense(exp);
                    }}
                    className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors"
                    aria-label={`Delete expense from ${exp.vendor}`}
                  >
                    <Icon name="trash" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon="receipt"
          title="No expenses found"
          description={searchQuery || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first expense to get started'}
          action={!searchQuery && categoryFilter === 'all' ? {
            label: 'Add Expense',
            onClick: handleAddExpense,
          } : undefined}
        />
      )}

      {/* Expense Dialog */}
      <ExpenseDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveExpense}
        initialData={editingExpense}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setExpenseToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete the expense from "${expenseToDelete?.vendor}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}