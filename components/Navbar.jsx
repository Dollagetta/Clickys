"use client";

import Link from 'next/link';
import Image from 'next/image'; // 1. Imported next/image
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Navbar.module.css';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -25, transition: { duration: 0.3, ease: "easeInOut" } },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeInOut", staggerChildren: 0.05 } },
    exit: { opacity: 0, y: -25, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 12 } }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/ai-shopper", label: "Smart Shop" },
    { href: "/whats-new", label: "What's New" },
    { href: "/products", label: "Amazon Products" },
    { href: "/deals", label: "All Products" },
    { href: "/wishlist", label: "Wishlist" },
    { href: "/about", label: "About Us" },
  ];

  return (
    <nav
      className={`${styles.navbar} ${hasScrolled ? styles.scrolled : ''}`}
    >
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2"
          >
           <div className={styles.logoWrapper}>
            <Link href="/" className={`${styles.logo} flex items-center`} style={{ textDecoration: 'none' }}>
              <Image src="/images/logosvg.svg" alt="Clickys Logo" width={150} height={50} className="object-contain" priority />
            </Link>
           </div>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.ul className={`${styles.navMenu} ${styles.desktopNav}`}>
            {navLinks.map((link) => (
              <motion.li key={link.href} variants={menuItemVariants} whileHover={{scale: 1.05}} whileTap={{scale:0.95}}>
                <Link href={link.href}>{link.label}</Link>
              </motion.li>
            ))}
          </motion.ul>

          {/* Mobile Menu Toggle Button */}
          <button
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>

          {/* Mobile Menu (Animated with AnimatePresence) */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                className={styles.mobileMenu}
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ul>
                  {navLinks.map((link) => (
                    <motion.li key={link.href} variants={menuItemVariants}>
                      <Link href={link.href} onClick={toggleMobileMenu}>
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </nav>
  );
};

export default Navbar;
