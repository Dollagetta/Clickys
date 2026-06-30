"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiArrowRight, FiCheckCircle, FiLoader, FiArrowLeft, FiGift, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { searchAllProducts } from '../components/searchUtils';

export default function GiftFinder() {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [occasion, setOccasion] = useState('');
  const [customOccasion, setCustomOccasion] = useState('');
  const [budget, setBudget] = useState('');
  
  const [contactMethod, setContactMethod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const recipients = ["Him", "Her", "Kids", "Teens", "Mom", "Dad", "Colleague", "Friend"];
  const occasions = ["Birthday", "Anniversary", "Valentine's Day", "Mother's Day", "Father's Day", "Women's Day", "Wedding", "Housewarming", "Christmas", "Diwali", "Raksha Bandhan", "Other"];
  const budgets = ["Under ₹500", "₹500 - ₹2000", "₹2000 - ₹5000", "₹5000+"];

  const displayOccasion = occasion === 'Other' && customOccasion ? customOccasion : occasion;

  const handleSearch = async () => {
    setIsSearching(true);
    setSuggestion('');
    
    try {
      // We do a broad search to get a pool of products, 
      // since strict text matching for "Mom Birthday" usually yields 0 results.
      const res = await fetch(`/api/global-search`);
      
      let data = { results: [] };
      if (res.ok) {
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
           data = await res.json();
        } else {
           console.warn("Received HTML instead of JSON from server");
        }
      } else {
        console.warn(`Search failed with status: ${res.status}`);
      }

      let mappedResults = (data.results || []).map(p => ({
        id: p.id || Math.random().toString(36).substr(2, 9),
        title: p.name || p.title || 'Unknown Product',
        price: p.price || null,
        image: p.imageUrl || p.image || null,
        link: p.amazonLink || p.link || '#'
      }));

      // Filter by Budget
      if (budget) {
        mappedResults = mappedResults.filter(p => {
          if (!p.price) return true;
          const numericPrice = parseInt(String(p.price).replace(/[^0-9]/g, ''), 10);
          if (isNaN(numericPrice)) return true;

          if (budget === "Under ₹500") return numericPrice < 500;
          if (budget === "₹500 - ₹2000") return numericPrice >= 500 && numericPrice <= 2000;
          if (budget === "₹2000 - ₹5000") return numericPrice >= 2000 && numericPrice <= 5000;
          if (budget === "₹5000+") return numericPrice >= 5000;
          return true;
        });
      }

      // Further local heuristic: try to match recipient/occasion text if possible, else just use the pool
      const searchTerm = (recipient + " " + (occasion === 'Other' ? customOccasion : occasion)).toLowerCase();
      const terms = searchTerm.split(/\s+/).filter(Boolean);
      
      let scoredResults = mappedResults.map(p => {
        let score = 0;
        const textToSearch = `${p.title} ${p.category} ${p.description}`.toLowerCase();
        for (const term of terms) {
          if (textToSearch.includes(term)) score += 1;
        }
        return { ...p, _score: score };
      });

      // Sort by score (closest matches first), then shuffle a bit among top scores to add variety
      scoredResults.sort((a, b) => b._score - a._score);
      
      // Take top 20, then shuffle and pick 5
      let topResults = scoredResults.slice(0, 20);
      topResults = topResults.sort(() => 0.5 - Math.random());

      const finalResults = topResults.slice(0, 5);
      setSearchResults(finalResults);

      // Fetch Expert Suggestion
      setIsSuggesting(true);
      fetch('/api/expert-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'gift',
          prompt: `I am looking for a gift for ${recipient} for ${displayOccasion} under ${budget}. I found these options: ${finalResults.map(r => r.title).join(', ')}. What do you think?`
        })
      })
      .then(r => r.json())
      .then(d => {
        setSuggestion(d.suggestion);
        setIsSuggesting(false);
      })
      .catch(e => {
        console.error(e);
        setIsSuggesting(false);
      });

    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
      setStep(4);
    }
  };

  const validateContact = (contact) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+[1-9]\d{10,14}$/;
    return emailRegex.test(contact) || phoneRegex.test(contact);
  };

  const handleSubmitContact = (e) => {
    e.preventDefault();
    if (!validateContact(contactMethod)) {
      alert("Please enter a valid email address or a WhatsApp number with country code (e.g., +919876543210).");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(5);
    }, 1000);
  };

  const reset = () => {
    setRecipient('');
    setOccasion('');
    setCustomOccasion('');
    setBudget('');
    setContactMethod('');
    setSuggestion('');
    setStep(1);
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
        
        <div className="flex flex-col mb-6">
          <h2 className="text-2xl font-black text-gray-900">Gift Finder</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Smart recommendations</p>
        </div>

        <div className="flex-grow flex flex-col min-h-0">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-grow flex flex-col"
              >
                <h3 className="text-sm font-bold text-gray-800 mb-3">Who is the gift for?</h3>
                <div className="flex flex-wrap gap-2 mb-4 overflow-y-auto hide-scrollbar max-h-[300px]">
                  {recipients.map(r => (
                    <button
                      key={r}
                      onClick={(e) => { e.stopPropagation(); setRecipient(r); setIsExpanded(true); }}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${recipient === r ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-orange-500 hover:bg-orange-50'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <div className="mt-auto pt-4 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(true); setStep(2); }}
                    disabled={!recipient}
                    className="bg-gray-900 text-white hover:bg-gray-800 px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 inline-flex items-center gap-1 shadow-md"
                  >
                    Next <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-grow flex flex-col"
              >
                <div className="flex items-center mb-3">
                  <button onClick={() => setStep(1)} className="flex items-center text-gray-900 hover:text-orange-600 pr-2 transition-colors text-sm font-bold"><FiArrowLeft className="mr-1" /> Back</button>
                  <h3 className="text-sm font-bold text-gray-800 ml-2">What's the occasion?</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4 overflow-y-auto hide-scrollbar max-h-[300px]">
                  {occasions.map(o => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${occasion === o ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-orange-500 hover:bg-orange-50'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                  {occasion === 'Other' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-4"
                    >
                      <input
                        type="text"
                        value={customOccasion}
                        onChange={(e) => setCustomOccasion(e.target.value)}
                        placeholder="Enter specific reason..."
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium text-gray-900"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-auto pt-2 text-right">
                  <button
                    onClick={() => setStep(3)}
                    disabled={!occasion || (occasion === 'Other' && !customOccasion.trim())}
                    className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all hover:bg-gray-800 disabled:opacity-50 inline-flex items-center gap-1 shadow-md"
                  >
                    Next <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-grow flex flex-col"
              >
                <div className="flex items-center mb-3">
                  <button onClick={() => setStep(2)} className="flex items-center text-gray-900 hover:text-orange-600 pr-2 transition-colors text-sm font-bold"><FiArrowLeft className="mr-1" /> Back</button>
                  <h3 className="text-sm font-bold text-gray-800 ml-2">Price Range</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {budgets.map(b => (
                    <button
                      key={b}
                      onClick={() => setBudget(b)}
                      className={`px-3 py-3 rounded-xl text-sm font-bold transition-all ${budget === b ? 'bg-orange-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-orange-500 hover:bg-orange-50'}`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <div className="mt-auto pt-4 pb-1">
                  <button
                    onClick={handleSearch}
                    disabled={!budget || isSearching}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                  >
                    {isSearching ? <FiLoader className="animate-spin" /> : <>Find Gifts <FiSearch /></>}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-grow flex flex-col h-full"
              >
                <div className="text-left mb-2 flex items-center justify-between">
                  <button onClick={() => setStep(3)} className="text-sm font-bold text-gray-900 hover:text-orange-600 flex items-center transition-colors"><FiArrowLeft className="mr-1"/> Back</button>
                  <div className="text-[10px] font-bold bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full inline-block border border-orange-100">
                    {recipient} • {displayOccasion} • {budget}
                  </div>
                </div>

                {/* Expert Suggestion */}
                {(isSuggesting || suggestion) && isExpanded && (
                  <div className="mb-4 bg-blue-50 border border-blue-100 p-4 rounded-xl">
                    <h4 className="text-xs font-bold text-blue-800 mb-2 flex items-center uppercase tracking-wider">
                      Shopping Expert
                    </h4>
                    {isSuggesting ? (
                      <div className="flex items-center text-blue-600 text-sm">
                        <FiLoader className="animate-spin mr-2" /> Thinking of a suggestion...
                      </div>
                    ) : (
                      <p className="text-sm text-blue-900 leading-relaxed">{suggestion}</p>
                    )}
                  </div>
                )}
                
                <div className={`flex-grow overflow-y-auto min-h-0 mb-3 pr-1 hide-scrollbar max-h-[400px] p-1 ${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max' : 'space-y-2'}`}>
                  {searchResults.length > 0 ? (
                    searchResults.map(p => (
                      <a key={p.id} href={p.link} className={`flex ${isExpanded ? 'flex-col' : 'items-center'} gap-3 p-3 bg-white border-2 border-gray-100 hover:border-orange-500 shadow-sm rounded-xl transition-all group`}>
                        <div className={`${isExpanded ? 'w-full h-40' : 'w-12 h-12'} bg-white rounded-lg border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden`}>
                          {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain" /> : <FiGift className="text-gray-300" />}
                        </div>
                        <div className={isExpanded ? 'flex flex-col' : 'flex-grow min-w-0'}>
                          <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">{p.title}</h4>
                          {p.price && <p className="text-xs font-black text-gray-600 mt-1">{p.price}</p>}
                          {isExpanded && <button className="mt-3 bg-gray-900 group-hover:bg-orange-500 text-white w-full py-2 rounded-lg text-xs font-bold transition-colors">View Product</button>}
                        </div>
                      </a>
                    ))
                  ) : (
                    <div className="text-center py-8 col-span-full">
                       <p className="text-sm font-bold text-gray-900 mb-1">No exact matches yet.</p>
                       <p className="text-xs text-gray-500">We're adding new gifts daily!</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-auto pt-4 shrink-0">
                    <p className="text-[10px] font-bold text-gray-500 mb-2 text-center uppercase tracking-wider">Want better recommendations?</p>
                    <form onSubmit={handleSubmitContact} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={contactMethod}
                        onChange={(e) => setContactMethod(e.target.value)}
                        placeholder="+91... or email"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium text-gray-900"
                      />
                      <button 
                        type="submit" 
                        disabled={isSubmitting || !contactMethod}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center text-sm font-bold shrink-0"
                      >
                        {isSubmitting ? <FiLoader className="animate-spin" /> : 'Notify'} 
                      </button>
                    </form>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-grow flex flex-col justify-center text-center"
              >
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-200">
                  <FiCheckCircle size={32} />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Request Sent!</h3>
                <p className="text-gray-600 mb-6 text-sm font-medium px-2">We'll message {contactMethod} soon with hand-picked gift ideas.</p>
                <button 
                  onClick={reset}
                  className="mt-2 w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-md text-sm"
                >
                  Find another gift
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  if (isExpanded && mounted) {
    return createPortal(content, document.body);
  }

  return content;
}
