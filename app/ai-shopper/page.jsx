import AIShopperClient from '../../components/AIShopperClient';
import Link from 'next/link';

export const metadata = {
  title: 'Smart Shop | Clickys',
  description: 'Let our AI find the best products and deals across the web for you.',
};

export default function AIShopperPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* PREMIUM HERO SECTION */}
        <div className="mb-12 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-none mb-6 mt-8">
            Welcome to Clickys <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-600">Smart Shop</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-medium">
            Smart product discovery powered by intelligent recommendations.
          </p>
        </div>

        {/* FEATURED CARDS */}
        <div className="flex overflow-x-auto pb-6 -mx-4 px-4 snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 md:mx-0 md:px-0 md:overflow-visible md:pb-0 mb-12 sm:mb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {/* Card 1: Buy a Gift */}
          <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center group relative rounded-[24px] p-[1px] bg-gradient-to-b from-orange-400/40 to-orange-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full w-full bg-white/80 backdrop-blur-xl rounded-[23px] overflow-hidden p-5 flex flex-col gap-2 border border-white/50 shadow-md transition-colors duration-300 group-hover:bg-white/95">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-orange-600 transition-colors duration-300">Buy a Gift</h2>
              <p className="text-gray-600 flex-grow text-sm">
                Find the perfect gift in seconds.
              </p>
              <a href="#chat-interface" className="inline-flex items-center justify-center w-full px-5 py-2.5 mt-3 text-sm font-bold text-white transition-all duration-300 bg-gray-900 border border-transparent rounded-full group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 hover:shadow-lg hover:shadow-orange-500/30">
                Start Gift Finder
              </a>
            </div>
          </div>
          
          {/* Card 2: Track Price */}
          <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center group relative rounded-[24px] p-[1px] bg-gradient-to-b from-emerald-400/40 to-green-500/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full w-full bg-white/80 backdrop-blur-xl rounded-[23px] overflow-hidden p-5 flex flex-col gap-2 border border-white/50 shadow-md transition-colors duration-300 group-hover:bg-white/95">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors duration-300">Track Price</h2>
              <p className="text-gray-600 flex-grow text-sm">
                Get price drop alerts instantly.
              </p>
              <a href="#chat-interface" className="inline-flex items-center justify-center w-full px-5 py-2.5 mt-3 text-sm font-bold text-white transition-all duration-300 bg-gray-900 border border-transparent rounded-full group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-green-500 hover:shadow-lg hover:shadow-emerald-500/30">
                Set Price Alert
              </a>
            </div>
          </div>

          {/* Card 3: Compare Price */}
          <div className="w-[75vw] sm:w-[280px] md:w-full shrink-0 snap-center group relative rounded-[24px] p-[1px] bg-gradient-to-b from-orange-400/40 to-green-400/40 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.3)]">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-500 rounded-[24px] blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative h-full w-full bg-white/80 backdrop-blur-xl rounded-[23px] overflow-hidden p-5 flex flex-col gap-2 border border-white/50 shadow-md transition-colors duration-300 group-hover:bg-white/95">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-green-600 transition-all duration-300">Compare Price</h2>
              <p className="text-gray-600 flex-grow text-sm">
                Find the best deal across stores.
              </p>
              <a href="#chat-interface" className="inline-flex items-center justify-center w-full px-5 py-2.5 mt-3 text-sm font-bold text-white transition-all duration-300 bg-gray-900 border border-transparent rounded-full group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-green-600 hover:shadow-lg hover:shadow-orange-500/30">
                Compare Now
              </a>
            </div>
          </div>
        </div>
        
        <div id="chat-interface" className="scroll-mt-6">
          <AIShopperClient />
        </div>
      </div>
    </>
  );
}
