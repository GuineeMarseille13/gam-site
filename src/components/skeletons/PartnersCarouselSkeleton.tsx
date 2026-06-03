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
    <div className="group relative w-full py-2">
      <div
        className="pointer-events-none absolute -inset-2 rounded-2xl opacity-100"
        style={{ background: "transparent", boxShadow: FLOAT_SHADOW }}
        aria-hidden
      />

      <div
        className="relative overflow-hidden rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white via-gray-50 to-white"
        style={{ boxShadow: CARD_SHADOW }}
      >
        <div className="relative flex h-[420px] flex-col overflow-hidden rounded-2xl bg-white sm:h-[450px]">
          <div
            className={cn(
              "pointer-events-none absolute -top-24 -right-24 h-64 w-64 rotate-45 bg-gradient-to-r opacity-80",
              accentRotate,
            )}
            aria-hidden
          />

          <div className="relative h-[220px] shrink-0 overflow-hidden bg-gradient-to-br from-slate-50 via-muted/40 to-slate-100/90 sm:h-[240px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-[5.5rem] items-center justify-center rounded-2xl border border-white/70 bg-white/75 shadow-inner ring-1 ring-black/[0.04]">
                <div className="size-12 animate-pulse rounded-lg bg-muted/80" />
              </div>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden bg-gradient-to-b from-white to-gray-50/50 p-5 sm:p-6">
            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <PulseBar className="h-7 w-[90%] shrink-0 rounded-md sm:h-8 sm:w-[85%]" />
              <div className="min-h-0 flex-1 space-y-2">
                <PulseBar className="h-3.5 w-full rounded-sm sm:h-4" />
                <PulseBar className="h-3.5 w-[88%] rounded-sm sm:h-4" />
              </div>
              <PulseBar className="h-3 w-24 shrink-0 rounded-sm" />
            </div>

            <div className="mt-3 flex shrink-0 items-center gap-2 sm:mt-4" aria-hidden>
              <div className="h-4 w-28 animate-pulse rounded-md bg-blue-500/20 sm:w-32" />
              <div className="size-4 shrink-0 animate-pulse rounded-sm bg-blue-500/15" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton section partenaires — carte pleine largeur utile (mobile), plusieurs cartes sur grand écran.
 */
export function PartnersCarouselSkeleton() {
  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-white via-slate-50/40 to-white py-12 sm:py-14 md:py-16"
      role="status"
      aria-busy="true"
      aria-label="Chargement des partenaires"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.08),transparent_55%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <PulseBar className="mx-auto mb-4 h-9 max-w-[min(100%,22rem)] rounded-lg sm:h-11 md:h-12 md:max-w-[28rem]" />
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-blue-400 to-transparent" />
          <div className="mx-auto max-w-2xl space-y-2">
            <PulseBar className="mx-auto h-4 w-full sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[96%] sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[88%] sm:h-5" />
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mt-10 md:mt-12">
        <div className="relative mx-auto w-full max-w-[100rem] px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden py-4 sm:py-6">
            <div className="flex justify-center gap-6 px-4 sm:gap-8 md:justify-start md:overflow-hidden lg:gap-10">
              <div className="w-full max-w-[min(400px,100%)] shrink-0 md:hidden">
                <PartnerCardSkeleton index={0} />
              </div>
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="hidden w-[340px] shrink-0 md:block lg:w-[380px] xl:w-[400px]"
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
