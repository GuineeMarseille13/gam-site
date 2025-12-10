"use client";

export function GAMSloganSkeleton() {
  return (
    <div className="bg-gradient-to-br from-gray-50 via-gray-100/80 to-stone-100 backdrop-blur-sm text-gray-800 py-8 md:py-10 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Title skeleton */}
        <div className="mb-6 md:mb-8">
          <div className="h-16 sm:h-20 md:h-24 w-64 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Description skeleton */}
        <div className="space-y-2 max-w-2xl mx-auto mb-6 md:mb-8">
          <div className="h-5 bg-gray-200 rounded w-full animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-4/5 mx-auto animate-pulse" />
        </div>

        {/* Social links skeleton */}
        <div className="flex flex-col items-center gap-4">
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4 md:gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

