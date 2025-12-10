"use client";

export function PartnersCarouselSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-100">
        {/* Title skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 sm:h-10 w-64 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4 shadow-sm" />
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full" />
        </div>

        {/* Partners grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200/60 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              {/* Logo skeleton with shimmer */}
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </div>
              
              {/* Name skeleton */}
              <div className="h-4 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

