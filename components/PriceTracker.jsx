"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiLoader, FiCheckCircle, FiChevronRight, FiArrowLeft, FiX } from 'react-icons/fi';
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
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    
    try {
      const res = await fetch(`/api/global-search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        let data = {};
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           data = await res.json();
        } else {
           throw new Error("Received HTML instead of JSON from server");
        }
        const mappedResults = (data.results || []).map(p => ({
          id: p.id || Math.random().toString(36).substr(2, 9),
          title: p.name || p.title || 'Unknown Product',
          price: p.price || null,
          image: p.imageUrl || p.image || null,
          link: p.amazonLink || p.link || '#'
        }));
        setProducts(mappedResults);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
      setStep(2);
    }
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
    <div 
      onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
      className={isExpanded
        ? "fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm overflow-y-auto p-4 md:p-10 flex flex-col w-full h-[100dvh]"
        : "bg-white border-2 border-gray-200 hover:border-orange-500 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 flex flex-col relative w-full h-full cursor-pointer"}
    >
      <div className={isExpanded ? "max-w-4xl mx-auto w-full flex flex-col bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-gray-900 relative min-h-[500px]" : "flex flex-col h-full"}>
        {isExpanded && (
          <button 
            type="button" 
            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }} 
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
          >
             <FiX size={20} />
          </button>
        )}
        
        <div className="flex flex-col mb-6 shrink-0">
            <h2 className="text-2xl font-black text-gray-900">Wait for Price Drop</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Get instant price alerts.</p>
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
                    placeholder="Search from all products e.g. iPhone"
                    className="w-full pl-10 pr-4 py-3 bg-[#ffffff] border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium text-[#ffffff]"
                  />
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button 
                  type="submit" 
                  disabled={!query.trim() || isSearching}
                  onClick={!isExpanded ? (e) => { e.stopPropagation(); setIsExpanded(true); } : undefined}
                  className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {isSearching ? <FiLoader className="animate-spin" /> : <>Search <FiChevronRight /></>}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <button onClick={() => setStep(1)} className="text-gray-900 hover:text-orange-600 flex items-center text-sm font-bold transition-colors">
                  <FiArrowLeft className="mr-1" /> Back
                </button>
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md font-bold">{products.length} found</span>
              </div>
              
              <div className={`flex-grow overflow-y-auto min-h-0 hide-scrollbar p-1 ${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max' : 'space-y-2'}`}>
                {products.length > 0 ? (
                  products.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => handleSelectProduct(p)}
                      className={`flex ${isExpanded ? 'flex-col' : 'items-center'} gap-3 p-3 bg-white hover:bg-orange-50 border-2 border-gray-100 hover:border-orange-500 shadow-sm rounded-xl cursor-pointer transition-all group`}
                    >
                      <div className={`${isExpanded ? 'w-full h-40' : 'w-12 h-12'} bg-white rounded-lg border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden`}>
                        {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain" /> : <FiSearch className="text-gray-300" />}
                      </div>
                      <div className={isExpanded ? 'flex flex-col' : 'flex-grow'}>
                        <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">{p.title}</h4>
                        {p.price && <p className="text-xs font-black text-gray-600 mt-1">{p.price}</p>}
                        {isExpanded && <button className="mt-3 bg-gray-100 hover:bg-orange-100 text-gray-900 group-hover:text-orange-700 w-full py-2 rounded-lg text-xs font-bold transition-colors">Select to Track</button>}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 col-span-full">
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
                <button onClick={() => setStep(2)} className="text-gray-900 hover:text-orange-600 flex items-center text-sm font-bold transition-colors mr-3">
                  <FiArrowLeft className="mr-1" /> Back
                </button>
                <div className="flex bg-gray-50 px-3 py-1.5 rounded-full items-center gap-2 border border-gray-200">
                  <h4 className="font-bold text-xs text-gray-800 line-clamp-1">{selectedProduct.title}</h4>
                </div>
              </div>

              <form onSubmit={handleSubmitTracking} className="flex-grow flex flex-col hide-scrollbar overflow-y-auto pr-1">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Target Price (₹) - Expected Price</label>
                    <input
                      type="number"
                      required
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      placeholder={selectedProduct.price ? `Currently ${selectedProduct.price}` : "e.g. 500"}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-900 mb-1">Contact (Email/WhatsApp)</label>
                    <input
                      type="text"
                      required
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                      placeholder="+91... or email"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-gray-900 font-bold"
                    />
                    <p className="text-xs text-gray-500 mt-1 pl-1">For WhatsApp, include country code (e.g. +91)</p>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={!priceRange || !contactMethod || isSubmitting}
                  className="w-full mt-6 mb-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {isSubmitting ? <FiLoader className="animate-spin" /> : 'Set Alert'}
                </button>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in-up flex flex-col justify-center text-center h-full">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border-2 border-green-200">
                <FiCheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Alert Saved!</h3>
              <p className="text-gray-600 mb-6 text-sm px-2 font-medium">We'll alert {contactMethod} when it drops below ₹{priceRange}.</p>
              <div className="mt-auto">
                <button 
                  onClick={() => {
                    setStep(1);
                    setQuery('');
                    setPriceRange('');
                    setContactMethod('');
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm"
                >
                  Track Another Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isExpanded && mounted) {
    return createPortal(content, document.body);
  }

  return content;
}
