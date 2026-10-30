import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { StatCard } from '../components/ui/StatCard';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { SampleBanner } from '../components/ui/SampleBanner';
import { SamplePill } from '../components/ui/SamplePill';
import { TimeEntryDialog } from '../components/ui/TimeEntryDialog';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { Icon } from '../components/ui/Icon';
import { formatMoney } from '../lib/money';
import { formatDateLocale } from '../lib/dates';
import { v4 as uuid } from 'uuid';
import type { TimeEntry } from '../types';

export function TimePage() {
  const { state, dismissDemo, addTimeEntry, updateTimeEntry, deleteTimeEntry } = useStore();
  const { toast } = useToast();
  const isDemo = !state.settings.demoDismissed && state.timeEntries.length === 0;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimeEntry | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<TimeEntry | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalHours = state.timeEntries.reduce((sum, entry) => {
      if (!entry.endTime) return sum;
      const start = new Date(entry.startTime).getTime();
      const end = new Date(entry.endTime).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return sum + hours;
    }, 0);

    const totalValue = state.timeEntries.reduce((sum, entry) => {
      if (!entry.endTime) return sum;
      const start = new Date(entry.startTime).getTime();
      const end = new Date(entry.endTime).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return sum + (hours * entry.rate);
    }, 0);

    const billedEntries = state.timeEntries.filter(entry => entry.endTime).length;

    return {
      totalHours: totalHours.toFixed(1),
      totalValue,
      billedEntries,
      totalEntries: state.timeEntries.length,
    };
  }, [state.timeEntries]);

  const handleAddEntry = () => {
    setEditingEntry(undefined);
    setDialogOpen(true);
  };

  const handleEditEntry = (entry: TimeEntry) => {
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleDeleteEntry = (entry: TimeEntry) => {
    setEntryToDelete(entry);
    setDeleteConfirmOpen(true);
  };

  const handleSaveEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    if (editingEntry) {
      updateTimeEntry({
        id: editingEntry.id,
        ...entryData,
      });
      toast('success', 'Time entry updated successfully');
    } else {
      addTimeEntry({
        id: uuid(),
        ...entryData,
      });
      toast('success', 'Time entry added successfully');
    }
  };

  const handleConfirmDelete = () => {
    if (entryToDelete) {
      deleteTimeEntry(entryToDelete.id);
      toast('success', 'Time entry deleted', {
        label: 'Undo',
        onClick: () => {
          addTimeEntry(entryToDelete);
        },
      });
      setEntryToDelete(null);
    }
  };

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (entry: TimeEntry) => <span className="text-xs md:text-sm text-muted">{formatDateLocale(entry.startTime.split('T')[0], state.settings.locale)}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (entry: TimeEntry) => (
        <div className="min-w-0">
          <div className="font-medium text-xs md:text-sm truncate text-foreground">{entry.description}</div>
          <div className="text-[11px] text-muted truncate">{entry.project}</div>
          {isDemo && <SamplePill />}
        </div>
      ),
    },
    {
      key: 'duration',
      label: 'Duration',
      render: (entry: TimeEntry) => {
        if (!entry.endTime) return '—';
        const start = new Date(entry.startTime).getTime();
        const end = new Date(entry.endTime).getTime();
        const hours = (end - start) / (1000 * 60 * 60);
        return <span className="text-xs md:text-sm text-muted">{hours.toFixed(1)}h</span>;
      },
    },
    {
      key: 'rate',
      label: 'Rate',
      render: (entry: TimeEntry) => <span className="text-xs md:text-sm text-muted">{formatMoney(entry.rate * 100, entry.currency)}/hr</span>,
    },
    {
      key: 'value',
      label: 'Value',
      render: (entry: TimeEntry) => {
        if (!entry.endTime) return '—';
        const start = new Date(entry.startTime).getTime();
        const end = new Date(entry.endTime).getTime();
        const hours = (end - start) / (1000 * 60 * 60);
        return <span className="text-xs md:text-sm font-medium text-foreground">{formatMoney(hours * entry.rate * 100, entry.currency)}</span>;
      },
      className: 'text-right',
    },
    {
      key: 'actions',
      label: '',
      render: (entry: TimeEntry) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditEntry(entry);
            }}
            className="p-1.5 hover:bg-background-subtle rounded-md transition-colors text-muted hover:text-foreground cursor-pointer"
            title="Edit"
            aria-label={`Edit time entry ${entry.description}`}
          >
            <Icon name="pencil-simple" size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteEntry(entry);
            }}
            className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors cursor-pointer"
            title="Delete"
            aria-label={`Delete time entry ${entry.description}`}
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  const statItems = [
    { label: 'Total Hours', value: `${stats.totalHours}h`, icon: '⏱' },
    { label: 'Total Value', value: formatMoney(stats.totalValue * 100, state.settings.homeCurrency), icon: '$' },
    { label: 'Billed Entries', value: stats.billedEntries, icon: '✓' },
    { label: 'Total Entries', value: stats.totalEntries, icon: '#' },
  ];

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader
        title="Time Tracking"
        subtitle={`${state.timeEntries.length} entries`}
        action={{
          label: 'Add Entry',
          onClick: handleAddEntry,
          icon: 'plus',
        }}
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {/* Statistics Section: Desktop StatCards vs Mobile 2x2 Grid */}
      <div className="mb-4">
        {/* Desktop StatCards */}
        <div className="hidden lg:grid grid-cols-4 gap-4">
          <StatCard
            label="Total Hours"
            value={`${stats.totalHours}h`}
            icon="⏱"
          />
          <StatCard
            label="Total Value"
            value={formatMoney(stats.totalValue * 100, state.settings.homeCurrency)}
            icon="$"
          />
          <StatCard
            label="Billed Entries"
            value={stats.billedEntries}
            icon="✓"
          />
          <StatCard
            label="Total Entries"
            value={stats.totalEntries}
            icon="#"
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

      {/* Data Table / Mobile Cards / Empty State */}
      {state.timeEntries.length > 0 ? (
        <>
          {/* Desktop Data Table */}
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <DataTable
              columns={columns}
              data={state.timeEntries}
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="lg:hidden flex flex-col gap-2">
            {state.timeEntries.map((entry) => {
              let hoursStr = '—';
              let valueStr = '—';
              if (entry.endTime) {
                const start = new Date(entry.startTime).getTime();
                const end = new Date(entry.endTime).getTime();
                const hours = (end - start) / (1000 * 60 * 60);
                hoursStr = `${hours.toFixed(1)}h`;
                valueStr = formatMoney(hours * entry.rate * 100, entry.currency);
              }

              return (
                <div
                  key={entry.id}
                  onClick={() => handleEditEntry(entry)}
                  className="p-3 bg-surface border border-border/80 rounded-xl transition-all cursor-pointer shadow-xs hover:border-border flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground truncate">{entry.description}</span>
                        {isDemo && <SamplePill />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted">
                        <span>{formatDateLocale(entry.startTime.split('T')[0], state.settings.locale)}</span>
                        {entry.project && <span>• {entry.project}</span>}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-foreground block">
                        {valueStr}
                      </span>
                      <span className="text-[10px] text-muted">{hoursStr} @ {formatMoney(entry.rate * 100, entry.currency)}/hr</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditEntry(entry);
                      }}
                      className="p-1.5 hover:bg-background-subtle rounded-md text-muted hover:text-foreground transition-colors"
                      aria-label={`Edit time entry ${entry.description}`}
                    >
                      <Icon name="pencil-simple" size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEntry(entry);
                      }}
                      className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors"
                      aria-label={`Delete time entry ${entry.description}`}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <EmptyState
          icon="timer"
          title="No time entries"
          description="Start tracking your time to see entries here"
          action={{
            label: 'Add Entry',
            onClick: handleAddEntry,
          }}
        />
      )}

      {/* Time Entry Dialog */}
      <TimeEntryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveEntry}
        initialData={editingEntry}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setEntryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Time Entry"
        description={`Are you sure you want to delete "${entryToDelete?.description}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}