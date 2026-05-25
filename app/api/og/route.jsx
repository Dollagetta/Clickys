import { ImageResponse } from 'next/og';

const framesConfig = [
  // 1: Clickys Brand (Green & Orange)
  {
    bgInfo: { backgroundColor: '#10b981', padding: '40px' },
    innerStyle: { borderRadius: '24px', border: '4px solid #ff8c00', backgroundColor: '#ffffff' },
    logoContainer: { bottom: '50px', right: '50px', backgroundColor: '#ffffff', borderRadius: '100px' },
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
      
      // Force smaller image to prevent Satori memory crash
      imgUrl.searchParams.set('w', '800');
      
      image = imgUrl.toString();
    } else if (image && (image.includes('clickysb.jpeg') || image.includes('logosvg.svg') || image.includes('clickysbg.png'))) {
      // Local fallback images are empty files, causing Satori to crash with Segmentation Fault
      image = null;
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
              bottom: frame.logoContainer.bottom,
              right: frame.logoContainer.right,
              display: 'flex',
              backgroundColor: frame.logoContainer.backgroundColor,
              padding: '10px 24px',
              borderRadius: frame.logoContainer.borderRadius,
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
