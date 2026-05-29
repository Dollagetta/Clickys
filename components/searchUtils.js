import { products } from './products';
import { products as flipkartProducts } from './flipkartProducts';
import { allGuides as guides } from './guides';

export const searchAllProducts = (query) => {
  if (!query) return [];
  const q = String(query).toLowerCase();
  
  const allProds = [
    ...(products || []),
    ...(flipkartProducts || [])
  ];
  
  // Try extracting from guides as well
  if (guides && Array.isArray(guides)) {
      guides.forEach(g => {
          if (g.products && Array.isArray(g.products)) {
              allProds.push(...g.products);
          }
      });
  }

  const results = allProds.filter(p => {
    return p.name?.toLowerCase().includes(q) || 
           p.title?.toLowerCase().includes(q) || 
           p.category?.toLowerCase().includes(q);
  });

  return results.map(p => ({
     id: p.id || p.slug || Math.random().toString(),
     title: p.name || p.title || 'Unknown Product',
     price: p.price || null,
     image: p.imageUrl || p.image || null,
     link: p.amazonLink || p.flipkartLink || p.link || `/products/${p.slug || ''}`
  }));
}
