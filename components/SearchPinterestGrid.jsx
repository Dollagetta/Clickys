"use client";

import { useSearchParams } from 'next/navigation';
import PinterestGrid from './PinterestGrid';

export default function SearchPinterestGrid({ initialItems }) {
  const searchParams = useSearchParams();
  const q = searchParams.get('q');
  const cat = searchParams.get('category');
  const discount = searchParams.get('discount');
  
  const isSearching = q || cat || (discount && discount !== '0');
  
  if (!isSearching) return null;
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <PinterestGrid initialItems={initialItems} />
    </div>
  );
}
