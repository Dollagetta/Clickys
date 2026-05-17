// components/AppProviders.js
"use client"; // This component uses client-side features

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePathname } from 'next/navigation';
import { WishlistProvider } from './WishlistContext';
import AnimatedPageWrapper from './AnimatedPageWrapper';
import { Toaster } from 'react-hot-toast';

export default function AppProviders({ children }) {
  const pathname = usePathname();

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
      <Toaster position="bottom-right" />
      <AnimatePresence mode="wait" initial={false}>
        <AnimatedPageWrapper key={pathname}>
          {children}
        </AnimatedPageWrapper>
      </AnimatePresence>
    </WishlistProvider>
  );
}

