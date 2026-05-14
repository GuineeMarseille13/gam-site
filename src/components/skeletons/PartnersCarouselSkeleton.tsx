"use client";

import { cn } from "@/helpers/utils";
import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

const CARD_SHADOW =
  "0 4px 6px -1px rgba(0,0,0,0.05), 0 10px 15px -3px rgba(0,0,0,0.08), 0 20px 25px -5px rgba(0,0,0,0.06)";

const FLOAT_SHADOW =
  "0 20px 25px -5px rgba(0,0,0,0.08), 0 10px 10px -5px rgba(0,0,0,0.06), 0 0 40px rgba(0,0,0,0.05)";

/**
 * Contenu carte — aligné sur `PartnerCard` / `PoleCard` : fond dégradé, titre, 2 lignes desc, lien texte + icône.
 */
function PartnerCardSkeleton({ index }: { index: number }) {
  const accentRotate =
    index % 2 === 0
      ? "from-blue-500/12 via-indigo-500/10 to-purple-500/5"
      : "from-indigo-500/12 via-purple-500/10 to-blue-500/5";

  return (
    <div className="group relative">
      <div
        className="pointer-events-none absolute -inset-2 rounded-2xl opacity-90"
        style={{ background: "transparent", boxShadow: FLOAT_SHADOW }}
        aria-hidden
      />

      <div
        className="relative overflow-hidden rounded-xl border border-gray-200/60 bg-white"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div
          className={cn(
            "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rotate-45 bg-gradient-to-r opacity-80",
            accentRotate,
          )}
          aria-hidden
        />

        <div className="flex h-[420px] flex-col sm:h-[450px]">
          <div className="relative h-[280px] shrink-0 overflow-hidden border-b border-slate-100 bg-gradient-to-br from-slate-50 via-muted/40 to-slate-100/90">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-[5.5rem] items-center justify-center rounded-2xl border border-white/70 bg-white/75 shadow-inner ring-1 ring-black/[0.04]">
                <div className="size-12 animate-pulse rounded-lg bg-muted/80" />
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between bg-gradient-to-b from-white to-gray-50/50 p-5 sm:p-6">
            <div>
              <PulseBar className="mb-2 h-7 w-[90%] rounded-md sm:mb-3 sm:h-8 sm:w-[85%]" />
              <div className="space-y-2">
                <PulseBar className="h-3.5 w-full rounded-sm sm:h-4" />
                <PulseBar className="h-3.5 w-[88%] rounded-sm sm:h-4" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2" aria-hidden>
              <div className="h-4 w-28 animate-pulse rounded-md bg-blue-500/20 sm:w-32" />
              <div className="size-4 shrink-0 animate-pulse rounded-sm bg-blue-500/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SKELETON_CARD_COUNT = 3;

/**
 * Skeleton section partenaires — même arborescence et classes de conteneur que `PartnersCarousel`
 * (section, radial, max-w-7xl, en-tête mb-6 sm:mb-8, piste max-w-[100rem], overflow-visible, flex gap-10 justify-center pour ≤ slides visibles).
 */
export function PartnersCarouselSkeleton() {
  return (
    <section
      className="relative w-full overflow-x-hidden bg-gradient-to-b from-white via-gray-50/50 to-white py-10 sm:py-12 md:py-14"
      role="status"
      aria-busy="true"
      aria-label="Chargement des partenaires"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_50%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:mb-8">
          <PulseBar className="mx-auto mb-4 h-9 max-w-[min(100%,22rem)] rounded-lg sm:h-11 md:h-12 md:max-w-[28rem]" />
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <div className="mx-auto max-w-3xl space-y-2 px-4 text-base leading-relaxed text-gray-600 sm:text-lg">
            <PulseBar className="mx-auto h-4 w-full sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[96%] sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[88%] sm:h-5" />
          </div>
        </div>

        <div className="relative mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-visible py-6 sm:py-8 md:py-10">
            <div className="flex justify-center gap-10">
              {Array.from({ length: SKELETON_CARD_COUNT }).map((_, i) => (
                <div
                  key={i}
                  className="w-full max-w-[300px] shrink-0 sm:w-[280px] md:w-[300px]"
                >
                  <PartnerCardSkeleton index={i} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
