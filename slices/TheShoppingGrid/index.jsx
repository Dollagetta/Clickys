import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicText, PrismicRichText } from '@prismicio/react';
import { FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';

/**
 * @typedef {import("@prismicio/client").Content.TheShoppingGridSlice} TheShoppingGridSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<TheShoppingGridSlice>} TheShoppingGridProps
 * @param {TheShoppingGridProps}
 */
const TheShoppingGrid = ({ slice }) => {
  const { section_tittle, the_items } = slice.primary;

  // Prismic passes repeatable zones in slice.items, but custom grouping is in primary
  const items = Array.isArray(the_items) ? the_items : (Array.isArray(slice.items) ? slice.items : []);

  return (
    <section className="py-16 bg-[#fffaf5] rounded-[4rem] my-12 border border-orange-100">
      <div className="container mx-auto px-4">
        {section_tittle && (
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
              {typeof section_tittle === 'string' || typeof section_tittle === 'number' ? String(section_tittle) : <PrismicText field={section_tittle} />}
            </h2>
            <div className="h-2 w-32 bg-orange-500 mx-auto rounded-full shadow-lg shadow-orange-100" />
          </div>
        )}

        {items.length > 0 && (
          <div className={`grid gap-6 justify-center ${
            items.length === 1 ? 'grid-cols-1 max-w-[400px] mx-auto' :
            items.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-[800px] mx-auto' :
            items.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-[1200px] mx-auto' :
            'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
          } items-start`}>
            {items.map((item, index) => (
              <div 
                key={index} 
                className="bg-white border text-center border-orange-100 rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group flex flex-col relative overflow-hidden"
              >
                {/* Action Buttons - Always Visible and Solid */}
                <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                  <button className="bg-white/80 backdrop-blur-md hover:bg-orange-600 hover:text-white p-3 rounded-full shadow-md text-gray-700 transition-all border border-black/5" title="Add to Wishlist">
                    <FiHeart size={18} />
                  </button>
                  <button className="bg-white/80 backdrop-blur-md hover:bg-orange-600 hover:text-white p-3 rounded-full shadow-md text-gray-700 transition-all border border-black/5" title="Share">
                    <FiShare2 size={18} />
                  </button>
                </div>

                {/* Product Image Section */}
                <div className="relative w-full aspect-square overflow-hidden bg-gray-50/50 p-8 flex items-center justify-center">
                  {item.product_image?.url ? (
                    <img 
                      src={item.product_image.url}
                      alt={item.product_image.alt || "Product"}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out drop-shadow-md"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 rounded-3xl">
                      <FiShoppingCart size={40} />
                    </div>
                  )}
                </div>
                
                <div className="p-6 pb-8 flex flex-col flex-grow bg-white">
                  <div className="mb-3">
                    <span className="inline-block bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider mb-3">
                      Deal Alert
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
                      {typeof item.product_name === 'string' || typeof item.product_name === 'number' ? String(item.product_name) : (item.product_name ? <PrismicText field={item.product_name} /> : 'Product Name')}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  {item.description && (
                    <div className="text-gray-500 text-sm mb-4 font-medium leading-relaxed line-clamp-2">
                      {typeof item.description === 'string' ? item.description : <PrismicRichText field={item.description} />}
                    </div>
                  )}
                  
                  {/* Price Section */}
                  <div className="mt-auto pt-2 flex flex-col gap-4 mx-auto items-center w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-orange-600">
                        {typeof item.price === 'string' || typeof item.price === 'number' ? String(item.price) : (item.price ? <PrismicText field={item.price} /> : '$0.00')}
                      </span>
                    </div>
                    
                    {(item.amazon_link && typeof item.amazon_link === 'object' && Object.keys(item.amazon_link).length > 0) ? (
                      <PrismicNextLink 
                        field={item.amazon_link} 
                        className="w-full min-w-[200px] py-4 px-6 bg-orange-600 text-white rounded-2xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer shadow-lg hover:shadow-xl"
                      >
                        <FiShoppingCart size={18} /> 
                        {typeof item.buy_button_label === 'string' || typeof item.buy_button_label === 'number' ? String(item.buy_button_label) : (item.buy_button_label ? <PrismicText field={item.buy_button_label} /> : 'Grab Deal')}
                      </PrismicNextLink>
                    ) : (typeof item.amazon_link === 'string' && item.amazon_link.trim().length > 0) ? (
                      <a 
                        href={item.amazon_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full min-w-[200px] py-4 px-6 bg-orange-600 text-white rounded-2xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 hover:bg-black transition-all cursor-pointer shadow-lg hover:shadow-xl"
                      >
                        <FiShoppingCart size={18} /> 
                        {typeof item.buy_button_label === 'string' || typeof item.buy_button_label === 'number' ? String(item.buy_button_label) : (item.buy_button_label ? <PrismicText field={item.buy_button_label} /> : 'Grab Deal')}
                      </a>
                    ) : (
                      <div className="w-full min-w-[200px] py-4 px-6 bg-orange-50 text-orange-800 rounded-2xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 border border-orange-200">
                        <FiShoppingCart size={18} />
                        {typeof item.buy_button_label === 'string' || typeof item.buy_button_label === 'number' ? String(item.buy_button_label) : (item.buy_button_label ? <PrismicText field={item.buy_button_label} /> : 'Check Outlet')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TheShoppingGrid;
