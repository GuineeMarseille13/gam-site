"use client";

export function EventsSectionSkeleton() {
  return (
    <section className="w-full py-10 md:py-16 bg-gradient-to-b from-white via-gray-50/50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-10 md:mb-12">
          <div className="h-10 sm:h-12 md:h-14 w-80 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-6" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
          </div>
        </div>

        {/* Events grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200"
            >
              {/* Image skeleton with modern gradient */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>

              {/* Content skeleton */}
              <div className="p-5 sm:p-6 space-y-4">
                {/* Date badge skeleton */}
                <div className="h-6 w-32 bg-gray-200 rounded-full" />

                {/* Title skeleton */}
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-full" />
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                </div>

                {/* Description skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>

                {/* Location skeleton */}
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

