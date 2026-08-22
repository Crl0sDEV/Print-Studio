# Prynt - SME Printing Business SaaS & Order Management Platform

Prynt is a production-grade, offline-first SaaS platform engineered for SME print shop owners. It simplifies customer file submissions, automates pricing calculations, delegates file storage to the shop owner's personal Google Drive, and provides an end-to-end **Photo Studio & Automated Print Imposition Suite** directly in the browser.

---

## Architecture Overview

```
Prynt Platform
├── Customer Storefront (/[slug])
│   ├── Dynamic Pricing Calculator (Paper size, GSM, Color mode, Page count)
│   ├── Direct File Upload (Routed to Google Drive or Supabase Storage)
│   └── Instant Order Submission & Confirmation
│
├── Owner Dashboard (/dashboard)
│   ├── Orders Data Table (Status tracking, Customer contact, Direct downloads)
│   ├── Photo & Print Studio Pro (/dashboard/studio)
│   │   ├── AI & Chroma-Key Background Eraser (₱0 Server Compute)
│   │   ├── Philippine ID Photo Lab & Formal Attire Studio (Barong/Suits/Nametag)
│   │   ├── Automated Print Layout & Gang Sheet Engine (A4, Short, Long, 4R)
│   │   └── Document & Receipt Scan Photocopy Enhancer
│   ├── Services & Pricing Manager (Paper presets, rates, and parameters)
│   ├── QR Code Poster Studio (Canvas API generator with quiet zones)
│   └── Storage Settings (Google Drive OAuth 2.0 connection management)
│
└── Backend Infrastructure
    ├── Next.js App Router & Server Actions
    ├── Supabase PostgreSQL Database (Strict RLS Policies)
    ├── Google Drive API (OAuth 2.0 Refresh Tokens)
    ├── Client-Side WebAssembly & WebGPU AI Runtime (@imgly/background-removal)
    └── Offline PWA Service Worker (next-pwa caching & offline fallbacks)
```

---

## Features

### 1. Zero-Cost Storage & Compute Architecture
* **Google Drive API:** Customer file uploads stream directly to the shop's designated Google Drive folder via Next.js Server Actions, bypassing database storage limits with 15GB+ free cloud storage.
* **100% Client-Side AI & Matting:** Neural network background removal runs locally on the browser via WebAssembly (WASM) and WebGPU, eliminating costly GPU server hosting expenses.

### 2. Print Studio Pro & ID Photo Suite
* **Dual-Engine Background Eraser:**
  * One-Click AI Background Removal for complex portraits.
  * Instant Chroma-Key / Magic Wand tool (<50ms) with customizable color tolerance and edge-feathering.
  * Manual Precision Eraser & Restore Brushes with Undo/Redo history.
  * 1-Click ID Background Replacer (Pure White `#FFF`, Studio Royal Blue `#0072CE`, Sky Blue, Classic Red, Gray, Transparent PNG, and custom color picker).
* **Philippine Standard ID Photo Lab:**
  * Standard presets: `1x1 in`, `2x2 in`, `Passport (35 × 45 mm DFA)`, `PRC / CSC (1.5 × 1.5 in)`, `Wallet (2.5 × 3.5 in)`, `3R`, `4R`, `5R`.
  * **Formal Attire Overlays:** Men's Barong Tagalog (traditional Philippine embroidery), Men's Business Suit & Tie, Women's Formal Blazer, and White Collared Polo with draggable position and scale controls.
  * **Official CSC & PRC Nametag Generator:** Official bottom white banner with black border formatting for full name and designation.
  * **Lighting Adjustments:** Brightness, Contrast, Sharpness, 90° rotation, and horizontal mirror flip.

### 3. Automated Print Layout & Gang Sheet Generator (Smart Imposition)
* **Paper Format Support:** A4 (210 × 297 mm), Short / Letter (8.5 × 11 in), Long / Folio (8.5 × 13 in), 4R Photo Paper (4 × 6 in), 5R, A3.
* **1-Click Standard Print Packages:**
  * **Package A (CSC & Job Hunting Combo):** 4 pcs 2x2 + 8 pcs 1x1.
  * **Package B (All 1x1 Sheet) / Package C (All 2x2 Sheet):** Maximized yield per sheet.
  * **Package D (DFA Passport Pack):** 6 pcs Passport + 4 pcs 1x1.
  * **Package E (Universal Mega Combo):** 4 pcs 2x2 + 4 pcs Passport + 8 pcs 1x1 + 2 pcs Wallet.
  * **Custom Gang Sheet Builder:** Specify exact photo quantities per size with automated shelf bin-packing.
* **Precision Cutting Guides:** Corner crop tick marks, dashed cutter guidelines, or solid border lines.
* **300 DPI Export & Hardware Printing:** Direct true-to-scale physical CSS inch (`in`) hardware printing (`window.print()`), plus 300 DPI PNG and PDF exports.

### 4. Document & Receipt Photocopy Enhancer
* Cleans up messy photocopy scans, dark receipts, contracts, and scanned IDs.
* Features High-Contrast Document mode, Pure 1-bit Black & White photocopier thresholding, and Magic Color ink booster.

### 5. Collapsible Workspace & Focus Mode
* Compact icon-rail mode (`collapsible="icon"`) reduces sidebar to 48px to maximize canvas space for precision editing.
* Toggle sidebar with in-studio buttons, top bar trigger, interactive border rail, or <kbd>Ctrl+B</kbd> keyboard shortcut.

### 6. Dynamic Customer Ordering & Pricing Engine
* Public-facing dynamic route (`/[slug]`) customized for each shop.
* Instant pricing calculation based on paper dimensions, GSM density, single/double-sided printing, and color options.

### 7. Print-Ready QR Code Generator
* Native HTML5 Canvas API poster generator creating brand-aligned printable QR posters for physical store placement.

### 8. Progressive Web Application (PWA)
* Offline dashboard access guaranteed via service workers (`@ducanh2912/next-pwa`) with graceful network fallbacks (`/~offline`).

---

## Tech Stack

* **Framework:** Next.js (App Router, Server Actions)
* **Language:** TypeScript (Strict Typing)
* **Styling:** Tailwind CSS, Shadcn UI
* **Client-Side AI & Image Processing:** `@imgly/background-removal`, HTML5 Canvas API, `jspdf`
* **Database & Auth:** Supabase (PostgreSQL with Row-Level Security)
* **Integrations:** Google Drive API (`googleapis` Node.js SDK)
* **PWA Engine:** `@ducanh2912/next-pwa`
* **State & Form Management:** React Hook Form, Zod Schema Validation

---

## Getting Started

### Prerequisites
* Node.js 18.x or later
* npm or pnpm
* Supabase Account
* Google Cloud Console Project (with Google Drive API enabled)

### Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google OAuth Configuration (Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional: Cloudflare Turnstile Anti-Bot (100% Free with unlimited requests)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=your-cloudflare-turnstile-site-key
CLOUDFLARE_TURNSTILE_SECRET_KEY=your-cloudflare-turnstile-secret-key
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Crl0sDEV/Print-Studio.git
cd Print-Studio
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
Execute `database-seed.sql` and `storage-policy.sql` in your Supabase SQL Editor to initialize tables (`shops`, `orders`, `pricing_presets`) and RLS policies.

4. Launch local development server:
```bash
npm run dev
```

Open `http://localhost:3000` to view the application.

---

## License

MIT License. Designed and developed by Carlos Miguel Sandrino.
