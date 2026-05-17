// components/AppProviders.js
"use client"; // This component uses client-side features

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { WishlistProvider } from './WishlistContext';

export default function AppProviders({ children }) {
  useEffect(() => {
    AOS.init({
      duration: 600, // Slightly faster default duration
      easing: 'ease-out-cubic',
      once: true, // Animate elements only once
      offset: 30, // Trigger animations a bit sooner
      delay: 50,  // Slight delay for staggered effect if multiple elements animate
    });
  }, []);

  return (
    <WishlistProvider>
      {children}
    </WishlistProvider>
  );
}

