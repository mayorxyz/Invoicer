# Dialog Audit - Native Browser Prompts Outside Editor

## Found Instances (Excluding src/components/editor)

### TimePage.tsx (4 prompts)
- Line 46: `prompt('Description:')` - collects time entry description
- Line 48: `prompt('Hourly rate:', '100')` - collects hourly rate
- Line 49: `prompt('Hours:', '1')` - collects hours worked
- Line 50: `prompt('Date (YYYY-MM-DD):', ...)` - collects date

### SettingsPage.tsx (1 confirm)
- Line 207: `confirm('Are you sure? This cannot be undone.')` - confirms delete all data

### ItemsPage.tsx (4 prompts)
- Line 45: `prompt('Item name:')` - collects item name
- Line 47: `prompt('Price:', '0')` - collects price
- Line 48: `prompt('Unit (hrs, days, pcs, etc.):', 'pcs')` - collects unit
- Line 49: `prompt('Category:', 'General')` - collects category

### ClientsPage.tsx (1 prompt, 1 confirm)
- Line 43: `prompt('Client name:')` - collects client name
- Line 193: `confirm('Delete this client?')` - confirms client deletion

### ExpensesPage.tsx (4 prompts)
- Line 81: `prompt('Vendor:')` - collects vendor name
- Line 83: `prompt('Amount:', '0')` - collects amount
- Line 84: `prompt('Category:', 'General')` - collects category
- Line 85: `prompt('Date (YYYY-MM-DD):', ...)` - collects date

## Total: 17 native prompts/confirms to replace

## Replacement Plan
1. Create shared Dialog component with focus trap and accessibility
2. Create ConfirmDialog for destructive actions
3. Create entity-specific form dialogs:
   - ItemDialog (name, SKU, category, unit, price, tax, active)
   - ExpenseDialog (date, vendor, category, amount, currency, tax, notes)
   - TimeEntryDialog (date, client, description, start/end, rate, billed)
   - ClientDialog (name, email, phone, address, tax ID, defaults)
4. Replace all native prompts with styled dialogs
5. Add lint rule to prevent future native prompt usage
