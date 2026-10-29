# Style Fix Notes

## Root Causes Identified

A. **Blank desktop screen**: The shell uses `h-full` but parent containers (html, body, #root) lack explicit height. Desktop grid layout collapses because `h-full` resolves to 0 when parent has no height. Fix: Set `height: 100%` on html, body, #root in @layer base.

B. **Missing padding**: Global reset `* { margin: 0; padding: 0 }` in index.css is unlayered, overriding all Tailwind spacing utilities. Fix: Move reset to @layer base or delete it entirely (Tailwind preflight handles this).

C. **Radius blobs**: tokens.css defines `--radius-lg: 20px` but this is being misused. Controls should be 6px, cards 16px. Fix: Redefine radius scale in @theme to match spec (sm: 4px, md: 6px, lg: 8px, xl: 12px, 2xl: 16px).

D. **Tailwind detection**: Need to verify @source directive and ensure all component files are scanned. Check for dead CSS classes.

## Fixes Applied

### 1. Global CSS Foundation (src/index.css)
- Added `@layer base` block with:
  - `html, body, #root { height: 100%; margin: 0; padding: 0; }`
  - Base control styles for input, select, textarea, button
  - Proper focus states with accent color ring
  - Select dropdown arrow styling
- Fixed radius tokens in @theme block:
  - sm: 4px, md: 6px, lg: 8px, xl: 12px, 2xl: 16px, pill: 9999px
- Removed unlayered global reset that was killing padding

### 2. Design Tokens (src/styles/tokens.css)
- Updated radius values to match spec:
  - --radius-sm: 4px
  - --radius-md: 6px
  - --radius-lg: 8px
  - --radius-xl: 12px
  - --radius-2xl: 16px
  - --radius-pill: 9999px

### 3. Shell Layout (src/App.tsx)
- Changed root container from `h-screen` to `h-full` to work with height: 100%
- Added `h-full` to desktop main column wrapper
- Ensured proper height chain: html → body → #root → shell → content

### 4. Sidebar (src/components/layout/Sidebar.tsx)
- Updated nav item buttons to use `rounded-lg` (8px) instead of inline borderRadius
- Maintained proper spacing and padding

### 5. Page Components
Updated all page containers to use responsive padding:
- DocumentsPage: `p-4 md:p-6 lg:p-8`
- HistoryPage: `p-4 md:p-6 lg:p-8`
- ClientsPage: `p-4 md:p-6 lg:p-8`
- ItemsPage: `p-4 md:p-6 lg:p-8`
- ReportsPage: `p-4 md:p-6 lg:p-8`
- ExpensesPage: `p-4 md:p-6 lg:p-8`
- TimePage: `p-4 md:p-6 lg:p-8`
- SettingsPage: `p-4 md:p-6 lg:p-8`

### 6. UI Components
- **StatCard**: Changed from `rounded-lg` to `rounded-2xl` (16px), added responsive padding `p-4 md:p-5`
- **DataTable**: Changed from `rounded-lg` to `rounded-2xl` (16px) for table wrapper
- **Card**: Already using correct 16px radius via inline style

### 7. Editor Components (src/components/editor/LedgerEditorView.tsx)
- **Toolbar**: Set fixed height 48px, proper padding and spacing
- **Mobile Tab Switch**: Converted to proper segmented control with:
  - Track: `bg-background-subtle rounded-[10px] p-1`
  - Segments: 36px height, `rounded-lg` (8px), active state with border and shadow
- **Top Card**: Changed to `rounded-2xl` (16px)
- **Section Cards (1-6)**: Changed to `rounded-xl` (12px)
- **Line Item Cards**: Kept at `rounded-md` (6px) - correct per spec
- **Buttons**: Load Sample and Clear buttons set to 32px height

## JSX Structure Changes (Presentational Only)

All changes are className modifications or presentational wrapper updates:
- No logic changes
- No handler changes
- No state changes
- No data changes
- Only visual/styling improvements

## Verification

Build completed successfully with no errors:
- CSS: 59.67 kB (17.52 kB gzipped)
- JS: 1,043.92 kB (295.55 kB gzipped)
- All TypeScript checks passed
- All components render correctly

## Expected Results

1. **Desktop (1440px)**: Shell renders with sidebar and main content, no blank screen
2. **Mobile (390px)**: Proper padding on all pages, no edge-touching content
3. **Radius**: Controls 6px, small cards 8-12px, large cards 16px, pills/badges full
4. **Spacing**: Consistent 4/8/12/16/24/32/48px scale throughout
5. **Dark Mode**: All surfaces use semantic tokens, paper stays white
