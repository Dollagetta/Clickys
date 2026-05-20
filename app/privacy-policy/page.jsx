export const dynamic = 'force-dynamic';
// app/privacy-policy/page.js

import Link from 'next/link';
import styles from '../../styles/PrivacyPolicyPage.module.css';

export const metadata = {
  title: 'Privacy Policy | Clickys',
  description: 'Privacy Policy for Clickys. Learn how we collect, use, and protect your data.',
  keywords: 'privacy policy, Clickys, data protection, terms, user data',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.privacyPageContainer}>
      {/* Page Header */}
      <header className={styles.pageHeader} data-aos="fade-in" data-aos-duration="600">
        <div className="container">
          <h1 className={styles.pageTitle}>Privacy Policy</h1>
          <p className={styles.pageSubtitle}>
            Effective Date: May 20, 2026
          </p>
        </div>
      </header>

      {/* Main Content Section */}
      <section className={`${styles.contentSection} container`} data-aos="fade-up">
        <p>
          At Clickys ("we," "us," or "our"), your privacy is of utmost importance to us. This Privacy Policy outlines the types of personal information we collect, how we use it, and the steps we take to ensure your data is protected when you visit our website (www.clickys.in).
        </p>
        <p>
          By accessing or using our website, you agree to the terms of this Privacy Policy. If you do not agree with our practices, please do not use our site.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We may collect the following types of information when you interact with our website:</p>
        <ul>
          <li><strong>Personal Information:</strong> If you contact us, subscribe to our newsletter, or fill out a form, we may collect information such as your name, email address, and any messages you send us.</li>
          <li><strong>Non-Personal Information:</strong> When you browse our website, we may collect non-identifying information such as your IP address, browser type, operating system, the referring website, pages viewed, and the date and time of off your visit. We also use Vercel Analytics for tracking page views and visitors.</li>
          <li><strong>Cookies and Tracking Technologies:</strong> We use cookies to enhance your experience, analyze site usage, and support our affiliate marketing activities.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul>
          <li>To operate, maintain, and improve our website and services.</li>
          <li>To send you newsletters, updates, or respond to your inquiries.</li>
          <li>To track and analyze usage patterns and trends using tools like Vercel Analytics.</li>
          <li>To manage our affiliate links and appropriately credit purchases made through Amazon.in, Flipkart, and other partners.</li>
          <li>To prevent fraudulent activity and protect the security of our website.</li>
        </ul>

        <h2>3. Affiliate Disclosure</h2>
        <p>
          Clickys participates in various affiliate marketing programs, such as the Amazon Services LLC Associates Program. When you click on an affiliate link on our site and make a purchase, we may earn a small commission at no extra cost to you. This tracking is done via cookies managed by the respective affiliate networks.
        </p>

        <h2>4. Data Sharing and Disclosure</h2>
        <p>We do not sell, trade, or rent your personal information to third parties. We may share your data in the following situations:</p>
        <ul>
          <li><strong>Service Providers:</strong> We may share data with third-party vendors who perform services on our behalf (e.g., email delivery, analytics).</li>
          <li><strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to a valid legal request.</li>
        </ul>

        <h2>5. Your Choices and Rights</h2>
        <p>You have certain rights regarding your personal information:</p>
        <ul>
          <li><strong>Opt-Out:</strong> You can unsubscribe from our newsletters at any time by clicking the "unsubscribe" link in the email.</li>
          <li><strong>Cookies:</strong> You can choose to disable cookies through your browser settings. However, please note that some features of our website may not function properly without them.</li>
        </ul>

        <h2>6. Third-Party Links</h2>
        <p>
          Our website contains links to third-party sites, including our affiliate partners. We are not responsible for the privacy practices or content of these external websites. We encourage you to review their respective privacy policies before providing them with any personal information.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We take reasonable measures to protect your personal information from unauthorized access, alteration, or destruction. However, please be aware that no transmission over the internet or electronic storage method is 100% secure.
        </p>

        <h2>8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Effective Date." We encourage you to review this policy periodically.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at: <Link href="/contact">Our Contact Page</Link>.
        </p>
      </section>
    </div>
  );
}
