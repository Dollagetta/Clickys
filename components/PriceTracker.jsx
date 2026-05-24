"use client";

import { useState } from 'react';
import { FiSearch, FiLoader, FiCheckCircle, FiBell, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';

export default function PriceTracker() {
  const [step, setStep] = useState(1); // 1: search, 2: results & pick, 3: range & contact, 4: success
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [priceRange, setPriceRange] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/internal-products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProducts(data.products || []);
      setStep(2);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setStep(3);
  };

  const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  const handleSubmitTracking = (e) => {
    e.preventDefault();
    if (!validateContact(contactMethod)) {
      alert("Please enter a valid email address or 10-digit phone number.");
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call to save tracking request
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden p-6 md:p-8 max-w-2xl mx-auto min-h-[400px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
          <FiBell size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Price Drop Alert</h2>
          <p className="text-gray-500 text-sm">We'll let you know when the price drops!</p>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleSearch} className="animate-fade-in-up">
          <label className="block text-sm font-medium text-gray-700 mb-2">What do you want to track?</label>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products on Clickys..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button 
            type="submit" 
            disabled={!query.trim() || isSearching}
            className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSearching ? <FiLoader className="animate-spin" /> : 'Search Products'}
          </button>
        </form>
      )}

      {step === 2 && (
        <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Select a product to track:</h3>
            <button onClick={() => setStep(1)} className="text-sm text-emerald-600 hover:underline">Back to search</button>
          </div>
          
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">
            {products.length === 0 ? (
              <p className="text-gray-500 py-4 text-center">No products found matching "{query}".</p>
            ) : (
              products.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-emerald-50 border border-gray-100 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-gray-300"><FiSearch /></div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-gray-900 line-clamp-2">{p.title}</h4>
                    {p.price && <p className="text-sm font-bold text-gray-700 mt-1">₹{p.price}</p>}
                  </div>
                  <div className="text-gray-400 group-hover:text-emerald-500 pr-2 transition-colors">
                    <FiChevronRight size={20} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {step === 3 && selectedProduct && (
        <form onSubmit={handleSubmitTracking} className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-900">Set tracking details</h3>
            <button type="button" onClick={() => setStep(2)} className="text-sm text-emerald-600 hover:underline">Change product</button>
          </div>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-xl mb-6">
            <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
              {selectedProduct.image ? (
                <img src={selectedProduct.image} alt={selectedProduct.title} className="max-w-full max-h-full object-contain" />
              ) : null}
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{selectedProduct.title}</h4>
              {selectedProduct.price && <p className="text-xs font-bold text-gray-700">Current: ₹{selectedProduct.price}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Price (₹)</label>
              <input
                type="number"
                required
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number or Email</label>
              <input
                type="text"
                required
                value={contactMethod}
                onChange={(e) => setContactMethod(e.target.value)}
                placeholder="Where should we notify you?"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none"
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting || !priceRange || !contactMethod}
            className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <FiLoader className="animate-spin" /> : 'Set Alert'}
          </button>
        </form>
      )}

      {step === 4 && (
        <div className="text-center py-8 animate-fade-in-up">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle size={32} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Alert Set Successfully!</h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">We'll keep an eye on {selectedProduct?.title} and notify you at {contactMethod} when it hits ₹{priceRange}.</p>
          <button 
            onClick={() => { setStep(1); setQuery(''); setSelectedProduct(null); setPriceRange(''); setContactMethod(''); }}
            className="text-emerald-600 font-semibold hover:underline"
          >
            Track another product
          </button>
        </div>
      )}
    </div>
  );
}
