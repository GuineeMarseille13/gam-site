"use client";

export function VolunteersSectionSkeleton() {
  return (
    <section className="relative w-full py-12 md:py-16 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="text-center mb-10 md:mb-12">
          <div className="h-10 sm:h-12 md:h-14 w-96 mx-auto bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="h-1 w-24 mx-auto bg-gray-200 rounded-full mb-6" />
          <div className="space-y-2 max-w-2xl mx-auto">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto" />
          </div>
        </div>

        {/* Volunteers container skeleton */}
        <div className="relative min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
          {/* Floating volunteers skeleton - using grid for better distribution */}
          <div className="relative w-full h-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8 sm:gap-12">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center space-y-2"
              >
                {/* Avatar skeleton */}
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 animate-pulse border-4 border-white shadow-lg" />
                  {/* Badge skeleton */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-300 border-2 border-white animate-pulse" />
                </div>
                
                {/* Name skeleton */}
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                
                {/* Role skeleton */}
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

