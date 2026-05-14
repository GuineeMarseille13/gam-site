"use client";

import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

const FLOAT_POSITIONS = [
  { left: "8%", top: "12%" },
  { left: "58%", top: "18%" },
  { left: "28%", top: "42%" },
  { left: "72%", top: "48%" },
  { left: "18%", top: "68%" },
  { left: "62%", top: "72%" },
  { left: "42%", top: "28%" },
  { left: "38%", top: "82%" },
]

/** Aligné sur `VolunteersSection` : grille lg:2, gauche texte + pile d’avatars, droite zone nuage. */
export function VolunteersSectionSkeleton() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background px-4 sm:px-6 lg:px-8">
      <div className="relative z-10 w-full">
        <div className="grid min-h-[75vh] items-stretch gap-4 lg:grid-cols-2">
          <div className="flex flex-col justify-center space-y-8 py-10 lg:py-0">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-muted px-4 py-1.5">
              <PulseBar className="size-1.5 rounded-full" />
              <PulseBar className="h-3 w-40 rounded-full" />
            </div>

            <div className="space-y-4">
              <PulseBar className="h-10 w-full max-w-md rounded-lg lg:h-12" />
              <PulseBar className="h-10 w-[92%] max-w-sm rounded-lg lg:h-12" />
              <div className="flex items-center gap-2 pt-1">
                <PulseBar className="h-0.5 w-10 rounded-full" />
                <PulseBar className="h-0.5 w-4 rounded-full" />
              </div>
            </div>

            <div className="space-y-3">
              <PulseBar className="h-4 w-full max-w-lg" />
              <PulseBar className="h-4 w-[96%] max-w-md" />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <PulseBar
                    key={i}
                    className="size-10 rounded-full border-2 border-background ring-2 ring-white/40"
                  />
                ))}
              </div>
              <PulseBar className="h-4 w-36" />
            </div>
          </div>

          <div className="relative min-h-[600px] w-full md:min-h-[650px]">
            <div className="absolute inset-0 overflow-hidden rounded-3xl border border-border/60 bg-muted/25 dark:bg-muted/15">
              {FLOAT_POSITIONS.map((pos, i) => (
                <div
                  key={i}
                  className="absolute"
                  style={{ left: pos.left, top: pos.top }}
                >
                  <PulseBar className="size-16 rounded-full border-4 border-white shadow-lg sm:size-[68px]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
