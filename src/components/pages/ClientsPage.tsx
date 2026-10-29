import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { PageHeader } from '../ui/PageHeader';
import { DataTable } from '../ui/DataTable';
import { EmptyState } from '../ui/EmptyState';
import { SampleBanner } from '../ui/SampleBanner';
import { SamplePill } from '../ui/SamplePill';
import { ClientDialog } from '../ui/ClientDialog';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { useToast } from '../ui/Toast';
import { Icon } from '../ui/Icon';
import { formatMoney } from '../../lib/money';
import { v4 as uuid } from 'uuid';
import type { Client } from '../../types';

export function ClientsPage() {
  const { state, dismissDemo, addClient, updateClient, deleteClient, newDraft, setView } = useStore();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const isDemo = !state.settings.demoDismissed && state.clients.length === 0;

  const filteredClients = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return state.clients;
    return state.clients.filter(client =>
      (client.name ?? '').toLowerCase().includes(query) ||
      (client.email ?? '').toLowerCase().includes(query) ||
      (client.phone ?? '').toLowerCase().includes(query)
    );
  }, [state.clients, searchQuery]);

  const getClientOutstanding = (clientId: string) => {
    const clientInvoices = state.invoices.filter(inv => inv.clientId === clientId);
    return clientInvoices.reduce((sum, inv) => {
      const total = inv.items.reduce((s, item) => s + (item.qty * item.price), 0);
      const paid = inv.payments.reduce((s, p) => s + p.amount, 0);
      return sum + (total - paid);
    }, 0);
  };

  const selectedClient = selectedClientId ? state.clients.find(c => c.id === selectedClientId) : null;

  const handleNewClient = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingClient(undefined);
    setDialogOpen(true);
  };

  const handleEditClient = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingClient(client);
    setDialogOpen(true);
  };

  const handleDeleteClient = (client: Client, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setClientToDelete(client);
    setDeleteConfirmOpen(true);
  };

  const handleSaveClient = (clientData: Omit<Client, 'id'>) => {
    if (editingClient) {
      updateClient({ id: editingClient.id, ...clientData });
      toast('success', 'Client updated successfully');
    } else {
      const newId = uuid();
      addClient({ id: newId, ...clientData });
      setSelectedClientId(null);
      toast('success', 'Client added successfully');
    }
    setDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      const removed = clientToDelete;
      deleteClient(removed.id);
      toast('success', 'Client deleted', {
        label: 'Undo',
        onClick: () => addClient(removed),
      });
      if (selectedClientId === removed.id) setSelectedClientId(null);
      setClientToDelete(null);
    }
  };

  const handleNewInvoiceForClient = (client: Client) => {
    newDraft('invoice');
    const draft = useStore.getState().draft;
    if (draft) {
      useStore.getState().updateDraft({
        client: { ...client },
        clientId: client.id,
      });
    }
    setView('editor');
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (client: Client) => (
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-xs flex-shrink-0">
            {(client.name || '?').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="font-medium truncate text-xs md:text-sm text-foreground">{client.name}</div>
            {isDemo && <SamplePill />}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (client: Client) => (
        <span className="truncate block text-xs md:text-sm text-muted">
          {client.email || '—'}
        </span>
      ),
    },
    {
      key: 'outstanding',
      label: 'Outstanding',
      render: (client: Client) => (
        <span className="text-xs md:text-sm font-medium text-foreground">
          {formatMoney(getClientOutstanding(client.id), state.settings.homeCurrency)}
        </span>
      ),
      className: 'text-right',
    },
    {
      key: 'actions',
      label: '',
      render: (client: Client) => (
        <div className="flex gap-1 justify-end">
          <button
            type="button"
            onClick={(e) => handleEditClient(client, e)}
            className="p-1.5 hover:bg-background-subtle rounded-md transition-colors text-muted hover:text-foreground cursor-pointer"
            aria-label={`Edit ${client.name}`}
          >
            <Icon name="pencil-simple" size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => handleDeleteClient(client, e)}
            className="p-1.5 hover:bg-danger/10 text-danger rounded-md transition-colors cursor-pointer"
            aria-label={`Delete ${client.name}`}
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
        title="Clients"
        subtitle={`${state.clients.length} total`}
        action={{
          label: 'New Client',
          onClick: handleNewClient,
          icon: 'plus',
        }}
      />

      {isDemo && <SampleBanner onClear={dismissDemo} />}

      {/* Search Input Bar */}
      <div className="bg-surface border border-border rounded-lg p-3 mb-4 shadow-sm">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
            <Icon name="magnifying-glass" size={15} />
          </span>
          <input
            type="text"
            placeholder="Search clients by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-w-0 pl-9 pr-3 py-2 bg-background border border-border rounded-md text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-accent text-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        {/* Client Listing Area */}
        <div className={`min-w-0 ${selectedClient ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          {filteredClients.length > 0 ? (
            <>
              {/* Desktop Data Table */}
              <div className="hidden lg:block overflow-hidden rounded-lg border border-border bg-surface shadow-sm">
                <DataTable
                  columns={columns}
                  data={filteredClients}
                  onRowClick={(client) => setSelectedClientId(client.id)}
                />
              </div>

              {/* Mobile Card Stack (Zero horizontal overflow) */}
              <div className="lg:hidden flex flex-col gap-2">
                {filteredClients.map((client) => {
                  const outstanding = getClientOutstanding(client.id);
                  const isSelected = selectedClientId === client.id;
                  return (
                    <div
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`p-3 bg-surface border rounded-xl transition-all cursor-pointer shadow-xs ${
                        isSelected ? 'border-accent ring-1 ring-accent/20' : 'border-border/80 hover:border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs flex-shrink-0">
                            {(client.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-semibold text-foreground truncate">{client.name}</h4>
                            <p className="text-[11px] text-muted truncate">{client.email || client.phone || 'No contact info'}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] text-muted uppercase tracking-wider block">Outstanding</span>
                          <span className="text-xs font-semibold text-foreground">
                            {formatMoney(outstanding, state.settings.homeCurrency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <EmptyState
              icon="users"
              title="No clients found"
              description={searchQuery ? 'Try adjusting your search query' : 'Add your first client to get started'}
              action={!searchQuery ? { label: 'Add Client', onClick: handleNewClient } : undefined}
            />
          )}
        </div>

        {/* Client Detail Sidebar / Slide-Over Drawer */}
        {selectedClient && (
          <div className="fixed inset-0 z-40 overflow-y-auto bg-background/80 backdrop-blur-xs p-3 md:p-6 pb-[max(1rem,env(safe-area-inset-bottom))] lg:static lg:z-auto lg:overflow-visible lg:bg-transparent lg:p-0 min-w-0 animate-in fade-in duration-150">
            <div className="bg-surface border border-border rounded-2xl lg:rounded-lg p-4 md:p-5 h-fit shadow-lg lg:shadow-sm">
              <div className="flex items-start justify-between mb-3 pb-2 border-b border-border">
                <div className="min-w-0 pr-2">
                  <h3 className="text-sm md:text-base font-semibold text-foreground truncate">{selectedClient.name}</h3>
                  <p className="text-xs text-muted truncate">{selectedClient.email || 'No email'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClientId(null)}
                  className="text-muted hover:text-foreground p-1.5 rounded-md hover:bg-background-subtle cursor-pointer"
                  aria-label="Close details"
                >
                  <Icon name="x" size={16} />
                </button>
              </div>

              <div className="space-y-2.5 mb-5 text-xs">
                <div>
                  <span className="text-muted uppercase tracking-wider text-[10px] font-semibold">Phone</span>
                  <p className="text-foreground font-medium mt-0.5 break-words">{selectedClient.phone || '—'}</p>
                </div>
                <div>
                  <span className="text-muted uppercase tracking-wider text-[10px] font-semibold">Address</span>
                  <p className="text-foreground font-medium mt-0.5 break-words">{selectedClient.address || '—'}</p>
                </div>
                {selectedClient.taxId && (
                  <div>
                    <span className="text-muted uppercase tracking-wider text-[10px] font-semibold">Tax ID</span>
                    <p className="text-foreground font-mono mt-0.5 break-all">{selectedClient.taxId}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleNewInvoiceForClient(selectedClient)}
                  className="w-full h-10 px-3 bg-accent text-accent-contrast rounded-lg hover:opacity-90 transition-opacity text-xs font-medium flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Icon name="plus" size={14} />
                  <span>New Invoice for Client</span>
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleEditClient(selectedClient, e)}
                    className="w-full h-9 px-3 bg-surface border border-border text-foreground rounded-lg hover:bg-background-subtle transition-colors text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Icon name="pencil-simple" size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteClient(selectedClient, e)}
                    className="w-full h-9 px-3 bg-surface border border-border text-danger rounded-lg hover:bg-danger/5 transition-colors text-xs font-medium cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Icon name="trash" size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ClientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveClient}
        initialData={editingClient}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setClientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        description={`Are you sure you want to delete "${clientToDelete?.name}"? This will not delete their invoices. This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}