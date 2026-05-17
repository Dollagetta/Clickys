import Link from 'next/link';
import { PrismicRichText, PrismicText } from '@prismicio/react';

/**
 * @typedef {import("@prismicio/client").Content.AiRecommendationsSlice} AiRecommendationsSlice
 * @typedef {import("@prismicio/react").SliceComponentProps<AiRecommendationsSlice>} AiRecommendationsProps
 * @param {AiRecommendationsProps}
 */
const AIRecommendations = ({ slice }) => {
  const { title, description } = slice.primary;

  return (
    <section className="py-12 my-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-[2.5rem] p-8 md:p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-green-200">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-black/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-block text-5xl mb-6 animate-bounce">🤖</div>
            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
              <PrismicText field={title} />
            </h2>
            <div className="text-lg md:text-xl text-green-50 mb-8 max-w-2xl mx-auto opacity-90">
              <PrismicRichText field={description} />
            </div>
            
            <Link 
              href="/ai-shopper"
              className="inline-flex items-center px-8 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 transition-all transform hover:scale-105 shadow-xl"
            >
              Start Chatting with AI
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;
