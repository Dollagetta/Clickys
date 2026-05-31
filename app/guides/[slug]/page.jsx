import { getGuideBySlug } from '../../../lib/guides';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) return { title: 'Guide Not Found' };

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/guides/${slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      images: [guide.image],
    },
  };
}

export default async function GuideDetailPage({ params }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const splitItems = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

  const features = splitItems(guide.features);
  const pros = splitItems(guide.pros);
  const cons = splitItems(guide.cons);
  const alternatives = splitItems(guide.alternatives);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: guide.title,
    image: guide.image,
    description: guide.description,
    offers: {
      '@type': 'Offer',
      price: guide.price ? guide.price.replace(/[^0-9.]/g, '') : '',
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: guide.link
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
          <h2 className="text-3xl font-black text-gray-900 mb-6 pb-2 border-b-4 border-green-500 inline-block">
            Product Overview
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            {guide.description}
          </p>
        </section>

        {/* H2: Features */}
        {features.length > 0 && (
          <section className="mb-14">
            <h2 className="text-3xl font-black text-gray-900 mb-8 inline-block relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-1.5 after:bg-blue-500 after:rounded-full">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, i) => (
                <div key={i} className="flex items-start bg-white p-5 rounded-2xl shadow-sm border border-gray-100 ring-1 ring-black/[0.03] hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">{feature}</h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Pros & Cons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* H2: Pros */}
          <section className="bg-gray-50/80 rounded-[24px] p-8 border border-gray-100 hover:border-green-200 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
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
          </section>

          {/* H2: Cons */}
          <section className="bg-gray-50/80 rounded-[24px] p-8 border border-gray-100 hover:border-red-200 transition-colors">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
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
          </section>
        </div>

        {/* H2: Alternatives */}
        {alternatives.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Alternatives Considered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {alternatives.map((alt, i) => (
                <div key={i} className="bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-center text-center">
                  <h3 className="text-sm font-semibold text-gray-800 m-0">{alt}</h3>
                </div>
              ))}
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
            Overall, {guide.title} offers {guide.features ? 'a robust set of features' : 'great value'} for its price point. It's a solid choice if you're looking for quality and reliability.
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
