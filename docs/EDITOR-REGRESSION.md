# Editor Regression Test Checklist

## Current Status (Before Fixes)

### Financial Adjustments
- [ ] Discount percent renders in preview
- [ ] Discount fixed renders in preview
- [ ] Tax percent renders in preview
- [ ] Tax fixed renders in preview (currently only percent supported)
- [ ] Shipping renders in preview
- [ ] Amount paid renders in preview
- [ ] Footer totals match preview totals
- [ ] Combined example (10% discount, 8.5% tax, 150 shipping, 500 paid) calculates correctly

### Print/PDF
- [ ] Print shows only paper (not form pane)
- [ ] Multi-page invoices print fully
- [ ] Table header repeats on each page
- [ ] No dark mode leakage in print
- [ ] No placeholders print ("[Company Logo]", "Client Name")
- [ ] Contact line doesn't print lone bullet when email/phone empty
- [ ] Document title set correctly before print

### Download PDF
- [ ] Download PDF button exists
- [ ] Downloads file named "<number>-<client>.pdf"
- [ ] PDF contains only paper
- [ ] PDF matches preview exactly
- [ ] No cut rows or blank pages
- [ ] A4 size correct

### Document Type Tabs
- [ ] Invoice tab sets mode to 'invoice' and shows "INVOICE"
- [ ] Estimate tab sets mode to 'quote' and shows "ESTIMATE"
- [ ] Quote tab sets mode to 'receipt' and shows "QUOTE" (BROKEN - shows "QUOTE" for receipt)

### Ship To
- [ ] Ship To checkbox toggles visibility
- [ ] Recipient Name input bound to draft
- [ ] Shipping Address input bound to draft
- [ ] Preview shows entered values (BROKEN - shows hardcoded text)
- [ ] Load Sample leaves Ship To off
- [ ] Clear empties and disables Ship To

### PO Number
- [ ] PO Number input updates immutably
- [ ] PO row appears in preview only when value exists
- [ ] PO Number persists after reload

### Payment Terms
- [ ] Net 15 shows when due date is 15 days after issue
- [ ] Net 30 shows when due date is 30 days after issue
- [ ] Net 60 shows when due date is 60 days after issue
- [ ] Due on Receipt shows when due date equals issue date
- [ ] Custom shows when difference is not 0/15/30/60 (BROKEN - doesn't show Custom)
- [ ] Changing issue date recomputes due date from terms
- [ ] Changing terms recomputes due date

### Currency
- [ ] Changing currency updates preview amounts
- [ ] Changing currency updates footer amounts
- [ ] Currency symbol appears before amounts

### Line Items
- [ ] Can add items
- [ ] Can delete items (minimum 1 row)
- [ ] Quantity accepts decimals
- [ ] Rate accepts decimals
- [ ] Details text shows under item name in preview
- [ ] Empty items show "No line items added yet."
- [ ] Items with only name still render

### Logo, Signature, Photos
- [ ] Logo upload works
- [ ] Logo shows in preview
- [ ] Logo remove works
- [ ] Signature pad draws
- [ ] Signature shows in preview
- [ ] Signature clear works
- [ ] Photos upload works (max 6, 2MB each)
- [ ] Photos show in preview
- [ ] Photos remove works
- [ ] Inline error messages (not alert())
- [ ] Logo persists after reload
- [ ] Signature persists after reload
- [ ] Photos persist after reload

### Load Sample / Clear
- [ ] Load Sample fills all fields
- [ ] Load Sample fills preview
- [ ] Clear confirms before clearing
- [ ] Clear empties all fields
- [ ] Clear empties signature
- [ ] Clear empties photos
- [ ] Clear empties logo
- [ ] Clear disables Ship To

### Visual Issues
- [ ] Document Meta card grid doesn't clip Payment Terms select
- [ ] Document Meta card grid doesn't clip date inputs
- [ ] Form looks correct in light theme
- [ ] Form looks correct in dark theme
- [ ] Paper stays white in both themes

### Footer
- [ ] Total Amount displays correctly
- [ ] Balance Due displays correctly
- [ ] Print button works
- [ ] Save & Export button works
- [ ] Buttons don't clip on narrow widths

## Issues Found

1. **Document Type Tabs**: Quote tab shows "QUOTE" for receipt mode (line 821)
2. **Ship To**: Preview shows hardcoded "Recipient Name" and "Shipping Address" (lines 844-845)
3. **Payment Terms**: No "Custom" option when difference is not 0/15/30/60
4. **Tax Type**: Only percent supported, no fixed option
5. **Download PDF**: Button missing
6. **Print CSS**: May not work with new shell structure
7. **Document Meta**: Grid may clip inputs at certain widths

## Files to Check
- src/components/editor/LedgerEditorView.tsx
- src/index.css (print styles)
- src/lib/money.ts (totals function)
