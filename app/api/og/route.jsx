import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const titleStr = searchParams.get('title') || 'Discover Top Picks & Deals';
    // Trim title if it's too long
    const title = titleStr.length > 70 ? titleStr.substring(0, 70) + '...' : titleStr;
    const category = searchParams.get('category') || 'Trending';
    const image = searchParams.get('image'); 

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#ffffff',
            backgroundImage: 'linear-gradient(135deg, #f0fdf4 0%, #e0e7ff 100%)',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Left Side Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'flex-start',
              width: '50%',
              padding: '60px',
              gap: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div 
                style={{ 
                  display: 'flex',
                  color: '#16a34a',
                  fontWeight: 'bold',
                  fontSize: '32px',
                  letterSpacing: '-1px'
                }}
              >
                Clickys
              </div>
              <div style={{ display: 'flex', padding: '6px 16px', background: '#dcfce7', color: '#166534', borderRadius: '30px', fontSize: '20px', fontWeight: 'bold' }}>
                {category}
              </div>
            </div>

            <h1
              style={{
                fontSize: '56px',
                fontWeight: '900',
                color: '#111827',
                lineHeight: 1.1,
                letterSpacing: '-2px',
                marginTop: '10px'
              }}
            >
              {title}
            </h1>
            
            <div style={{ display: 'flex', marginTop: 'auto', color: '#4b5563', fontSize: '24px', fontWeight: '500' }}>
              Find gifts, track prices & compare.
            </div>
          </div>

          {/* Right Side Image Frame */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '50%',
              padding: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '40px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                border: '8px solid white',
              }}
            >
              {image ? (
                <img
                  src={image}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div style={{ fontSize: '100px', color: '#e5e7eb' }}>📦</div>
              )}
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
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
