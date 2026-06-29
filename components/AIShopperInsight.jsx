"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiZap, FiLoader, FiAlertCircle } from 'react-icons/fi';

export default function AIShopperInsight({ productTitle, description, category }) {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInsight = async () => {
    if (!productTitle) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productTitle, description, category }),
      });
      const data = await response.json();
      if (data.insight) {
        setInsight(data.insight);
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load AI insight.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsight();
  }, [productTitle]);

  if (!loading && !insight && !error) return null;

  return (
    <div className="my-6 p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 shadow-sm overflow-hidden relative">
      <div className="flex items-center gap-2 mb-2">
        <FiZap className="w-5 h-5 text-orange-600" />
        <h3 className="font-bold text-orange-900 text-sm md:text-base">AI Shopper Insight</h3>
      </div>
      
      <div className="min-h-[40px] flex items-center">
        {loading ? (
          <div className="flex items-center gap-2 text-orange-600/70 text-sm italic">
            <FiLoader className="w-4 h-4 animate-spin" />
            Generating smart insight...
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-red-500 text-sm">
            <FiAlertCircle className="w-4 h-4" />
            {error}
          </div>
        ) : (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-700 text-sm md:text-base leading-relaxed"
          >
            {insight}
          </motion.p>
        )}
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-2 -right-2 opacity-5 pointer-events-none">
        <FiZap className="w-16 h-16 text-orange-900" />
      </div>
    </div>
  );
}
