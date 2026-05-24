import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const image = searchParams.get('image');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: '#ff8c00',
            backgroundImage: 'linear-gradient(135deg, #ff9f1c 0%, #ff5200 100%)',
            fontFamily: 'sans-serif',
            padding: '40px',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
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

          <div
            style={{
              position: 'absolute',
              bottom: '50px',
              right: '50px',
              display: 'flex',
              backgroundColor: '#ffffff',
              padding: '10px 24px',
              borderRadius: '100px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                color: '#ff6200',
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
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}
