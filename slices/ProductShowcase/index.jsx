"use client";
import { motion } from 'framer-motion';
import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import { FiShoppingCart, FiTag } from 'react-icons/fi';

/**
 * @typedef {import("@prismicio/client").Content.ProductShowcaseSlice} ProductShowcaseSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ProductShowcaseSlice>} ProductShowcaseProps
 * @param {ProductShowcaseProps}
 */
const ProductShowcase = ({ slice }) => {
  const { section_title, section_description } = slice.primary;

  return (
    <section className="py-16 bg-slate-50/50 rounded-[3rem] my-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {(section_title || section_description) && (
          <div className="text-center mb-16">
            {section_title && (
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                <PrismicText field={section_title} />
              </h2>
            )}
            {section_description && (
              <div className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">
                <PrismicRichText field={section_description} />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {slice.items.map((item, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full border border-slate-100"
            >
              <div className="relative aspect-square overflow-hidden bg-white p-4">
                {item.discount_label && (
                  <span className="absolute top-4 left-4 z-10 bg-orange-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg uppercase tracking-widest">
                    <FiTag size={12} /> {item.discount_label}
                  </span>
                )}
                <PrismicNextImage 
                  field={item.product_image} 
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              
              <div className="p-6 pt-2 flex flex-col flex-1">
                <h3 className="text-base font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                  {typeof item.product_name === 'string' || typeof item.product_name === 'number' ? String(item.product_name) : (item.product_name ? <PrismicText field={item.product_name} /> : 'Product Name')}
                </h3>
                
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xl font-extrabold text-slate-900">
                    {typeof item.price === 'string' || typeof item.price === 'number' ? String(item.price) : (item.price ? <PrismicText field={item.price} /> : '$0.00')}
                  </span>
                  {item.original_price && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {typeof item.original_price === 'string' || typeof item.original_price === 'number' ? String(item.original_price) : (item.original_price ? <PrismicText field={item.original_price} /> : null)}
                    </span>
                  )}
                </div>
                
                <PrismicNextLink 
                  field={item.buy_link} 
                  className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 group-hover:shadow-xl group-hover:shadow-orange-100"
                >
                  <FiShoppingCart size={18} /> Buy Now
                </PrismicNextLink>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
