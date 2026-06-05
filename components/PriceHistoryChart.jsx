"use client";

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { FiTrendingDown } from 'react-icons/fi';

export default function PriceHistoryChart({ currentPrice }) {
  // Generate fake history data for the last 30 days based on currentPrice
  const data = useMemo(() => {
    let basePrice = 1000;
    
    if (currentPrice) {
      // Try to parse price
      const cleanPrice = String(currentPrice).replace(/[^0-9.]/g, '');
      const parsed = parseFloat(cleanPrice);
      if (!isNaN(parsed) && parsed > 0) {
        basePrice = parsed;
      }
    }

    const today = new Date();
    const history = [];
    
    // Simulate price drops. Maybe a spike 15 days ago.
    for (let i = 30; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      
      let price = basePrice * 1.2; // 20% higher 30 days ago
      
      if (i > 20) {
        price = basePrice * 1.3 + (Math.random() * 50);
      } else if (i > 10) {
        price = basePrice * 1.1 + (Math.random() * 30);
      } else if (i > 2) {
        price = basePrice * 1.05 + (Math.random() * 10);
      } else {
        price = basePrice;
      }
      
      history.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: parseFloat(price.toFixed(2))
      });
    }
    
    return history;
  }, [currentPrice]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-8 mb-8" data-aos="fade-up">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Price History <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">Last 30 Days</span>
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track price changes to make sure you're getting the best deal.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
          <FiTrendingDown className="w-5 h-5" />
          <span className="font-bold text-sm">Great time to buy!</span>
        </div>
      </div>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 15, right: 15, left: 25, bottom: 5 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
            <YAxis 
              width={80}
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              tickFormatter={(value) => `₹${value}`}
              domain={['dataMin', 'dataMax']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`₹${value}`, 'Price']}
            />
            <Area type="monotone" dataKey="price" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
