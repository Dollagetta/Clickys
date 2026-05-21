'use client';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

const BADGE_COLORS = {
  'Just Launched': { bg: '#ff4d4f', text: '#fff' },
  'Hot Drop':       { bg: '#ff7a00', text: '#fff' },
  'Exclusive':      { bg: '#7c3aed', text: '#fff' },
  'Bestseller':     { bg: '#16a34a', text: '#fff' },
};

function getFallbackImage(category, name) {
  const cat = String(category || '').toLowerCase();
  const n = String(name || '').toLowerCase();
  
  if (cat.includes('phone') || cat.includes('mobile') || n.includes('phone') || n.includes('mobile') || n.includes('galaxy') || n.includes('iphone') || n.includes('pixel') || n.includes('moto') || n.includes('poco') || n.includes('oneplus')) {
    return 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=60&auto=format&fit=crop';
  }
  if (cat.includes('earbud') || cat.includes('headphone') || cat.includes('audio') || cat.includes('sound') || n.includes('bud') || n.includes('ear') || n.includes('headphone') || n.includes('audio') || n.includes('pods')) {
    return 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=60&auto=format&fit=crop';
  }
  if (cat.includes('watch') || cat.includes('wearable') || n.includes('watch') || n.includes('wearable') || n.includes('band')) {
    return 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&q=60&auto=format&fit=crop';
  }
  if (cat.includes('laptop') || cat.includes('computer') || n.includes('laptop') || n.includes('book') || n.includes('pc')) {
    return 'https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=300&q=60&auto=format&fit=crop';
  }
  if (cat.includes('appliance') || cat.includes('home') || cat.includes('kitchen') || n.includes('fridge') || n.includes('refrigerator') || n.includes('washing') || n.includes('cook') || n.includes('oven') || n.includes('lg')) {
    return 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&q=60&auto=format&fit=crop';
  }
  if (cat.includes('fashion') || cat.includes('cloth') || cat.includes('wear') || n.includes('shirt') || n.includes('pant') || n.includes('shoe') || n.includes('bag')) {
    return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&q=60&auto=format&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=300&q=60&auto=format&fit=crop';
}

function LaunchCard({ item }) {
  const badge = BADGE_COLORS[item.badge] || { bg: '#1d4ed8', text: '#fff' };
  const [showPreview, setShowPreview] = useState(false);
  const fallbackImg = getFallbackImage(item.category, item.name);

  return (
    <>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: '200px',
        maxWidth: '200px',
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
        transition: 'transform 0.22s ease, box-shadow 0.22s ease',
        textDecoration: 'none',
        color: 'inherit',
        flexShrink: 0,
        border: '1.5px solid #f0f0f0',
        position: 'relative'
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.16)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
      }}
    >
      <Link
        href={item.link || '#'}
        target="_blank"
        rel="noopener noreferrer nofollow"
        style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}
      >
        {/* Image */}
        <div style={{ position: 'relative', width: '100%', height: '160px', background: '#f8f8f8', overflow: 'hidden' }}>
          <img
            src={item.imageUrl || fallbackImg}
            alt={item.name}
            referrerPolicy="no-referrer"
            style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
            onError={e => { e.target.src = fallbackImg; }}
          />
          {/* Badge */}
          <span style={{
            position: 'absolute', top: 8, left: 8,
            background: badge.bg, color: badge.text,
            fontSize: '10px', fontWeight: 700,
            padding: '3px 8px', borderRadius: '100px',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {item.badge || 'New'}
          </span>
          {/* NEW pill */}
          <span style={{
            position: 'absolute', top: 8, right: 8,
            background: '#fff', color: '#111',
            fontSize: '9px', fontWeight: 700,
            padding: '2px 7px', borderRadius: '100px',
            border: '1.5px solid #e5e7eb',
            letterSpacing: '0.05em',
          }}>
            🆕 {item.launchDate}
          </span>
        </div>
      </Link>
      
      {/* Info */}
      <div style={{ padding: '12px 12px 14px', display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        <Link
          href={item.link || '#'}
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {item.brand} · {item.category}
          </span>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#111', lineHeight: 1.35, margin: '4px 0 0 0',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.name}
          </p>
          <p style={{ fontSize: '11px', color: '#6b7280', margin: '4px 0 0 0', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.description}
          </p>
        </Link>
        
        <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#111' }}>{item.price}</span>
          <span style={{
            fontSize: '11px', fontWeight: 600,
            color: item.platform === 'Amazon' ? '#ff9900' : item.platform === 'Flipkart' ? '#2874f0' : '#7c3aed',
          }}>
            {item.platform}
          </span>
        </div>

        {/* Quick View Button */}
        <div style={{ marginTop: 8 }}>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(true); }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '100%',
              padding: '6px 10px', 
              borderRadius: '6px',
              backgroundColor: '#f8fafc', 
              color: '#475569', 
              border: '1px solid #cbd5e1',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <span style={{ marginRight: '6px' }}>👁️</span> Preview
          </button>
        </div>
      </div>
    </div>

    {showPreview && (
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          backdropFilter: 'blur(4px)'
        }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(false); }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#fff',
            borderRadius: '16px',
            padding: '2rem',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}
        >
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPreview(false); }}
            style={{
              position: 'absolute',
              top: '1rem', right: '1rem',
              background: 'none', border: 'none',
              fontSize: '1.5rem', cursor: 'pointer',
              color: '#64748b'
            }}
          >
            ✕
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <img
                src={item.imageUrl || fallbackImg}
                alt={item.name}
                referrerPolicy="no-referrer"
                style={{ objectFit: 'contain', margin: '0 auto', display: 'block', maxWidth: '300px', maxHeight: '250px', width: '100%' }}
                onError={(e) => e.currentTarget.src = fallbackImg}
              />
            </div>

            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{item.name}</h3>
              <p style={{ color: '#64748b', margin: '0 0 1rem 0', fontWeight: '500' }}>{item.price}</p>
              
              <div style={{ color: '#334155', lineHeight: '1.6', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                <p>{item.description}</p>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', marginBottom: '0.5rem' }}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  style={{ 
                    backgroundColor: item.platform === 'Amazon' ? '#ff9900' : (item.platform === 'Flipkart' ? '#2874f0' : '#7c3aed'),
                    flex: 1,
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem', color: '#fff', borderRadius: '8px', fontWeight: '600', textDecoration: 'none'
                  }}
                >
                  Buy on {item.platform}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      minWidth: '200px', maxWidth: '200px', height: '290px',
      background: '#f3f4f6', borderRadius: '16px', flexShrink: 0,
      animation: 'pulse 1.5s ease-in-out infinite',
    }} />
  );
}

export default function NewLaunchesSection() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    fetch('/api/new-launches')
      .then(r => r.json())
      .then(data => { setLaunches(data.launches || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 440, behavior: 'smooth' });
  };

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 2);
  };

  const btnStyle = (enabled) => ({
    width: 36, height: 36, borderRadius: '50%',
    border: '1.5px solid #e5e7eb',
    background: enabled ? '#111' : '#f3f4f6',
    color: enabled ? '#fff' : '#d1d5db',
    cursor: enabled ? 'pointer' : 'default',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, fontWeight: 700,
    transition: 'all 0.18s',
    flexShrink: 0,
  });

  return (
    <section style={{ background: '#fafafa', padding: '28px 0 24px', borderBottom: '1px solid #ebebeb' }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .nl-scroll::-webkit-scrollbar { display: none; }
        .nl-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}></span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
                What&apos;s New
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                Latest launches &amp; fresh drops
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/whats-new" style={{ fontSize: '12px', color: '#111', fontWeight: 600, textDecoration: 'none', marginRight: 8 }}>
              See all →
            </Link>
            <button onClick={() => scroll(-1)} style={btnStyle(canScrollLeft)} disabled={!canScrollLeft} aria-label="Scroll left">‹</button>
            <button onClick={() => scroll(1)} style={btnStyle(canScrollRight)} disabled={!canScrollRight} aria-label="Scroll right">›</button>
          </div>
        </div>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          className="nl-scroll"
          style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 4 }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : launches.map(item => <LaunchCard key={item.id} item={item} />)
          }
        </div>
      </div>
    </section>
  );
}
