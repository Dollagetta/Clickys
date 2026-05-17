import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicText } from '@prismicio/react';

/**
 * @typedef {import("@prismicio/client").Content.CTABannerSlice} CTABannerSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<CTABannerSlice>} CTABannerProps
 * @param {CTABannerProps}
 */
const CTABanner = ({ slice }) => {
  const { text, button_link, button_text, background_image } = slice.primary;

  return (
    <section className="relative w-full py-16 md:py-20 overflow-hidden rounded-3xl my-8 bg-black">
      {background_image?.url && (
        <div className="absolute inset-0 opacity-40">
           <PrismicNextImage 
            field={background_image} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tighter uppercase italic max-w-4xl mx-auto">
          <PrismicText field={text} />
        </h2>
        
        {button_link && button_text && (
          <PrismicNextLink 
            field={button_link}
            className="inline-block px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-full hover:bg-green-500 hover:text-white transition-all transform hover:scale-105 shadow-md"
          >
            {typeof button_text === 'string' || typeof button_text === 'number' ? String(button_text) : <PrismicText field={button_text} />}
          </PrismicNextLink>
        )}
      </div>
    </section>
  );
};

export default CTABanner;
