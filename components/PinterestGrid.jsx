"use client";
import { useState, useMemo, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Bookmark, ExternalLink, Share2, X, Play, Pause, Eye, ChevronLeft } from 'lucide-react';

export default function PinterestGrid({ initialItems }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const videoRef = useRef(null);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

  const [prismicItems, setPrismicItems] = useState(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);

  useEffect(() => {
    if (initialItems && initialItems.length > 0) {
      setPrismicItems(initialItems);
      setLoading(false);
      return;
    }

    async function fetchPrismicGrid() {
      try {
        const { createClient } = await import('../prismicio');
        const client = createClient();
        const docs = await client.getAllByType('pinterestgrid');
        if (docs && docs.length > 0) {
          setPrismicItems(docs);
        }
      } catch (err) {
        console.error("Error fetching Prismic PinterestGrid custom pages client-side:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrismicGrid();
  }, [initialItems]);

  useEffect(() => {
    if (selectedItem && selectedItem.type === 'video' && videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().catch(err => {
        console.log("Autoplay with sound blocked, trying muted:", err);
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play();
        }
      });
    }
  }, [selectedItem]);

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
      id: 48,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1080',
      title: 'Polarized Wayfarer Shades',
      description: 'An icon for a reason. These classic wayfarer frames offer timeless appeal with modern polarized lens technology for clear vision.',
      site: 'via Ajio',
      aspectRatio: 'aspect-[3/2]',
      link: 'https://ajiio.in/ypU93JC'
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

  const getAsString = (field) => {
    if (!field) return '';
    if (typeof field === 'string') return field;
    if (Array.isArray(field)) {
      try {
        return field.map(node => node.text || '').join(' ');
      } catch (e) {
        return '';
      }
    }
    return '';
  };

  const getAspectRatioClass = (ratio) => {
    if (!ratio) return 'aspect-[3/4]';
    const r = String(ratio).toLowerCase();
    if (r.includes('square')) return 'aspect-square';
    if (r.includes('portrait') || r.includes('3/4') || r.includes('3-4')) return 'aspect-[3/4]';
    if (r.includes('tall') || r.includes('2/3') || r.includes('2-3')) return 'aspect-[2/3]';
    if (r.includes('landscape') || r.includes('3/2') || r.includes('3-2')) return 'aspect-[3/2]';
    if (r.includes('4/3') || r.includes('4-3')) return 'aspect-[4/3]';
    if (r.includes('4/5') || r.includes('4-5')) return 'aspect-[4/5]';
    if (r.includes('16/9') || r.includes('16-9')) return 'aspect-[16/9]';
    return 'aspect-[3/4]';
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560343776-97e7d202ff0e?q=80&w=1080';

  const mappedItems = useMemo(() => {
    if (prismicItems && prismicItems.length > 0) {
      return prismicItems.map((doc, idx) => {
        const data = doc.data || {};
        
        const imageUrl = data.product_image?.url || FALLBACK_IMAGE;
        const title = getAsString(data.heading);
        const description = getAsString(data.description) || '';
        const platform = getAsString(data.platform) || 'via Clickys';
        const site = platform.toLowerCase().startsWith('via') ? platform : `via ${platform}`;
        const link = data.affiliate_link?.url || (typeof data.affiliate_link === 'string' ? data.affiliate_link : '#');
        const videoSrc = data.video?.url || (typeof data.video === 'string' ? data.video : '');
        const isVideo = Boolean(data.is_video);
        const aspect_ratio = data.aspect_ratio || 'portrait';
        
        return {
          id: doc.id || `prismic-${idx}`,
          uid: doc.uid,
          image: imageUrl,
          title: title,
          description: description,
          site: site,
          aspectRatio: getAspectRatioClass(aspect_ratio),
          link: link,
          type: isVideo ? 'video' : 'image',
          videoSrc: videoSrc,
        };
      }).filter(item => item.title !== 'Curated Product' && item.title !== 'Curated Style' && item.title !== '');
    }
    return items.filter(item => item.title !== 'Curated Product' && item.title !== 'Curated Style');
  }, [prismicItems, items]);

  const filteredItems = useMemo(() => {
    if (!searchQuery) return mappedItems;
    return mappedItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery) || 
      item.description.toLowerCase().includes(searchQuery)
    );
  }, [mappedItems, searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

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
      <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 w-full">
        {paginatedItems.map((item) => (
          <div key={item.id} className={`break-inside-avoid relative mb-3 md:mb-4 group rounded-xl md:rounded-2xl ${playingVideoId === item.id ? 'z-50 overflow-visible' : 'overflow-hidden'} bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer`} onClick={() => setSelectedItem(item)}>
            
            {/* Media Container */}
            <div className={`relative w-full ${item.aspectRatio} ${playingVideoId !== item.id ? 'overflow-hidden' : ''} bg-gray-50 rounded-t-xl md:rounded-t-2xl`}>
              {item.type === 'video' ? (
                <>
                  <div className="absolute inset-0 flex flex-row w-full h-full">
                    <div className="relative w-1/2 h-full group/video-container border-r border-gray-100 bg-gray-100">
                      <video 
                        src={item.videoSrc}
                        className="object-cover w-full h-full"
                        autoPlay
                        muted
                        playsInline
                        loop
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setPlayingVideoId(item.id);
                          }}
                          className="bg-white/40 backdrop-blur-md p-2.5 md:p-3 rounded-full text-gray-900 border border-white/50 shadow-lg pointer-events-auto transition-transform transform hover:scale-110"
                        >
                          <Play className="w-4 h-4 md:w-5 md:h-5 fill-current pl-0.5" />
                        </button>
                      </div>
                    </div>
                    <div className="relative w-1/2 h-full bg-white">
                      <Image 
                        src={item.image || FALLBACK_IMAGE} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        quality={85}
                      />
                    </div>
                  </div>
                  {playingVideoId === item.id && (
                    <div className="absolute inset-[-12px] md:inset-[-20px] z-[60] bg-black rounded-2xl shadow-2xl overflow-hidden scale-105 transition-all outline outline-4 outline-white/20 flex flex-col">
                      <video 
                        src={item.videoSrc}
                        className="w-full h-full object-contain bg-black"
                        autoPlay
                        controls
                        playsInline
                        loop
                      />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setPlayingVideoId(null); }}
                        className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1 hover:bg-black/70 transition-colors border border-white/10"
                      >
                        <ChevronLeft className="w-3 h-3" /> Back
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 bg-white p-2">
                  <div className="relative w-full h-full">
                    <Image 
                      src={item.image || FALLBACK_IMAGE} 
                      alt={item.title} 
                      fill 
                      className="object-contain group-hover:scale-105 transition-transform duration-700 ease-in-out"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      quality={85}
                    />
                  </div>
                </div>
              )}
              
              {/* Site Badge overlay */}
              <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-sm text-[10px] font-bold text-gray-800 z-10 flex items-center gap-1 uppercase">
                {item.site.replace('via ', '')}
              </div>
            </div>

            {/* Content Area - Minimal View for Grid */}
            <div className="p-3 md:p-4 flex flex-col bg-white">
              <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 md:mb-3 mb-2">
                {item.title}
              </h3>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-auto">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                 >
                   <Eye className="w-3.5 h-3.5" />
                   Review
                 </button>
                 <a 
                  href={item.link} 
                  onClick={(e) => e.stopPropagation()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  Shop Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Frame
          </button>
          <span className="font-medium text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
            Frame {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-6 py-2.5 bg-white border border-gray-200 rounded-full font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-2"
          >
            Next Frame <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>
      )}

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
            className="bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Navigation */}
            <div className="absolute top-3 left-3 right-3 z-20 flex justify-between">
              <button 
                className="bg-white/90 backdrop-blur hover:bg-white px-2 py-1 rounded-lg shadow-sm text-[10px] font-bold flex items-center gap-1 transition-all text-gray-900 border border-gray-100"
                onClick={() => setSelectedItem(null)}
              >
                <ChevronLeft className="w-3 h-3" /> Back
              </button>
              <button 
                className="bg-white/90 backdrop-blur hover:bg-white p-1.5 rounded-full shadow-sm transition-all border border-gray-100"
                onClick={() => setSelectedItem(null)}
              >
                <X className="w-3.5 h-3.5 text-gray-900" />
              </button>
            </div>
            
            {/* Visual Side */}
            <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px] md:min-h-[450px] flex flex-row group/modal-video border-r border-gray-100">
              {selectedItem.type === 'video' ? (
                <>
                  <div className="relative w-1/2 h-full border-r border-gray-100">
                    <video 
                      ref={videoRef}
                      src={selectedItem.videoSrc}
                      className="w-full object-cover h-full"
                      autoPlay
                      playsInline
                      loop
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/modal-video:opacity-100 transition-opacity bg-black/10">
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
                        className="p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition-all transform hover:scale-110"
                      >
                        {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
                      </button>
                    </div>
                  </div>
                  <div className="relative w-1/2 h-full p-2 bg-white">
                    <Image 
                      src={selectedItem.image || FALLBACK_IMAGE} 
                      alt={selectedItem.title} 
                      fill 
                      className="object-contain"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </>
              ) : (
                <div className="relative w-full h-full p-4 bg-white">
                  <Image 
                    src={selectedItem.image || FALLBACK_IMAGE} 
                    alt={selectedItem.title} 
                    fill 
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>

            {/* Content Side */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto pt-16 md:pt-8">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                  {selectedItem.site.replace('via ', '')}
                </span>
                <div className="flex gap-2">
                  <button className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors">
                    <Share2 className="w-4 h-4 text-gray-700" />
                  </button>
                  <button className="p-1.5 bg-red-50 hover:bg-red-100 rounded-full transition-colors text-red-600">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight">{selectedItem.title}</h2>
              <div className="text-sm text-gray-600 mb-6 leading-relaxed">
                <p>{selectedItem.description || "No description available for this item."}</p>
                <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                  <p className="text-xs text-orange-800 font-medium italic">
                    "Find this and more curated styles on my official curator page. Handpicked quality products for you."
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100">
                <a 
                  href={selectedItem.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full block text-center bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm"
                >
                  Shop Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
