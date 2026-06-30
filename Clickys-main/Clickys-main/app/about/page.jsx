export const revalidate = 86400;
// app/about/page.js
// This is a Server Component by default.

import Image from 'next/image';
import Link from 'next/link';
 // Adjust path
import CallToAction from '../../components/CallToAction'; // Adjust path
import styles from '../../styles/AboutPage.module.css'; // Create this CSS Module
import { FiUsers, FiTarget, FiHeart, FiAward, FiMessageCircle, FiEye } from 'react-icons/fi';

/* Metadata for the About Us page
export const metadata = {
  title: "About Us | Clickys.in - Your Shopping Partner",
  description: "Learn about Clickys.in, your trusted affiliate marketing platform for curated Amazon and Flipkart deals on tech, home, and grooming essentials in India.",
  keywords: [
    "about Clickys.in",
    "Amazon Flipkart affiliate India",
    "Clickys.in shopping platform",
    "online deals platform India",
    "curated shopping Clickys.in",
    "tech and home deals India",
    "Clickys.in mission and vision",
    "trusted affiliate marketing India"
  ],
  openGraph: {
    title: "About Clickys.in | Your Shopping Partner in India",
    description: "Clickys.in brings you curated Amazon and Flipkart deals on tech, grooming, and home essentials. Learn about our mission to simplify shopping!",
    url: "https://www.clickys.in/about",
    siteName: "Clickys.in",
    type: "website",
    locale: "en_IN"
  },
  twitter: {
    card: "summary_large_image",
    title: "About Clickys.in | Shopping Made Easy",
    description: "Discover Clickys.in, your go-to platform for curated Amazon and Flipkart deals on tech, home, and grooming products!"
  }
};*/

export const metadata = {
  title: 'About Clickys – Trusted Deals & Smart Shopping',
  description: 'Clickys helps shoppers in India, Africa and worldwide with trusted reviews, affiliate deals, and smart shopping guides from Amazon, Flipkart, Myntra & more.',
  keywords: 'About Clickys, trusted reviews, Amazon deals, Flipkart offers, Myntra discounts, Meesho shopping, Ajio deals, Blinkit affiliate, smart shopping',
};

export default function AboutPage() {
  return (
    <>
      <div className={styles.aboutPageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader} data-aos="fade-in" data-aos-duration="600">
          <div className="container">
            <FiUsers className={styles.headerIcon} />
            <h1 className={styles.pageTitle}>About Clickys</h1>
            <p className={styles.pageSubtitle}>
              Connecting you with quality products and unbeatable deals, built on transparency and trust.
            </p>
          </div>
        </header>

        {/* Main Content Section "https://placehold.co/700x500/2ECC71/FFFFFF?text=Our+Journey+Begins&font=Inter" */}
        <section className={`${styles.contentSection} container`}>
          {/* Our Story Section */}
          <div className={styles.storySection} data-aos="fade-up">
            <div className={styles.storyImageWrapper}>
              <Image
                src="https://picsum.photos/seed/clickys/700/500" // Placeholder image
                alt="The Clickys Team or Concept Art"
                width={700}
                height={500}
                className={styles.storyImage}
                style={{ objectFit: 'cover' }}
                referrerPolicy="no-referrer"
              />
            </div>
            <div className={styles.storyTextContent}>
              <h2 className={styles.sectionHeading}><FiTarget /> Our Story & Mission</h2>
              <p>
                Clickys was born from a simple idea: shopping on Amazon should be exciting and easy, not overwhelming. With millions of products and countless reviews, finding the perfect item can feel like searching for a needle in a haystack. That's where we come in.
              </p>
              <p>
                Our mission is to be your most trusted companion in the vast world of Amazon. We meticulously research, test (where possible), and review products across various categories to bring you honest, insightful, and reliable recommendations. We aim to save you time, reduce decision fatigue, and help you discover products that genuinely enhance your life.
              </p>
              <p>
                We're passionate about uncovering hidden gems, highlighting exceptional value, and ensuring you have all the information you need to make confident purchasing decisions.
              </p>
            </div>
          </div>

          {/* Our Values Section */}
          <div className={styles.valuesSection} data-aos="fade-up" data-aos-delay="100">
            <h2 className={styles.sectionHeading}><FiHeart /> Our Core Values</h2>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard} data-aos="zoom-in-up" data-aos-delay="150">
                <FiEye className={styles.valueIcon} />
                <h4 className={styles.valueTitle}>Transparency</h4>
                <p>We believe in complete honesty. Our affiliate relationships are clearly disclosed, and our reviews are not swayed by potential commissions.</p>
              </div>
              <div className={styles.valueCard} data-aos="zoom-in-up" data-aos-delay="250">
                <FiAward className={styles.valueIcon} />
                <h4 className={styles.valueTitle}>Integrity</h4>
                <p>Our recommendations are based on thorough research, expert analysis, and genuine user feedback. We prioritize accuracy and fairness above all.</p>
              </div>
              <div className={styles.valueCard} data-aos="zoom-in-up" data-aos-delay="350">
                <FiUsers className={styles.valueIcon} />
                <h4 className={styles.valueTitle}>User-Centricity</h4>
                <p>You, our reader, are at the heart of everything we do. We strive to provide content that is valuable, solves your problems, and improves your shopping experience.</p>
              </div>
              <div className={styles.valueCard} data-aos="zoom-in-up" data-aos-delay="450">
                <FiMessageCircle className={styles.valueIcon} />
                <h4 className={styles.valueTitle}>Engagement</h4>
                <p>We aim to build a community. We listen to your feedback, answer your questions, and continuously adapt to serve you better.</p>
              </div>
            </div>
          </div>

          {/* How We Work Section */}
          <div className={styles.howWeWorkSection} data-aos="fade-up" data-aos-delay="200">
            <h2 className={styles.sectionHeading}>How We Support Our Work</h2>
            <div className={styles.howWeWorkContent}>
                <p>
                    To keep Clickys running and continue providing you with high-quality, free content, we participate in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.in and affiliated sites.
                </p>
                <p>
                    When you click on one of our product links and make a purchase on Amazon, we may earn a small commission <strong>at no extra cost to you</strong>. This is how we fund our research, writing, and website maintenance.
                </p>
                <p>
                    It's important to us that you know our editorial content is not influenced by these affiliate partnerships. We are committed to providing unbiased information to help you make the best choices. Your trust is paramount, and we work hard to maintain it every day.
                </p>
            </div>
          </div>

          {/* Meet the Team */}
          <div className={styles.teamSection} data-aos="fade-up" data-aos-delay="100">
            <h2 className={styles.sectionHeading}>Meet Our (Future) Team</h2>
            <p className={styles.teamIntro}>
              While Clickys is currently a growing passion project, we envision a team of dedicated product enthusiasts, writers, and researchers who share our commitment to quality and transparency. Stay tuned as we grow!
            </p>
          </div>
            {/* Placeholder for team member cards if you expand this later */}
            {/*
            <div className={styles.teamGrid}>
              <div className={styles.teamMemberCard}>Team Member 1</div>
              <div className={styles.teamMemberCard}>Team Member 2</div>
            </div>
            
          </div>*/}

          {/* Call to Action Section */}
          <div className={styles.ctaSection} data-aos="fade-up" data-aos-delay="200">
            <h3 className={styles.ctaTitle}>Have Questions or Suggestions?</h3>
            <p>
              We'd love to hear from you! Whether it's a product you'd like us to review or feedback on our site, get in touch.
            </p>
            <CallToAction text="Contact Us Now" link="/contact" type="primary" icon={<FiMessageCircle />} iconPosition="left"/>
          </div>
        </section>
      </div>
    </>
  );
};
