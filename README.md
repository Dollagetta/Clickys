# 📦 Clickys - Complete Architecture & Documentation

Welcome to the documentation for **Clickys**! This guide covers the complete architecture, routing workflow, content management, and instructions to securely deploy your application to Vercel via GitHub while keeping your API keys protected.

---

## 🗺️ 1. Site Workflow & Page Architecture

Clickys is built using Next.js 15 (App Router). Below is the workflow for every major section of your application:

### The Core Shopping Experience
*   **`/` (Home Page):** The entry point. It aggregates hero banners, featured categories, trending Amazon deals, and Prismic shopping guides into a single dashboard.
*   **`/products` & `/deals`:** Handles the localized or fetched display of deals. Users can browse, sort, and filter items on these pages.
*   **`/categories`:** Allows users to find products grouped by types (Electronics, Fashion, Home, etc.).
*   **`/wishlist`:** A localized tool allowing users to bookmark their favorite items for later without needing to log in immediately. It uses browser-side storage (or Firebase when logged in) to remember saved items.
*   **`/ai-shopper`:** An intelligent shopping assistant powered by the Gemini AI. Users describe what they are looking for, and the backend `/api` uses your Gemini API keys securely to suggest tailored products.

### Marketing & Information
*   **`/about`:** Highlights the story and mission behind Clickys. Perfect for establishing brand trust.
*   **`/whats-new`:** Shows the latest platform features, newest curated listicles, or recently added Prismic guides.
*   **`/contact`:** Includes support emails, FAQ, and contact forms for users to reach out.

### Business & Partnerships
*   **`/partners` & `/affiliate`:** Dedicated pages explaining how merchants, influencers, or Amazon sellers can partner with Clickys and grow their audience.

### Secure Backend Layers
*   **`/api/*`:** Next.js Route Handlers (Server-Side). **This is where your API keys stay safe.** For example, when the `ai-shopper` is running, the frontend sends a prompt to `/api/gemini`, and the server uses your hidden `GEMINI_API_KEY` to talk to Google, then sends the response back to the frontend. This means users or hackers can *never* see your secrets!

---

## 🏗️ 2. Content Management Workflows

### Static & Hardcoded Content
Some sections, like the `categories` list on the Home Page or core values on the `/about` page, are maintained locally for maximum speed. 
*   **How to update content:** You can update images, fallback text, and simple arrays directly in the React Components (e.g., `/app/about/page.jsx`, `/app/page.jsx`).

### Prismic CMS (Dynamic Content)
The site integrates deeply with **Prismic CMS** to allow easy, non-coder editing.
Log into your Prismic Dashboard to edit Custom Types dynamically:
1.  **Product**
2.  **Guide** (Shopping Guides & Articles)
3.  **Partner**
4.  **Marketing Banner**

*These components are automatically pulled during build-time and cached seamlessly.*

---

## 🔒 3. Secret Management & Secure Backend

To keep your Amazon API Keys, Resend Email Keys, and Gemini AI secrets **safe**:
1.  **Never Use `NEXT_PUBLIC_` For Secrets:** If an environment variable starts with `NEXT_PUBLIC_`, it becomes visible in the browser's source code. 
2.  **Keep them in `.env.local` locally:** E.g., `AMAZON_CREDENTIAL_SECRET="xyz123"`. (Do NOT commit `.env.local` to GitHub!).
3.  **Access them ONLY via Server Components or `/api` routes:** Your frontend code should always request data from your own `/api/` endpoints, allowing the backend server to safely bundle the secrets and make the external request.

---

## 🚀 4. Deployment Workflow: GitHub to Vercel

To take your application live while maintaining a strict, secure boundary for your environment variables, use the modern GitHub + Vercel deployment pipeline:

### Step 1: Push to GitHub
1. Create a free account on [GitHub](https://github.com).
2. Inside your AI Studio editor, click the three-dot menu and select **Export > Download as ZIP**, or sync via git commands. Unzip the code and push the folder to a newly created **Private GitHub Repository**. (Setting it to *Private* is an extra layer of safety to protect your source code!).

### Step 2: Connect to Vercel
1. Create an account on [Vercel](https://vercel.com) (Log in with your GitHub account).
2. Click **"Add New Project"** and select your new Clickys GitHub repository.
3. Vercel will automatically detect `Next.js` as the framework.

### Step 3: Securely Inject Environment Variables
*This is the most critical step for security!*
Before clicking deploy, expand the **Environment Variables** section. Here, you will securely paste your keys. Vercel encrypts these on their servers, and they are injected straight into your backend `Node.js` environment—they will never touch the user's browser.
Add these variables:
*   `GEMINI_API_KEY`
*   `AMAZON_CREDENTIAL_ID` & `AMAZON_CREDENTIAL_SECRET` & `AMAZON_ASSOCIATE_TAG`
*   `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` (This one *is* public and safe to share)
*   `RESEND_API_KEY` (if you are sending newsletter emails)
*   `SITE_URL` (Set this to `https://clickys.in`)

### Step 4: Deploy & Add Custom Domain
1. Click **Deploy**. Vercel will build your `next build` command and safely host your site globally on a lightning-fast CDN.
2. Under project settings, go to **Domains**, and add `clickys.in` and `www.clickys.in`.
3. Vercel will give you a DNS Record (usually an `A` record). Copy it, go to your domain provider (GoDaddy/Namecheap), and paste it in your DNS settings. Your site will be fully live within minutes!

---

## 🗺️ 5. Automated Sitemap & SEO

The SEO infrastructure for Clickys is fully automated! 
*   **Sitemap Generation:** We use `next-sitemap` tied neatly to the `postbuild` script in `package.json`. Every time Vercel deploys a new version of your site, it securely crawls all your `/app` routes (including your newest Prismic Guides) and dynamically updates `sitemap.xml` and `robots.txt`!
*   **XML Endpoints:** Google and other search engines will find your sitemap automatically at `https://clickys.in/sitemap.xml`.
*   *(Note: Your sitemap has already been successfully generated internally and currently resides in the `/public` folder of this workspace!)*

---
Happy Coding & Curating! 🚀
