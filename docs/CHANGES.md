# CHANGES.md — Redesign & Globalize Audit

## What Exists (v1 — InvoiceNG)
- `src/types.ts` — NGN/USD/GBP/EUR only, `Mode = invoice|receipt|quote`, kobo-based money, `vatOn`/`vatRate`/`whtRate` fields
- `src/config.ts` — Nigeria-first defaults (7.5% VAT, WHT presets, NGN default)
- `src/lib/money.ts` — `toKobo`/`fromKobo`, always 2 decimals, NGN-centric `formatMoney`
- `src/lib/dates.ts` — basic date utils, no locale
- `src/lib/status.ts` — derived status (draft/sent/paid/partial/overdue/cancelled)
- `src/lib/numbering.ts` — per-mode counters
- `src/lib/words.ts` — English-only amountInWords
- `src/lib/storage.ts` — localStorage, schema v1, no migration
- `src/lib/share.ts` — WhatsApp, mailto, clipboard
- `src/lib/csv.ts` — CSV export
- `src/store/useStore.ts` — single Zustand store, undo/redo, toasts
- `src/components/` — SellerForm, DocumentForm, ClientPicker, ItemsForm, Adjustments, PaymentsForm, NotesForm, Preview (3 templates), HistoryView, ClientsView, SettingsView
- `src/App.tsx` — two-pane layout, mobile tab toggle, dark SaaS theme
- `src/index.css` — Tailwind + print CSS (A4)
- `public/sw.js`, `public/manifest.json` — PWA shell

## What Will Change
1. **Branding**: `InvoiceNG` → `APP_NAME = 'Invoicer'`; no Nigeria defaults
2. **Types**: Generic `Currency` (string), new `Tax` model (label, rate, type, apply-to), new `Mode` adds credit-note/proforma/purchase-order/delivery-note/statement, `BusinessProfile` for multi-business
3. **Money**: `toMinor`/`fromMinor` per currency decimals (JPY=0, USD=2, KWD=3)
4. **Tax**: Replace `vatOn`/`whtRate` with `taxes: Tax[]`; inclusive/exclusive pricing mode; per-line tax and discount
5. **Migration**: `migrate()` v1→v2 tested function
6. **Locale**: `navigator.language` inference, first-run dialog, `Intl` formatting, RTL support, i18n (en/es/fr/pt/de/ar)
7. **Design**: Light-first with dark toggle, CSS variable tokens, Inter + JetBrains Mono, 6px radius, hairline rules, accordion editor, left rail, sticky totals bar
8. **Features**: Deposits/milestones, late fees, early-payment discounts, custom fields, payment QR codes, share link (lz-string), reports dashboard, expenses, time tracker, client statements, command palette, CSV import, encrypted backup
9. **Templates**: Redesigned Classic/Modern/Minimal with design tokens, RTL, tabular mono numbers
10. **Print**: A4/Letter per document, repeating thead, totals on last page, page x of y

## What Stays
- Folder structure (add `src/data/`, `src/i18n/`, `src/features/`)
- Zustand store pattern
- localStorage approach (namespaced keys, try/catch, quota handling)
- Print-via-window.print() approach
- PWA shell (sw.js, manifest.json)
- React + Vite + TS strict + Tailwind stack
