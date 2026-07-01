export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-6"></div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Guides...</h2>
      <p className="text-gray-500">Connecting to our product database.</p>
      
      {/* Skeleton cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-5 animate-pulse">
            <div className="aspect-video bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="h-10 bg-gray-200 rounded-xl w-full"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
