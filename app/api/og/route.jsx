import { ImageResponse } from 'next/og';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    let image = searchParams.get('image'); 
    
    // Clean Prismic image URLs so Satori doesn't crash from WebP or invalid params
    if (image && image.includes('prismic.io')) {
      const imgUrl = new URL(image);
      const autoParams = imgUrl.searchParams.get('auto');
      if (autoParams) {
         const cleanAuto = autoParams.split(',').filter(x => x !== 'format' && x !== 'compress').join(',');
         if (cleanAuto) {
           imgUrl.searchParams.set('auto', cleanAuto);
         } else {
           imgUrl.searchParams.delete('auto');
         }
      }
      // Remove any weird fm=jpg,compress
      const fm = imgUrl.searchParams.get('fm');
      if (fm && fm.includes(',')) {
         imgUrl.searchParams.set('fm', fm.split(',')[0]);
      } else {
         imgUrl.searchParams.set('fm', 'jpg');
      }
      image = imgUrl.toString();
    }
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            backgroundColor: '#ffffff',
            fontFamily: 'sans-serif',
            padding: '40px',
            position: 'relative'
          }}
        >
          {/* Main Photo inner container */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '2px solid #e5e7eb',
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
              bottom: '50px',
              right: '50px',
              display: 'flex',
              backgroundColor: '#ffffff',
              padding: '10px 24px',
              borderRadius: '100px',
              border: '1px solid #e5e7eb',
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
    console.log(e.message);
    return new Response('Failed to generate the image', {
      status: 500,
    });
  }
}

