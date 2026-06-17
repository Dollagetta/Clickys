import Image from 'next/image';

export default function PinterestGrid() {
  // Placeholder data for the masonry grid
  const items = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxzbmVha2Vyc3xlbnwwfHx8fDE3MDkyMjkwNjh8MA&ixlib=rb-4.0.3&q=80&w=1080',
      title: 'Vibrant Red Sneakers for Everyday Style',
      description: 'Comfortable and stylish sneakers perfect for casual outings and light workouts. Features memory foam insoles.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyfHxtYW58ZW58MHx8fHwxNzA5MjI5MTA1fDA&ixlib=rb-4.0.3&q=80&w=1080',
      title: 'Classic Denim Jacket',
      description: 'A timeless denim jacket that adds an edgy touch to any casual outfit. 100% cotton with a vintage wash.',
      site: 'via Myntra',
      aspectRatio: 'aspect-[3/4]'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzfGVufDB8fHx8MTcwOTIyOTEyOHww&ixlib=rb-4.0.3&q=80&w=1080',
      title: 'Wireless Noise-Canceling Over-Ear Headphones',
      description: 'Experience immersive audio with active noise cancellation, deep bass, and 30-hour battery life.',
      site: 'via Flipkart',
      aspectRatio: 'aspect-[4/3]'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1627384113972-f4c0392fe5aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHw1fHxzZXJ1bXxlbnwwfHx8fDE3MDkyMjkxNTd8MA&ixlib=rb-4.0.3&q=80&w=1080',
      title: 'Hydrating Vitamin C Face Serum',
      description: 'Rejuvenate your skin with this deeply hydrating and glowing facial serum. Cruelty-free and vegan.',
      site: 'via Nykaa',
      aspectRatio: 'aspect-[4/5]'
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwyMHx8c21hcnR3YXRjaHxlbnwwfHx8fDE3MDkyMjkxOTN8MA&ixlib=rb-4.0.3&q=80&w=1080',
      title: 'Fitness Smartwatch Tracker',
      description: 'Keep track of your health metrics, steps, heart rate, and notifications on the go with a vibrant OLED display.',
      site: 'via Amazon',
      aspectRatio: 'aspect-square'
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1610824352934-c10d87b700cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTYyMDF8MHwxfHNlYXJjaHwzM3x8Y29mZmVlJTIwbWFrZXJ8ZW58MHx8fHwxNzA5MjI5MjQzfDA&ixlib=rb-4.0.3&q=80&w=1080',
      title: 'Premium Espresso Coffee Maker',
      description: 'Brew cafe-quality espresso at home with this sleek, compact machine featuring a 15-bar pump.',
      site: 'via Clickys.in',
      aspectRatio: 'aspect-[2/3]'
    },
     {
      id: 7,
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
      title: 'Minimalist Desk Lamp with Wireless Charging',
      description: 'Adjustable LED light with a clean, modern aesthetic for your workspace. Includes a built-in Qi wireless charger.',
      site: 'via Clickys.in',
      aspectRatio: 'aspect-[3/2]'
    }
  ];

  return (
    <section className="py-16 mx-4 md:mx-auto max-w-7xl">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Trending Inspiration</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover the latest styles and curated looks. (Placeholder for Prismic Slices)</p>
      </div>
      
      {/* Masonry Grid Container */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-3xl overflow-hidden bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col cursor-pointer">
            
            {/* Image Container with varying aspect ratio */}
            <div className={`relative w-full ${item.aspectRatio} overflow-hidden bg-gray-50`}>
              <Image 
                src={item.image} 
                alt={item.title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (maxwidth: 1280px) 33vw, 25vw"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Gradient (Optional: subtle shadow at bottom for text contrast if overlaid, but we are placing text below) */}
              
              {/* Site Badge overlay */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-800 z-10">
                {item.site}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col gap-2 bg-white">
              <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {item.description}
              </p>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}
