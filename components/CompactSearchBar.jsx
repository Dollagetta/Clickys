'use client';
import { useState, useEffect } from 'react';
import { FiSearch, FiArrowLeft } from 'react-icons/fi';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../styles/CompactSearchBar.module.css';

export default function CompactSearchBar() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [discount, setDiscount] = useState('0');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isSearching = searchParams.has('q') || (searchParams.has('category') && searchParams.get('category') !== 'All') || (searchParams.has('discount') && searchParams.get('discount') !== '0');

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
    setCategory(searchParams.get('category') || 'All');
    setDiscount(searchParams.get('discount') || '0');
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    let url = `/?q=${encodeURIComponent(query)}`;
    if (category !== 'All') {
      url += `&category=${encodeURIComponent(category)}`;
    }
    if (discount !== '0') {
      url += `&discount=${encodeURIComponent(discount)}`;
    }
    router.push(url);
  };

  const handleBack = () => {
    setQuery('');
    setCategory('All');
    setDiscount('0');
    router.push('/');
  };

  return (
    <div className={styles.searchContainer}>
      <form className={styles.searchForm} onSubmit={handleSearch}>
        {isSearching ? (
          <button 
            type="button" 
            onClick={handleBack} 
            className="p-2 mr-1 hover:bg-gray-100 rounded-full transition-colors group flex items-center justify-center"
            title="Back to Home"
          >
            <FiArrowLeft className="text-orange-500 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
        ) : (
          <FiSearch className={styles.searchIcon} />
        )}
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..." 
          className={styles.searchInput}
        />
        <div className={styles.selectWrapper}>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className={styles.categorySelect}
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Health">Health</option>
            <option value="Home">Home</option>
          </select>
        </div>
        <div className={styles.selectWrapper}>
          <select 
            value={discount} 
            onChange={(e) => setDiscount(e.target.value)}
            className={styles.categorySelect}
            style={{ maxWidth: '100px' }}
          >
            <option value="0">Discounts</option>
            <option value="10">10%+ Off</option>
            <option value="20">20%+ Off</option>
            <option value="30">30%+ Off</option>
            <option value="50">50%+ Off</option>
          </select>
        </div>
        <button type="submit" className={styles.searchButton}>Search</button>
      </form>
    </div>
  );
}
