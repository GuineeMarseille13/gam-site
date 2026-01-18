"use client";

export function PresentationSectionSkeleton() {
  return (
    <section className="w-full sm:py-8 md:py-10 bg-gradient-to-b from-white via-gray-50/50 to-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header skeleton */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="h-10 sm:h-12 md:h-14 w-48 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-6" />
        </div>

        {/* Main card skeleton */}
        <div className="relative rounded-3xl bg-gradient-to-br from-white via-gray-50/80 to-white p-6 sm:p-8 md:p-10 border border-gray-200/60 backdrop-blur-sm shadow-lg">
          {/* Content skeleton */}
          <div className="space-y-6">
            {/* Paragraphs skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            </div>
            
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse" />
            </div>

            {/* Features grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200/50"
                >
                  {/* Icon skeleton */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  
                  {/* Text skeleton */}
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

