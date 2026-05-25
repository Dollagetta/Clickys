import { ImageResponse } from 'next/og';

const framesConfig = [
  // 1: Orange Energy
  {
    bgInfo: { backgroundColor: '#ff8c00', backgroundImage: 'linear-gradient(135deg, #ff9f1c 0%, #ff5200 100%)', padding: '40px' },
    innerStyle: { borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: 'none', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', right: '50px', top: 'auto', left: 'auto', backgroundColor: '#ffffff', borderRadius: '100px', border: 'none' },
    logoText: { color: '#ff6200' },
  },
  // 2: Midnight Cyber
  {
    bgInfo: { backgroundColor: '#111827', backgroundImage: 'linear-gradient(135deg, #111827 0%, #000000 100%)', padding: '40px' },
    innerStyle: { borderRadius: '16px', border: '4px solid #3b82f6', boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)', backgroundColor: '#ffffff' },
    logoContainer: { top: '50px', left: '50px', bottom: 'auto', right: 'auto', backgroundColor: '#111827', border: '2px solid #3b82f6', borderRadius: '16px' },
    logoText: { color: '#3b82f6' },
  },
  // 3: Soft Peach
  {
    bgInfo: { backgroundColor: '#fdfbfb', backgroundImage: 'linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%)', padding: '40px' },
    innerStyle: { borderRadius: '32px', border: '12px solid #ffddd2', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', left: '50px', top: 'auto', right: 'auto', backgroundColor: '#e29578', borderRadius: '20px', border: 'none' },
    logoText: { color: '#ffffff' },
  },
  // 4: Vivid Purple
  {
    bgInfo: { backgroundColor: '#8b5cf6', backgroundImage: 'linear-gradient(135deg, #c084fc 0%, #6d28d9 100%)', padding: '60px' },
    innerStyle: { borderRadius: '0px', boxShadow: '20px 20px 0px #4c1d95', border: '4px solid #ffffff', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '30px', right: '30px', top: 'auto', left: 'auto', backgroundColor: '#4c1d95', borderRadius: '0px', border: 'none' },
    logoText: { color: '#ffffff' },
  },
  // 5: Mint Fresh
  {
    bgInfo: { backgroundColor: '#10b981', backgroundImage: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', padding: '30px' },
    innerStyle: { borderRadius: '48px', boxShadow: '0 20px 40px rgba(5, 150, 105, 0.3)', border: '8px solid rgba(255,255,255,0.5)', backgroundColor: '#ffffff' },
    logoContainer: { top: '50px', right: '50px', bottom: 'auto', left: 'auto', backgroundColor: '#ffffff', borderRadius: '48px', border: 'none' },
    logoText: { color: '#059669' },
  },
  // 6: Deep Ocean
  {
    bgInfo: { backgroundColor: '#0f172a', backgroundImage: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)', padding: '40px' },
    innerStyle: { borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', border: '2px solid #38bdf8', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', right: '50px', top: 'auto', left: 'auto', backgroundColor: '#0ea5e9', borderRadius: '8px', border: 'none' },
    logoText: { color: '#ffffff' },
  },
  // 7: Golden Dawn
  {
    bgInfo: { backgroundColor: '#f59e0b', backgroundImage: 'linear-gradient(to right, #f5af19, #f12711)', padding: '50px' },
    innerStyle: { borderRadius: '200px', border: '8px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', left: '50px', top: 'auto', right: 'auto', backgroundColor: '#ffffff', borderRadius: '100px', border: 'none' },
    logoText: { color: '#d97706' },
  },
  // 8: Clean Slate
  {
    bgInfo: { backgroundColor: '#f1f5f9', backgroundImage: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', padding: '40px' },
    innerStyle: { borderRadius: '8px', border: '2px solid #cbd5e1', boxShadow: '15px 15px 0px #94a3b8', backgroundColor: '#ffffff' },
    logoContainer: { top: '50px', left: '50px', bottom: 'auto', right: 'auto', backgroundColor: '#ffffff', border: '2px solid #cbd5e1', borderRadius: '4px' },
    logoText: { color: '#334155' },
  },
  // 9: Vibrant Pink
  {
    bgInfo: { backgroundColor: '#ec4899', backgroundImage: 'linear-gradient(135deg, #f472b6 0%, #be185d 100%)', padding: '40px' },
    innerStyle: { borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(190, 24, 93, 0.5)', border: 'none', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', right: '50px', top: 'auto', left: 'auto', backgroundColor: '#ffe4e6', borderRadius: '100px', border: 'none' },
    logoText: { color: '#e11d48' },
  },
  // 10: Neon Matrix
  {
    bgInfo: { backgroundColor: '#000000', backgroundImage: 'none', padding: '40px' },
    innerStyle: { borderRadius: '0px', border: '4px solid #22c55e', boxShadow: '0 0 40px rgba(34, 197, 94, 0.3)', backgroundColor: '#000000' },
    logoContainer: { bottom: '50px', left: '50px', top: 'auto', right: 'auto', backgroundColor: '#000000', border: '2px solid #22c55e', borderRadius: '0px' },
    logoText: { color: '#22c55e' },
  },
  // 11: Sky Blue Minimal
  {
    bgInfo: { backgroundColor: '#e0f2fe', backgroundImage: 'none', padding: '60px' },
    innerStyle: { borderRadius: '32px', border: 'none', boxShadow: '0 20px 40px rgba(2, 132, 199, 0.1)', backgroundColor: '#ffffff' },
    logoContainer: { top: '30px', right: '30px', bottom: 'auto', left: 'auto', backgroundColor: '#0284c7', borderRadius: '16px', border: 'none' },
    logoText: { color: '#e0f2fe' },
  },
  // 12: Retro Sunset
  {
    bgInfo: { backgroundColor: '#2e0249', backgroundImage: 'linear-gradient(180deg, #2e0249 0%, #a91079 50%, #f806cc 100%)', padding: '40px' },
    innerStyle: { borderRadius: '12px', border: '6px solid #f806cc', boxShadow: '0 10px 40px rgba(248, 6, 204, 0.5)', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', left: '50px', top: 'auto', right: 'auto', backgroundColor: '#2e0249', border: '2px solid #f806cc', borderRadius: '12px' },
    logoText: { color: '#f806cc' },
  },
  // 13: Elegant Monochrome
  {
    bgInfo: { backgroundColor: '#18181b', backgroundImage: 'none', padding: '80px' },
    innerStyle: { borderRadius: '0px', border: '2px solid #52525b', boxShadow: 'none', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '40px', right: '40px', top: 'auto', left: 'auto', backgroundColor: '#27272a', borderRadius: '0px', border: 'none' },
    logoText: { color: '#fafafa' },
  },
  // 14: Tropical Horizon
  {
    bgInfo: { backgroundColor: '#ff9a9e', backgroundImage: 'linear-gradient(to top, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)', padding: '40px' },
    innerStyle: { borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', border: 'none', backgroundColor: '#ffffff' },
    logoContainer: { top: '40px', left: '40px', bottom: 'auto', right: 'auto', backgroundColor: '#ffffff', borderRadius: '100px', border: 'none' },
    logoText: { color: '#ff6200' },
  },
  // 15: Corporate Blue Horizon
  {
    bgInfo: { backgroundColor: '#1d4ed8', backgroundImage: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)', padding: '40px' },
    innerStyle: { borderRadius: '8px', border: 'none', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.5)', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', left: '50px', top: 'auto', right: 'auto', backgroundColor: '#ffffff', borderRadius: '4px', border: 'none' },
    logoText: { color: '#1d4ed8' },
  },
  // 16: Rose Gold Glitz
  {
    bgInfo: { backgroundColor: '#e2d1c3', backgroundImage: 'linear-gradient(to top, #e2d1c3 0%, #fdfcfb 100%)', padding: '50px' },
    innerStyle: { borderRadius: '40px', border: '6px solid #c8a2c8', boxShadow: '0 20px 40px rgba(200, 162, 200, 0.3)', backgroundColor: '#ffffff' },
    logoContainer: { top: '50px', right: '50px', bottom: 'auto', left: 'auto', backgroundColor: '#ffffff', borderRadius: '20px', border: '2px solid #c8a2c8' },
    logoText: { color: '#a67c52' },
  },
  // 17: Indigo Pulse
  {
    bgInfo: { backgroundColor: '#312e81', backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', padding: '40px' },
    innerStyle: { borderRadius: '24px', border: '8px solid rgba(255,255,255,0.1)', boxShadow: 'none', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', right: '50px', top: 'auto', left: 'auto', backgroundColor: '#4338ca', borderRadius: '8px', border: 'none' },
    logoText: { color: '#ffffff' },
  },
  // 18: Sunny Lemonade
  {
    bgInfo: { backgroundColor: '#fef08a', backgroundImage: 'linear-gradient(135deg, #fef08a 0%, #facc15 100%)', padding: '30px' },
    innerStyle: { borderRadius: '16px', border: 'none', boxShadow: '0 20px 50px rgba(202, 138, 4, 0.4)', backgroundColor: '#ffffff' },
    logoContainer: { top: '50px', left: '50px', bottom: 'auto', right: 'auto', backgroundColor: '#ffffff', borderRadius: '100px', border: 'none' },
    logoText: { color: '#ca8a04' },
  },
  // 19: Ruby Core
  {
    bgInfo: { backgroundColor: '#9f1239', backgroundImage: 'linear-gradient(135deg, #e11d48 0%, #881337 100%)', padding: '40px' },
    innerStyle: { borderRadius: '32px', border: '4px solid #fda4af', boxShadow: '0 30px 60px -12px rgba(0,0,0,0.6)', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '40px', right: '40px', top: 'auto', left: 'auto', backgroundColor: '#ffffff', borderRadius: '20px', border: 'none' },
    logoText: { color: '#be123c' },
  },
  // 20: Emerald Glow
  {
    bgInfo: { backgroundColor: '#064e3b', backgroundImage: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)', padding: '60px' },
    innerStyle: { borderRadius: '32px', border: '2px solid #34d399', boxShadow: '0 0 60px rgba(52, 211, 153, 0.25)', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', left: '50px', top: 'auto', right: 'auto', backgroundColor: '#a7f3d0', borderRadius: '16px', border: 'none' },
    logoText: { color: '#064e3b' },
  }
];

// Removed edge runtime due to build error
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const image = searchParams.get('image'); 
    
    // Default to frame 0
    let frameIndex = 0;
    
    if (image) {
      // Deterministically select a frame based on the image URL
      let hash = 0;
      for (let i = 0; i < image.length; i++) {
        hash = image.charCodeAt(i) + ((hash << 5) - hash);
      }
      frameIndex = Math.abs(hash) % framesConfig.length;
    }
    
    // Allow override via query string
    const specificFrame = searchParams.get('frameIndex');
    if (specificFrame !== null && !isNaN(parseInt(specificFrame))) {
       frameIndex = parseInt(specificFrame) % framesConfig.length;
    }

    const frame = framesConfig[frameIndex] || framesConfig[0];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: frame.bgInfo.backgroundColor,
            backgroundImage: frame.bgInfo.backgroundImage,
            fontFamily: 'sans-serif',
            padding: frame.bgInfo.padding,
            position: 'relative'
          }}
        >
          {/* Main Photo inner container */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              backgroundColor: frame.innerStyle.backgroundColor,
              borderRadius: frame.innerStyle.borderRadius,
              boxShadow: frame.innerStyle.boxShadow,
              border: frame.innerStyle.border,
              overflow: 'hidden',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {image ? (
              <img
                src={image}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div style={{ fontSize: '100px', color: '#e5e7eb' }}>📦</div>
            )}
          </div>

          {/* Logo overlay */}
          <div
            style={{
              position: 'absolute',
              top: frame.logoContainer.top,
              bottom: frame.logoContainer.bottom,
              left: frame.logoContainer.left,
              right: frame.logoContainer.right,
              display: 'flex',
              backgroundColor: frame.logoContainer.backgroundColor,
              border: frame.logoContainer.border,
              padding: '10px 24px',
              borderRadius: frame.logoContainer.borderRadius,
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                color: frame.logoText.color,
                fontWeight: '900',
                fontSize: '32px',
                letterSpacing: '-1px',
              }}
            >
              Clickys
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(e.message);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}
