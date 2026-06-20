# 🖥️ Clickys Website - Content Manager's Guide

Welcome to the **Clickys Website** control center! This guide is written exactly for you—the content editor, marketer, or site owner—so you can easily manage, edit, and update the entire website without touching a single line of code.

---

## 🏗️ 1. How the Website Works (The Basics)

Your website is split into two simple management systems:
1. **Prismic (CMS)**: This is where you edit the website pages (like the Homepage or About page) and drag-and-drop sections (called "Slices").
2. **Google Sheets**: This is where you manage large lists of data, like your "Products" or "Shopping Guides." Update a row in the spreadsheet, and the website updates automatically!

---

## 🎨 2. How to Edit Pages & Sections (Using Prismic)

Every page on your website is built using **"Slices"**. Think of Slices as Lego blocks. You can stack them, rearrange them, or remove them to build your page.

### **Step-by-Step: Changing the Homepage (Or any page)**
1. **Log in to Prismic**: Go to [prismic.io](https://prismic.io) and log in to your project.
2. **Go to 'Documents'**: On the left-hand menu, click **Documents**.
3. **Select your Page**: Click on the "Homepage" (or any other page you want to update).
4. **Edit the Slices (Sections)**:
   Scroll down the page. You'll see different blocks covering different parts of the website. Here are the blocks you can add or edit:
   
   - 🖼️ **Hero Banner**: The big main banner at the top of the page. You can change the main title, background image, and button text here.
   - 📌 **Pinterest Grid**: The masonry-style gallery showing off stylish trends and products.
   - 🛍️ **Products Section**: Highlights specific hand-picked products from your inventory.
   - 📢 **CTA Banner (Call To Action)**: The promotional banner requesting users to "Subscribe" or "Shop Now".
   - 📖 **Guide**: Highlights deep-dive shopping guides.

5. **Make your Changes**: Click into any of these blocks, type your new text, or upload a new image.
6. **Save & Publish**: Click the green **"Save"** button at the top right, then hit **"Publish"** so the changes go live on the website!

---

## 📊 3. How to Manage Products & Guides (Using Google Sheets)

To make it incredibly easy to manage hundreds of products and guides, your website reads directly from your private Google Sheets.

### **Updating Shopping Guides:**
1. Open your linked **Google Sheet** (the one set up for Guides).
2. Add a new row to add a new Guide. Fill in the columns:
   - **Column A (Title)**: The title of the guide (e.g., "Best Running Shoes 2024").
   - **Column B (Price)**: Target price.
   - **Column C (Link)**: Your affiliate link or shopping URL.
   - **Column D (Image)**: Paste an image URL here.
   - **Column E (Category)**: e.g., "Fitness", "Tech".
3. **That's it!** As soon as you type it in the sheet, the website's database fetches the new rows when the page refreshes or the website builds.

### **Updating Products:**
Follow the exact same steps in your **Products Google Sheet**. Add the name, price, link, and platform (like "Amazon" or "Myntra"), and it will automatically sync to your store pages.

---

## 🛠️ 4. How to Update General Website Info 

Some items exist permanently on the website. Here is how they are managed:

*   **Navigation & Footer Links**: If you need to change top menu links, look in Prismic for a document named "Navigation" or "Settings" (if configured), or ask your developer to adjust the core `app/layout.jsx` file.
*   **Company Name & Logo**: These are set during the initial build but can be adjusted globally through Prismic Settings if set up, or the `/public` folder containing `logo.png`.

---

## 🚀 5. For Developers (Code & Deployment)

*(If you ever hire a developer to make structural changes to the code, point them here)*

**Environment Setup:**
Ensure the following variables are set in your `.env` or deployment host:
- `SITE_URL` (e.g. `https://www.clickys.in`)
- `GOOGLE_CLIENT_EMAIL` & `GOOGLE_PRIVATE_KEY` (For Google Sheets sync)
- `PRODUCT_SHEET_ID` & `GUIDE_SHEET_ID`
- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` (Prismic repository connection)

**Commands to run locally:**
```bash
npm install       # Install dependencies
npm run dev       # Start the local development server
npm run slicemachine # Launch the visual Slice builder for Prismic
npm run build     # Generate sitemaps and optimize the site for production
```

---
**Need help?** All content changes can be done safely within Prismic or Google Sheets. You cannot "break" the website by changing text or images in Prismic. Happy editing! 🚀
