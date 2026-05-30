"use client";

import Link from 'next/link';
import Image from 'next/image'; // 1. Imported next/image
import styles from '../styles/Footer.module.css';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaAmazon } from 'react-icons/fa';
import { FiZap, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import NewsletterSubscription from './NewsletterSubscription';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const socialLinks = [
    { href: "https://www.facebook.com/clickyse/", icon: <FaFacebookF />, label: "Facebook" },
    { href: "https://x.com/clickys25", icon: <FaTwitter />, label: "X/(Twitter)" },
    { href: "https://www.instagram.com/_clickyse?igsh=bjV3YnZ6OG80MHNq", icon: <FaInstagram />, label: "Instagram" },
    { href: "https://www.youtube.com/channel/UCHEEoI2IKwg6mcRNLmKtXnw", icon: <FaYoutube />, label: "YouTube" },
    { href: "https://www.amazon.in/shop/clickyse", icon: <FaAmazon />, label: "Amazon Store" },
  ];

  const footerSections = [
    {
      title: "Explore",
      links: [
        { href: "/products", label: "Amazon Products" },
        { href: "/deals", label: "All Products" },
        { href: "/whats-new", label: "What is new?" },
      ]
    },
    {
      title: "About Clickys",
      links: [
        { href: "/about", label: "About Us" },
        { href: "/contact", label: "Contact" },
      ]
    },
    {
      title: "Support",
      links: [
        { href: "/contact", label: "FAQ" },
        { href: "/privacy-policy", label: "Privacy Policy" },
      ]
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        <NewsletterSubscription />
      </div>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-block"
                >
                  <Link href="/" className={`group ${styles.footerLogo} flex items-baseline font-black tracking-tighter`} style={{ textDecoration: 'none' }}>
                    <span className="text-green-600 transition-colors duration-300 group-hover:text-green-500 text-[40px]">click</span>
                    <span className="text-[#f9c616] transition-colors duration-300 group-hover:text-orange-400 text-3xl">ys</span>
                  </Link>
                </motion.div>
                <p className={styles.footerTagline}>Your trusted guide to Amazon's best finds.</p>
                <p className={styles.disclosure}>
                  As an Amazon Affiliate we may earn from qualifying purchases.
                </p>
            </div>
            <div className={styles.footerFeaturedContent}>
                <h4 className={styles.featuredContentTitle}>Don&#39;t Miss Out!</h4>
                <div className={styles.featuredItem}>
                    <FiBookOpen className={styles.featuredIcon} />
                    <div>
                        <Link href="/products" className={styles.featuredLink}>
                            Our Amazing Amazon Products
                        </Link>
                        <p className={styles.featuredDescription}>Buy from Amazon today with fast shipping and secure checkout!</p>
                    </div>
                </div>
                <div className={styles.featuredItem}>
                    <FiZap className={styles.featuredIcon} />
                    <div>
                        <Link href="/deals" className={styles.featuredLink}>
                            Browse all our expertly chosen products.
                        </Link>
                        <p className={styles.featuredDescription}>Grab expert product picks and limited stock with exclusive deals!</p>
                    </div>
                </div>
            </div>
        </div>

        <div className={styles.footerMain}>
            {footerSections.map(section => (
                <div key={section.title} className={styles.footerLinksColumn}>
                    <h4 className={styles.footerLinksTitle}>{section.title}</h4>
                    <ul>
                        {section.links.map(link => (
                            <li key={link.href}>
                                <Link href={link.href}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; {currentYear} Clickys. All Rights Reserved.
                           Made with ❤️ by <Link href="https://www.pixelcrafte.co.zw/">PixelCrafte</Link></p>
          <div className={styles.socialIcons}>
            {socialLinks.map(social => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ y: -3, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
