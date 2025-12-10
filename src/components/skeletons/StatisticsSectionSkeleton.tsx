"use client";

export function StatisticsSectionSkeleton() {
  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-10 md:mb-12">
          <div className="h-10 sm:h-12 md:h-14 w-80 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-6" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto" />
          </div>
        </div>

        {/* Statistics grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-50" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-3">
                {/* Icon skeleton */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                
                {/* Value skeleton */}
                <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse" />
                
                {/* Label skeleton */}
                <div className="space-y-1.5 w-full">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

