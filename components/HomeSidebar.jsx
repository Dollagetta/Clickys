"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

export default function HomeSidebar() {
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ categories: false, platform: false, discount: false, price: false });
  const toggleSection = (s) => setOpenSections(prev => ({...prev, [s]: !prev[s]}));

  const [categorySearchTerm, setCategorySearchTerm] = useState('');
  const allCategories = ['Electronics', 'Fashion', 'Kitchen', 'Health', 'Home', 'Games', 'Beauty', 'Pet Supplies', 'Automotive', 'Office'];
  const allPlatforms = ['Amazon', 'Flipkart', 'Meesho', 'Ajio', 'TataCliQ', 'JioMart', 'Firstcry', 'Zara', 'Shopsy'];
  
  const [minDiscount, setMinDiscount] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const goToProducts = (queries = {}) => {
    const params = new URLSearchParams();
    if (queries.category) params.set('q', queries.category);
    if (queries.platform) params.set('platform', queries.platform);
    router.push(`/products?${params.toString()}`);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    goToProducts({});
  };

  const renderFilters = () => (
    <>
      {/* CATEGORIES ACCORDION */}
      <div className="mb-6 border-b pb-6">
        <button 
          onClick={() => toggleSection('categories')} 
          className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
        >
          CATEGORIES
          {openSections.categories ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
        
        {openSections.categories && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="mb-3">
              <input 
                type="text" 
                placeholder="Search categories..."
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={categorySearchTerm}
                onChange={(e) => setCategorySearchTerm(e.target.value)}
              />
            </div>
            <ul className="max-h-64 overflow-y-auto pr-2 space-y-3 text-sm text-gray-800">
              {allCategories
                .filter(cat => cat.toLowerCase().includes(categorySearchTerm.toLowerCase()))
                .map((cat) => (
                <li key={cat}>
                  <label className="flex items-center cursor-pointer hover:text-orange-600 transition-colors">
                    <input
                      type="checkbox"
                      className="mr-3 w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      onChange={() => goToProducts({ category: cat })}
                    />
                    <span className="truncate text-base">{cat}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* PLATFORM ACCORDION */}
      <div className="mb-6 border-b pb-6">
        <button 
          onClick={() => toggleSection('platform')} 
          className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
        >
          PLATFORM
          {openSections.platform ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>
        
        {openSections.platform && (
          <ul className="space-y-3 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
            {allPlatforms.map(plat => (
              <li key={plat}>
                <label className="flex items-center cursor-pointer hover:text-orange-600 transition-colors">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    onChange={() => goToProducts({ platform: plat })}
                  />
                  <span className="truncate text-base">{plat}</span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* DISCOUNT ACCORDION */}
      <div className="mb-6 border-b pb-6">
        <button 
          onClick={() => toggleSection('discount')} 
          className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
        >
          DISCOUNT %
          {openSections.discount ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>

        {openSections.discount && (
          <div className="space-y-3 text-sm text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
            {[10, 20, 30, 40, 50, 60, 70, 80].map((d) => (
              <label key={d} className="flex items-center cursor-pointer hover:text-orange-600 transition-colors">
                <input
                  type="radio"
                  name="home_discount_min"
                  className="mr-3 w-4 h-4 text-orange-600 focus:ring-orange-500"
                  onChange={() => {
                    setMinDiscount(d);
                    goToProducts({});
                  }}
                />
                <span className="text-base">Min {d}% Off</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* PRICE ACCORDION */}
      <div>
        <button 
          onClick={() => toggleSection('price')} 
          className="w-full flex justify-between items-center font-bold text-gray-900 tracking-wider uppercase text-sm mb-4"
        >
          PRICE
          {openSections.price ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
        </button>

        {openSections.price && (
          <form onSubmit={handlePriceSubmit}>
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <input 
                type="number" 
                placeholder="Min" 
                value={priceRange.min} 
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                className="w-full text-base border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <span className="text-gray-400 font-bold">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={priceRange.max} 
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                className="w-full text-base border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button type="submit" className="mt-3 w-full bg-orange-500 text-white rounded-lg py-2 font-bold hover:bg-orange-600 transition-colors">
               Apply
            </button>
          </form>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Offcanvas Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
          <aside className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center p-5 border-b">
              <h2 className="text-xl font-extrabold flex items-center text-gray-900 mb-0">Filter</h2>
              <button 
                className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
                onClick={() => setIsMobileOpen(false)}
              >
                <FiChevronUp size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {renderFilters()}
            </div>
          </aside>
        </div>
      )}

      {/* Desktop static layout & Mobile Toggle Header */}
      <aside className={`w-full lg:w-72 shrink-0 bg-white border border-gray-200 p-5 lg:p-6 rounded-2xl h-max lg:sticky lg:top-24 self-start shadow-sm mb-4 lg:mb-0 ${isMobileOpen ? 'hidden lg:block' : 'block'}`}>
        <div className="flex justify-between items-center lg:mb-6 lg:pb-4 lg:border-b">
          <h2 className="text-xl lg:text-2xl font-extrabold flex items-center text-gray-900 border-none pb-0 mb-0">Filter</h2>
          <button 
            className="lg:hidden p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200"
            onClick={() => setIsMobileOpen(true)}
          >
            <FiChevronDown size={24} />
          </button>
        </div>
        
        <div className="hidden lg:block">
          {renderFilters()}
        </div>
      </aside>
    </>
  );
}
