const fs = require('fs');
let code = fs.readFileSync('./components/PinterestGrid.jsx', 'utf8');

if (!code.includes('useCompare')) {
  code = code.replace(
    "import { useSearchParams } from 'next/navigation';",
    "import { useSearchParams } from 'next/navigation';\nimport { useCompare } from './CompareContext';"
  );
  code = code.replace(
    "import { Bookmark, ExternalLink, Share2, X, Play, Pause, Eye, ChevronLeft } from 'lucide-react';",
    "import { Bookmark, ExternalLink, Share2, X, Play, Pause, Eye, ChevronLeft, CheckSquare, Square } from 'lucide-react';"
  );
  code = code.replace(
    "const videoRef = useRef(null);",
    "const videoRef = useRef(null);\n  const { compareItems, toggleCompare, setIsCompareDrawerOpen } = useCompare();"
  );
  
  // Replace the action buttons div
  const oldButtons = `<div className="flex flex-col gap-2 mt-auto">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                 >
                   <Eye className="w-3.5 h-3.5" />
                   Review
                 </button>
                 <a 
                  href={item.link} 
                  onClick={(e) => e.stopPropagation()} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  Shop Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>`;
              
  const newButtons = `<div className="flex flex-col gap-2 mt-auto">
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                 >
                   <Eye className="w-3.5 h-3.5" />
                   Review
                 </button>
                 <div className="flex flex-row gap-2">
                   <a 
                    href={item.link} 
                    onClick={(e) => e.stopPropagation()} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white text-[10px] md:text-xs font-bold py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Shop Now <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCompare({
                        id: item.id || item.uid || item.title,
                        title: item.title,
                        image: item.image,
                        price: item.price || 'Check Website',
                        link: item.link
                      });
                      setIsCompareDrawerOpen(true);
                    }}
                    className="bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-600 text-[10px] md:text-xs font-bold px-3 py-2 md:py-2.5 rounded-lg transition-colors flex items-center justify-center"
                    title="Compare"
                  >
                    {compareItems && compareItems.some(c => c.id === (item.id || item.uid || item.title)) ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                  </button>
                 </div>
              </div>`;
              
  code = code.replace(oldButtons, newButtons);
  fs.writeFileSync('./components/PinterestGrid.jsx', code);
}
