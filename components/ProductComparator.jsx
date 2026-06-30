"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiSearch, FiLoader, FiCheckCircle, FiChevronRight, FiArrowLeft, FiX, FiPlus } from 'react-icons/fi';
import { searchAllProducts } from '../components/searchUtils';

export default function ProductComparator() {
  const [step, setStep] = useState(1); 
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  
  const [compareItems, setCompareItems] = useState([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);

  const [suggestion, setSuggestion] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);

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
        // The API returns { id, name, price, imageUrl, amazonLink, ... }
        // We map it to { id, title, price, image, link, ... } which the UI expects
        const mappedResults = (data.results || []).map(p => ({
          id: p.id || Math.random().toString(36).substr(2, 9),
          title: p.name || p.title || 'Unknown Product',
          price: p.price || null,
          image: p.imageUrl || p.image || null,
          link: p.amazonLink || p.link || '#',
          description: p.description || null
        }));
        setProducts(mappedResults);
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product) => {
    const newItems = [...compareItems];
    newItems[activeSlot] = product;
    setCompareItems(newItems);
    setQuery('');
    setProducts([]);
    
    const nextEmpty = newItems.findIndex(i => i === null);
    const filledCount = newItems.filter(i => i !== null).length;
    
    if (nextEmpty !== -1 && filledCount < 2) {
        setActiveSlot(nextEmpty);
    } else if (filledCount >= 2) {
        setStep(2);
    }
  };

  const resetSelection = () => {
    setCompareItems([null, null, null]);
    setActiveSlot(0);
    setStep(1);
    setQuery('');
    setProducts([]);
    setSuggestion('');
  };

  const removeSlot = (index) => {
    const newItems = [...compareItems];
    newItems[index] = null;
    setCompareItems(newItems);
    if (newItems.filter(i => i !== null).length < 2) {
        setStep(1);
        setActiveSlot(index);
    }
  };

  const content = (
    <div 
      onClick={!isExpanded ? () => setIsExpanded(true) : undefined}
      className={isExpanded
        ? "fixed inset-0 z-[100] bg-zinc-900/40 backdrop-blur-sm p-4 overflow-y-auto md:p-10 flex flex-col w-full h-[100dvh]"
        : "bg-white border-2 border-gray-200 hover:border-green-500 rounded-3xl shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 flex flex-col relative w-full h-full cursor-pointer"}
    >
      <div className={isExpanded ? "max-w-5xl mx-auto w-full flex flex-col bg-white rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-gray-900 relative min-h-[500px]" : "flex flex-col h-full"} >
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
            <h2 className="text-2xl font-black text-gray-900">Compare Products</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">Side-by-side specs</p>
        </div>

        <div className="flex-grow flex flex-col min-h-0">
          {step === 1 && (
            <div className="animate-fade-in-up flex flex-col h-full">
              <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl mb-4 gap-2 border border-gray-200">
                {[0, 1, 2].map(i => (
                  <div 
                    key={i} 
                    onClick={(e) => { e.stopPropagation(); setActiveSlot(i); }}
                    className={`flex flex-col items-center justify-center flex-1 p-2 rounded-xl cursor-pointer h-16 relative transition-all ${activeSlot === i ? 'bg-white shadow-md ring-2 ring-green-500' : 'bg-transparent hover:bg-white/50 border border-transparent'}`}
                  >
                    {compareItems[i] ? (
                      <>
                        <div className="text-[10px] font-bold text-gray-900 line-clamp-2 text-center leading-tight">{compareItems[i].title}</div>
                        <button onClick={(e) => {e.stopPropagation(); removeSlot(i);}} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-[3px] shadow-sm hover:!bg-red-600 transition-colors"><FiX size={10}/></button>
                      </>
                    ) : (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeSlot === i ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-400'}`}>
                         <FiPlus />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4">
                <form onSubmit={handleSearch} className="flex-grow shrink-0 relative mr-2 flex">
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Search from all products for Slot ${activeSlot + 1}...`}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm font-medium text-gray-900"
                      style={{ width: '200px' }}
                    />
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                  <button 
                    type="submit" 
                    disabled={!query.trim() || isSearching}
                    onClick={!isExpanded ? (e) => { e.stopPropagation(); setIsExpanded(true); } : undefined}
                    className="ml-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 text-sm flex items-center justify-center"
                    style={{ height: '40px', width: '80px' }}
                  >
                    {isSearching ? <FiLoader className="animate-spin" /> : 'Search'}
                  </button>
                </form>
                {products.length > 0 && (
                  <button onClick={() => { setProducts([]); setQuery(''); }} className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-3 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-200">
                    <FiX size={20} />
                  </button>
                )}
              </div>

              <div className={`flex-grow overflow-y-auto space-y-2 pr-1 min-h-[0] hide-scrollbar ${isExpanded ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max' : 'max-h-[300px]'}`}>
                {products.map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => handleSelectProduct(p)}
                    className={`flex ${isExpanded ? 'flex-col' : 'items-center'} gap-3 p-3 bg-white hover:bg-green-50 border-2 border-gray-100 hover:border-green-500 shadow-sm rounded-xl cursor-pointer transition-all group`}
                  >
                    <div className={`${isExpanded ? 'w-full h-40' : 'w-12 h-12'} bg-white rounded-lg border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden`}>
                      {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain" /> : <p className="text-xs text-gray-400 font-bold">Img</p>}
                    </div>
                    <div className={isExpanded ? 'flex flex-col' : 'flex-grow min-w-0'}>
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-green-700">{p.title}</h4>
                      {p.price && <p className="text-xs font-black text-gray-600 mt-1">{p.price}</p>}
                      {isExpanded && <button className="mt-3 bg-gray-100 hover:bg-green-100 text-gray-900 group-hover:text-green-800 w-full py-2 rounded-lg text-xs font-bold transition-colors">Add to Slot {activeSlot + 1}</button>}
                    </div>
                  </div>
                ))}
              </div>
              
              {compareItems.filter(i => i !== null).length >= 2 && (
                <button onClick={() => {
                  setStep(2);
                  const itemsToCompare = compareItems.filter(i => i !== null);
                  setIsSuggesting(true);
                  fetch('/api/expert-suggestion', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      type: 'compare',
                      prompt: `I am comparing the following products: ${JSON.stringify(itemsToCompare.map(i => ({title: i.title, link: i.link, price: i.price}))) }. Please provide a detailed comparison including pros, cons, key features, and possible alternatives if available (you can suggest 1-2 external product ideas). Recommend actual products using their exact links formatted as Markdown links. Format your response clearly in Markdown.`
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
                }} className="mt-auto pt-4 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg text-sm w-full block text-center">
                  Compare Selected
                </button>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in-up flex flex-col h-full w-full">
              <div className="flex justify-between items-center mb-6 shrink-0">
                <button onClick={() => setStep(1)} className="text-sm font-bold flex items-center text-gray-900 hover:text-green-600 transition-colors bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl">
                  <FiArrowLeft className="mr-2" /> Back
                </button>
                <button onClick={resetSelection} className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-bold transition-colors">
                  Clear All
                </button>
              </div>

              {(isSuggesting || suggestion) && isExpanded && (
                <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl max-h-64 overflow-y-auto shrink-0">
                  <h4 className="text-xs font-bold text-blue-800 mb-2 flex items-center uppercase tracking-wider">
                    Shopping Expert
                  </h4>
                  {isSuggesting ? (
                    <div className="flex items-center text-blue-600 text-sm">
                      <FiLoader className="animate-spin mr-2" /> Analyzing options...
                    </div>
                  ) : (
                    <div className="text-sm text-blue-900 leading-relaxed prose prose-sm prose-blue max-w-none">
                      {suggestion}
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex-grow w-full overflow-x-auto hide-scrollbar border border-gray-200 rounded-2xl shadow-sm bg-white relative">
                <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full table-fixed">
                  <tbody>
                    {/* Images & Title */}
                    <tr>
                      <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-600 w-24 md:w-32 border-r align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Product</th>
                      {compareItems.filter(i => i !== null).map((prod, idx) => (
                        <td key={idx} className="p-4 border-b border-r border-gray-200 align-top">
                          <div className="h-32 md:h-40 w-full bg-white rounded-xl mb-4 flex items-center justify-center p-2 relative group">
                             {prod.image ? <img src={prod.image} className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform group-hover:scale-105" /> : <p className="text-xs text-gray-400 font-bold">No Image</p>}
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 leading-snug line-clamp-3 hover:text-green-600 transition-colors" title={prod.title}>{prod.title}</h4>
                        </td>
                      ))}
                    </tr>
                    {/* Price */}
                    <tr>
                      <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-600 border-r align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Price</th>
                      {compareItems.filter(i => i !== null).map((prod, idx) => (
                        <td key={idx} className="p-4 border-b border-r border-gray-200">
                          <span className="text-lg md:text-xl font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg inline-block">
                            {prod.price ? `₹${prod.price}` : 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    {/* Description */}
                    <tr>
                      <th className="p-4 border-b border-gray-200 bg-gray-50 font-bold text-gray-600 border-r align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Features</th>
                      {compareItems.filter(i => i !== null).map((prod, idx) => (
                        <td key={idx} className="p-4 border-b border-r border-gray-200 text-sm text-gray-600 align-top">
                          {prod.description ? (
                            <div className="line-clamp-6 text-xs md:text-sm prose prose-sm" dangerouslySetInnerHTML={{ __html: prod.description }} />
                          ) : (
                            <span className="text-gray-400 italic text-xs">No description available.</span>
                          )}
                        </td>
                      ))}
                    </tr>
                    {/* Buy Link */}
                    <tr>
                      <th className="p-4 border-gray-200 bg-gray-50 font-bold text-gray-600 border-r align-middle text-center sticky left-0 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Action</th>
                      {compareItems.filter(i => i !== null).map((prod, idx) => (
                        <td key={idx} className="p-4 border-r border-gray-200">
                           <a href={prod.link || "#"} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 hover:shadow-md hover:-translate-y-0.5 transition-all">
                             View Offer <FiChevronRight className="ml-1" />
                           </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
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
