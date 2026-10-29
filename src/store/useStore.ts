import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import type { Invoice, Settings, Client, BusinessProfile, SavedItem, Expense, TimeEntry, Mode, AppState, Item, Payment, Tax, ThemeMode, LanguageCode, CurrencyCode } from '../types';
import { DEFAULT_BUSINESS, DEFAULT_SETTINGS } from '../lib/defaults';
import { today, addDays } from '../lib/dates';
import { nextNumber } from '../lib/numbering';
import * as storage from '../lib/storage';
import { generateSampleClients, generateSampleItems, generateSampleDocuments, generateSampleExpenses, generateSampleTimeEntries } from '../data/sample';

type View = 'editor' | 'documents' | 'history' | 'clients' | 'items' | 'reports' | 'expenses' | 'time' | 'settings';

interface Toast { id: string; message: string; action?: () => void; actionLabel?: string }

interface Store {
  state: AppState;
  draft: Invoice | null;
  view: View;
  mobileTab: 'form' | 'preview';
  toasts: Toast[];
  noStorage: boolean;
  undoPast: Invoice[];
  undoFuture: Invoice[];

  init: () => void;
  setView: (v: View) => void;
  setMobileTab: (t: 'form' | 'preview') => void;

  // Business
  getBusiness: () => BusinessProfile;
  updateBusiness: (patch: Partial<BusinessProfile>) => void;

  // Settings
  updateSettings: (patch: Partial<Settings>) => void;
  toggleSidebar: () => void;
  dismissDemo: () => void;
  loadSampleData: () => void;

  // Draft
  newDraft: (mode: Mode) => void;
  updateDraft: (patch: Partial<Invoice>) => void;
  saveDraft: () => void;
  loadDraftFromInvoice: (inv: Invoice) => void;
  undo: () => void;
  redo: () => void;

  // Documents
  duplicateInvoice: (id: string) => void;
  deleteInvoice: (id: string) => void;
  convertDocument: (id: string, toMode: Mode) => void;

  // Clients
  addClient: (c: Client) => void;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;

  // Items library
  addSavedItem: (item: SavedItem) => void;
  deleteSavedItem: (id: string) => void;

  // Expenses
  addExpense: (e: Expense) => void;
  deleteExpense: (id: string) => void;

  // Time
  addTimeEntry: (t: TimeEntry) => void;
  updateTimeEntry: (t: TimeEntry) => void;
  deleteTimeEntry: (id: string) => void;

  // Toasts
  addToast: (message: string, action?: () => void, actionLabel?: string) => void;
  removeToast: (id: string) => void;

  // Backup
  importData: (json: string) => boolean;
  wipeAll: () => void;
}

function createEmptyDoc(mode: Mode, business: BusinessProfile): Invoice {
  const { number } = nextNumber(business, mode);
  return {
    id: uuid(), number, mode,
    issueDate: today(),
    dueDate: addDays(today(), business.defaultDueDays),
    currency: business.defaultCurrency,
    status: 'draft',
    clientId: '',
    client: { id: '', name: '', address: '', email: '', phone: '' },
    businessId: business.id,
    items: [{ id: uuid(), desc: '', qty: 1, unit: 'each', price: 0, taxable: true, taxIds: [] }],
    taxes: business.defaultTaxes.length > 0 ? [...business.defaultTaxes] : [],
    pricingMode: business.defaultPricingMode,
    discType: 'percent', discVal: 0,
    shipping: 0,
    payments: [],
    paymentInstructions: [...business.paymentInstructions],
    milestones: [],
    notes: business.defaultNotes,
    terms: business.defaultTerms,
    payLink: '',
    template: business.defaultTemplate,
    accent: business.defaultAccent,
    paperSize: business.defaultPaperSize,
    documentLanguage: business.defaultLanguage,
    customFields: [],
    versions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function persist(state: AppState) {
  storage.saveState(state);
}

// Helper to dismiss demo data on any write operation
function dismissDemoOnWrite(state: AppState): AppState {
  if (!state.settings.demoDismissed) {
    return { ...state, settings: { ...state.settings, demoDismissed: true } };
  }
  return state;
}

export const useStore = create<Store>((set, get) => ({
  state: {
    schemaVersion: 2, invoices: [], clients: [], savedItems: [], expenses: [], timeEntries: [],
    businesses: [DEFAULT_BUSINESS], activeBusinessId: DEFAULT_BUSINESS.id, settings: DEFAULT_SETTINGS,
  },
  draft: null,
  view: 'editor',
  mobileTab: 'form',
  toasts: [],
  noStorage: false,
  undoPast: [],
  undoFuture: [],

  init: () => {
    const noStorage = !storage.isLocalStorageAvailable();
    const state = storage.loadState();
    set({ state, noStorage });
  },

  setView: (v) => set({ view: v }),
  setMobileTab: (t) => set({ mobileTab: t }),

  getBusiness: () => {
    const { state } = get();
    return state.businesses.find(b => b.id === state.activeBusinessId) || state.businesses[0];
  },

  updateBusiness: (patch) => {
    const { state } = get();
    const businesses = state.businesses.map(b => b.id === state.activeBusinessId ? { ...b, ...patch } : b);
    const newState = { ...state, businesses };
    set({ state: newState });
    persist(newState);
  },

  updateSettings: (patch) => {
    const { state } = get();
    const settings = { ...state.settings, ...patch };
    const newState = { ...state, settings };
    set({ state: newState });
    persist(newState);
  },

  toggleSidebar: () => {
    const { state } = get();
    const settings = { ...state.settings, sidebarCollapsed: !state.settings.sidebarCollapsed };
    const newState = { ...state, settings };
    set({ state: newState });
    persist(newState);
  },

  dismissDemo: () => {
    const { state } = get();
    const settings = { ...state.settings, demoDismissed: true };
    const newState = { ...state, settings };
    set({ state: newState });
    persist(newState);
  },

  loadSampleData: () => {
    const { state } = get();
    // Only load sample data if there are no real records
    if (state.invoices.length > 0 || state.clients.length > 0 || state.expenses.length > 0) {
      return;
    }
    
    const sampleClients = generateSampleClients();
    const sampleItems = generateSampleItems();
    const sampleDocuments = generateSampleDocuments(sampleClients);
    const sampleExpenses = generateSampleExpenses();
    const sampleTimeEntries = generateSampleTimeEntries(sampleClients);
    
    const newState = {
      ...state,
      clients: sampleClients,
      savedItems: sampleItems,
      invoices: sampleDocuments,
      expenses: sampleExpenses,
      timeEntries: sampleTimeEntries,
      settings: { ...state.settings, demoDismissed: false },
    };
    
    set({ state: newState });
    // Don't persist sample data - it's generated on-the-fly
  },

  newDraft: (mode) => {
    const business = get().getBusiness();
    const draft = createEmptyDoc(mode, business);
    set({ draft, undoPast: [], undoFuture: [] });
  },

  updateDraft: (patch) => {
    const { draft, undoPast } = get();
    if (!draft) return;
    const past = [...undoPast, draft].slice(-50);
    const updated = { ...draft, ...patch, updatedAt: new Date().toISOString() };
    set({ draft: updated, undoPast: past, undoFuture: [] });
  },

  saveDraft: () => {
    const { draft, state } = get();
    if (!draft) return;
    const exists = state.invoices.find(i => i.id === draft.id);
    let invoices: Invoice[];
    let businesses = state.businesses;
    if (exists) {
      invoices = state.invoices.map(i => i.id === draft.id ? { ...draft, updatedAt: new Date().toISOString() } : i);
    } else {
      invoices = [...state.invoices, { ...draft, updatedAt: new Date().toISOString() }];
      const biz = businesses.find(b => b.id === draft.businessId);
      if (biz) {
        const { counter } = nextNumber(biz, draft.mode);
        businesses = businesses.map(b => b.id === biz.id ? { ...b, counter } : b);
      }
    }
    // Dismiss demo data when saving a document
    const settings = { ...state.settings, demoDismissed: true };
    const newState = { ...state, invoices, businesses, settings };
    set({ state: newState });
    persist(newState);
    get().addToast('Saved');
  },

  loadDraftFromInvoice: (inv) => {
    set({ draft: { ...inv }, undoPast: [], undoFuture: [] });
  },

  undo: () => {
    const { draft, undoPast, undoFuture } = get();
    if (!draft || undoPast.length === 0) return;
    const prev = undoPast[undoPast.length - 1];
    set({ draft: prev, undoPast: undoPast.slice(0, -1), undoFuture: [draft, ...undoFuture] });
  },

  redo: () => {
    const { draft, undoPast, undoFuture } = get();
    if (!draft || undoFuture.length === 0) return;
    const next = undoFuture[0];
    set({ draft: next, undoPast: [...undoPast, draft], undoFuture: undoFuture.slice(1) });
  },

  duplicateInvoice: (id) => {
    const { state } = get();
    const inv = state.invoices.find(i => i.id === id);
    if (!inv) return;
    const biz = state.businesses.find(b => b.id === inv.businessId) || get().getBusiness();
    const { number } = nextNumber(biz, inv.mode);
    const dup: Invoice = { ...inv, id: uuid(), number, status: 'draft', payments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    let newState = { ...state, invoices: [...state.invoices, dup] };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
    get().addToast('Duplicated');
  },

  deleteInvoice: (id) => {
    const { state } = get();
    const inv = state.invoices.find(i => i.id === id);
    if (!inv) return;
    const invoices = state.invoices.filter(i => i.id !== id);
    let newState = { ...state, invoices };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
    get().addToast('Deleted', () => {
      const restored = { ...get().state, invoices: [...get().state.invoices, inv] };
      set({ state: restored });
      persist(restored);
    }, 'Undo');
  },

  convertDocument: (id, toMode) => {
    const { state } = get();
    const inv = state.invoices.find(i => i.id === id);
    if (!inv) return;
    const biz = state.businesses.find(b => b.id === inv.businessId) || get().getBusiness();
    const { number } = nextNumber(biz, toMode);
    const converted: Invoice = { ...inv, id: uuid(), number, mode: toMode, status: 'draft', payments: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    let newState = { ...state, invoices: [...state.invoices, converted] };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
    get().addToast('Converted');
  },

  addClient: (c) => {
    const { state } = get();
    let newState = { ...state, clients: [...state.clients, c] };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  updateClient: (c) => {
    const { state } = get();
    let newState = { ...state, clients: state.clients.map(cl => cl.id === c.id ? c : cl) };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  deleteClient: (id) => {
    const { state } = get();
    let newState = { ...state, clients: state.clients.filter(c => c.id !== id) };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  addSavedItem: (item) => {
    const { state } = get();
    let newState = { ...state, savedItems: [...state.savedItems, item] };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  deleteSavedItem: (id) => {
    const { state } = get();
    let newState = { ...state, savedItems: state.savedItems.filter(i => i.id !== id) };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  addExpense: (e) => {
    const { state } = get();
    let newState = { ...state, expenses: [...state.expenses, e] };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  deleteExpense: (id) => {
    const { state } = get();
    let newState = { ...state, expenses: state.expenses.filter(e => e.id !== id) };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  addTimeEntry: (t) => {
    const { state } = get();
    let newState = { ...state, timeEntries: [...state.timeEntries, t] };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  updateTimeEntry: (t) => {
    const { state } = get();
    let newState = { ...state, timeEntries: state.timeEntries.map(te => te.id === t.id ? t : te) };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  deleteTimeEntry: (id) => {
    const { state } = get();
    let newState = { ...state, timeEntries: state.timeEntries.filter(t => t.id !== id) };
    newState = dismissDemoOnWrite(newState);
    set({ state: newState });
    persist(newState);
  },

  addToast: (message, action, actionLabel) => {
    const id = uuid();
    set(s => ({ toasts: [...s.toasts, { id, message, action, actionLabel }] }));
    setTimeout(() => get().removeToast(id), 5000);
  },

  removeToast: (id) => {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }));
  },

  importData: (json) => {
    const data = storage.importBackup(json);
    if (!data) return false;
    const stateWithDemoDismissed = dismissDemoOnWrite(data);
    set({ state: stateWithDemoDismissed });
    persist(stateWithDemoDismissed);
    return true;
  },

  wipeAll: () => {
    storage.wipeAll();
    const fresh: AppState = {
      schemaVersion: 2, invoices: [], clients: [], savedItems: [], expenses: [], timeEntries: [],
      businesses: [DEFAULT_BUSINESS], activeBusinessId: DEFAULT_BUSINESS.id, settings: DEFAULT_SETTINGS,
    };
    set({ state: fresh, draft: null });
  },
}));
