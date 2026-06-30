import Link from 'next/link';
import Image from 'next/image';

const affiliateColors = {
  Amazon: "#FF9900",
  Clickbank: "#B22234",
  Cj: "#0A9C55",
  Rakuten: "#BF0030",
  Shareasale: "#003595",
  Impact: "#FF2234",
  Awin: "#F37324",
  Fiverr: "#1DBF73",
  Booking: "#003580",
  Bluehost: "#0059B3",
  Amazonin: "#FF9900",
  Flipkart: "#FFD600",
  Vcommission: "#34A853",
  Cuelinks: "#2B84EA",
  Admitad: "#3056D3",
  Involveasia: "#F24B6A",
  Optimise: "#F58023",
  Makemytrip: "#008CFF",
  Nykaa: "#E80071",
  Myntra: "#FF3F6C",
  Meesho: "#E72E77",
  Ajio: "#2C4152",
  Blinkit: "#FFD600",
  Shopsy: "#0C3C60",
  Topsy: "#6C63FF",
  Jumia: "#F68B1E"
};

export default function GuideCard({ guide }) {
  const platform = guide.platform || 'Amazon';
  const normalizedPlatform = platform.charAt(0).toUpperCase() + platform.slice(1).toLowerCase();
  const platformColor = affiliateColors[normalizedPlatform] || affiliateColors['Amazon'];

  let descriptionText = guide.description;
  if (Array.isArray(guide.description)) {
    descriptionText = guide.description[0]?.text || '';
  }

  return (
    <div 
      className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-full group border border-gray-100"
    >
      <div className="relative h-56 md:h-64 overflow-hidden bg-gray-50/50 mb-2 border-b border-gray-100">
        {guide.image ? (
            <Image
            src={guide.image}
            alt={guide.title}
            fill
            className="object-contain p-8 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
        
        {/* Absolute Badges Overlay */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between items-start pointer-events-none">
            <div className="flex w-full justify-between items-start">
               {guide.category && (
                 <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm shadow-black/5 uppercase tracking-wide group-hover:text-orange-500 transition-colors pointer-events-auto">
                   {guide.category}
                 </span>
               )}
               {platform && (
                 <span 
                   className="text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg ml-auto pointer-events-auto"
                   style={{ backgroundColor: platformColor }}
                 >
                   {platform}
                 </span>
               )}
            </div>
            
            {guide.discount && (
              <span className="bg-red-500 text-white text-sm font-black px-3 py-1 rounded-full shadow-lg pointer-events-auto mt-auto">
                {guide.discount.toString().includes('%') ? guide.discount : `${guide.discount}%`} OFF
              </span>
            )}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-black text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-orange-500 transition-colors leading-tight">
          {guide.title}
        </h3>
        
        <div className="text-3xl font-black text-gray-900 mb-3 flex items-baseline gap-1" style={{ color: platformColor }}>
          {guide.price && (guide.price.toString().includes('₹') ? guide.price : `₹${guide.price}`)}
        </div>

        <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
          {descriptionText}
        </p>

        <div className="flex gap-3">
          <Link
            href={`/guides/${guide.slug}`}
            className="inline-flex items-center justify-center flex-1 text-gray-900 bg-gray-100 hover:bg-gray-200 font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-sm"
          >
            View Guide
          </Link>
          <a
            href={guide.link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center flex-1 text-white font-bold py-3.5 px-4 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-md hover:shadow-lg"
            style={{ backgroundColor: platformColor }}
          >
            Buy Now
            <svg className="w-5 h-5 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
