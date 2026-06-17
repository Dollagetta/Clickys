"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Bookmark, ExternalLink, Share2, X, Play, Pause, Eye } from 'lucide-react';

export default function PinterestGrid() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  // Placeholder data for the masonry grid
  const items = useMemo(() => [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1080',
      title: 'Vibrant Pulse Sneakers',
      description: 'Step into comfort with these lightweight running shoes. Engineered for performance and style, perfect for both gym sessions and casual street style.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=1080',
      title: 'Heritage Denim Jacket',
      description: 'A classic silhouette that never goes out of style. This premium denim jacket offers a relaxed fit and durable construction for years of wear.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1080',
      title: 'Pro ANC Wireless Headphones',
      description: 'Experience pure sound with advanced active noise cancellation technology. 40-hour battery life ensures your music never stops.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 4,
          image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1080',
      title: 'Luxury Leather Handbag',
      description: 'Elegant and spacious, this handcrafted leather bag is designed for the modern woman. Featuring gold-tone hardware and multiple compartments.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?q=80&w=1080',
      title: 'Glow Reveal Facial Serum',
      description: 'Transform your skin with our vitamin-rich serum. Formulated to brighten, hydrate, and reduce fine lines for a youthful complexion.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1080',
      title: 'Elite Health Smartwatch',
      description: 'The ultimate wellness companion. Track your sleep, heart rate, and workouts with high precision. Stay connected with smart notifications.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[2/3]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1080',
      title: 'Smart Audio Hub',
      description: 'Crystal clear sound meets intelligent voice control. Manage your smart home or enjoy your favorite podcasts with ease.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1080',
      title: 'Nordic Minimalist Watch',
      description: 'Sophisticated and understated. This minimalist watch features a genuine leather strap and a clean sapphire crystal dial.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1610824352934-c10d87b700cc?q=80&w=1080',
      title: 'Artisan Espresso Station',
      description: 'Unleash your inner barista. This semi-automatic machine delivers the perfect crema and rich flavor for your daily caffeine ritual.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1080',
      title: 'Ultra-Light Training Shoes',
      description: 'Breatheable mesh and responsive cushioning make these the ideal choice for long runs or high-intensity interval training.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=1080',
      title: 'Ceramic Pour Over Kit',
      description: 'Artisan ceramic coffee dripper set for the slow coffee movement. Includes everything you need for the perfect manual brew.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1080',
      title: 'Rugged Bluetooth Speaker',
      description: 'Take the party anywhere. Dustproof and waterproof with a heavy-duty battery that provides up to 24 hours of loud, clear audio.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[3/2]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1522314619421-4f1642875f56?q=80&w=1080',
      title: 'Luxe Velvet Armchair',
      description: 'Add a touch of regality to your living room. This plush velvet armchair combines comfort with mid-century modern design.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[2/3]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1080',
      title: 'Urban Explorer Boots',
      description: 'Durable construction meets city style. These boots feature a water-resistant exterior and high-traction rubber soles for any weather.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1080',
      title: 'Structured Tote Bag',
      description: 'The perfect work-to-weekend companion. Fits a 13-inch laptop and all your essentials with a sleek, structured profile.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1080',
      title: 'Retro Film Camera',
      description: 'Rediscover the art of photography. This manual SLR camera offers authentic grain and beautiful depth of field for timeless shots.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 17,
      image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1080',
      title: 'Modern Coffee Table',
      description: 'A centerpiece for your lounge. Crafted from solid oak with a minimalist glass top, it blends seamlessly with any decor.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 18,
      image: 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?q=80&w=1080',
      title: 'Sustainable Cork Backpack',
      description: 'Eco-friendly and durable. This uniquely textured bag is made from natural cork, providing a water-resistant and vegan alternative.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[2/3]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 19,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1080',
      title: 'Morning Brew Ritual Bean',
      description: 'Elevate your mornings with our premium single-origin coffee beans. Perfectly roasted to bring out notes of chocolate and caramel.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 20,
      image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1080',
      title: 'Noise Isolating Buds',
      description: 'Feather-light and powerful. Enjoy studio-quality sound in a tiny package. Includes three sizes of silicone tips for the perfect fit.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-square',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 21,
      image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1080',
      title: 'Cedarwood Scented Candle',
      description: 'Fill your home with the calming scent of the forest. Hand-poured soy wax with a wood wick that crackles as it burns.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 22,
      image: 'https://images.unsplash.com/photo-1531234799389-dcb7651eb0a2?q=80&w=1080',
      title: 'Polished Aviator Shades',
      description: 'Protect your eyes with style. These classic aviators feature polarized lenses and a lightweight titanium frame.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 23,
      image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1080',
      title: 'Canvas Wall Art Set',
      description: 'A triptych of abstract prints to liven up your space. Printed on museum-grade canvas with fade-resistant inks.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[3/2]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 24,
      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1080',
      title: 'Cotton Crewneck Tee',
      description: 'The definitive basic. Our 100% organic cotton t-shirt offers a soft feel and a perfect fit that stays true after every wash.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 25,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1080',
      title: 'Smart LED Desk Lamp',
      description: 'Tailor your light to your task. Features multiple color temperatures and brightness levels with a built-in wireless phone charger.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 26,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1080',
      title: 'Leather Portfolio Case',
      description: 'Organize your professional life. Premium leather folder with slots for your tablet, cards, and a notebook.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 27,
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1080',
      title: 'Wool Blend Pea Coat',
      description: 'Brace the cold with elegance. This heavy-duty wool coat features a double-breasted design and deep warmed pockets.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[2/3]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 28,
      image: 'https://images.unsplash.com/photo-1507764923504-cd90bf7da772?q=80&w=1080',
      title: 'Slim Fit Chinos',
      description: 'Versatile pants for any occasion. Made with a hint of stretch for movement and a sharp, tapered profile.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 29,
      image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1080',
      title: 'Luxury Watch Winder',
      description: 'Protect your timepieces. This silent motor winder keeps your automatic watches synchronized and ready to wear.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 30,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1080',
      title: 'Vertical Laptop Stand',
      description: 'Maximize your desk space. This sleek aluminum stand holds your laptop securely in a vertical position for better airflow.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 31,
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1080',
      title: 'VR Immersion Headset',
      description: 'Enter new worlds. High-resolution screens and spatial audio deliver a truly immersive virtual reality experience.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[3/2]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 32,
      image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1080',
      title: 'Breathable Knit Trainers',
      description: 'Light as air. These multi-color knit sneakers provide a sock-like fit and incredible energy return with every step.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 33,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1080',
      title: 'Gold Trim Sunglasses',
      description: 'Make a statement. These oversized frames with gold accents offer full UV protection and high-fashion flair.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 34,
      image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=1080',
      title: 'Retro Portable Radio',
      description: 'Vintage aesthetics meet modern connectivity. This AM/FM radio also functions as a high-quality Bluetooth speaker.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 35,
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1080',
      title: 'Dimmable Ring Light',
      description: 'Level up your content. This 10-inch ring light offers three light colors and ten brightness levels for perfect lighting.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-square',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 36,
      image: 'https://images.unsplash.com/photo-1594932224491-9941966bba7a?q=80&w=1080',
      title: 'Velvet Evening Blazer',
      description: 'Dazzle at your next event. This slim-cut velvet blazer features a satin lapel and a tailored fit for a sharp, sophisticated look.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[2/3]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 37,
      image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1080',
      title: 'Graphic Print Hoodie',
      description: 'Streetwear essentials. This oversized hoodie features a bold artistic print and extra-thick fleece for maximum cozy vibes.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 38,
      image: 'https://images.unsplash.com/photo-1517191434949-5e90cd67d2b6?q=80&w=1080',
      title: 'Handled Ceramic Mug',
      description: 'The perfect grip for your tea or coffee. Hand-glazed ceramic with an ergonomic handle and a rustic, textured finish.',
      site: 'via Myntra',
      aspectRatio: 'aspect-square',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 39,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1080',
      title: 'Performance Tracksuit',
      description: 'Move freely. This two-piece set is made from moisture-wicking fabric that keeps you dry and flexible during workouts.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 40,
      image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=1080',
      title: 'Pocket Sized Projector',
      description: 'Cinema in your pocket. This miniature projector connects to your phone and displays up to 100 inches of crisp video.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[16/9]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 41,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1080',
      title: 'Electric Hybrid Bicycle',
      description: 'Commute smarter. This lightweight E-bike offers pedal assist up to 25km/h and a range of 50km on a single charge.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[3/2]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 42,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1080',
      title: 'Quilted Puffer Vest',
      description: 'Layer up for the outdoors. This water-repellent vest features recycled insulation and a packable design for easy travel.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 43,
      image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=1080',
      title: 'Suede Chelsea Boots',
      description: 'Modern classics. These premium suede boots feature flexible side gores and a pull tab for easy wear, finished with a sleek crepe sole.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[4/5]',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 44,
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1080',
      title: 'Curved Gaming Monitor',
      description: 'Total immersion. 144Hz refresh rate and a 1ms response time ensure smooth gameplay on a stunning QHD curved panel.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[16/9]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 45,
      image: 'https://images.unsplash.com/photo-1616489953149-805e2634e9e0?q=80&w=1080',
      title: 'Geometric Area Rug',
      description: 'Refresh your floor space. This high-pile rug features a bold monochrome pattern that adds character to any modern room.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 46,
      image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1080',
      title: 'Professional Pet Groomer',
      description: 'Salon quality at home. This quiet-motor clipper set includes multiple attachments for grooming all coat types and lengths.',
      site: 'via Myntra',
      aspectRatio: 'aspect-square',
      link: 'https://myntr.it/CXgM9Oa'
    },
    {
      id: 47,
      image: 'https://images.unsplash.com/photo-1620003263720-95b45a6035d5?q=80&w=1080',
      title: 'Smart Garden Starter Kit',
      description: 'Grow your own herbs indoor. This self-watering hydroponic system includes LED grow lights to ensure your plants thrive all year.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[3/4]',
      link: 'https://fktr.in/8mAf4Vj'
    },
    {
      id: 48,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1080',
      title: 'Polarized Wayfarer Shades',
      description: 'An icon for a reason. These classic wayfarer frames offer timeless appeal with modern polarized lens technology for clear vision.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/2]',
      link: 'https://ajiio.in/ypU93JC'
    },
    {
      id: 49,
      image: 'https://images.unsplash.com/photo-1621339019692-06941837542d?q=80&w=1080',
      title: 'Foldable Drone Pro Plus',
      description: 'See the world from above. 4K camera with GPS auto-return and 30 minutes of flight time. Compact enough to take on any adventure.',
      site: 'via Amazon',
      aspectRatio: 'aspect-[4/3]',
      link: 'https://www.amazon.in/shop/clickyse'
    },
    {
      id: 50,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1080',
      title: 'Studio Pro Headphones',
      description: 'Flat response for accurate mixing. These headphones are the industry standard for music production and professional monitoring.',
      site: 'via Myntra',
      aspectRatio: 'aspect-square',
      link: 'https://myntr.it/CXgM9Oa'
    }
  ], []);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.title.toLowerCase().includes(searchQuery) || 
      item.description.toLowerCase().includes(searchQuery)
    );
  }, [items, searchQuery]);

  // If search query is present but no items match, we could show a message
  // For now, let's just render the filtered list.

  return (
    <section className="py-16 mx-4 md:mx-auto max-w-7xl" id="inspiration-grid">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Trending Inspiration'}
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {searchQuery ? `Found ${filteredItems.length} styles matching your search.` : 'Discover the latest styles and curated looks from top retailers.'}
        </p>
      </div>
      
      {/* Masonry Grid Container */}
      <div className="columns-2 sm:columns-2 lg:columns-3 xl:columns-4 gap-3 md:gap-6 space-y-3 md:space-y-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-xl md:rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer" onClick={() => setSelectedItem(item)}>
            
            {/* Media Container */}
            <div className={`relative w-full ${item.aspectRatio} overflow-hidden bg-gray-50`}>
              {item.type === 'video' ? (
                <div className="relative w-full h-full group/video-container">
                  <video 
                    src={item.videoSrc}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    muted
                    playsInline
                    loop
                    onClick={(e) => {
                      e.stopPropagation();
                      const video = e.currentTarget;
                      if (video.paused) video.play();
                      else video.pause();
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = e.currentTarget.closest('div').querySelector('video');
                        if (video.paused) video.play();
                        else video.pause();
                      }}
                      className="bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition-all transform hover:scale-110"
                    >
                      <Play className="w-6 h-6 fill-current" />
                    </button>
                  </div>
                </div>
              ) : (
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
              )}
              
              {/* Site Badge overlay */}
              <div className="absolute top-2 md:top-4 left-2 md:left-4 bg-white/95 backdrop-blur-md px-2 md:px-3 py-0.5 md:py-1 rounded-full shadow-sm text-[10px] md:text-xs font-bold text-gray-800 z-10 flex items-center gap-1 uppercase">
                {item.site.replace('via ', '')}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-3 md:p-4 flex flex-col bg-white">
              <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-1 mb-3">
                {item.title}
              </h3>

              {/* Persistent Actions */}
              <div className="flex items-center justify-between gap-2">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                 >
                   <Eye className="w-3 h-3 md:w-3.5 h-3.5" />
                   Review
                 </button>
                 <a 
                  href={item.link} 
                  onClick={(e) => e.stopPropagation()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  Shop Now <ExternalLink className="w-3 h-3 md:w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>
      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-500 font-medium">No results found for "{searchQuery}"</p>
          <button 
            onClick={() => window.history.pushState({}, '', '/')} 
            className="mt-4 text-orange-600 font-bold hover:underline"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedItem(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute top-4 right-4 z-20 bg-white/80 backdrop-blur disabled:opacity-50 hover:bg-white p-2 rounded-full shadow-sm"
              onClick={() => setSelectedItem(null)}
            >
              <X className="w-5 h-5 text-gray-900" />
            </button>
            
            {/* Visual Side */}
            <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-[500px] flex items-center justify-center group/modal-video">
              {selectedItem.type === 'video' ? (
                <div className="relative w-full h-full">
                  <video 
                    ref={videoRef}
                    src={selectedItem.videoSrc}
                    className="w-full object-cover h-full"
                    muted
                    playsInline
                    loop
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/modal-video:opacity-100 transition-opacity bg-black/20">
                    <button 
                      onClick={() => {
                        if (videoRef.current) {
                          if (videoRef.current.paused) {
                            videoRef.current.play();
                            setIsPaused(false);
                          } else {
                            videoRef.current.pause();
                            setIsPaused(true);
                          }
                        }
                      }}
                      className="p-4 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition-all transform hover:scale-110"
                    >
                      {isPaused ? <Play className="w-8 h-8 fill-current" /> : <Pause className="w-8 h-8 fill-current" />}
                    </button>
                  </div>
                </div>
              ) : (
                <Image 
                  src={selectedItem.image} 
                  alt={selectedItem.title} 
                  fill 
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <span className="bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                  {selectedItem.site}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="p-2 bg-red-50 hover:bg-red-100 rounded-full transition-colors text-red-600">
                    <Bookmark className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{selectedItem.title}</h2>
              <div className="text-gray-600 mb-8 leading-relaxed">
                <p>{selectedItem.description || "No description available for this item."}</p>
                <div className="mt-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-sm text-orange-800 font-medium italic">
                    "Find this and more curated styles on my official curator page. Handpicked quality products for you."
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-gray-100">
                <a 
                  href={selectedItem.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full block text-center bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Visit Site <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
