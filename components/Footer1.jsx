// components/Footer.js
"use client";

import Link from 'next/link';
import styles from '../styles/Footer.module.css'; // Ensure this path is correct
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaAmazon } from 'react-icons/fa'; // Added FiZap, FiBookOpen
import { FiZap, FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { href: "https://www.facebook.com/clickyse/", icon: <FaFacebookF />, label: "Facebook" },
    { href: "#", icon: <FaTwitter />, label: "Twitter" },
    { href: "#", icon: <FaInstagram />, label: "Instagram" },
    { href: "#", icon: <FaYoutube />, label: "YouTube" },
    { href: "#", icon: <FaAmazon />, label: "Amazon Store" },
  ];

  const footerSections = [
    {
      title: "Explore",
      links: [
        { href: "/products", label: "All Products" },
        { href: "/deals", label: "Hot Deals" },
        { href: "/whats-new", label: "What's New" },
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
      ]
    }
  ];


  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
                <Link href="/" className={`group ${styles.footerLogo} flex items-baseline font-black tracking-tighter`} style={{ textDecoration: 'none' }}>
                    <span className="text-green-600 transition-colors duration-300 group-hover:text-green-500 text-[40px]">click</span>
                    <span className="text-[#f9c616] transition-colors duration-300 group-hover:text-orange-400 text-3xl">ys</span>
                </Link>
                <p className={styles.footerTagline}>Your trusted guide to Amazon's best finds.</p>
                <p className={styles.disclosure}>
                    As an Amazon Associate, we earn from qualifying purchases. All product recommendations are independently chosen by our editorial team.
                </p>
            </div>
            {/* Replaced Newsletter with Featured Content Snippet */}
            <div className={styles.footerFeaturedContent}>
                <h4 className={styles.featuredContentTitle}>Don't Miss Out!</h4>
                <div className={styles.featuredItem}>
                    {/* Example: Link to a popular guide */}
                    <FiBookOpen className={styles.featuredIcon} />
                    <div>
                        <Link href="/whats-new" className={styles.featuredLink}>
                            Our Latest Updates
                        </Link>
                        <p className={styles.featuredDescription}>Read our latest articles.</p>
                    </div>
                </div>
                <div className={styles.featuredItem}>
                    {/* Example: Link to deals page */}
                    <FiZap className={styles.featuredIcon} /> {/* Using FiZap for deals */}
                    <div>
                        <Link href="/deals" className={styles.featuredLink}>
                            Today's Hottest Deals
                        </Link>
                        <p className={styles.featuredDescription}>Grab limited-time offers before they're gone!</p>
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
