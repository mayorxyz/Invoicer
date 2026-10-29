# Fix Notes - App Shell and Sidebar Restoration

## Root Causes

1. **App.tsx bypasses shell for editor view**: When `view === 'editor'`, the app renders `<LedgerEditorView />` directly without wrapping it in the shell structure (TopBar, Sidebar, main content area). This causes the sidebar and top bar to disappear when viewing the editor.

2. **LedgerEditorView has its own full-viewport layout**: The editor component uses `h-screen` on its root div and includes its own header bar and sticky footer. When mounted inside a shell or scrolling page, this creates duplicate scroll areas and duplicate footers.

## Fixes Applied

### 1. Restored Shell Structure in App.tsx
- Removed the conditional rendering that bypassed the shell for editor view
- All views (including editor) now render inside the shell's main content area
- Shell uses CSS Grid with sidebar (248px/72px) and main column
- Main column is a flex container with `min-h-0` to prevent overflow issues

### 2. Collapsible Sidebar Implementation
- Added `sidebarCollapsed` state to store (persisted in localStorage)
- Sidebar width transitions between 248px (expanded) and 72px (collapsed)
- Collapse toggle button with caret icons (left/right arrows)
- Keyboard shortcut: Ctrl/Cmd+B to toggle
- Mobile (<1024px): Sidebar becomes a drawer with backdrop
- Collapsed state shows only icons with tooltips on hover
- Profile section and backup card hidden when collapsed
- Active nav item maintains highlight in both states

### 3. LedgerEditorView Integration
- Removed the duplicate header bar (logo, "Ledger", "Document Studio")
- Kept editor-specific controls (accent colors, theme toggle, Load Sample, Clear) as a toolbar row
- Changed root from `h-screen` to `h-full min-h-0` to fit inside shell
- Form and preview panes are the only scroll containers
- Added bottom padding (80px) to both panes to account for sticky footer
- Footer stays at bottom of editor area, not viewport

### 4. Fixed Double Scroll Issue
- Shell uses `overflow-hidden` to prevent window scrolling
- Main column uses `min-h-0` to allow flex children to scroll independently
- Editor view: only form and preview panes scroll
- Other views: main content area scrolls
- Print CSS updated to hide shell chrome and show only paper

### 5. Mobile Responsiveness
- Below 1024px: Sidebar becomes a drawer (off-canvas)
- Hamburger menu in TopBar opens drawer
- Backdrop closes drawer on click
- Escape key closes drawer
- Route changes close drawer
- Form/Preview segmented switch for editor on mobile

## Files Modified

1. **src/store/useStore.ts**
   - Added `sidebarCollapsed: boolean` to Settings
   - Added `toggleSidebar()` action
   - Persists collapsed state in localStorage

2. **src/App.tsx**
   - Unified shell structure for all views
   - Added mobile drawer logic for sidebar
   - Added keyboard shortcut (Ctrl/Cmd+B)
   - Removed conditional editor rendering

3. **src/components/layout/Sidebar.tsx**
   - Added collapse/expand functionality
   - Conditional rendering based on collapsed state
   - Tooltips for nav items when collapsed
   - Smooth width transition (200ms)
   - Mobile drawer mode with backdrop

4. **src/components/layout/TopBar.tsx**
   - Added hamburger menu button for mobile
   - Opens sidebar drawer on mobile

5. **src/components/editor/LedgerEditorView.tsx**
   - Removed duplicate header bar
   - Changed root to `h-full min-h-0`
   - Added toolbar row for editor controls
   - Added bottom padding to panes (80px)
   - Footer positioned at bottom of editor area

6. **src/index.css**
   - Updated print CSS to hide shell chrome
   - Added transition utilities for sidebar

## Acceptance Criteria Met

✅ Sidebar and all pages are back and reachable
✅ Active nav state is correct
✅ No console errors
✅ Sidebar folds to 72px and expands to 248px with animation
✅ Tooltip labels show when collapsed
✅ State persists after reload
✅ Ctrl/Cmd+B works
✅ Mobile uses drawer
✅ Editor shows one top bar, one toolbar row, one footer
✅ No duplicate bars anywhere
✅ Editor scrolling happens only inside form and preview panes
✅ No window scroll in editor
✅ No second footer at bottom
✅ Nothing hidden behind footer
✅ Print outputs only the paper
✅ Both themes look correct
✅ No hard-coded colors
✅ No emojis
✅ Typecheck passes
✅ Build passes
