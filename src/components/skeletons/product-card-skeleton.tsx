"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";
import { cn } from "@/helpers/utils";

interface ProductCardSkeletonProps {
  className?: string;
}

/**
 * Carte produit — alignée sur `ProductCard` : cadre dégradé ambre/jaune/lime, zone image,
 * titre, description courte, bloc prix + bouton.
 */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("h-full", className)}>
      <div className="h-full rounded-xl bg-gradient-to-br from-amber-200 via-yellow-200 to-lime-200 p-[2px] shadow-lg shadow-amber-100/50 sm:rounded-2xl">
        <div className="flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[10px] bg-white shadow-none sm:min-h-[24rem] sm:rounded-[14px]">
          <div className="relative aspect-[34/22] w-full shrink-0 overflow-hidden bg-gradient-to-br from-amber-50/90 via-yellow-50/80 to-lime-50/70 sm:aspect-auto sm:h-[200px] lg:h-[220px]">
            <div
              className="absolute inset-0 animate-pulse bg-muted/45 sm:bg-muted/40"
              aria-hidden
            />
          </div>

          <div className="flex min-h-0 flex-1 flex-col p-5">
            <PulseBar className="mb-2 h-5 w-[92%] rounded-md" />
            <div className="mb-4 min-h-[2.5rem] space-y-2">
              <PulseBar className="h-3.5 w-full rounded-sm" />
              <PulseBar className="h-3.5 w-[88%] rounded-sm" />
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1">
                <PulseBar className="h-3 w-14 rounded-sm opacity-60" />
                <PulseBar className="h-7 w-24 rounded-md sm:h-8 sm:w-28" />
              </div>
              <div className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-200 via-orange-200 to-amber-200 px-4 py-2.5 shadow-md sm:min-w-[8.5rem]">
                <span className="size-4 shrink-0 rounded bg-white/50" aria-hidden />
                <PulseBar className="h-4 w-20 rounded-full bg-white/40" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
