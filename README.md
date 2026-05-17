# 📦 Clickys Website Documentation.

Welcome to the documentation for **Clickys Website**! This comprehensive guide walks you through maintaining the app, updating static/dynamic content, managing APIs, handling newsletter subscriptions, and deploying a live instance to Vercel with your custom domain.

---

## 🏗️ 1. Managing Static & Hardcoded Content.

Some parts of the application are hardcoded into the React components to act as fallback or fast-rendering sections. Here is how you can update them.

### Updating the About Us Page (`/app/about/page.jsx`)
To change the mission text, core values, or images on the About Us page, edit `/app/about/page.jsx`:

```javascript
// File: /app/about/page.jsx

// 1. Changing the Hero Image
<Image
  src="https://picsum.photos/seed/clickys/700/500" // -> CHANGE THIS URL to your new image URL
  alt="The Clickys Team or Concept Art"
  width={700}
  height={500}
/>

// 2. Changing the Content text
<div className={styles.storyTextContent}>
  <h2 className={styles.sectionHeading}><FiTarget /> Our Story & Mission</h2>
  <p>
    Clickys was born from a simple idea... // -> CHANGE THIS PARAGRAPH
  </p>
</div>
```

---

## 🏠 2. Updating the Home Page (`/app/page.jsx`)

The Home Page mixes content from the Prismic CMS, Amazon Product API, and local hardcoded fallback data.

### To Change Hardcoded Categories
At the top of `/app/page.jsx`, there is an array named `categories`. Update the array to change the circular category icons shown on the homepage.

```javascript
// File: /app/page.jsx

const categories = [
  { id: 'cat1', name: 'Electronics', slug: 'electronics', imageUrl: '...', productCount: 1200 },
  { id: 'cat2', name: 'Fashion', slug: 'fashion', imageUrl: '...', productCount: 850 },
  // Add or edit categories here. Ensure the imageUrl is a valid image link!
];
```

---

## 🛒 3. Updating Products & Deals

Products come from two main sources: **Prismic CMS** and the local **Products Database**, with Amazon Products coming from the Amazon API.

### All Products / Deals Section
If you want to manually insert deals or update the fallback product list, edit the local products file:

```javascript
// File: /components/products.js

export const products = [
  {
    id: 'p1',
    name: 'Awesome Laptop XYZ', // -> CHANGE NAME
    slug: 'awesome-laptop-xyz', 
    price: 999.00,             // -> CHANGE PRICE
    originalPrice: 1299.00,
    rating: 4.8,
    imageUrl: 'https://example.com/laptop.jpg', // -> CHANGE IMAGE
    onPromotion: true,
    // ...other properties
  },
];
```

### Amazon Products Section & API Integration
The home page automatically searches Amazon for specific Deals. This lives in `/app/page.jsx`.

```javascript
// File: /app/page.jsx

const [
  // ...other fetches
  apiAmazonProducts, 
] = await Promise.allSettled([
  // ...other fetches
  searchAmazonProducts('Trending Deals', 4), // -> CHANGE 'Trending Deals' to 'Laptops' or any keyword. Change '4' to how many products to fetch.
]);
```

**Amazon Product API Credentials:**
To ensure `searchAmazonProducts` functions properly in production, you must have Amazon Product Advertising API (PA-API) credentials and define them in your environment variables. 
The variables typically required are:
- `AMAZON_CREDENTIAL_ID` (Your AWS Access Key)
- `AMAZON_CREDENTIAL_SECRET` (Your AWS Secret Key)
- `AMAZON_ASSOCIATE_TAG` (Your Amazon Affiliate ID - like `clickys-20`)

---

## 📚 4. Updating Shopping Guides

Guides are pulled from **Prismic CMS** but use a fallback logic in `/components/guides.js`. 

### Managing Hardcoded Guides (`/components/guides.js`)
If the Prismic fetch fails or if you want to add static guides, add them here. The reading time tag on the UI is automatically calculated from the content's word count!

```javascript
// File: /components/guides.js

export const allGuides = [
  {
    id: 'g1',
    title: 'The Ultimate Guide to Buying a Laptop in 2026', // -> CHANGE TITLE
    slug: 'ultimate-laptop-buying-guide',
    excerpt: 'Discover everything you need to know...', // -> CHANGE EXCERPT
    content: 'Long form content goes here...',          // -> ADD FULL CONTENT
    imageUrl: 'https://example.com/image.jpg',          // -> CHANGE IMAGE
    category: 'Technology',
    readingTime: 5 // Optional fallback
  }
];
```

---

## ⚙️ 5. Prismic CMS Logic & Dynamic Content

This project uses **Prismic CMS** to allow easy, non-coder editing.
Log into your Prismic Dashboard (at `theophelousmudhleyo@gmail.com`) to edit Custom Types:
1.  **Product**
2.  **Guide**
3.  **Partner**
4.  **Marketing Banner**

The logic to fetch them is mostly inside `client.getAllByType("...")`.
Example from Home Page (`/app/page.jsx`):

```javascript
// Fetch guides from Prismic:
client.getAllByType("guide", {
  orderings: { field: 'my.guide.date', direction: 'desc' },
  limit: 3, // -> Increase this to show more guides on the homepage!
})
```

If you ever change the fields in Prismic (like adding a `subtitle` field to the Guide), you must also update the React component mapping to display it:

```javascript
// Example in /app/page.jsx mapping logic:
guides = guidesResponseResult.value.map(doc => {
  return {
    id: doc.id,
    title: doc.data.title,
    subtitle: doc.data.subtitle, // -> Add the new field mapping here!
    // ...
  };
});
```

---

## 📫 6. Contact & FAQ Page

To update the main contact details or FAQs, look in the Contact directory.

### Edit Contact Details (`/app/contact/page.jsx`)
```javascript
// File: /app/contact/page.jsx
const contactDetails = [
  {
    icon: <FiMail />,
    title: 'Email Us',
    value: 'support@clickys.in', // -> CHANGE EMAIL
    link: 'mailto:support@clickys.in'
  },
  // Add phone numbers, address, etc.
]
```

### Edit FAQs (`/app/contact/page.jsx` or similar nested FAQ component)
```javascript
const faqs = [
  {
    question: "How do you select your deals?",
    answer: "We use a mix of API automation and hand-picked curation..." // -> Update text
  }
]
```

---

## 📧 7. Newsletter, Emails & Subscriptions

This app handles newsletter emails through external integrations. Depending on the setup you want (Firebase, Prismic, Resend), here's how to manage it:

1. **Firebase Firestore (Data Storage):**
   When a user submits the newsletter form (often in `<Footer>` or a `<NewsletterSubscription>` component), their email is saved to a Firebase collection (e.g., `newsletter_subscribers`).
   To manage this, log into your Firebase Console. Under Firestore Database, look for the target collection, where you can view or download all subscribed emails.
   
2. **Resend.com (Transactional/Marketing Emails):**
   To send welcome emails or weekly deal blasts, you use Resend. Have a serverless function (Next.js API route like `/api/subscribe/route.js`) receive the form submission.
   ```javascript
   // File: /app/api/subscribe/route.js
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);

   export async function POST(req) {
     const { email } = await req.json();
     // Send email via Resend
     await resend.emails.send({
       from: 'newsletter@clickys.in',
       to: email,
       subject: 'Welcome to Clickys Deals!',
       html: '<p>Thanks for subscribing.</p>'
     });
     return Response.json({ success: true });
   }
   ```
   **To enable this**, you need to sign up for Resend.com, verify `clickys.in`, and add `RESEND_API_KEY` to your Vercel Environment Variables.

3. **Prismic (For Content/Body of the Emails):**
   If you want to write standard newsletter content without editing code, you can create a "Newsletter Template" Custom Type in Prismic.
   Fetch it in your API handler before passing the HTML to Resend!

---

## 🚀 8. Deploying on Vercel with clickys.in

Follow these steps to take your project live to the world on **Vercel** with your domain (`clickys.in`):

### Step 1: Upload to GitHub
1. Create a GitHub repository (e.g., `MyClickys`).
2. Push your localized codebase up to GitHub.

### Step 2: Import into Vercel
1. Go to [Vercel.com](https://vercel.com) and log in.
2. Click **"Add New Project"** and authorize GitHub if needed.
3. Select your `MyClickys` repository from the list.
4. Leave the Framework Preset as **Next.js**.

### Step 3: Add Environment Variables
Before you click Deploy, expand the **Environment Variables** section. Add all required secrets for your app to function properly:
- `AMAZON_CREDENTIAL_ID` & `AMAZON_CREDENTIAL_SECRET` & `AMAZON_ASSOCIATE_TAG` (for the Amazon API)
- `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` (Your Prismic Repo Name)
- `RESEND_API_KEY` (if using Resend)
- Any Firebase credentials configured for your Newsletter logic.

### Step 4: Deploy!
Click **Deploy**. Vercel will build the `next build` command and launch your app onto a `.vercel.app` temporary URL.

### Step 5: Add your Custom Domain (clickys.in)
1. In your Vercel project dashboard, go to **Settings > Domains**.
2. Type in `clickys.in` and `www.clickys.in` and click **Add**.
3. Vercel will provide you with DNS Records (typically an A Record like `76.76.21.21` or a CNAME).
4. Go to the domain registrar where you purchased `clickys.in` (e.g., GoDaddy, Namecheap).
5. Open your DNS Settings there, and copy+paste the records Vercel provided.
6. Once the DNS propagates, Vercel will secure `clickys.in` with an SSL certificate, and your site will be live!

---
Happy Coding & Curating! 🚀
