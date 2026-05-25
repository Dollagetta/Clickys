import { ImageResponse } from 'next/og';

const framesConfig = [
  // 1: Clickys Brand (Green & Orange)
  {
    bgInfo: { backgroundColor: '#10b981', backgroundImage: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '40px' },
    innerStyle: { borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '4px solid #ff8c00', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', right: '50px', top: 'auto', left: 'auto', backgroundColor: '#ffffff', borderRadius: '100px', border: 'none' },
    logoText: { color: '#ff8c00' },
  }
];

// Removed edge runtime due to build error
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
