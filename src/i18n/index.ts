import type { LanguageCode } from '../types';

export type TranslationKey =
  | 'app.name' | 'nav.editor' | 'nav.documents' | 'nav.clients' | 'nav.items' | 'nav.reports' | 'nav.settings'
  | 'mode.invoice' | 'mode.quote' | 'mode.receipt' | 'mode.credit_note' | 'mode.proforma' | 'mode.purchase_order' | 'mode.delivery_note' | 'mode.statement'
  | 'doc.title' | 'doc.number' | 'doc.issueDate' | 'doc.dueDate' | 'doc.currency' | 'doc.status'
  | 'client.billTo' | 'client.name' | 'client.address' | 'client.email' | 'client.phone' | 'client.taxId' | 'client.search' | 'client.new' | 'client.save'
  | 'item.desc' | 'item.qty' | 'item.unit' | 'item.price' | 'item.amount' | 'item.taxable' | 'item.add' | 'item.empty'
  | 'tax.label' | 'tax.rate' | 'tax.type' | 'tax.added' | 'tax.included' | 'tax.deducted' | 'tax.add' | 'tax.verify'
  | 'adj.subtotal' | 'adj.discount' | 'adj.shipping' | 'adj.total' | 'adj.payable' | 'adj.paid' | 'adj.balance'
  | 'pay.method' | 'pay.date' | 'pay.amount' | 'pay.ref' | 'pay.add' | 'pay.markPaid' | 'pay.instructions'
  | 'notes.label' | 'notes.terms' | 'notes.paymentLink'
  | 'status.draft' | 'status.sent' | 'status.paid' | 'status.partial' | 'status.overdue' | 'status.cancelled'
  | 'action.save' | 'action.print' | 'action.delete' | 'action.duplicate' | 'action.new' | 'action.export' | 'action.import' | 'action.share' | 'action.remind'
  | 'words.amountInWords' | 'words.page' | 'words.of'
  | 'empty.noDocuments' | 'empty.noClients' | 'empty.noItems' | 'empty.createFirst'
  | 'firstRun.title' | 'firstRun.country' | 'firstRun.currency' | 'firstRun.tax' | 'firstRun.business' | 'firstRun.skip' | 'firstRun.next' | 'firstRun.done'
  | 'settings.defaults' | 'settings.data' | 'settings.backup' | 'settings.restore' | 'settings.wipe' | 'settings.theme'
  | 'report.revenue' | 'report.outstanding' | 'report.paid' | 'report.overdue' | 'report.aging'
  | 'confirm.delete' | 'confirm.wipe' | 'notice.noBackend' | 'notice.backup';

const en: Record<TranslationKey, string> = {
  'app.name': 'Invoicer',
  'nav.editor': 'Editor', 'nav.documents': 'Documents', 'nav.clients': 'Clients', 'nav.items': 'Items', 'nav.reports': 'Reports', 'nav.settings': 'Settings',
  'mode.invoice': 'Invoice', 'mode.quote': 'Quote', 'mode.receipt': 'Receipt', 'mode.credit_note': 'Credit Note',
  'mode.proforma': 'Proforma', 'mode.purchase_order': 'Purchase Order', 'mode.delivery_note': 'Delivery Note', 'mode.statement': 'Statement',
  'doc.title': 'Document', 'doc.number': 'Number', 'doc.issueDate': 'Issue Date', 'doc.dueDate': 'Due Date', 'doc.currency': 'Currency', 'doc.status': 'Status',
  'client.billTo': 'Bill To', 'client.name': 'Name', 'client.address': 'Address', 'client.email': 'Email', 'client.phone': 'Phone', 'client.taxId': 'Tax ID', 'client.search': 'Search clients...', 'client.new': 'New Client', 'client.save': 'Save Client',
  'item.desc': 'Description', 'item.qty': 'Qty', 'item.unit': 'Unit', 'item.price': 'Price', 'item.amount': 'Amount', 'item.taxable': 'Taxable', 'item.add': 'Add Item', 'item.empty': 'No items yet',
  'tax.label': 'Tax', 'tax.rate': 'Rate', 'tax.type': 'Type', 'tax.added': 'Added', 'tax.included': 'Included', 'tax.deducted': 'Deducted', 'tax.add': 'Add Tax', 'tax.verify': 'Verify with your local tax authority',
  'adj.subtotal': 'Subtotal', 'adj.discount': 'Discount', 'adj.shipping': 'Shipping', 'adj.total': 'Total', 'adj.payable': 'Payable', 'adj.paid': 'Paid', 'adj.balance': 'Balance Due',
  'pay.method': 'Method', 'pay.date': 'Date', 'pay.amount': 'Amount', 'pay.ref': 'Reference', 'pay.add': 'Add Payment', 'pay.markPaid': 'Mark Fully Paid', 'pay.instructions': 'Payment Instructions',
  'notes.label': 'Notes', 'notes.terms': 'Terms & Conditions', 'notes.paymentLink': 'Payment Link',
  'status.draft': 'Draft', 'status.sent': 'Sent', 'status.paid': 'Paid', 'status.partial': 'Partial', 'status.overdue': 'Overdue', 'status.cancelled': 'Cancelled',
  'action.save': 'Save', 'action.print': 'Print / PDF', 'action.delete': 'Delete', 'action.duplicate': 'Duplicate', 'action.new': 'New', 'action.export': 'Export', 'action.import': 'Import', 'action.share': 'Share', 'action.remind': 'Send Reminder',
  'words.amountInWords': 'Amount in words', 'words.page': 'Page', 'words.of': 'of',
  'empty.noDocuments': 'No documents yet', 'empty.noClients': 'No clients yet', 'empty.noItems': 'No items yet', 'empty.createFirst': 'Create your first one',
  'firstRun.title': 'Welcome', 'firstRun.country': 'Country', 'firstRun.currency': 'Currency & Tax', 'firstRun.tax': 'Tax Settings', 'firstRun.business': 'Business Details', 'firstRun.skip': 'Skip', 'firstRun.next': 'Next', 'firstRun.done': 'Get Started',
  'settings.defaults': 'Defaults', 'settings.data': 'Data Management', 'settings.backup': 'Export Backup', 'settings.restore': 'Import Backup', 'settings.wipe': 'Wipe All Data', 'settings.theme': 'Theme',
  'report.revenue': 'Revenue', 'report.outstanding': 'Outstanding', 'report.paid': 'Paid', 'report.overdue': 'Overdue', 'report.aging': 'Aging',
  'confirm.delete': 'Are you sure you want to delete this?', 'confirm.wipe': 'This will delete ALL data. Type WIPE to confirm.',
  'notice.noBackend': 'Data is stored only in this browser. Back up regularly.', 'notice.backup': 'Last backup',
};

const es: Record<TranslationKey, string> = {
  ...en,
  'app.name': 'Invoicer',
  'nav.editor': 'Editor', 'nav.documents': 'Documentos', 'nav.clients': 'Clientes', 'nav.items': 'Artículos', 'nav.reports': 'Informes', 'nav.settings': 'Ajustes',
  'mode.invoice': 'Factura', 'mode.quote': 'Presupuesto', 'mode.receipt': 'Recibo', 'mode.credit_note': 'Nota de Crédito',
  'client.billTo': 'Facturar A', 'adj.subtotal': 'Subtotal', 'adj.discount': 'Descuento', 'adj.shipping': 'Envío', 'adj.total': 'Total', 'adj.balance': 'Saldo Pendiente',
  'action.save': 'Guardar', 'action.print': 'Imprimir / PDF', 'action.delete': 'Eliminar', 'action.new': 'Nuevo',
  'empty.noDocuments': 'Sin documentos', 'empty.noClients': 'Sin clientes', 'empty.createFirst': 'Crea el primero',
  'firstRun.title': 'Bienvenido', 'firstRun.skip': 'Omitir', 'firstRun.next': 'Siguiente', 'firstRun.done': 'Comenzar',
};

const fr: Record<TranslationKey, string> = {
  ...en,
  'nav.editor': 'Éditeur', 'nav.documents': 'Documents', 'nav.clients': 'Clients', 'nav.items': 'Articles', 'nav.reports': 'Rapports', 'nav.settings': 'Paramètres',
  'mode.invoice': 'Facture', 'mode.quote': 'Devis', 'mode.receipt': 'Reçu', 'mode.credit_note': 'Avoir',
  'client.billTo': 'Facturer À', 'adj.subtotal': 'Sous-total', 'adj.discount': 'Remise', 'adj.shipping': 'Livraison', 'adj.total': 'Total', 'adj.balance': 'Solde Dû',
  'action.save': 'Enregistrer', 'action.print': 'Imprimer / PDF', 'action.delete': 'Supprimer', 'action.new': 'Nouveau',
  'empty.noDocuments': 'Aucun document', 'empty.noClients': 'Aucun client', 'empty.createFirst': 'Créez le premier',
  'firstRun.title': 'Bienvenue', 'firstRun.skip': 'Passer', 'firstRun.next': 'Suivant', 'firstRun.done': 'Commencer',
};

const pt: Record<TranslationKey, string> = {
  ...en,
  'nav.editor': 'Editor', 'nav.documents': 'Documentos', 'nav.clients': 'Clientes', 'nav.items': 'Itens', 'nav.reports': 'Relatórios', 'nav.settings': 'Configurações',
  'mode.invoice': 'Fatura', 'mode.quote': 'Orçamento', 'mode.receipt': 'Recibo', 'mode.credit_note': 'Nota de Crédito',
  'client.billTo': 'Faturar Para', 'adj.subtotal': 'Subtotal', 'adj.discount': 'Desconto', 'adj.shipping': 'Frete', 'adj.total': 'Total', 'adj.balance': 'Saldo Devido',
  'action.save': 'Salvar', 'action.print': 'Imprimir / PDF', 'action.delete': 'Excluir', 'action.new': 'Novo',
  'firstRun.title': 'Bem-vindo', 'firstRun.skip': 'Pular', 'firstRun.next': 'Próximo', 'firstRun.done': 'Começar',
};

const de: Record<TranslationKey, string> = {
  ...en,
  'nav.editor': 'Editor', 'nav.documents': 'Dokumente', 'nav.clients': 'Kunden', 'nav.items': 'Positionen', 'nav.reports': 'Berichte', 'nav.settings': 'Einstellungen',
  'mode.invoice': 'Rechnung', 'mode.quote': 'Angebot', 'mode.receipt': 'Quittung', 'mode.credit_note': 'Gutschrift',
  'client.billTo': 'Rechnung An', 'adj.subtotal': 'Zwischensumme', 'adj.discount': 'Rabatt', 'adj.shipping': 'Versand', 'adj.total': 'Gesamt', 'adj.balance': 'Offener Betrag',
  'action.save': 'Speichern', 'action.print': 'Drucken / PDF', 'action.delete': 'Löschen', 'action.new': 'Neu',
  'firstRun.title': 'Willkommen', 'firstRun.skip': 'Überspringen', 'firstRun.next': 'Weiter', 'firstRun.done': 'Loslegen',
};

const ar: Record<TranslationKey, string> = {
  ...en,
  'nav.editor': 'المحرر', 'nav.documents': 'المستندات', 'nav.clients': 'العملاء', 'nav.items': 'البنود', 'nav.reports': 'التقارير', 'nav.settings': 'الإعدادات',
  'mode.invoice': 'فاتورة', 'mode.quote': 'عرض سعر', 'mode.receipt': 'إيصال', 'mode.credit_note': 'إشعار دائن',
  'client.billTo': 'فاتورة إلى', 'adj.subtotal': 'المجموع الفرعي', 'adj.discount': 'خصم', 'adj.shipping': 'الشحن', 'adj.total': 'المجموع', 'adj.balance': 'الرصيد المستحق',
  'action.save': 'حفظ', 'action.print': 'طباعة / PDF', 'action.delete': 'حذف', 'action.new': 'جديد',
  'firstRun.title': 'مرحبا', 'firstRun.skip': 'تخطي', 'firstRun.next': 'التالي', 'firstRun.done': 'ابدأ',
};

const TRANSLATIONS: Record<LanguageCode, Record<TranslationKey, string>> = { en, es, fr, pt, de, ar };

export function t(key: TranslationKey, lang: LanguageCode = 'en'): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key] || key;
}

export const SUPPORTED_LANGUAGES: { code: LanguageCode; name: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'pt', name: 'Português', dir: 'ltr' },
  { code: 'de', name: 'Deutsch', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
];

export const AMOUNT_WORDS_SUPPORTED: LanguageCode[] = ['en', 'es', 'fr', 'pt', 'de'];
