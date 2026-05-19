// app/contact/page.js
import styles from '../../styles/ContactPage.module.css';
import { FiMessageSquare, FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import faqData from '../../components/faq';
import FAQSection from './faqSection';
import ContactForm from '../../components/ContactForm'; // Imported ContactForm

export const metadata = {
  title: 'Contact Clickys – Support & Partnerships',
  description: 'Get in touch with Clickys for support, product queries, partnerships, and advertising. We’re here to help you shop smarter.',
  keywords: 'Contact Clickys, support Clickys, partnership Clickys, product queries, Amazon support, Flipkart help, Myntra support, Meesho contact, Ajio help',
};

export default function ContactPage() {
  return (
    <>
      <div className={styles.contactPageContainer}>
        {/* Page Header */}
        <header className={styles.pageHeader} data-aos="fade-in" data-aos-duration="600">
          <div className="container">
            <FiMessageSquare className={styles.headerIcon} />
            <h1 className={styles.pageTitle}>Get In Touch</h1>
            <p className={styles.pageSubtitle}>
              We're here to help and answer any question you might have.
            </p>
          </div>
        </header>

        {/* Main Content Section: Contact Form and FAQ Info */}
        <section className={`${styles.mainContentSection} container`}>
          <div className={styles.contactLayout}>
            <div className={styles.formWrapper}>
              <ContactForm />
              <div className="mt-12">
                <FAQSection data={faqData} />
              </div>
            </div>

            {/* Contact Information Area */}
            <aside className={styles.contactInfoWrapper} data-aos="fade-left" data-aos-delay="100">
              <h2 className={styles.sectionHeadingAlt}>Contact Information</h2>
              <p className={styles.contactInfoIntro}>
                Alternatively, you can reach us through the following channels:
              </p>
              <ul className={styles.contactDetailsList}>
                <li>
                  <FiMail className={styles.contactIcon} />
                  <div>
                    <strong>Email Us:</strong>
                    <a href="mailto:teamclickys@gmail.com">teamclickys@gmail.com</a>
                  </div>
                </li>
                <li>
                  <FiPhone className={styles.contactIcon} />
                  <div>
                    <strong>Call Us:</strong>
                    <span>(Mon-Sun, 9am-5pm IST)</span>
                    <a href="tel:+917396507539">+91 7396507539</a>
                  </div>
                </li>
                <li>
                  <FiMapPin className={styles.contactIcon} />
                  <div>
                    <strong>Our Office:</strong>
                    <span>Peddapuram, Andhra Pradesh, India</span>
                  </div>
                </li>
              </ul>
              <h3 className={styles.socialMediaTitle}>Connect on Social Media</h3>
              <div className={styles.socialMediaLinks}>
                <a href="https://www.facebook.com/clickyse/" aria-label="Facebook" className={styles.socialLink}><FiFacebook /></a>
                <a href="https://x.com/clickys25" aria-label="Twitter" className={styles.socialLink}><FiTwitter /></a>
                <a href="https://www.instagram.com/_clickyse?igsh=bjV3YnZ6OG80MHNq" aria-label="Instagram" className={styles.socialLink}><FiInstagram /></a>
              </div>
            </aside>
          </div>
        </section>

        {/* Optional: Map Section */}
        <section className={styles.mapSection} data-aos="fade-up">
          <div className="container">
            <h2 className={styles.sectionHeading}>Find Us On The Map</h2>
            <div className={styles.mapEmbed}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3813.8627317065757!2d82.1342794738212!3d17.07936581160822!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a37817acfbe52e5%3A0xf2db667eb06d3475!2sK.K.Golden%20Jubilee%20Resorts%20(A%2Fc)%20(convention%20hall)(%20kalyanamandapam)!5e0!3m2!1sen!2sin!4v1748168674929!5m2!1sen!2sin"
                width="100%"
                height="400"
                style={{ border:0, borderRadius: 'var(--rounded-lg)', boxShadow: 'var(--shadow-md)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Clickys Office Location"
              ></iframe>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
