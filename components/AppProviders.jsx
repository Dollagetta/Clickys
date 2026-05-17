// components/AppProviders.js
"use client"; // This component uses client-side features

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { usePathname } from 'next/navigation';
import { WishlistProvider } from './WishlistContext';
import { Toaster } from 'react-hot-toast';

export default function AppProviders({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    const initAOS = () => {
      AOS.init({
        duration: 600, // Slightly faster default duration
        easing: 'ease-out-cubic',
        once: true, // Animate elements only once
        offset: 30, // Trigger animations a bit sooner
        delay: 50,  // Slight delay for staggered effect if multiple elements animate
      });
    };
    
    // Delay AOS initialization to avoid blocking the main thread and LCP
    const timer = setTimeout(initAOS, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <WishlistProvider>
      <Toaster position="bottom-right" />
      {children}
    </WishlistProvider>
  );
}

