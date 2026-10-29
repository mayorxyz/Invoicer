import { v4 as uuid } from 'uuid';
import { today, addDays, subtractDays } from '../lib/dates';
import type { Invoice, Client, SavedItem, Expense, TimeEntry, Mode, Status } from '../types';

// Fictional companies and people
const COMPANY_NAMES = [
  'Northwind Traders', 'Contoso Ltd', 'Adventure Works', 'Fabrikam Inc',
  'Tailspin Toys', 'Wingtip Toys', 'Litware Inc', 'Proseware Systems',
  'Southridge Video', 'Humongous Insurance', 'Graphic Design Studio',
  'Cloud First Consulting', 'Digital Dynamics', 'Peak Performance Co',
  'Blue Ocean Solutions', 'Green Valley Technologies', 'Red Rock Digital',
];

const CONTACT_NAMES = [
  'Sarah Chen', 'Marcus Rodriguez', 'Aisha Patel', 'James O\'Brien',
  'Yuki Tanaka', 'Oliver Schmidt', 'Fatima Al-Hassan', 'Lucas Silva',
  'Emma Thompson', 'Noah Kim', 'Sofia Martinez', 'Liam Johnson',
  'Mia Williams', 'Ethan Brown', 'Isabella Davis',
];

const SERVICE_ITEMS = [
  { name: 'Web Development', unit: 'hrs', price: 120, category: 'Development' },
  { name: 'UI/UX Design', unit: 'hrs', price: 95, category: 'Design' },
  { name: 'Consulting Session', unit: 'hrs', price: 150, category: 'Consulting' },
  { name: 'Project Management', unit: 'hrs', price: 110, category: 'Management' },
  { name: 'Logo Design', unit: 'pcs', price: 450, category: 'Design' },
  { name: 'Website Hosting', unit: 'days', price: 25, category: 'Hosting' },
  { name: 'SEO Optimization', unit: 'hrs', price: 85, category: 'Marketing' },
  { name: 'Content Writing', unit: 'hrs', price: 75, category: 'Content' },
  { name: 'Database Setup', unit: 'pcs', price: 800, category: 'Development' },
  { name: 'Security Audit', unit: 'pcs', price: 1200, category: 'Security' },
  { name: 'Training Session', unit: 'hrs', price: 100, category: 'Training' },
  { name: 'Maintenance Package', unit: 'days', price: 150, category: 'Support' },
];

const EXPENSE_CATEGORIES = [
  'Software', 'Hardware', 'Office Supplies', 'Travel', 'Marketing',
  'Utilities', 'Professional Services', 'Insurance', 'Rent', 'Other'
];

const EXPENSE_VENDORS = [
  'Adobe Systems', 'Microsoft 365', 'AWS', 'DigitalOcean', 'Figma',
  'Slack Technologies', 'Zoom Video', 'Dropbox', 'Google Workspace',
  'Office Depot', 'Staples', 'WeWork', 'Regus', 'FedEx', 'UPS',
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysAgo: number): string {
  return subtractDays(today(), randomInt(0, daysAgo));
}

// Generate sample clients
export function generateSampleClients(): Client[] {
  return Array.from({ length: 8 }, (_, i) => ({
    id: uuid(),
    name: COMPANY_NAMES[i % COMPANY_NAMES.length],
    address: `${randomInt(100, 999)} Business Ave, Suite ${randomInt(100, 999)}\nSan Francisco, CA 94105`,
    email: `contact@${COMPANY_NAMES[i % COMPANY_NAMES.length].toLowerCase().replace(/\s+/g, '')}.com`,
    phone: `+1 (555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
    taxId: `TAX-${randomInt(10000000, 99999999)}`,
    tags: [randomChoice(['Enterprise', 'SMB', 'Startup', 'Agency'])],
  }));
}

// Generate sample saved items
export function generateSampleItems(): SavedItem[] {
  return SERVICE_ITEMS.map(item => ({
    id: uuid(),
    name: item.name,
    price: item.price,
    unit: item.unit,
    category: item.category,
    sku: `SKU-${randomInt(1000, 9999)}`,
  }));
}

// Generate sample documents
export function generateSampleDocuments(clients: Client[]): Invoice[] {
  const documents: Invoice[] = [];
  const modes: Mode[] = ['invoice', 'invoice', 'invoice', 'quote', 'receipt'];
  const statuses: Status[] = ['paid', 'paid', 'paid', 'sent', 'sent', 'draft', 'overdue', 'partial'];
  
  // Generate 15 documents spread over 6 months
  for (let i = 0; i < 15; i++) {
    const client = randomChoice(clients);
    const mode = randomChoice(modes);
    const status = randomChoice(statuses);
    const issueDate = randomDate(180); // Last 6 months
    const dueDate = addDays(issueDate, 30);
    
    // Generate 2-5 line items
    const numItems = randomInt(2, 5);
    const items = Array.from({ length: numItems }, () => {
      const service = randomChoice(SERVICE_ITEMS);
      const qty = randomInt(1, 20);
      return {
        id: uuid(),
        desc: service.name,
        qty,
        unit: service.unit,
        price: service.price,
        taxable: true,
        taxIds: [],
      };
    });
    
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
    const tax = Math.round(subtotal * 0.085); // 8.5% tax
    const total = subtotal + tax;
    
    // Generate payments based on status
    const payments = [];
    if (status === 'paid') {
      payments.push({
        id: uuid(),
        date: addDays(issueDate, randomInt(5, 25)),
        amount: total / 100, // Convert to major units
        method: 'transfer' as const,
        ref: `PAY-${randomInt(10000, 99999)}`,
      });
    } else if (status === 'partial') {
      payments.push({
        id: uuid(),
        date: addDays(issueDate, randomInt(5, 15)),
        amount: (total * 0.5) / 100, // 50% paid
        method: 'transfer' as const,
        ref: `PAY-${randomInt(10000, 99999)}`,
      });
    }
    
    documents.push({
      id: uuid(),
      number: `${mode === 'invoice' ? 'INV' : mode === 'quote' ? 'QUO' : 'RCT'}-${String(1000 + i).padStart(4, '0')}`,
      mode,
      issueDate,
      dueDate,
      currency: 'USD',
      status,
      clientId: client.id,
      client,
      businessId: 'default',
      items,
      taxes: [{
        id: uuid(),
        label: 'Tax',
        rate: 0.085,
        type: 'added',
        applyTo: 'all',
        enabled: true,
      }],
      pricingMode: 'exclusive',
      discType: 'percent',
      discVal: 0,
      shipping: 0,
      payments,
      paymentInstructions: [],
      milestones: [],
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days.',
      payLink: '',
      template: 'classic',
      accent: '#1F3FD1',
      paperSize: 'A4',
      documentLanguage: 'en',
      customFields: [],
      versions: [],
      createdAt: new Date(issueDate).toISOString(),
      updatedAt: new Date(issueDate).toISOString(),
    });
  }
  
  return documents.sort((a, b) => b.issueDate.localeCompare(a.issueDate));
}

// Generate sample expenses
export function generateSampleExpenses(): Expense[] {
  return Array.from({ length: 12 }, () => ({
    id: uuid(),
    date: randomDate(90),
    vendor: randomChoice(EXPENSE_VENDORS),
    category: randomChoice(EXPENSE_CATEGORIES),
    amount: randomInt(50, 500),
    currency: 'USD',
    tax: Math.round(randomInt(5, 50) * 100) / 100,
    note: 'Business expense',
  }));
}

// Generate sample time entries
export function generateSampleTimeEntries(clients: Client[]): TimeEntry[] {
  const entries: TimeEntry[] = [];
  
  // Generate 8 entries for the current week
  for (let i = 0; i < 8; i++) {
    const client = randomChoice(clients);
    const service = randomChoice(SERVICE_ITEMS.filter(s => s.unit === 'hrs'));
    const hours = randomInt(1, 8);
    const date = subtractDays(today(), randomInt(0, 6));
    
    entries.push({
      id: uuid(),
      clientId: client.id,
      project: `${client.name} Project`,
      description: service.name,
      startTime: `${date}T09:00:00`,
      endTime: `${date}T${String(9 + hours).padStart(2, '0')}:00:00`,
      rate: service.price,
      currency: 'USD',
    });
  }
  
  return entries;
}

// Activity log entry type
export interface ActivityLogEntry {
  id: string;
  type: 'created' | 'edited' | 'sent' | 'paid' | 'reminder' | 'exported' | 'deleted' | 'restored';
  documentNumber?: string;
  documentId?: string;
  timestamp: string;
  description: string;
}

// Generate sample activity log
export function generateSampleActivityLog(documents: Invoice[]): ActivityLogEntry[] {
  const activities: ActivityLogEntry[] = [];
  const types: ActivityLogEntry['type'][] = ['created', 'edited', 'sent', 'paid'];
  
  // Generate 20 activities over the last 30 days
  for (let i = 0; i < 20; i++) {
    const doc = randomChoice(documents);
    const type = randomChoice(types);
    const daysAgo = randomInt(0, 30);
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - daysAgo);
    timestamp.setHours(randomInt(8, 18), randomInt(0, 59));
    
    activities.push({
      id: uuid(),
      type,
      documentNumber: doc.number,
      documentId: doc.id,
      timestamp: timestamp.toISOString(),
      description: `${type.charAt(0).toUpperCase() + type.slice(1)} document ${doc.number}`,
    });
  }
  
  return activities.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}
