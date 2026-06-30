import { getGuideBySlug } from '../../../lib/guides';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PrismicRichText } from '@prismicio/react';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) return { title: 'Guide Not Found' };

  let descriptionText = typeof guide.description === 'string' 
    ? guide.description 
    : (guide.description?.[0]?.text || 'Check out our latest buying guide, tips, and recommendations on Clickys.');

  return {
    title: guide.title,
    description: descriptionText,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: descriptionText,
      images: [guide.image],
    },
  };
}

const richTextComponents = {
  heading1: ({ children }) => <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 mt-12 leading-tight tracking-tight">{children}</h1>,
  heading2: ({ children }) => <h2 className="text-3xl font-black text-gray-900 mb-6 mt-10 pb-2 border-b-4 border-green-500 inline-block">{children}</h2>,
  heading3: ({ children }) => <h3 className="text-2xl font-bold text-gray-800 mb-4 mt-8">{children}</h3>,
  heading4: ({ children }) => <h4 className="text-xl font-bold text-gray-800 mb-3 mt-6">{children}</h4>,
  heading5: ({ children }) => <h5 className="text-lg font-bold text-gray-800 mb-2 mt-4">{children}</h5>,
  heading6: ({ children }) => <h6 className="text-base font-bold text-gray-800 mb-2 mt-4">{children}</h6>,
  paragraph: ({ children }) => <p className="text-xl text-gray-700 leading-relaxed mb-6">{children}</p>,
  list: ({ children }) => <ul className="list-disc pl-6 space-y-3 mb-8">{children}</ul>,
  listItem: ({ children }) => <li className="text-lg text-gray-700">{children}</li>,
  oList: ({ children }) => <ol className="list-decimal pl-6 space-y-3 mb-8">{children}</ol>,
  oListItem: ({ children }) => <li className="text-lg text-gray-700">{children}</li>,
  hyperlink: ({ children, node }) => (
    <a href={node.data.url} target={node.data.target} className="text-blue-600 font-bold hover:underline">
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-extrabold text-gray-900">{children}</strong>,
  image: ({ node }) => (
    <div className="my-10 max-w-3xl mx-auto overflow-hidden rounded-2xl shadow-md border border-gray-100">
      <img src={node.url} alt={node.alt || ''} className="w-full h-auto object-contain" />
      {node.alt && <p className="text-center text-sm text-gray-500 mt-2 p-2">{node.alt}</p>}
    </div>
  ),
};

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const splitItems = (text) => {
    if (!text || typeof text !== 'string') return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

  const features = splitItems(guide.features);
  const pros = splitItems(guide.pros);
  const cons = splitItems(guide.cons);
  const alternatives = splitItems(guide.alternatives);

  const hasFeatures = guide.isPrismic ? guide.features?.length > 0 : features.length > 0;
  const hasPros = guide.isPrismic ? guide.pros?.length > 0 : pros.length > 0;
  const hasCons = guide.isPrismic ? guide.cons?.length > 0 : cons.length > 0;
  const hasAlternatives = guide.isPrismic ? guide.alternatives?.length > 0 : alternatives.length > 0;
  const hasFaq = guide.isPrismic && guide.faq?.length > 0;

  const priceString = guide.price ? guide.price.toString().replace(/[^0-9.]/g, '') : '';
  const brandName = guide.title.split(' ')[0] || 'Generic';
  
  let descriptionText = typeof guide.description === 'string' 
    ? guide.description 
    : (guide.description?.[0]?.text || `Buy the best ${guide.title} on ${guide.platform || 'Amazon'}. High quality and reliable features.`);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: guide.title.length > 100 ? guide.title.substring(0, 97) + '...' : guide.title,
    image: guide.image,
    description: descriptionText,
    sku: guide.slug,
    brand: {
      '@type': 'Brand',
      name: brandName
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '4.8',
        bestRating: '5'
      },
      author: {
        '@type': 'Person',
        name: 'Clickys Editor'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '15'
    },
    offers: {
      '@type': 'Offer',
      price: priceString || '0',
      priceCurrency: 'INR',
      priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      availability: 'https://schema.org/InStock',
      url: guide.link,
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnPeriod',
        merchantReturnDays: 30,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn'
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'INR'
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'd'
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'd'
          }
        }
      }
    }
  };

  const getPlatformColors = (platformName) => {
    const platform = (platformName || 'Amazon').toLowerCase();
    if (platform.includes('amazon')) {
      return 'bg-[#FF9900] hover:bg-[#E38900] text-gray-900 shadow-md border border-[#E38900]';
    }
    if (platform.includes('flipkart')) {
      return 'bg-[#FFC200] hover:bg-[#F0B300] text-[#000000] shadow-md border border-[#F0B300]';
    }
    if (platform.includes('myntra')) {
      return 'bg-[#FF3E6C] hover:bg-[#E53560] text-white shadow-md border border-[#E53560]';
    }
    if (platform.includes('ajio')) {
      return 'bg-[#2C4152] hover:bg-[#1C2C39] text-white shadow-md border border-[#1C2C39]';
    }
    if (platform.includes('nykaa')) {
      return 'bg-[#FC2779] hover:bg-[#E0226B] text-white shadow-md border border-[#E0226B]';
    }
    return 'bg-gray-900 hover:bg-black text-white shadow-md border border-black';
  };

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Breadcrumb / Back Button */}
      <nav className="mb-8 flex items-center justify-between">
        <Link href="/guides" className="inline-flex items-center text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Guides
        </Link>
      </nav>

      {/* H1: Guide Title */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          4.8 / 5.0
        </span>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Editor's Choice
        </span>
      </div>
      <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
        {guide.title}
      </h1>

      {/* Featured Image */}
      {guide.image && (
        <div className="relative max-w-sm md:max-w-md mx-auto rounded-[2rem] overflow-hidden mb-12 ring-1 ring-gray-100 transition-transform duration-300 bg-white">
          <div className="h-[250px] sm:h-[350px] relative">
            <Image
              src={guide.image}
              alt={guide.title}
              fill
              className="object-contain p-8 mix-blend-multiply"
              priority
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}

      <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-green">
        
        {/* H2: Product Overview */}
        <section className="mb-12">
          {guide.isPrismic ? (
            <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-3xl font-black text-gray-900 mb-6 pb-2 border-b-4 border-green-500 inline-block">Product Overview</h2>
              <PrismicRichText field={guide.description} components={richTextComponents} />
            </div>
          ) : (
            <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-3xl font-black text-gray-900 mb-6 pb-2 border-b-4 border-green-500 inline-block">
                Product Overview
              </h2>
              <div className="text-xl text-gray-700 leading-relaxed font-medium">
                {guide.description}
              </div>
            </div>
          )}
        </section>

        {/* H2: Features */}
        {hasFeatures && (
          <section className="mb-14">
            {guide.isPrismic ? (
              <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-8 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-blue-500 after:rounded-full">Key Features</h2>
                <PrismicRichText field={guide.features} components={richTextComponents} />
              </div>
            ) : (
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-8 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-blue-500 after:rounded-full">Key Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {features.map((feature, i) => (
                    <div key={i} className="flex items-start bg-gray-50/80 p-5 rounded-2xl border border-gray-100 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm transition-all duration-300 cursor-default">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 mt-0.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight">{feature}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Pros & Cons */}
        {(hasPros || hasCons) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
            {/* H2: Pros */}
            {hasPros && (
              <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all duration-300 group cursor-default">
                {guide.isPrismic ? (
                  <div className="prismic-content group-hover:bg-green-50/30 transition-colors rounded-xl p-2 -m-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">✓</div>
                      What we love
                    </h2>
                    <PrismicRichText field={guide.pros} components={richTextComponents} />
                  </div>
                ) : (
                  <div className="group-hover:bg-green-50/30 transition-colors rounded-xl p-2 -m-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl">
                        ✓
                      </div>
                      What we love
                    </h2>
                    <ul className="space-y-4">
                      {pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-green-500 mt-1 font-bold text-lg">•</span>
                          <h3 className="text-base font-semibold text-gray-700 leading-snug m-0">{pro}</h3>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {/* H2: Cons */}
            {hasCons && (
              <section className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all duration-300 group cursor-default">
                {guide.isPrismic ? (
                  <div className="prismic-content group-hover:bg-red-50/30 transition-colors rounded-xl p-2 -m-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">×</div>
                      Things to consider
                    </h2>
                    <PrismicRichText field={guide.cons} components={richTextComponents} />
                  </div>
                ) : (
                  <div className="group-hover:bg-red-50/30 transition-colors rounded-xl p-2 -m-2">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-xl">
                        ×
                      </div>
                      Things to consider
                    </h2>
                    <ul className="space-y-4">
                      {cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-red-400 mt-1 font-bold text-lg">•</span>
                          <h3 className="text-base font-semibold text-gray-700 leading-snug m-0">{con}</h3>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* H2: Alternatives */}
        {hasAlternatives && (
          <section className="mb-14">
            {guide.isPrismic ? (
              <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-2 border-b-4 border-indigo-500 inline-block">Alternatives Considered</h2>
                <PrismicRichText field={guide.alternatives} components={richTextComponents} />
              </div>
            ) : (
              <div className="bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                <h2 className="text-3xl font-black text-gray-900 mb-8 pb-2 border-b-4 border-indigo-500 inline-block">Alternatives Considered</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {alternatives.map((alt, i) => (
                    <div key={i} className="bg-gray-50/80 px-6 py-4 rounded-xl border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-sm transition-all duration-300 flex items-center justify-center text-center cursor-default">
                      <h3 className="text-sm font-semibold text-gray-800 m-0">{alt}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* FAQ (Prismic Only) */}
        {hasFaq && (
          <section className="mb-14">
            <div className="prismic-content bg-white p-8 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <h2 className="text-3xl font-black text-gray-900 mb-6 pb-2 border-b-4 border-purple-500 inline-block">Frequently Asked Questions</h2>
              <PrismicRichText field={guide.faq} components={richTextComponents} />
            </div>
          </section>
        )}

        {/* H2: Pricing and Discount Information */}
        <section className="mb-14 bg-white rounded-[2.5rem] p-8 md:p-10 border-2 border-gray-100 shadow-xl relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mr-10 w-64 h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-full blur-3xl opacity-70 pointer-events-none"></div>
          
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 relative z-10">Pricing & Availability</h2>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            
            <div>
              <div className="flex flex-wrap items-baseline gap-4 mb-3">
                <span className="text-5xl font-black text-gray-900 tracking-tight">
                  {guide.price && (guide.price.toString().includes('₹') ? guide.price : `₹${guide.price}`)}
                </span>
                {guide.discount && (
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-sm md:text-base font-bold px-3 py-1 rounded-lg uppercase tracking-wide shadow-sm">
                    {guide.discount.toString().includes('%') ? guide.discount : `${guide.discount}%`} OFF
                  </span>
                )}
              </div>
              <p className="text-gray-500 font-medium">
                Available on <span className="text-gray-800 font-bold">{guide.platform || 'Amazon'}</span>. Prices are subject to change.
              </p>
            </div>
            
            {guide.link && (
              <a
                href={guide.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center text-lg font-bold py-4 px-10 rounded-[1.25rem] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 w-full md:w-auto ${getPlatformColors(guide.platform)}`}
              >
                Buy on {guide.platform || 'Amazon'}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            )}
          </div>
        </section>

        {/* H2: Conclusion */}
        <section>
          <h2 className="text-3xl font-black text-gray-900 mb-6">Conclusion</h2>
          <p className="text-xl text-gray-700 leading-relaxed italic border-l-4 border-green-500 pl-6 py-2 bg-gray-50 rounded-r-xl">
            Overall, {guide.title} offers {hasFeatures ? 'a robust set of features' : 'great value'} for its price point. It's a solid choice if you're looking for quality and reliability.
          </p>
        </section>
      </div>

      <div className="mt-20 pt-12 border-t border-gray-100">
        <Link href="/guides" className="text-green-600 font-bold hover:underline flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to all guides
        </Link>
      </div>
    </article>
  );
}
