import fs from 'fs';
let code = fs.readFileSync('./components/guides/GuideCard.jsx', 'utf8');

if (!code.includes('useCompare')) {
  // Add "use client" and imports
  code = '"use client";\n' + code;
  code = code.replace(
    "import Image from 'next/image';",
    "import Image from 'next/image';\nimport { useCompare } from '../CompareContext';\nimport { Square, CheckSquare } from 'lucide-react';"
  );
  
  // Add hook call
  code = code.replace(
    "export default function GuideCard({ guide }) {",
    "export default function GuideCard({ guide }) {\n  const { compareItems = [], toggleCompare, setIsCompareDrawerOpen } = useCompare() || {};"
  );
  
  // Add compare button
  const oldButtons = `<div className="flex gap-3">
          <Link
            href={\`/guides/\${guide.slug}\`}
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
        </div>`;
        
  const newButtons = `<div className="flex flex-col gap-2">
        <div className="flex gap-3">
          <Link
            href={\`/guides/\${guide.slug}\`}
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
        {toggleCompare && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare({
                id: guide.id || guide.slug || guide.title,
                title: guide.title,
                image: guide.image,
                price: guide.price || 'Check Website',
                link: guide.link
              });
              setIsCompareDrawerOpen(true);
            }}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 mt-1"
          >
            {compareItems && compareItems.some(c => c.id === (guide.id || guide.slug || guide.title)) ? (
               <><CheckSquare className="w-4 h-4" /> Remove from Compare</>
            ) : (
               <><Square className="w-4 h-4" /> Add to Compare</>
            )}
          </button>
        )}
        </div>`;
        
  code = code.replace(oldButtons, newButtons);
  fs.writeFileSync('./components/guides/GuideCard.jsx', code);
}
