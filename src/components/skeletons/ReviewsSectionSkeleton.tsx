"use client";

export function ReviewsSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden py-10 md:py-12 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-8 md:mb-10">
          <div className="h-10 sm:h-12 md:h-14 w-96 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-3" />
          <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-4" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto" />
          </div>
        </div>

        {/* Marquee skeleton */}
        <div className="relative">
          {/* Testimonial cards skeleton */}
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-72 sm:w-80 bg-white border-2 border-gray-100 rounded-xl p-5 shadow-md"
              >
                <div className="flex items-start gap-3 mb-3">
                  {/* Avatar skeleton */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
                  
                  <div className="flex-1 space-y-2">
                    {/* Name skeleton */}
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    
                    {/* Role skeleton */}
                    <div className="h-3 w-24 bg-gray-200 rounded" />
                    
                    {/* Stars skeleton */}
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div key={j} className="w-3 h-3 bg-gray-200 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Review text skeleton */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

