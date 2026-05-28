"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  useEffect(() => {
    // Load from localStorage if present
    const stored = localStorage.getItem("clickys-compare");
    if (stored) {
      try {
        setCompareItems(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse compare items");
      }
    }
  }, []);

  const toggleCompare = (product) => {
    setCompareItems((prev) => {
      const exists = prev.some((p) => p.id === product.id || (p.asin && p.asin === product.asin));
      let newItems;
      if (exists) {
        newItems = prev.filter((p) => p.id !== product.id && p.asin !== product.asin);
      } else {
        if (prev.length >= 3) {
          // Max 3 items
          alert("You can only compare up to 3 items at a time.");
          return prev;
        }
        newItems = [...prev, product];
      }
      localStorage.setItem("clickys-compare", JSON.stringify(newItems));
      return newItems;
    });
  };

  const removeFromCompare = (idOrAsin) => {
    setCompareItems((prev) => {
      const newItems = prev.filter((p) => p.id !== idOrAsin && p.asin !== idOrAsin);
      localStorage.setItem("clickys-compare", JSON.stringify(newItems));
      return newItems;
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    localStorage.removeItem("clickys-compare");
  };

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        toggleCompare,
        removeFromCompare,
        clearCompare,
        isCompareDrawerOpen,
        setIsCompareDrawerOpen,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
