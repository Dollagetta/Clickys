import { products } from './products';
import { products as flipkartProducts } from './flipkartProducts';
import { allGuides as guides } from './guides';

export const searchAllProducts = (query) => {
  if (!query) return [];
  const rawQ = String(query).toLowerCase().trim();
  
  const allProds = [
    ...(products || []),
    ...(flipkartProducts || [])
  ];
  
  if (guides && Array.isArray(guides)) {
      guides.forEach(g => {
          if (g.products && Array.isArray(g.products)) {
              allProds.push(...g.products);
          }
      });
  }

  // Remove trailing s/es and split spaces
  const terms = rawQ.split(/\s+/).filter(t => t.length > 0).map(t => {
    let clean = t;
    if (clean.length > 3 && clean.endsWith('ies')) clean = clean.slice(0, -3) + 'y';
    else if (clean.length > 3 && clean.endsWith('s')) clean = clean.slice(0, -1);
    return clean;
  });

  const results = allProds.filter(p => {
    const searchableText = `${p.name || ''} ${p.title || ''} ${p.category || ''} ${p.description || ''} ${p.brand || ''} ${p.about || ''} ${(p.tags || []).join(' ')}`.toLowerCase();
    
    // Check if every term in the search is found in the searchable text
    return terms.every(t => searchableText.includes(t));
  });

  return results.map((p, idx) => ({
     id: p.id || p.slug || `prod-${idx}-${Math.random().toString(36).substring(7)}`,
     title: p.name || p.title || 'Unknown Product',
     price: p.price || p.oldPrice || null,
     image: p.imageUrl || p.image || null,
     link: p.amazonLink || p.flipkartLink || p.link || `/products/${p.slug || ''}`,
     internalLink: p.slug ? `/products/${p.slug}` : (p.link || '#')
  }));
}
