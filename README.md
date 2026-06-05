# 📦 Clickys Website Comprehensive Technical Manual

Welcome to the development and maintenance handbook for the **Clickys Website**! This interactive documentation details the full system architecture, content synchronization pipelines, dynamic build processes, automated indexing setup, and deployment guides.

---

## 🚀 Key Automated Features Added in This Iteration

1. **Automated Sitemap Generation on Deployment**  
   Every time the site compiles or builds (`npm run build`), the custom build runner automatically runs `next-sitemap` through a `postbuild` script hook. This dynamically fetches all pages (both static and client routes) and writes a production-ready, search-engine-optimized sitemap to `/public/sitemap.xml`.
2. **Dynamic Google Sheets Integration for Sitemap Indexing**  
   The build pipeline securely hooks into Google Sheets using `google-auth-library` inside the sitemap engine to map, slugify, and sync your dynamic Guides (`/guides/[slug]`) and Products at compilation time, ensuring that search crawlers automatically discover newly-added entries from your spreadsheets.
3. **Smart Site URL Normalization**  
   The system automatically sanitizes `SITE_URL` inputs, ensuring that the sitemap location outputs always resolve to safe, fully-qualified protocols (e.g., `https://www.clickys.in`), preventing search console validation errors.

---

## 🏗️ 1. Project System Architecture

The Clickys web application combines high-performance static rendering, real-time client-side interactions, and headless content databases:

```
                  ┌───────────────────────┐
                  │   Client Browser/Bot  │
                  └───────────┬───────────┘
                              │
               Requests sitemap.xml / Page
                              │
               ┌──────────────▼──────────────┐
               │    Next.js 15+ App Server   │
               └──────────────┬──────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │ (Static Pages)     │ (Headless APIs)    │ (Data Sheets)
 ┌───────▼────────┐   ┌───────▼────────┐   ┌───────▼────────┐
 │  Local App     │   │  Prismic CMS   │   │  Google Sheets │
 │  Routes/Styles │   │  Headless API  │   │  Spreadsheets  │
 └────────────────┘   └────────────────┘   └────────────────┘
```

- **Framework**: Next.js 15+ (App Router, styled in Tailwind CSS).
- **Theme**: Neutral Slate & Emerald Green accents, utilizing smooth animations via `framer-motion`.
- **Database & Persistence**: Firebase Firestore (for storing newsletters and tracking subscriber states).
- **Dynamic Content Head**: 
  - **Prismic CMS**: Controls products, whats-new items, deals, slide promotions, and partner grids.
  - **Google Sheets Spreadsheet (Read-Only)**: Manages active deals checklist, curated recommendation guides, and dynamic routing directories.
- **Email Service**: Resend API integration (triggered for welcome letters and newsletter distributions).

---

## 📁 2. Workspace File Directory Structure

```bash
/
├── app/                  # Next.js App Router (Layouts, pages, API routes, sitemaps)
├── components/           # UI Elements & Interactive custom widgets
│   └── ui/               # Tailored React-icons & framer-motion visuals
├── lib/                  # Backend SDK utilities, sheets controllers, and db configs
│   ├── firebase.js       # Firebase Client SDK initializer
│   ├── firebase-admin.js # Firebase Cloud Admin setup
│   ├── guides.ts         # Google Sheets Guides router
│   └── products.ts       # Google Sheets Products router
├── public/               # Static assets & generated indices (robots.txt, sitemap.xml)
├── slices/               # Prismic CMS Custom Type Slice templates
├── styles/               # Styling configuration rules
├── metadata.json         # Platform capability metadata
├── next-sitemap.config.js# Sitemap generation build profile
├── slicemachine.config.json # Prismic custom schema config
└── package.json          # Main dependency manifest & deployment build hooks
```

---

## 🛠️ 3. Environment Variables Specification

Define these environment configuration variables in your hosting provider (e.g., Vercel, Cloud Run, Replit) or local `.env`:

| Key | Type | Description | Required | Source |
| :--- | :--- | :--- | :--- | :--- |
| `SITE_URL` | String | Base address of the live site (e.g. `https://www.clickys.in`) | **Yes** | Domain Host |
| `GOOGLE_CLIENT_EMAIL` | String | Google Cloud Service Account Email | **Yes** | Google Cloud Console |
| `GOOGLE_PRIVATE_KEY` | String | google service account private certificate (JSON formatting, escapes `\n`) | **Yes** | Google Cloud Console |
| `PRODUCT_SHEET_ID` | String | spreadsheet ID detailing inventory sheets | **Yes** | Google Sheets URL |
| `GUIDE_SHEET_ID` | String | spreadsheet ID detailing guides catalog | **Yes** | Google Sheets URL |
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | String | Repository name registered in Prismic dashboard | **Yes** | Prismic Console |
| `RESEND_API_KEY` | String | Mailer gateway secret token | Optional | Resend Dashboard |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | String | Public credential for newsletter collections | Optional | Firebase Console |

---

## 🔍 4. Automated Sitemap Build Mechanics

Sitemap configuration is managed globally inside `/next-sitemap.config.js`.

### How it is Triggered
1. When you deploy or run a production build, your loader handles compilation:
   ```bash
   npm run build
   ```
2. Once the Next.js static page analyzer finishes, the custom `postbuild` hook executes `next-sitemap`.
3. `next-sitemap` reads the compiled pages and triggers `additionalPaths()` inside `next-sitemap.config.js` to query external APIs.
4. It compiles everything into a physical index file (`/public/sitemap.xml`) and separate node indices (`/public/sitemap-0.xml`), which are immediately accessible to search crawlers without slowing down your runtime performance!

### Sitemap Configuration Profile (`next-sitemap.config.js`)
```javascript
export default {
  siteUrl: process.env.SITE_URL || 'https://clickys.in',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  // ... imports & queries Google Sheets + Prismic Docs to return paths array ...
};
```

---

## 📊 5. Content Curation & Updating Pipelines

Here is the blueprint to update different sections of the website.

### A. Updating Dynamic Guides (Google Sheets)
Dynamic guides in `/app/guides/[slug]` utilize Google Sheets as an active headless source. To add or adjust a guide:
1. Open the spreadsheet linked to your `GUIDE_SHEET_ID`.
2. Format your columns as follows:
   - **Column A**: `Title` (Used to form the header title & auto-slug URL)
   - **Column B**: `Price` (Target sale or referential price)
   - **Column C**: `Link` (Redirect affiliate or product checkout URL)
   - **Column D**: `Image` (Image URL)
   - **Column E**: `Category` (Group tag - e.g. "Technology", "Fashion")
   - **Column F**: `Discount` (Markdown discount or promotion label)
   - **Column G**: `Platform` (Fulfillment platform - e.g. "Amazon", "Myntra")
   - **Column H**: `Description` (Intro text block)
   - **Column I**: `Features` | **Column J**: `Pros` | **Column K**: `Cons` | **Column L**: `Alternatives`
3. Dynamic routing updates the endpoint on the fly. The sitemap imports them at deployment compilation.

### B. Updating Prismic Custom Types
The dynamic storefront components fetch data on-demand from Prismic CMS. To edit content schemas, launch:
```bash
npm run slicemachine
```
Log into the Prismic UI and publish documents matching these specific Custom Types:
- `product`: Accessible under `/products/[uid]`
- `whatsnew`: Accessible under `/whats-new/[uid]`
- `deal`: Accessible under `/deals/[uid]`
- `partner`: Highlighted inside your home-page partnership brand networks.

### C. Modifying Fallback Static Data
If you need to adjust fallback values, look inside these dedicated files:
- **Core Category Circles**: Located in `/app/page.jsx` (the `categories` array constant).
- **Local Fallback Products**: Located in `/components/products.js` (the `products` array export).
- **Local Fallback Guides**: Located in `/components/guides.js` (the `allGuides` array export).
- **Company Story & Milestones**: Located in `/app/about/page.jsx`.
- **Contact Channels**: Located in `/app/contact/page.jsx`.

---

## 🤖 6. Incremental Static Regeneration (ISR) Webhooks

To synchronize fresh Prismic updates immediately to your users without triggering full project builds:
1. Log into your Prismic Dashboard.
2. Navigate to **Settings > Webhooks**.
3. Create a new webhook pointing to:
   ```
   https://www.clickys.in/api/revalidate
   ```
4. Set the trigger event to **Document published** or **Document unpublished**. This route securely signals your deployment container to purge cached indices for that specific URI instantly!

---

## 📧 7. Newsletter, Emails & Subscriptions

1. **User Subscriptions**: Subscribing via the Footer saves emails to the `newsletter_subscribers` collection in Firebase Firestore.
2. **Automated Campaign Dispatches**: When dynamic material lands on Prismic, the Resend API can dispatch notices using `/api/send-newsletter`. Let it default to the main categories (/products, /deals, /whats-new) if deep links are still propagating.

---

## 🚀 8. Actionable Maintenance Commands

Run these terminal instructions inside your workspace during local staging:

```bash
# 1. Install local dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Format and lint source files
npm run lint

# 4. Generate local static production sitemaps & build bundles
npm run build

# 5. Bootstrap local production server
npm run start
```

---
Happy Coding & Curating! 🚀
