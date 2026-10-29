# Design Changes - Liftoff Style Redesign

## Current State
- Generic dark SaaS theme
- Emoji icons throughout
- No consistent design system
- Mixed typography (Inter + JetBrains Mono)
- Basic component styling
- No landing page or style guide

## Components to Replace

### 1. Design Tokens
- **Current**: Inline Tailwind classes, no centralized tokens
- **New**: `src/styles/tokens.css` with CSS variables for colors, typography, spacing
- **Colors**: Flame #FF5A1F, ink #111111, muted #FAFAFA, surface #F4F4F4
- **Typography**: Plus Jakarta Sans (self-hosted), tabular numerals for amounts
- **Spacing**: 8px grid system

### 2. Icons
- **Current**: Emoji characters (📄, 👤, 📦, 📊, ⚙, ✎, ✕, etc.)
- **New**: Phosphor Icons via `@phosphor-icons/react`
- **Wrapper**: Single `<Icon />` component with size/weight props
- **Flags**: country-flag-icons package instead of emoji flags

### 3. Base Components
- **Current**: Inline styled elements
- **New**: Reusable component library
  - Button (Primary/Secondary/Ghost with arrow tile)
  - Input/Select/Textarea (44px height, proper labels)
  - Segmented control (pill track)
  - Pill/Badge (status pills with dots)
  - Card (stat card, list card, empty state)
  - Accordion (with orange index, completion check)
  - Table (hairline rules, sticky header)
  - Dialog/Drawer/Popover/Tooltip
  - Toast (ink background, bottom-center)
  - Command palette (Ctrl+K)

### 4. Layout
- **Current**: Simple flex layout
- **New**: 
  - Desktop: Top bar (64px) + Left sidebar (240px)
  - Mobile: Top bar + Bottom tab bar
  - Peach glow background (radial gradient)
  - Preview stage with flame-tint panel

### 5. Editor
- **Current**: Basic form + preview split
- **New**: 
  - Three columns: Form (accordion) | Preview stage | (empty)
  - Greeting row with H5 + caption
  - Document-type segmented control
  - Accordion sections with (01), (02) numbering
  - Progress bar (hairline, flame fill)
  - Preview toolbar (zoom, page nav, template switcher)
  - Sticky totals bar with count-up animation

### 6. Paper Templates
- **Current**: Basic Classic/Modern/Minimal
- **New**: 
  - Classic: Eyebrow labels, hairline rules, accent title
  - Modern: Large H3 title, peach band behind totals, numbered items
  - Minimal: Generous whitespace, accent only on balance
  - All use Plus Jakarta Sans, tabular numerals, orange-square marker

### 7. Views
- **Current**: Basic views with inline styling
- **New**: 
  - Documents: Stat cards with sparklines, delta badges, bulk actions
  - Clients: Split view (list left, detail right)
  - Reports: SVG charts (bar, sparkline, aging), tooltips
  - Settings: Two-column layout with eyebrow numbering
  - First-run: Centered dialog with progress indicator

### 8. Landing Page
- **Current**: None
- **New**: 
  - Hero with browser-frame mockup + phone mockup
  - Features grid (2x4)
  - How it works (3 steps with product shots)
  - Templates showcase
  - FAQ accordion
  - Footer with ink background

### 9. Style Guide
- **Current**: None
- **New**: `/style-guide` route showing all components

### 10. Motion
- **Current**: Basic transitions
- **New**: 
  - 150-250ms ease-out
  - Button arrow nudge on hover
  - Accordion height animation
  - Page reveal (8px translate + fade)
  - Chart bars grow from zero (400ms staggered)
  - Count-up on stat numbers
  - Respects prefers-reduced-motion

### 11. Accessibility
- **Current**: Basic focus states
- **New**: 
  - 44px touch targets
  - Visible labels (no placeholder-only)
  - Focus rings (2px flame, 2px offset)
  - aria-live on totals
  - Skip link
  - Semantic landmarks
  - Test at 360px and 1440px

## Files to Create/Modify

### New Files
- `src/styles/tokens.css` - Design tokens
- `src/components/ui/Icon.tsx` - Icon wrapper
- `src/components/ui/Button.tsx` - Button variants
- `src/components/ui/Input.tsx` - Input/Select/Textarea
- `src/components/ui/Segmented.tsx` - Segmented control
- `src/components/ui/Pill.tsx` - Status pills
- `src/components/ui/Card.tsx` - Card variants
- `src/components/ui/Accordion.tsx` - Accordion sections
- `src/components/ui/Table.tsx` - Data table
- `src/components/ui/Dialog.tsx` - Modal dialogs
- `src/components/ui/Toast.tsx` - Toast notifications
- `src/components/ui/Tooltip.tsx` - Tooltips
- `src/components/ui/CommandPalette.tsx` - Ctrl+K palette
- `src/components/layout/TopBar.tsx` - Top navigation
- `src/components/layout/Sidebar.tsx` - Left sidebar
- `src/components/layout/MobileTabs.tsx` - Bottom tab bar
- `src/components/editor/EditorView.tsx` - Redesigned editor
- `src/components/editor/AccordionForm.tsx` - Accordion form
- `src/components/editor/PreviewStage.tsx` - Preview with toolbar
- `src/components/editor/StickyTotals.tsx` - Sticky totals bar
- `src/components/papers/Classic.tsx` - Classic template
- `src/components/papers/Modern.tsx` - Modern template
- `src/components/papers/Minimal.tsx` - Minimal template
- `src/components/views/DocumentsView.tsx` - Documents view
- `src/components/views/ClientsView.tsx` - Clients view
- `src/components/views/ItemsView.tsx` - Items view
- `src/components/views/ReportsView.tsx` - Reports view
- `src/components/views/SettingsView.tsx` - Settings view
- `src/components/charts/BarChart.tsx` - Bar chart
- `src/components/charts/Sparkline.tsx` - Sparkline
- `src/components/charts/AgingChart.tsx` - Aging stacked bar
- `src/pages/Landing.tsx` - Landing page
- `src/pages/StyleGuide.tsx` - Style guide page
- `src/pages/App.tsx` - Main app (renamed from current App.tsx)

### Modified Files
- `src/index.css` - Import tokens, update base styles
- `tailwind.config.js` - Extend theme with tokens
- `src/main.tsx` - Add router for landing/style-guide
- `src/App.tsx` - Refactor to use new components
- `package.json` - Add phosphor-icons, fontsource, flag-icons
- `README.md` - Update with new design system info

### Unchanged Files
- All `src/lib/*` files (logic unchanged)
- `src/store/useStore.ts` (state unchanged)
- `src/types.ts` (types unchanged)
- `src/data/*` (data unchanged)
- `src/i18n/*` (translations unchanged)

## Dependencies to Add
- `@phosphor-icons/react` - Icon library
- `@fontsource/plus-jakarta-sans` - Self-hosted font
- `country-flag-icons` - SVG flag icons

## Testing
- Add emoji scan test (fail if emoji found in src/)
- Visual regression tests at 360px and 1440px
- Accessibility audit (axe-core)
- Print CSS verification (A4, Letter, multi-page)
