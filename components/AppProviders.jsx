// components/AppProviders.js
"use client"; // This component uses client-side features

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { WishlistProvider } from './WishlistContext';
import { CompareProvider } from './CompareContext';
import CompareDrawer from './CompareDrawer';
import LiveActivityToast from './LiveActivityToast';

export default function AppProviders({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 600, // Slightly faster default duration
      easing: 'ease-out-cubic',
      once: true, // Animate elements only once
      offset: 30, // Trigger animations a bit sooner
      delay: 50,  // Slight delay for staggered effect if multiple elements animate
    });

    // Disable right-click
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable Inspect Element (shortcuts)
    const handleKeyDown = (e) => {
      // F12 key
      if (e.keyCode === 123) {
        e.preventDefault();
      }
      // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
      if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
        e.preventDefault();
      }
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <WishlistProvider>
      <CompareProvider>
        {children}
        <CompareDrawer />
        <LiveActivityToast />
      </CompareProvider>
    </WishlistProvider>
  );
}

