"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import heroImages from '../public/hero-images.json';

export default function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 10000); // 10 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Images Layer */}
      {heroImages.map((item, index) => {
        const isActive = index === currentIndex;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <Image
              src={item.image}
              alt={item.alt}
              fill
              priority={isActive || index === (currentIndex + 1) % heroImages.length}
              sizes="100vw"
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        );
      })}

      {/* Subtle Gradient Overlay for text readability without being too dark */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}

