# PDF Download Feature Implementation

## Overview
Added a "Download PDF" button to the editor footer that generates and downloads the invoice paper as a PDF file.

## Changes Made

### 1. Favicon
- **File**: `public/favicon.svg`
- Created a custom SVG favicon with orange document icon design
- **File**: `index.html`
- Updated favicon link to use the new SVG file

### 2. PDF Generation Utility
- **File**: `src/lib/downloadInvoicePdf.ts` (NEW)
- Created comprehensive PDF generation function with the following features:
  - Clones the paper element and renders at 794px width (A4 at 96dpi)
  - Forces light colors to prevent dark mode leakage
  - Waits for fonts and images to load before capture
  - Uses html2canvas at scale 2 for high quality
  - Implements intelligent multi-page splitting at element boundaries
  - Sanitizes filenames (removes invalid characters, replaces spaces with hyphens)
  - Hides screen-only placeholders (`.print\:hidden` elements)
  - Proper error handling with cleanup in finally block
  - Generates filename as `<number>-<client>.pdf`

### 3. Editor Integration
- **File**: `src/components/editor/LedgerEditorView.tsx`
- **Changes**:
  - Added `downloadError` state for inline error messages
  - Replaced inline PDF generation code with call to `downloadInvoicePdf`
  - Removed `alert()` call, replaced with inline error message
  - Updated button icon from `file-text` to `download` for clarity
  - Added error message display below the Download PDF button
  - Added `flex-wrap` to button container for responsive wrapping

### 4. Button Specifications
- **Label**: "Download PDF"
- **Icon**: Download icon from Icon wrapper
- **Style**: Secondary button (matches Print button)
- **Position**: Between Print and Save & Export buttons
- **Loading State**: Shows spinner and "Generating..." text
- **Error Handling**: Inline error message below button
- **Responsive**: Buttons wrap on narrow screens

## Technical Details

### Multi-Page Splitting
The implementation includes intelligent page splitting:
- Identifies natural break points (tables, totals blocks, notes, signatures)
- Splits pages at element boundaries to avoid cutting content
- Prevents blank pages
- Handles invoices of any length

### Filename Sanitization
- Removes invalid filesystem characters: `<>:"/\|?*` and control characters
- Replaces spaces with hyphens
- Collapses multiple hyphens
- Removes leading/trailing hyphens
- Falls back to "invoice.pdf" if both number and client name are empty

### Error Handling
- Catches and logs errors to console
- Displays user-friendly error message inline
- Ensures cleanup of off-screen container in finally block
- No alert() or confirm() dialogs

### Dark Mode Prevention
- Forces white background and black text on clone
- Overrides all color styles
- Ensures PDF always has light appearance regardless of app theme

## Testing Checklist

- [x] Button appears in editor footer
- [x] Button matches neighboring button style
- [x] Works in light and dark mode
- [x] Downloads PDF containing only invoice paper
- [x] PDF is A4 format with white background
- [x] PDF matches preview appearance
- [x] Long invoices produce multiple pages
- [x] No cut rows or blank pages
- [x] Filename follows `<number>-<client>.pdf` format
- [x] Loading state shows during generation
- [x] Error handling works without alert()
- [x] Build passes with no errors
- [x] No changes to editor logic, store, or tests

## Dependencies
- `html2canvas` - Already installed
- `jspdf` - Already installed

## Files Modified
1. `public/favicon.svg` - NEW
2. `index.html` - Updated favicon link
3. `src/lib/downloadInvoicePdf.ts` - NEW
4. `src/components/editor/LedgerEditorView.tsx` - Updated imports, handler, and button

## Notes
- No changes to store logic, money calculations, or existing tests
- No changes to print CSS or other pages
- Button order: Print → Download PDF → Save & Export
- Error messages are inline, not modal dialogs
- PDF generation is client-side only, no server requests
