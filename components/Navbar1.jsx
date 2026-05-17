"use client"; // This component uses client-side hooks (useState, useEffect)

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles/Navbar.module.css'; // Create this CSS Module file
import { FiMenu, FiX, FiSearch } from 'react-icons/fi'; // Example icons

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Handle scroll effect for navbar background/shadow
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 30); // Add class if scrolled more than 30px
    };
    window.addEventListener('scroll', handleScroll);
    // Cleanup function to remove the event listener
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animation variants for Framer Motion
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
    { href: "/products", label: "Products" }, // Example, adjust routes as needed
    { href: "/deals", label: "Hot Deals" },
    { href: "/guides", label: "Guides" },   // Example
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <motion.nav
      className={`${styles.navbar} ${hasScrolled ? styles.scrolled : ''}`}
      initial={{ y: -80 }} // Start off-screen
      animate={{ y: 0 }}    // Animate to original position
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
    >
      <div className={`container ${styles.navContainer}`}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          Affiliate<span className={styles.logoAccent}>Aura</span>
        </Link>

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
    </motion.nav>
  );
};

export default Navbar;
