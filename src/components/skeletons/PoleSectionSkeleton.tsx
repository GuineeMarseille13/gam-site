"use client";

export function PoleSectionSkeleton() {
  return (
    <section className="w-full py-5 sm:py-8 md:py-10 bg-gradient-to-b from-white via-gray-50/30 to-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center sm:mb-8 md:mb-10">
          <div className="h-10 sm:h-12 md:h-14 w-80 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-4" />
          <div className="space-y-2 max-w-3xl mx-auto">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto" />
          </div>
        </div>

        {/* Poles grid skeleton */}
        <div className="flex flex-wrap gap-6 sm:gap-8 justify-center items-stretch">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-2rem)] lg:w-[calc(25%-2rem)] max-w-sm"
            >
              <div className="h-full rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow">
                {/* Image skeleton */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>

                {/* Content skeleton */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Title skeleton */}
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />

                  {/* Description skeleton */}
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>

                  {/* Button skeleton */}
                  <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse mt-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

