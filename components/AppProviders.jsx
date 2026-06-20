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

    // Disable right-click globally
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Disable modern DevTools keyboard combinations and shortcut keys
    const handleKeyDown = (e) => {
      // F12 key
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + I or Cmd + Shift + I (Inspect Elements)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'i' || e.key === 'I' || e.keyCode === 73)) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + J or Cmd + Shift + J (Developer Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'j' || e.key === 'J' || e.keyCode === 74)) {
        e.preventDefault();
        return false;
      }

      // Ctrl + Shift + C or Cmd + Shift + C (Inspect Element Mode)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'c' || e.key === 'C' || e.keyCode === 67)) {
        e.preventDefault();
        return false;
      }

      // Ctrl + U or Cmd + U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U' || e.keyCode === 85)) {
        e.preventDefault();
        return false;
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

