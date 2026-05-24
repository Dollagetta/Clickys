"use client";

import { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheckCircle, FiLoader } from 'react-icons/fi';
import { createClient } from '../prismicio';
import * as prismic from '@prismicio/client';
import ProductCard from './ProductCard';

export default function SmartShopFeatures() {
  const [activeModal, setActiveModal] = useState(null); // 'gift' | 'track' | 'compare'

  // --- Gift Finder State ---
  const [giftStep, setGiftStep] = useState(1);
  const [giftData, setGiftData] = useState({
    gender: '',
    relationship: '',
    otherRelationship: '',
    occasion: '',
    otherOccasion: '',
    budgetMax: '',
  });
  const [giftResults, setGiftResults] = useState([]);
  const [giftLoading, setGiftLoading] = useState(false);
  const [giftContact, setGiftContact] = useState('');
  const [giftContactSubmitted, setGiftContactSubmitted] = useState(false);

  // --- Track Price State ---
  const [trackStep, setTrackStep] = useState(1);
  const [trackSearchQuery, setTrackSearchQuery] = useState('');
  const [trackSearchResults, setTrackSearchResults] = useState([]);
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackSelectedProduct, setTrackSelectedProduct] = useState(null);

  const [trackData, setTrackData] = useState({
    expectedRange: '',
    contact: ''
  });
  const [trackSubmitted, setTrackSubmitted] = useState(false);

  // --- Compare Products State ---
  const [compareQuery, setCompareQuery] = useState('');
  const [compareResults, setCompareResults] = useState([]);
  const [compareLoading, setCompareLoading] = useState(false);
  const [selectedToCompare, setSelectedToCompare] = useState([]);
  const [isComparing, setIsComparing] = useState(false);

  // Modals Close Handler
  const closeModal = () => {
    setActiveModal(null);
    // reseting states
    setGiftStep(1);
    setGiftResults([]);
    setGiftContactSubmitted(false);
    setTrackSubmitted(false);
    setTrackStep(1);
    setTrackSearchQuery('');
    setTrackSearchResults([]);
    setTrackSelectedProduct(null);
    setTrackData({ expectedRange: '', contact: '' });
    setCompareQuery('');
    setCompareResults([]);
    setSelectedToCompare([]);
    setIsComparing(false);
  };

  // --- GIFT FINDER LOGIC ---
  const handleGiftSubmit = async () => {
    setGiftStep(5);
    setGiftLoading(true);
    try {
      const client = createClient();
      // Search keywords combining occasion and gender
      const q = `${giftData.occasion} ${giftData.gender}`.trim();
      const prismicRes = await client.getAllByType('product', {
        orderings: [{ field: 'document.first_publication_date', direction: 'desc' }]
      });

      // Filter locally in JS to find matches (naive search for demonstration)
      const matching = prismicRes.filter(p => {
        const title = p.data.title?.toLowerCase() || '';
        const desc = p.data.description?.toLowerCase() || '';
        const searchTerms = [
          giftData.gender.toLowerCase(),
          giftData.relationship.toLowerCase() === 'other' ? giftData.otherRelationship.toLowerCase() : giftData.relationship.toLowerCase(),
          giftData.occasion.toLowerCase() === 'other' ? giftData.otherOccasion.toLowerCase() : giftData.occasion.toLowerCase()
        ];
        
        let matchScore = 0;
        searchTerms.forEach(term => {
          if (term && (title.includes(term) || desc.includes(term))) {
            matchScore++;
          }
        });

        const priceNum = p.data.price ? parseFloat(p.data.price.replace(/[^0-9.]/g, '')) : Infinity;
        const budgetAllowed = giftData.budgetMax ? parseFloat(giftData.budgetMax) : Infinity;

        return matchScore > 0 && priceNum <= budgetAllowed;
      });

      const mappedMatching = matching.slice(0, 6).map(p => ({
        id: p.id,
        name: p.data?.title,
        category: p.data?.category || 'General',
        price: p.data?.price,
        imageUrl: p.data?.image,
        amazonLink: p.data?.link?.url,
        platform: p.data?.platform || 'Amazon',
        discount: p.data?.discount,
        description: p.data?.description,
        data: p.data
      }));

      setGiftResults(mappedMatching);
    } catch (e) {
      console.error(e);
      setGiftResults([]);
    } finally {
      setGiftLoading(false);
    }
  };

  // Contact validation helper
  const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  const handleGiftContactSubmit = (e) => {
    e.preventDefault();
    if (!validateContact(giftContact)) {
      alert("Please enter a valid email address or 10-digit phone number.");
      return;
    }
    setGiftContactSubmitted(true);
  };

  // --- TRACK PRICE LOGIC ---
  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!trackSearchQuery.trim()) return;
    setTrackLoading(true);
    try {
      const client = createClient();
      const res = await client.getAllByType('product', {
        filters: [prismic.filter.fulltext('my.product.title', trackSearchQuery)]
      });
      const mapped = res.slice(0, 6).map(p => ({
        id: p.id,
        name: p.data?.title,
        category: p.data?.category || 'General',
        price: p.data?.price,
        imageUrl: p.data?.image,
        amazonLink: p.data?.link?.url,
        platform: p.data?.platform || 'Amazon',
        discount: p.data?.discount,
        description: p.data?.description,
        data: p.data
      }));
      setTrackSearchResults(mapped);
    } catch(err) {
      console.error(err);
    } finally {
      setTrackLoading(false);
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!validateContact(trackData.contact)) {
      alert("Please enter a valid email address or 10-digit phone number.");
      return;
    }
    setTrackSubmitted(true);
  };

  // --- COMPARE LOGIC ---
  const handleCompareSearch = async (e) => {
    e.preventDefault();
    if (!compareQuery.trim()) return;
    setCompareLoading(true);
    try {
      const client = createClient();
      const res = await client.getAllByType('product', {
        filters: [prismic.filter.fulltext('my.product.title', compareQuery)]
      });
      const mapped = res.slice(0, 6).map(p => ({
        id: p.id,
        name: p.data?.title,
        category: p.data?.category || 'General',
        price: p.data?.price,
        imageUrl: p.data?.image,
        amazonLink: p.data?.link?.url,
        platform: p.data?.platform || 'Amazon',
        discount: p.data?.discount,
        description: p.data?.description,
        data: p.data // keep raw data for comparison table
      }));
      setCompareResults(mapped);
    } catch(err) {
      console.error(err);
    } finally {
      setCompareLoading(false);
    }
  };

  const toggleCompareSelect = (product) => {
    if (selectedToCompare.find(p => p.id === product.id)) {
      setSelectedToCompare(prev => prev.filter(p => p.id !== product.id));
    } else {
      if (selectedToCompare.length < 3) {
        setSelectedToCompare(prev => [...prev, product]);
      }
    }
  };

  return (
    <>
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 md:overflow-visible md:pb-0 mb-8 sm:mb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Card 1: Buy a Gift */}
        <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center rounded-[24px] overflow-hidden bg-white shadow-lg border border-orange-100 flex flex-col transition-transform duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-1" onClick={() => setActiveModal('gift')}>
          <div className="h-2 w-full bg-gradient-to-r from-orange-400 to-amber-500"></div>
          <div className="p-5 flex flex-col gap-2 flex-grow items-center justify-center text-center">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Find a Gift</h2>
            <p className="text-gray-600 text-sm mb-4">
              Step-by-step gift finder to get the perfect match.
            </p>
            <button className="bg-orange-500 text-white rounded-full px-6 py-2 text-sm font-bold hover:bg-orange-600 transition-colors w-full">
              Let's Go
            </button>
          </div>
        </div>
        
        {/* Card 2: Track Price */}
        <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center rounded-[24px] overflow-hidden bg-white shadow-lg border border-emerald-100 flex flex-col transition-transform duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-1" onClick={() => setActiveModal('track')}>
          <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-green-500"></div>
          <div className="p-5 flex flex-col gap-2 flex-grow items-center justify-center text-center">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Track Price</h2>
            <p className="text-gray-600 text-sm mb-4">
              Get price drop alerts straight to your WhatsApp/Email.
            </p>
            <button className="bg-emerald-500 text-white rounded-full px-6 py-2 text-sm font-bold hover:bg-emerald-600 transition-colors w-full">
              Set Alert
            </button>
          </div>
        </div>

        {/* Card 3: Compare Price */}
        <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center rounded-[24px] overflow-hidden bg-white shadow-lg border border-blue-100 flex flex-col transition-transform duration-300 hover:shadow-xl cursor-pointer hover:-translate-y-1" onClick={() => setActiveModal('compare')}>
          <div className="h-2 w-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
          <div className="p-5 flex flex-col gap-2 flex-grow items-center justify-center text-center">
            <h2 className="text-xl font-bold tracking-tight text-gray-900 mb-2">Compare Products</h2>
            <p className="text-gray-600 text-sm mb-4">
              Compare up to 3 products side-by-side to find the best deal.
            </p>
            <button className="bg-blue-500 text-white rounded-full px-6 py-2 text-sm font-bold hover:bg-blue-600 transition-colors w-full">
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {/* --- OVERLAYS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <button type="button" onClick={(e) => { e.preventDefault(); closeModal(); }} className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 hover:text-gray-900 z-10 cursor-pointer">
              <FiX size={20} />
            </button>

            {/* --- GIFT FINDER UI --- */}
            {activeModal === 'gift' && (
              <div className="p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Gift Finder</h2>

                {/* Step 1: Gender */}
                {giftStep === 1 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h3 className="text-lg font-semibold text-gray-700">What is the gender of the person?</h3>
                    <div className="flex flex-col gap-3">
                      {['Male', 'Female', 'Other'].map(opt => (
                        <button key={opt} onClick={() => { setGiftData({...giftData, gender: opt}); setGiftStep(2); }} className="w-full text-left px-6 py-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors font-medium">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Relationship */}
                {giftStep === 2 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h3 className="text-lg font-semibold text-gray-700">What is your relationship to them?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Friend', 'Partner', 'Parent', 'Sibling', 'Colleague'].map(opt => (
                        <button key={opt} onClick={() => { setGiftData({...giftData, relationship: opt}); setGiftStep(3); }} className="px-6 py-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors font-medium text-left">
                          {opt}
                        </button>
                      ))}
                      <div className="sm:col-span-2">
                        <input type="text" placeholder="Other (please specify)" value={giftData.otherRelationship} onChange={(e) => setGiftData({...giftData, relationship: 'Other', otherRelationship: e.target.value})} className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                        {giftData.relationship === 'Other' && giftData.otherRelationship && (
                          <button onClick={() => setGiftStep(3)} className="mt-3 w-full bg-orange-500 text-white rounded-xl py-3 font-bold hover:bg-orange-600 transition-colors">Next</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Occasion */}
                {giftStep === 3 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h3 className="text-lg font-semibold text-gray-700">What is the occasion?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['Birthday', "Valentine's Day", "Mother's Day", "Father's Day", 'Anniversary', 'Surprise'].map(opt => (
                        <button key={opt} onClick={() => { setGiftData({...giftData, occasion: opt}); setGiftStep(4); }} className="px-6 py-4 rounded-xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-colors font-medium text-left">
                          {opt}
                        </button>
                      ))}
                      <div className="sm:col-span-2">
                        <input type="text" placeholder="Other (please specify)" value={giftData.otherOccasion} onChange={(e) => setGiftData({...giftData, occasion: 'Other', otherOccasion: e.target.value})} className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none" />
                        {giftData.occasion === 'Other' && giftData.otherOccasion && (
                          <button onClick={() => setGiftStep(4)} className="mt-3 w-full bg-orange-500 text-white rounded-xl py-3 font-bold hover:bg-orange-600 transition-colors">Next</button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Budget */}
                {giftStep === 4 && (
                  <div className="space-y-4 animate-in slide-in-from-right-4">
                    <h3 className="text-lg font-semibold text-gray-700">What is your maximum budget? (INR)</h3>
                    <div className="flex flex-col gap-4">
                      <input type="number" placeholder="e.g. 2000" value={giftData.budgetMax} onChange={(e) => setGiftData({...giftData, budgetMax: e.target.value})} className="w-full px-6 py-4 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-lg" required />
                      <button onClick={handleGiftSubmit} disabled={!giftData.budgetMax} className="w-full bg-orange-500 text-white rounded-xl py-4 font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-lg">
                        Find Gifts
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Results */}
                {giftStep === 5 && (
                  <div className="space-y-6 animate-in slide-in-from-right-4">
                    {giftLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-orange-500">
                        <FiLoader className="animate-spin mb-4" size={40} />
                        <p className="text-gray-600 font-medium">Searching our catalog for the best matches...</p>
                      </div>
                    ) : (
                      <div>
                        {giftResults.length > 0 ? (
                          <div>
                            <h3 className="text-xl font-bold mb-4">We found these gifts for you:</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              {giftResults.map(p => (
                                <ProductCard key={p.id} product={p} />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
                            {!giftContactSubmitted ? (
                              <form onSubmit={handleGiftContactSubmit}>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Not available right now</h3>
                                <p className="text-gray-600 mb-6">We couldn't find a perfect match currently. Can you provide your contact for updates regarding the gift?</p>
                                <input type="text" placeholder="Email or WhatsApp Number" value={giftContact} onChange={e => setGiftContact(e.target.value)} required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[1-9]\d{1,14}$" title="Please enter a valid email address or phone number" className="w-full px-4 py-3 rounded-lg border border-gray-300 mb-4 focus:ring-2 focus:ring-orange-500 outline-none" />
                              <div className="flex flex-col gap-4">
                                <button type="submit" className="bg-orange-500 text-white rounded-lg px-6 py-3 font-bold hover:bg-orange-600 transition-colors w-full">Notify Me</button>
                                <button type="button" onClick={closeModal} className="text-gray-500 underline font-medium w-full text-center hover:text-gray-700">Back to Home</button>
                              </div>
                            </form>
                          ) : (
                            <div className="text-green-600 flex flex-col items-center">
                              <FiCheckCircle size={48} className="mb-4" />
                              <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                              <p className="text-gray-600 mb-6">We've saved your details and will alert you the moment we find a matching gift.</p>
                              <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 rounded-lg px-6 py-3 font-bold hover:bg-gray-200 transition-colors">
                                Back to Home
                              </button>
                            </div>
                          )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* --- TRACK PRICE UI --- */}
            {activeModal === 'track' && (
              <div className="p-6 md:p-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Track a Price</h2>
                
                {trackStep === 1 && (
                  <div className="space-y-6 animate-in fade-in">
                    <p className="text-gray-600 mb-6 border-b pb-6">Search for a product from our catalog to track its price drops.</p>
                    <form onSubmit={handleTrackSearch} className="flex gap-2">
                      <input type="text" placeholder="Search product name or URL..." value={trackSearchQuery} onChange={e => setTrackSearchQuery(e.target.value)} className="flex-grow px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none text-lg" required />
                      <button type="submit" disabled={trackLoading} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center min-w-[100px]">
                        {trackLoading ? <FiLoader className="animate-spin" /> : 'Search'}
                      </button>
                    </form>
                    
                    {trackSearchResults.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {trackSearchResults.map(p => (
                          <div key={p.id} onClick={() => { setTrackSelectedProduct(p); setTrackStep(2); }} className="border border-gray-200 rounded-2xl cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all">
                            <div className="pointer-events-none p-4">
                              <ProductCard product={p} />
                            </div>
                            <div className="p-4 pt-0 text-center">
                              <span className="inline-block px-4 py-2 rounded-full text-sm font-bold bg-emerald-100 text-emerald-700">
                                Select to Track
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {trackSearchResults.length === 0 && !trackLoading && trackSearchQuery && (
                        <p className="text-center text-gray-500 py-10">No products found matching your search.</p>
                    )}
                  </div>
                )}

                {trackStep === 2 && !trackSubmitted && (
                  <form onSubmit={handleTrackSubmit} className="space-y-5 animate-in fade-in">
                    <div className="mb-4">
                       <button type="button" onClick={() => setTrackStep(1)} className="text-emerald-600 font-semibold hover:underline flex items-center mb-6">
                          &larr; Back to select product
                       </button>
                       <p className="text-gray-700">Selected Product: <strong>{trackSelectedProduct?.name}</strong></p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Price Maximum (INR)</label>
                      <input type="number" required value={trackData.expectedRange} onChange={e => setTrackData({...trackData, expectedRange: e.target.value})} placeholder="e.g. 90000" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">WhatsApp Number or Email</label>
                      <input type="text" required pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^\+?[1-9]\d{1,14}$" title="Please enter a valid email address or phone number" value={trackData.contact} onChange={e => setTrackData({...trackData, contact: e.target.value})} placeholder="Where should we send the alert?" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                    </div>
                    <div className="flex flex-col gap-3">
                      <button type="submit" className="w-full bg-emerald-500 text-white font-bold text-lg py-4 rounded-xl hover:bg-emerald-600 transition-colors mt-4">
                        Start Tracking
                      </button>
                    </div>
                  </form>
                )}

                {trackSubmitted && trackStep === 2 && (
                  <div className="py-12 text-center animate-in zoom-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-500 mb-6">
                      <FiCheckCircle size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Tracking Now</h3>
                    <p className="text-gray-600 text-lg mb-8">We are keeping an eye on <strong>{trackSelectedProduct?.name}</strong>. You will be alerted via {trackData.contact}.</p>
                    <button type="button" onClick={closeModal} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
                      Back to Home
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* --- COMPARE UI --- */}
            {activeModal === 'compare' && (
              <div className="p-6 md:p-10 flex flex-col h-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">Compare Products</h2>

                {!isComparing ? (
                  <div className="flex-grow space-y-6 animate-in fade-in">
                    <form onSubmit={handleCompareSearch} className="flex gap-2">
                      <input type="text" placeholder="Search for products in our catalog..." value={compareQuery} onChange={e => setCompareQuery(e.target.value)} className="flex-grow px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-lg" required />
                      <button type="submit" disabled={compareLoading} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center min-w-[100px]">
                        {compareLoading ? <FiLoader className="animate-spin" /> : 'Search'}
                      </button>
                    </form>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex justify-between items-center">
                      <span className="font-semibold text-blue-900">Selected: {selectedToCompare.length} / 3</span>
                      <button onClick={() => setIsComparing(true)} disabled={selectedToCompare.length === 0} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition">
                        Compare Now
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                      {compareResults.map(p => {
                        const isSelected = selectedToCompare.find(sel => sel.id === p.id);
                        return (
                          <div key={p.id} onClick={() => toggleCompareSelect(p)} className={`border-2 rounded-2xl cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                            <div className="pointer-events-none p-4">
                              <ProductCard product={p} />
                            </div>
                            <div className="p-4 pt-0 text-center">
                              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                {isSelected ? 'Selected' : 'Select'}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                      {compareResults.length === 0 && !compareLoading && compareQuery && (
                        <p className="col-span-full text-center text-gray-500 py-10">No products found matching your search.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <button onClick={() => setIsComparing(false)} className="text-blue-600 font-semibold hover:underline flex items-center">
                        &larr; Back to select products
                      </button>
                      <button onClick={closeModal} className="text-gray-500 font-medium hover:text-gray-900 transition flex items-center gap-2">
                        Back to Home &times;
                      </button>
                    </div>
                    <div className="w-full pb-4">
                      {/* Desktop view */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[600px] border-collapse bg-white">
                          <thead>
                            <tr>
                              <th className="p-4 border font-bold text-left bg-gray-50 w-1/4">Features</th>
                              {selectedToCompare.map(p => (
                                <th key={p.id} className="p-4 border font-bold text-left bg-gray-50 w-1/4">
                                  {p.data?.title?.substring(0, 30)}...
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="p-4 border font-semibold text-gray-700">Image</td>
                              {selectedToCompare.map(p => (
                                 <td key={p.id} className="p-4 border align-top text-center">
                                   {p.data?.image?.url ? <img src={p.data.image.url} alt="" className="h-24 object-contain mx-auto" /> : 'No image'}
                                 </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-4 border font-semibold text-gray-700">Price</td>
                              {selectedToCompare.map(p => (
                                 <td key={p.id} className="p-4 border text-lg font-bold text-green-600">{p.data?.price || 'N/A'}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-4 border font-semibold text-gray-700">Platform</td>
                              {selectedToCompare.map(p => (
                                 <td key={p.id} className="p-4 border">{p.data?.platform || 'Amazon'}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-4 border font-semibold text-gray-700">Discount</td>
                              {selectedToCompare.map(p => (
                                 <td key={p.id} className="p-4 border">{p.data?.discount || 'None'}</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-4 border font-semibold text-gray-700">Description</td>
                              {selectedToCompare.map(p => (
                                 <td key={p.id} className="p-4 border text-sm text-gray-600">{p.data?.description?.substring(0, 100)}...</td>
                              ))}
                            </tr>
                            <tr>
                              <td className="p-4 border font-semibold text-gray-700">Action</td>
                              {selectedToCompare.map(p => (
                                 <td key={p.id} className="p-4 border">
                                   <a href={p.data?.link?.url || '#'} target="_blank" className="bg-orange-500 text-white px-4 py-2 rounded font-bold hover:bg-orange-600 block text-center">
                                     View Deal
                                   </a>
                                 </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Mobile view */}
                      <div className="md:hidden flex flex-col gap-6">
                        {selectedToCompare.map(p => (
                          <div key={p.id} className="border border-blue-200 rounded-xl bg-white shadow-sm flex flex-col overflow-hidden">
                             <div className="font-bold text-gray-900 border-b border-gray-100 p-4 bg-gray-50">{p.data?.title?.substring(0, 60)}...</div>
                             <div className="p-4 flex flex-col gap-3">
                               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                 <span className="text-sm font-semibold text-gray-500">Image</span>
                                 {p.data?.image?.url ? <img src={p.data.image.url} alt="" className="h-16 object-contain" /> : <span className="text-gray-400 text-sm">No image</span>}
                               </div>
                               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                 <span className="text-sm font-semibold text-gray-500">Price</span>
                                 <span className="font-bold text-green-600">{p.data?.price || 'N/A'}</span>
                               </div>
                               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                 <span className="text-sm font-semibold text-gray-500">Platform</span>
                                 <span className="text-gray-800 text-sm">{p.data?.platform || 'Amazon'}</span>
                               </div>
                               <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                 <span className="text-sm font-semibold text-gray-500">Discount</span>
                                 <span className="text-gray-800 text-sm">{p.data?.discount || 'None'}</span>
                               </div>
                               <div className="flex flex-col gap-1 py-2">
                                 <span className="text-sm font-semibold text-gray-500">Description</span>
                                 <span className="text-sm text-gray-700 leading-relaxed">{p.data?.description?.substring(0, 150)}...</span>
                               </div>
                             </div>
                             <div className="p-4 bg-gray-50 border-t border-gray-100">
                               <a href={p.data?.link?.url || '#'} target="_blank" className="bg-orange-500 text-white w-full py-3 rounded-lg font-bold hover:bg-orange-600 flex justify-center items-center">
                                 View Deal
                               </a>
                             </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

