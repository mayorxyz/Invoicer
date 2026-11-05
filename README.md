# Invoicer

**Invoicer** is a static, client‑side single‑page application (SPA) for generating professional invoices, quotes, receipts, and related business documents — entirely in your browser.

No signup, no login, no email registration, and no backend server. Every document, client record, and setting is saved locally in your browser's `localStorage`, so your financial data stays under your control.

---

## Features

- **Documents:** Invoices, quotes, receipts, credit notes, proforma invoices, purchase orders, delivery notes, and statements
- **Local-first:** All data is stored client‑side in `localStorage` (key: `invoicer_v2`) — nothing is uploaded to a cloud database
- **Privacy by design:** No accounts, no tracking scripts, no analytics, no third‑party marketing cookies
- **Offline capable:** Cached via a service worker so you can work without an internet connection
- **Export / Import:** Download a complete JSON backup of all records; restore it on another browser or device
- **Multi‑currency:** ~168 currencies supported
- **Multi‑language:** 6 languages supported
- **Multi‑tax:** Configure and apply different tax rates
- **Templates:** 9 document templates
- **PDF ready:** Export documents to PDF

---

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool & dev server)
- **Tailwind CSS** (styling)
- **React Router** (client‑side routing)
- **lucide‑react** (icons)
- **framer‑motion** (animations)
- **@dnd‑kit** (drag‑and‑drop)
- **recharts** (charts)
- **uuid**, **date‑fns**, **canvas‑confetti**

---

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm

### Install

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Build for production

```bash
npm run build
```

Production output goes to the `dist/` directory.

### Type check

```bash
npm run typecheck
```

---

## Project Structure

```
invoice-1/
├── public/               # Static assets
├── src/
│   ├── App.tsx           # App shell & routes
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles & Tailwind
│   ├── components/
│   │   ├── layout/       # SiteHeader, SiteFooter
│   │   ├── mockups/      # UI mockup components
│   │   └── ui/           # Shared UI primitives (ScrollReveal, ScrollToTop, etc.)
│   └── pages/            # Route pages
│       ├── Home.tsx
│       ├── About.tsx
│       ├── Contact.tsx
│       ├── FAQ.tsx
│       ├── Features.tsx
│       ├── HowItWorks.tsx
│       ├── Pricing.tsx
│       └── Legal.tsx     # Privacy & terms (combined legal page)
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.js
```

---

## Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/features` | Features |
| `/how-it-works` | How It Works |
| `/pricing` | Pricing |
| `/about` | About |
| `/faq` | FAQ |
| `/contact` | Contact |
| `/legal` | Privacy & Terms of Service |

---

## Data & Privacy

- **Storage:** `localStorage` under the key `invoicer_v2`
- **Encryption:** Data is stored as unencrypted plain JSON tied to your browser origin
- **Security:** If someone gains physical access to an unlocked device, they can inspect browser storage. For sensitive records, secure your device and regularly download JSON backups
- **Export:** Available from the Settings page data section
- **Import:** Restore a JSON backup onto another browser or device
- **Delete:** Clear stored records through the app or by clearing your browser site data

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run typecheck` | Run TypeScript type check (`tsc --noEmit`) |

---

## License

Open source. See the repository for license details.