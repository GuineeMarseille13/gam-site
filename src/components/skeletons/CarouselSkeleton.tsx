"use client";

import { cn } from "@/helpers/utils";

export function CarouselSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative w-full h-[400px] sm:h-[500px] md:h-[600px] rounded-xl overflow-hidden shadow-2xl">
        {/* Background gradient with shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
        </div>
        
        {/* Content overlay skeleton */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 space-y-4 z-10">
          {/* Title skeleton with gradient */}
          <div className="h-8 sm:h-10 md:h-12 w-3/4 max-w-2xl bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg animate-pulse shadow-lg" />
          
          {/* Description skeleton */}
          <div className="space-y-2 w-2/3 max-w-xl">
            <div className="h-4 bg-white/70 rounded w-full backdrop-blur-sm" />
            <div className="h-4 bg-white/70 rounded w-5/6 backdrop-blur-sm" />
            <div className="h-4 bg-white/70 rounded w-4/6 backdrop-blur-sm" />
          </div>
        </div>

        {/* Dots skeleton with modern style */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 bg-black/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 z-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "rounded-full transition-all duration-300",
                i === 1
                  ? "w-16 h-4 bg-white rounded-full"
                  : "w-4 h-4 bg-white/50 rounded-full hover:bg-white/70"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

