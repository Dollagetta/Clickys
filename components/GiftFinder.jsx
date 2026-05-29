"use client";

import { useState } from 'react';
import { FiSearch, FiArrowRight, FiCheckCircle, FiLoader, FiArrowLeft, FiGift } from 'react-icons/fi';
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

  const recipients = ["Him", "Her", "Kids", "Teens", "Mom", "Dad", "Colleague", "Friend"];
  const occasions = ["Birthday", "Anniversary", "Valentine's Day", "Mother's Day", "Father's Day", "Women's Day", "Wedding", "Housewarming", "Christmas", "Diwali", "Raksha Bandhan", "Other"];
  const budgets = ["Under ₹500", "₹500 - ₹2000", "₹2000 - ₹5000", "₹5000+"];

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate real search based on user inputs
    setTimeout(() => {
      const results = searchAllProducts(recipient + " " + (occasion === 'Other' ? customOccasion : occasion));
      setSearchResults(results.slice(0, 3)); // show top 3
      setIsSearching(false);
      setStep(4);
    }, 600);
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
    setStep(1);
  };

  const displayOccasion = occasion === 'Other' && customOccasion ? customOccasion : occasion;

  const content = (
    <div className={step >= 4
      ? "fixed inset-0 z-[100] bg-white p-6 md:p-10 flex flex-col overflow-hidden h-[100dvh] transition-all duration-300"
      : "bg-white border shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 mx-auto h-[400px] flex flex-col relative w-full"
    } style={step >= 4 ? {} : { borderColor: '#51af2a', borderWidth: '9px', borderRadius: '60px', height: '400px' }}>
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-green-600">Gift Finder</h2>
        <p className="text-gray-500 text-sm font-medium mt-1">Smart recommendations</p>
      </div>

      <div className="flex-grow flex flex-col" style={{ minHeight: '280px' }}>
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
              <div className="flex flex-wrap gap-2 mb-4">
                {recipients.map(r => (
                  <button
                    key={r}
                    onClick={() => setRecipient(r)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${recipient === r ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="mt-auto pt-4 text-right">
                <button
                  onClick={() => setStep(2)}
                  disabled={!recipient}
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 inline-flex items-center gap-1 shadow-md"
                  style={{ backgroundColor: '#e6650b', color: '#0f0d0d' }}
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
                <button onClick={() => setStep(1)} className="flex items-center text-orange-500 hover:text-green-600 pr-2 transition-colors text-sm font-bold"><FiArrowLeft className="mr-1" /> Back</button>
                <h3 className="text-sm font-bold text-gray-800 ml-2">What's the occasion?</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {occasions.map(o => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${occasion === o ? 'shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'}`}
                    style={occasion === o ? { height: '10px', paddingTop: '33px', paddingLeft: '22px', paddingRight: '20px', paddingBottom: '51px', fontWeight: 'bold', fontSize: '16px', color: '#060606', backgroundColor: '#f67a0d', display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
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
                      className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-sm font-medium"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-auto pt-2 text-right">
                <button
                  onClick={() => setStep(3)}
                  disabled={!occasion || (occasion === 'Other' && !customOccasion.trim())}
                  className="bg-gray-900 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:bg-black hover:-translate-y-0.5 disabled:opacity-50 inline-flex items-center gap-1 shadow-md"
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
                <button onClick={() => setStep(2)} className="flex items-center text-orange-500 hover:text-green-600 pr-2 transition-colors text-sm font-bold"><FiArrowLeft className="mr-1" /> Back</button>
                <h3 className="text-sm font-bold text-gray-800 ml-2">Price Range</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {budgets.map(b => (
                  <button
                    key={b}
                    onClick={() => setBudget(b)}
                    className={`px-2 py-2 rounded-xl text-xs font-bold transition-all ${budget === b ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-md transform scale-105' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
              <div className="mt-auto pt-4 pb-1">
                <button
                  onClick={handleSearch}
                  disabled={!budget || isSearching}
                  className="w-full bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
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
              className="flex-grow flex flex-col"
            >
              <div className="text-left mb-2">
                <button onClick={() => setStep(3)} className="text-sm font-bold text-orange-500 hover:text-green-600 flex items-center transition-colors"><FiArrowLeft className="mr-1"/> Back</button>
              </div>
              
              <div className="mb-3 text-[10px] font-bold bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full inline-block mx-auto border border-orange-100">
                {recipient} • {displayOccasion} • {budget}
              </div>
              
              <div className="flex-grow overflow-y-auto min-h-0 mb-3 space-y-2 pr-1 hide-scrollbar">
                {searchResults.length > 0 ? (
                  searchResults.map(p => (
                    <a key={p.id} href={p.link} className="flex items-center gap-3 p-2 bg-white border-2 border-gray-100 hover:border-orange-200 shadow-sm rounded-xl transition-all group">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1">
                        {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain mix-blend-multiply" /> : <FiGift className="text-gray-300" />}
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">{p.title}</h4>
                        {p.price && <p className="text-[10px] font-black text-green-600 mt-0.5">₹{p.price}</p>}
                      </div>
                    </a>
                  ))
                ) : (
                  <div className="text-center py-4">
                     <p className="text-sm font-bold text-gray-900 mb-1">No exact matches yet.</p>
                     <p className="text-xs text-gray-500">We're adding new gifts daily!</p>
                  </div>
                )}
              </div>
              
              <div className="mt-auto border-t border-gray-100 pt-3">
                  <p className="text-[10px] font-bold text-gray-500 mb-2 text-center uppercase tracking-wider">Want better recommendations?</p>
                  <form onSubmit={handleSubmitContact} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={contactMethod}
                      onChange={(e) => setContactMethod(e.target.value)}
                      placeholder="+91... or email"
                      className="w-full px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all outline-none text-xs font-medium"
                    />
                    <button 
                      type="submit" 
                      disabled={isSubmitting || !contactMethod}
                      className="bg-gray-900 hover:bg-black text-white px-4 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center text-xs font-bold shrink-0"
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
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-200">
                <FiCheckCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-600 mb-6 text-xs font-medium px-2">We'll message {contactMethod} soon with hand-picked gift ideas.</p>
              <button 
                onClick={reset}
                className="mt-2 w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm"
              >
                Find another gift
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return content;
}
