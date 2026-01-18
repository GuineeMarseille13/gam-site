"use client";

export function ProductsSectionSkeleton() {
  return (
    <section className="w-full">
      {/* Header skeleton */}
      <div className="text-center sm:mb-6">
        <div className="h-10 sm:h-12 md:h-14 w-64 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-3" />
        <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-4" />
        <div className="space-y-2 max-w-3xl mx-auto px-4">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto" />
        </div>
      </div>

      {/* Products carousel skeleton */}
      <div className="relative max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-5 sm:gap-6 overflow-x-hidden py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[320px] sm:w-[360px]"
            >
              <div className="rounded-2xl p-[2px] bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  {/* Image skeleton */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                  </div>

                  {/* Content skeleton */}
                  <div className="p-4 space-y-3">
                    {/* Category skeleton */}
                    <div className="h-4 w-20 bg-gray-200 rounded" />

                    {/* Title skeleton */}
                    <div className="space-y-2">
                      <div className="h-5 bg-gray-200 rounded w-full" />
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                    </div>

                    {/* Description skeleton */}
                    <div className="space-y-1.5">
                      <div className="h-3 bg-gray-200 rounded w-full" />
                      <div className="h-3 bg-gray-200 rounded w-5/6" />
                    </div>

                    {/* Price and button skeleton */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-24 bg-gray-200 rounded" />
                      <div className="h-10 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

