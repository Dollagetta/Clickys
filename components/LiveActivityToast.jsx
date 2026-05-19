"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEye, FiHeart, FiTrendingUp, FiShoppingBag, FiStar, FiZap, FiMessageCircle, FiTag } from "react-icons/fi";

const messages = [
  { icon: FiEye, text: () => `${Math.floor(Math.random() * 15) + 3} people are currently looking at this item`, color: "text-blue-500", bg: "bg-blue-100" },
  { icon: FiHeart, text: () => `Someone just saved a tech gadget to their Wishlist!`, color: "text-red-500", bg: "bg-red-100" },
  { icon: FiTrendingUp, text: () => `Prices on electronics are dropping. Check out the latest!`, color: "text-green-500", bg: "bg-green-100" },
  { icon: FiShoppingBag, text: () => `A user just completed a purchase via our partner link.`, color: "text-purple-500", bg: "bg-purple-100" },
  { icon: FiStar, text: () => `This product just received a 5-star rating!`, color: "text-yellow-500", bg: "bg-yellow-100" },
  { icon: FiZap, text: () => `Flash deal ending soon on top accessories!`, color: "text-orange-500", bg: "bg-orange-100" },
  { icon: FiMessageCircle, text: () => `Our AI Shopper just helped someone find the perfect gift.`, color: "text-indigo-500", bg: "bg-indigo-100" },
  { icon: FiTag, text: () => `New discount code applied for a smartwatch deal.`, color: "text-teal-500", bg: "bg-teal-100" },
];

export default function LiveActivityToast() {
  const [currentToast, setCurrentToast] = useState(null);

  useEffect(() => {
    const showToast = () => {
      // Pick a random message
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setCurrentToast({ ...msg, textStr: msg.text() });

      // Hide after a few seconds
      setTimeout(() => {
        setCurrentToast(null);
      }, 5000); // Wait 5 seconds before hiding
    };

    // Show first toast after a delay
    const initialTimer = setTimeout(showToast, 3000);

    // Then show a toast periodically
    const intervalTimer = setInterval(() => {
      // Small chance to show a toast every interval to make it feel organic, not robotic
      if (Math.random() > 0.3) {
        showToast();
      }
    }, 15000); // check every 15 seconds

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {currentToast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-6 left-6 z-40 bg-white/90 backdrop-blur-md shadow-2xl border border-gray-100 rounded-2xl flex items-center p-4 max-w-sm"
        >
          <div className={`${currentToast.bg} ${currentToast.color} p-3 rounded-full mr-4`}>
            {<currentToast.icon className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-snug">
              {currentToast.textStr}
            </p>
            <p className="text-xs text-gray-400 mt-1">Just now</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
