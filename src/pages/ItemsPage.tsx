import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { PageHeader } from '../components/ui/PageHeader';
import { DataTable } from '../components/ui/DataTable';
import { EmptyState } from '../components/ui/EmptyState';
import { SampleBanner } from '../components/ui/SampleBanner';
import { SamplePill } from '../components/ui/SamplePill';
import { ItemDialog } from '../components/ui/ItemDialog';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { useToast } from '../components/ui/Toast';
import { Icon } from '../components/ui/Icon';
import { formatMoney } from '../lib/money';
import { v4 as uuid } from 'uuid';
import type { SavedItem } from '../types';

export function ItemsPage() {
  const { state, dismissDemo, addSavedItem, deleteSavedItem } = useStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SavedItem | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SavedItem | null>(null);

  const isDemo = !state.settings.demoDismissed && state.savedItems.length === 0;

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(state.savedItems.map(item => item.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [state.savedItems]);

  // Filter items
  const filteredItems = useMemo(() => {
    return state.savedItems.filter(item => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSku = item.sku?.toLowerCase().includes(query);
        if (!matchesName && !matchesSku) return false;
      }

      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [state.savedItems, searchQuery, categoryFilter]);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setDialogOpen(true);
  };

  const handleEditItem = (item: SavedItem) => {
    setEditingItem(item);
    setDialogOpen(true);
  };

  const handleDeleteItem = (item: SavedItem) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleSaveItem = (itemData: Omit<SavedItem, 'id'>) => {
    if (editingItem) {
      deleteSavedItem(editingItem.id);
    }
    addSavedItem({
      id: uuid(),
      ...itemData,
    });
    toast('success', editingItem ? 'Item updated successfully' : 'Item added successfully');
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteSavedItem(itemToDelete.id);
      toast('success', 'Item deleted', {
        label: 'Undo',
        onClick: () => {
          addSavedItem(itemToDelete);
        },
      });
      setItemToDelete(null);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: SavedItem) => (
        <div className="min-w-0">
          <div className="font-medium text-xs md:text-sm truncate text-foreground">{item.name}</div>
          {isDemo && <SamplePill />}
        </div>
      ),
    },
    {
      key: 'sku',
      label: 'SKU',
      render: (item: SavedItem) => (
        <span className="font-mono text-xs md:text-sm text-muted">{item.sku || '—'}</span>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (item: SavedItem) => <span className="text-xs md:text-sm text-muted truncate">{item.category || '—'}</span>,
    },
    {
      key: 'unit',
      label: 'Unit',
      render: (item: SavedItem) => <span className="text-xs md:text-sm text-muted">{item.unit}</span>,
    },
    {
      key: 'price',
      label: 'Price',
      render: (item: SavedItem) => <span className="text-xs md:text-sm font-medium text-foreground">{formatMoney(item.price * 100, state.settings.homeCurrency)}</span>,
      className: 'text-right',
    },
    {
      key: 'actions',
      label: '',
      render: (item: SavedItem) => (
        <div className="flex gap-1 justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditItem(item);
            }}
            className="p-1.5 hover:bg-background-subtle rounded-md transition-colors text-muted hover:text-foreground cursor-pointer"
            title="Edit"
            aria-label={`Edit ${item.name}`}
          >
            <Icon name="pencil-simple" size={15} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteItem(item);
            }}
            className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors cursor-pointer"
            title="Delete"
            aria-label={`Delete ${item.name}`}
          >
            <Icon name="trash" size={15} />
          </button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  return (
    <div className="p-3 md:p-6 lg:p-8 max-w-7xl mx-auto pb-24 lg:pb-8 min-w-0">
      <PageHeader
        title="Items"
        subtitle={`${state.savedItems.length} total`}
        action={{
          label: 'Add Item',
          onClick: handleAddItem,
          icon: 'plus',
        }}
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {/* Filters Toolbar */}
      <div className="bg-surface border border-border rounded-lg p-3 mb-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
              <Icon name="magnifying-glass" size={15} />
            </span>
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-background border border-border rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs md:text-sm"
          >
            <option value="all">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table / Mobile Cards / Empty State */}
      {filteredItems.length > 0 ? (
        <>
          {/* Desktop Data Table */}
          <div className="hidden lg:block overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
            <DataTable
              columns={columns}
              data={filteredItems}
            />
          </div>

          {/* Mobile Card Stack */}
          <div className="lg:hidden flex flex-col gap-2">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleEditItem(item)}
                className="p-3 bg-surface border border-border/80 rounded-xl transition-all cursor-pointer shadow-xs hover:border-border flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-foreground truncate">{item.name}</span>
                      {isDemo && <SamplePill />}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-muted">
                      {item.sku && <span className="font-mono">SKU: {item.sku}</span>}
                      {item.category && <span>• {item.category}</span>}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-semibold text-foreground block">
                      {formatMoney(item.price * 100, state.settings.homeCurrency)}
                    </span>
                    <span className="text-[10px] text-muted">per {item.unit || 'unit'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-1 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditItem(item);
                    }}
                    className="p-1.5 hover:bg-background-subtle rounded-md text-muted hover:text-foreground transition-colors"
                    aria-label={`Edit ${item.name}`}
                  >
                    <Icon name="pencil-simple" size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item);
                    }}
                    className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors"
                    aria-label={`Delete ${item.name}`}
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
          icon="package"
          title="No items found"
          description={searchQuery || categoryFilter !== 'all' ? 'Try adjusting your filters' : 'Add your first item to get started'}
          action={!searchQuery && categoryFilter === 'all' ? {
            label: 'Add Item',
            onClick: handleAddItem,
          } : undefined}
        />
      )}

      {/* Item Dialog */}
      <ItemDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveItem}
        initialData={editingItem}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        description={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}