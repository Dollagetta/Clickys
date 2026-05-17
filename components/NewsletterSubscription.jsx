'use client';

import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';
import { motion } from 'framer-motion';
import { FiZap } from 'react-icons/fi';
import CallToAction from './CallToAction';

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const path = 'subscribers';
      await addDoc(collection(db, path), {
        email: email,
        subscribedAt: serverTimestamp(),
        isActive: true,
      });
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setErrorMessage('Failed to subscribe. Please try again later.');
      handleFirestoreError(error, OperationType.CREATE, 'subscribers');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[20px] shadow-lg border border-orange-100 max-w-md mx-auto my-4 relative overflow-hidden group">
      {/* Decorative background blobs */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-orange-100 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
      <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity"></div>

      <div className="relative z-10 text-center">
        <h3 className="text-xl font-extrabold text-gray-900 mb-1 tracking-tight">Stay in the Loop</h3>
        <p className="text-gray-600 mb-4 text-sm font-medium">
          Get exclusive deals and product arrivals directly in your inbox.
        </p>
        
        {status === 'success' ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-50 text-green-700 p-3 rounded-xl flex flex-col items-center gap-1 border border-green-200"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-sm uppercase tracking-wider">Welcome to the Club!</span>
            <p className="text-[10px] font-medium">You're now subscribed to Clickys updates.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 transition-all font-semibold text-gray-800 placeholder-gray-400"
                disabled={status === 'loading'}
              />
            </div>
            <CallToAction 
              text={status === 'loading' ? "" : "Subscribe"} 
              type="submit" 
              className="sm:min-w-[120px] bg-orange-600 text-white border-none py-2 px-4 shadow-md hover:shadow-orange-200 !text-sm"
              icon={status === 'loading' ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FiZap className="rotate-12" />}
              iconPosition="right"
              premium
              style={status === 'loading' ? { pointerEvents: 'none', opacity: 0.8 } : {}}
            />
          </form>
        )}
        
        {status === 'error' && (
          <p className="mt-3 text-red-500 text-xs font-bold bg-red-50 py-1.5 px-3 rounded-full inline-block">
            {errorMessage}
          </p>
        )}
        
        <p className="mt-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
