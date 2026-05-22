"use client";

import { useState } from 'react';
import { FiSearch, FiLoader, FiCheckCircle, FiChevronRight, FiLayers, FiX } from 'react-icons/fi';

export default function ProductComparator() {
  const [step, setStep] = useState(1); // 1: Select slot 1, 2: Select slot 2, 3: Compare
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [products, setProducts] = useState([]);
  
  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);
  
  const [activeSlot, setActiveSlot] = useState(1); // which product slot we are currently picking

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/internal-products?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (product) => {
    if (activeSlot === 1) {
      setProduct1(product);
      setQuery('');
      setProducts([]);
      setActiveSlot(2);
    } else {
      setProduct2(product);
      setQuery('');
      setProducts([]);
      setStep(3); // go to comparison
    }
  };

  const resetSelection = () => {
    setProduct1(null);
    setProduct2(null);
    setActiveSlot(1);
    setStep(1);
    setQuery('');
    setProducts([]);
  };

  return (
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-xl overflow-hidden p-6 md:p-8 max-w-4xl mx-auto min-h-[400px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
          <FiLayers size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Comparison</h2>
          <p className="text-gray-500 text-sm">Select two products to compare side-by-side.</p>
        </div>
      </div>

      {step < 3 && (
        <div className="animate-fade-in-up">
          {/* Selected Slots Header */}
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-6">
            <div className={`flex flex-col items-center flex-1 p-2 rounded-lg ${activeSlot === 1 ? 'bg-white shadow-sm ring-2 ring-orange-500' : 'opacity-70'}`}>
              <span className="text-xs font-bold text-gray-400 mb-1">PRODUCT 1</span>
              {product1 ? (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1 truncate w-32">{product1.title}</div>
                  <button onClick={() => {setProduct1(null); setActiveSlot(1);}} className="text-xs text-orange-500 hover:underline mt-1">Change</button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Waiting...</span>
              )}
            </div>
            
            <div className="px-4 text-gray-400 font-bold text-lg">VS</div>
            
            <div className={`flex flex-col items-center flex-1 p-2 rounded-lg ${activeSlot === 2 ? 'bg-white shadow-sm ring-2 ring-orange-500' : 'opacity-70'}`}>
              <span className="text-xs font-bold text-gray-400 mb-1">PRODUCT 2</span>
              {product2 ? (
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900 line-clamp-1 truncate w-32">{product2.title}</div>
                  <button onClick={() => {setProduct2(null); setActiveSlot(2);}} className="text-xs text-orange-500 hover:underline mt-1">Change</button>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Waiting...</span>
              )}
            </div>
          </div>

          {/* Search Area for Active Slot */}
          <form onSubmit={handleSearch} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for Product {activeSlot}:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. Samsung Galaxy..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all outline-none"
                />
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
              <button 
                type="submit" 
                disabled={!query.trim() || isSearching}
                className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {isSearching ? <FiLoader className="animate-spin" /> : 'Search'}
              </button>
            </div>
          </form>

          {/* Results List */}
          {products.length > 0 && (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 border-t border-gray-100 pt-4">
               {products.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handleSelectProduct(p)}
                  className="flex items-center gap-4 p-3 bg-white hover:bg-orange-50 border border-gray-200 rounded-xl cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded flex-shrink-0 flex items-center justify-center">
                    {p.image ? (
                      <img src={p.image} alt={p.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <FiSearch className="text-gray-300" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{p.title}</h4>
                    {p.price && <p className="text-xs font-bold text-gray-600 mt-1">₹{p.price}</p>}
                  </div>
                  <div className="text-gray-400 group-hover:text-orange-500 pr-2">
                    <FiCheckCircle />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {step === 3 && product1 && product2 && (
        <div className="animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Comparison Result</h3>
            <button onClick={resetSelection} className="text-sm bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition-colors text-gray-700">
              Start new comparison
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Product 1 Col */}
            <div className="bg-white p-6 border-r border-gray-200 flex flex-col">
              <div className="h-40 w-full bg-gray-50 rounded-xl mb-4 flex items-center justify-center p-2">
                 {product1.image ? <img src={product1.image} alt={product1.title} className="max-h-full object-contain" /> : <FiSearch className="text-gray-300 text-3xl" />}
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">{product1.title}</h4>
              <p className="text-2xl font-black text-orange-600 mb-4">{product1.price ? `₹${product1.price}` : 'Price not set'}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                 <a href={product1.link} className="block w-full py-3 text-center bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                   View Detail
                 </a>
              </div>
            </div>
            
            {/* Product 2 Col */}
            <div className="bg-white p-6 flex flex-col">
              <div className="h-40 w-full bg-gray-50 rounded-xl mb-4 flex items-center justify-center p-2">
                 {product2.image ? <img src={product2.image} alt={product2.title} className="max-h-full object-contain" /> : <FiSearch className="text-gray-300 text-3xl" />}
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">{product2.title}</h4>
              <p className="text-2xl font-black text-orange-600 mb-4">{product2.price ? `₹${product2.price}` : 'Price not set'}</p>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                 <a href={product2.link} className="block w-full py-3 text-center bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors">
                   View Detail
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
