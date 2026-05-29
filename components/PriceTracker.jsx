"use client";

import { useState } from 'react';
import { FiSearch, FiLoader, FiCheckCircle, FiChevronRight, FiArrowLeft } from 'react-icons/fi';
import { searchAllProducts } from '../components/searchUtils';

export default function PriceTracker() {
  const [step, setStep] = useState(1); 
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  const [priceRange, setPriceRange] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    
    setTimeout(() => {
      const results = searchAllProducts(query);
      setProducts(results);
      setIsSearching(false);
      setStep(2);
    }, 400);
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setStep(3);
  };

  const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{10,14}$/; // Require country code like +91
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  const handleSubmitTracking = (e) => {
    e.preventDefault();
    if (!validateContact(contactMethod)) {
      alert("Please enter a valid email address or a WhatsApp number with country code (e.g., +919876543210).");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 1000);
  };

  const content = (
    <div className={step > 1 
      ? "fixed inset-0 z-[100] bg-white p-6 md:p-10 flex flex-col overflow-hidden h-[100dvh] transition-all duration-300"
      : "bg-white border shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 mx-auto h-[400px] flex flex-col relative w-full"
    } style={step > 1 ? {} : { borderColor: '#51af2a', borderWidth: '9px', borderRadius: '60px', height: '400px' }}>
      <div className="flex flex-col mb-6 shrink-0">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">Wait for Price Drop</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Get instant alerts.</p>
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        {step === 1 && (
          <div className="animate-fade-in-up flex flex-col h-full">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Which product to track?</h3>
            <form onSubmit={handleSearch} className="flex-grow flex flex-col">
              <div className="relative mb-auto">
                <input
                  type="text"
                  required
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium"
                />
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
              </div>
              <button 
                type="submit" 
                disabled={!query.trim() || isSearching}
                className="w-full mt-4 hover:from-orange-600 hover:to-green-600 font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                style={{ backgroundColor: '#ed9b12', color: '#ffffff' }}
              >
                {isSearching ? <FiLoader className="animate-spin" /> : <>Search <FiChevronRight /></>}
              </button>
            </form>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <button onClick={() => setStep(1)} className="text-orange-500 hover:text-green-600 flex items-center text-xs font-bold transition-colors">
                <FiArrowLeft className="mr-1" /> Back
              </button>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md font-bold">{products.length} found</span>
            </div>
            
            <div className="flex-grow overflow-y-auto min-h-0 space-y-2 pr-1 hide-scrollbar">
              {products.length > 0 ? (
                products.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => handleSelectProduct(p)}
                    className="flex items-center gap-3 p-3 bg-white hover:bg-orange-50 border-2 border-transparent hover:border-orange-200 shadow-sm rounded-xl cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
                      {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain" /> : <FiSearch className="text-gray-300" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">{p.title}</h4>
                      {p.price && <p className="text-[10px] font-black text-green-600 mt-0.5">₹{p.price}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm font-bold text-gray-900 mb-1">No products found.</p>
                  <button onClick={() => setStep(1)} className="text-orange-600 font-bold hover:underline text-xs">Try different keywords</button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && selectedProduct && (
          <div className="animate-fade-in-up flex flex-col h-full">
            <div className="flex items-center mb-4 shrink-0">
              <button onClick={() => setStep(2)} className="text-orange-500 hover:text-green-600 flex items-center text-sm font-bold transition-colors mr-3">
                <FiArrowLeft className="mr-1" /> Back
              </button>
              <div className="flex bg-orange-50 px-3 py-1.5 rounded-full items-center gap-2 border border-orange-100">
                <h4 className="font-bold text-[10px] text-orange-800 line-clamp-1">{selectedProduct.title}</h4>
              </div>
            </div>

            <form onSubmit={handleSubmitTracking} className="flex-grow flex flex-col hide-scrollbar overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Target Price (₹) - Expected Price</label>
                  <input
                    type="number"
                    required
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder={selectedProduct.price ? `Currently ₹${selectedProduct.price}` : "e.g. 500"}
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contact (Email/WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    placeholder="+91... or email"
                    className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium"
                  />
                  <p className="text-[10px] text-gray-500 mt-1 pl-1">For WhatsApp, include country code (e.g. +91)</p>
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={!priceRange || !contactMethod || isSubmitting}
                className="w-full mt-auto mb-2 bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? <FiLoader className="animate-spin" /> : 'Set Alert'}
              </button>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in-up flex flex-col justify-center text-center h-full">
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
              <FiCheckCircle size={32} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-2">Alert Saved!</h3>
            <p className="text-gray-600 mb-6 text-xs px-2 font-medium">We'll alert {contactMethod} when it drops below ₹{priceRange}.</p>
            <button 
              onClick={() => {
                setStep(1);
                setQuery('');
                setPriceRange('');
                setContactMethod('');
                setSelectedProduct(null);
              }}
              className="mt-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
            >
              Track Another Product
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return content;
}
