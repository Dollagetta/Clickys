import { PrismicNextImage, PrismicNextLink } from '@prismicio/next';
import { PrismicRichText, PrismicText } from '@prismicio/react';
import { FiCheck, FiX, FiStar, FiShoppingCart } from 'react-icons/fi';

/**
 * @typedef {import("@prismicio/client").Content.ComparisonSectionSlice} ComparisonSectionSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<ComparisonSectionSlice>} ComparisonSectionProps
 * @param {ComparisonSectionProps}
 */
const ComparisonSection = ({ slice }) => {
  const { title, description } = slice.primary;

  return (
    <section className="py-12 my-8 px-4">
      <div className="container mx-auto">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                <PrismicText field={title} />
              </h2>
            )}
            {description && (
              <div className="text-gray-600 max-w-2xl mx-auto text-lg">
                <PrismicRichText field={description} />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {slice.items.map((item, index) => (
            <div 
              key={index} 
              className={`relative bg-white rounded-3xl border ${index === 0 ? 'border-green-100' : 'border-blue-100'} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
            >
              {/* Vertical Badge for mobile or header for desktop */}
              <div className={`p-6 ${index === 0 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'} border-b border-inherit`}>
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  {index === 0 ? "Top Pick" : "Best Value"}
                </h3>
              </div>

              <div className="p-8">
                <div className="flex flex-col sm:flex-row gap-8 mb-8 items-start">
                  <div className="w-full sm:w-40 aspect-square bg-gray-50 rounded-2xl p-4 flex-shrink-0">
                    <PrismicNextImage 
                      field={item.product_image} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-gray-900 mb-2">{item.product_name}</h4>
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FiStar 
                          key={i} 
                          size={16} 
                          className={i < parseInt(item.rating || "0") ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
                        />
                      ))}
                      <span className="text-sm font-medium ml-2 text-gray-500">{item.price}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h5 className="text-sm font-bold text-green-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <FiCheck /> Pros
                    </h5>
                    <div className="prose prose-sm prose-green text-gray-600">
                      <PrismicRichText field={item.pros} />
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-red-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <FiX /> Cons
                    </h5>
                    <div className="prose prose-sm prose-red text-gray-600">
                      <PrismicRichText field={item.cons} />
                    </div>
                  </div>
                </div>

                <PrismicNextLink 
                  field={item.buy_link}
                  className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                    index === 0 
                    ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-100' 
                    : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-100'
                  }`}
                >
                  <FiShoppingCart /> Check Price
                </PrismicNextLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
