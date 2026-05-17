import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiStar, FiShoppingCart, FiCreditCard } from 'react-icons/fi';
import Image from 'next/image';
import { PrismicNextImage } from "@prismicio/next";
import CallToAction from './CallToAction';

const QuickViewModal = ({ isOpen, onClose, product, finalAffiliateColor, finalLink, buttonText, isPrismicImage, imageUrl, tagText }) => {
  // Prevent body scroll when modal is open and handle scrollbar layout shift
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  if (!product) return null;

  const {
    name = '',
    category = '',
    price = '',
    rating = 0,
    reviewCount = 0,
    platformValue = '',
    discount = 0,
    features = [],
    availabilityStatus = '',
    shortDescription,
    longDescription,
    description
  } = product;

  let displayDescription = shortDescription || '';
  if (!displayDescription && typeof description === 'string') {
    displayDescription = description;
  }
  if (!displayDescription && typeof longDescription === 'string') {
    displayDescription = longDescription.replace(/<[^>]+>/g, '');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        key="quickview-modal"
        className="fixed inset-0 z-[2000] flex items-start sm:items-center justify-center p-4 pt-16 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          key="quickview-modal-content"
          className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden min-h-[50vh] sm:h-auto my-auto"
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 md:top-4 md:right-4 z-20 p-2 bg-white hover:bg-gray-100 rounded-full transition-colors text-gray-800 shadow-md border border-gray-200 flex items-center gap-2 px-3 md:px-4"
          >
            <FiX size={18} />
            <span className="text-sm font-semibold hidden sm:inline">Back</span>
          </button>

          {/* Left Column: Image Area */}
          <div className="w-full md:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-6 md:p-8 relative shrink-0">
             {tagText && (
               <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-full z-10" style={{ backgroundColor: finalAffiliateColor }}>
                 {tagText}
               </span>
             )}
             {(discount > 0) && (
               <span className="absolute top-12 left-4 md:top-4 md:right-14 md:left-auto px-3 py-1 text-xs font-bold uppercase tracking-wider bg-red-500 text-white rounded-full z-10">
                 {discount}% OFF
               </span>
             )}
            <div className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-sm aspect-square flex items-center justify-center">
               {!isPrismicImage && (
                 <Image
                   src={imageUrl}
                   alt={name}
                   fill
                   className="object-contain drop-shadow-md"
                   sizes="(max-width: 768px) 100vw, 50vw"
                   priority
                   unoptimized={true}
                 />
               )}
               {isPrismicImage && (
                 <PrismicNextImage field={imageUrl} fill className="object-contain p-4 drop-shadow-md" priority />
               )}
            </div>
          </div>

          {/* Right Column: Product Details */}
          <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col md:overflow-y-auto max-h-[85vh] md:max-h-[90vh]">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">{category}</p>
              {availabilityStatus && (
                <span className={`text-xs font-bold px-2 py-1 rounded inline-flex items-center gap-1 ${(String(availabilityStatus).toLowerCase().includes('in stock') || availabilityStatus === true || String(availabilityStatus).toLowerCase() === 'true' || String(availabilityStatus).toLowerCase() === 'available') ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {(String(availabilityStatus).toLowerCase().includes('in stock') || availabilityStatus === true || String(availabilityStatus).toLowerCase() === 'true' || String(availabilityStatus).toLowerCase() === 'available') ? <><FiCheck size={12}/> In Stock</> : 'Out of Stock'}
                </span>
              )}
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">{name}</h2>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} className={i < Math.round(rating) ? "fill-current" : "text-gray-200"} size={18} />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {reviewCount > 0 ? `${reviewCount} Reviews` : 'No reviews yet'}
              </span>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                {price && price !== '0' ? (
                  <>
                    <span className="text-3xl font-extrabold text-gray-900">{price}</span>
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-gray-900">On Sale</span>
                )}
              </div>
              <p className="text-sm text-gray-600">Price when purchased online on {platformValue || 'partner site'}</p>
            </div>

            {(displayDescription || (Array.isArray(features) && features.length > 0)) && (
              <div className="mb-8 flex-grow">
                <h4 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">About this item</h4>
                {displayDescription && <p className="text-gray-600 text-sm leading-relaxed mb-4">{displayDescription}</p>}
                {Array.isArray(features) && features.length > 0 && (
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <FiCheck className="mt-0.5 min-w-[16px]" style={{ color: finalAffiliateColor }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
              <CallToAction
                text={buttonText}
                link={finalLink}
                icon={<FiShoppingCart />}
                iconPosition="right"
                target="_blank"
                className="flex-1 w-full"
                premium
                style={{ backgroundColor: finalAffiliateColor, borderColor: finalAffiliateColor, color: '#fff' }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
