"use client";

import { useState } from 'react';
import { FiSearch, FiLoader, FiCheckCircle, FiChevronRight, FiArrowLeft, FiX, FiPlus } from 'react-icons/fi';
import { searchAllProducts } from '../components/searchUtils';

export default function ProductComparator() {
  const [step, setStep] = useState(1); 
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  
  const [compareItems, setCompareItems] = useState([null, null, null]);
  const [activeSlot, setActiveSlot] = useState(0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    
    setTimeout(() => {
      const results = searchAllProducts(query);
      setProducts(results);
      setIsSearching(false);
    }, 400);
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
    <div className={products.length > 0 || step === 2
      ? "fixed inset-0 z-[100] bg-white p-6 md:p-10 flex flex-col overflow-hidden h-[100dvh] transition-all duration-300"
      : "bg-white border shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 mx-auto h-[400px] flex flex-col relative w-full"
    } style={products.length > 0 || step === 2 ? {} : { borderColor: '#51af2a', borderWidth: '9px', borderRadius: '60px', height: '400px' }}>
      <div className="flex flex-col mb-6 shrink-0">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-orange-600">Compare</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">Side-by-side specs</p>
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        {step === 1 && (
          <div className="animate-fade-in-up flex flex-col h-full">
            <div className="flex justify-between items-center bg-gray-50 p-2 rounded-xl mb-4 gap-2 border border-gray-100">
              {[0, 1, 2].map(i => (
                <div 
                  key={i} 
                  onClick={() => setActiveSlot(i)}
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
              <form onSubmit={handleSearch} className="flex-grow shrink-0 relative mr-2">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search for Slot ${activeSlot + 1}...`}
                  className="w-full pl-9 pr-[80px] py-2 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-sm font-medium"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" size={16} />
                <button 
                  type="submit" 
                  disabled={!query.trim() || isSearching}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-[80%] px-3 bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white font-bold rounded-lg transition-all shadow-md disabled:opacity-50 text-[10px] flex items-center justify-center"
                >
                  {isSearching ? <FiLoader className="animate-spin" /> : 'Search'}
                </button>
              </form>
              {products.length > 0 && (
                <button onClick={() => { setProducts([]); setQuery(''); }} className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-2 bg-gray-50 hover:bg-red-50 rounded-xl border border-gray-100">
                  <FiX size={18} />
                </button>
              )}
            </div>

            <div className="flex-grow overflow-y-auto space-y-2 pr-1 min-h-0">
              {products.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-3 p-2 bg-white hover:bg-green-50 border-2 border-transparent hover:border-green-200 shadow-sm rounded-xl cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-lg border border-gray-100 shrink-0 flex items-center justify-center overflow-hidden">
                    {p.image ? <img src={p.image} className="max-w-full max-h-full object-contain" /> : <p className="text-xs text-gray-400 font-bold">Img</p>}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{p.title}</h4>
                    {p.price && <p className="text-[10px] font-black text-orange-600 mt-0.5">₹{p.price}</p>}
                  </div>
                </div>
              ))}
            </div>
            
            {compareItems.filter(i => i !== null).length >= 2 && (
              <button onClick={() => setStep(2)} className="mt-4 w-full bg-gradient-to-r from-green-500 to-orange-500 hover:from-green-600 hover:to-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 text-sm">
                Compare Selected
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in-up flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <button onClick={() => setStep(1)} className="text-sm font-bold flex items-center text-green-600 hover:text-orange-600 transition-colors">
                <FiArrowLeft className="mr-1" /> Back
              </button>
              <button onClick={resetSelection} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-bold transition-colors text-gray-700">
                Clear
              </button>
            </div>
            
            <div className="flex-grow overflow-x-auto hide-scrollbar border-2 border-green-100 rounded-2xl relative bg-white">
              <div className="flex w-max min-w-full divide-x-2 divide-green-50 h-full">
                {compareItems.filter(i => i !== null).map((prod, idx) => (
                  <div key={idx} className="bg-white p-4 flex flex-col w-[150px] md:w-[160px] shrink-0 h-full overflow-y-auto hide-scrollbar hover:bg-green-50/30 transition-colors">
                    <div className="h-24 w-full bg-white border border-gray-100 rounded-xl mb-4 flex items-center justify-center p-2 shrink-0 shadow-sm">
                       {prod.image ? <img src={prod.image} className="max-h-full object-contain mix-blend-multiply" /> : <p className="text-xs text-gray-400 font-bold">No Image</p>}
                    </div>
                    <h4 className="font-bold text-xs text-gray-900 mb-2 leading-snug line-clamp-3">{prod.title}</h4>
                    <p className="text-sm font-black text-orange-600 mb-4">{prod.price ? `₹${prod.price}` : 'N/A'}</p>
                    
                    <div className="mt-auto pt-4 border-t-2 border-gray-50 shrink-0">
                       <a href={prod.link || "#"} className="block w-full py-2.5 text-center bg-gray-900 text-white text-xs font-bold rounded-xl hover:bg-black hover:shadow-md transition-all">
                         View
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return content;
}
