"use client";

import { cn } from "@/helpers/utils";
import { PulseBar } from "@/components/skeletons/home-skeleton-primitives";

const TIMELINE_LINE =
  "absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-yellow-400 to-lime-400";

/** Pastille centrale desktop — même taille que le point réel (w-4 h-4 + bordure). */
function TimelineDotSkeleton() {
  return (
    <div
      className="size-4 shrink-0 rounded-full border-4 border-white bg-gradient-to-r from-amber-400 to-yellow-400 shadow-lg dark:border-background"
      aria-hidden
    />
  );
}

/** Badge date + ligne lieu — alignement comme sur la timeline desktop. */
function DateLocationRowSkeleton({ alignEnd }: { alignEnd: boolean }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2",
        alignEnd ? "justify-end" : "justify-start",
      )}
    >
      <PulseBar className="h-8 w-36 rounded-full sm:w-40" />
      <PulseBar className="h-4 w-28 rounded-md" />
    </div>
  );
}

/** Bloc média — `aspect-video`, `rounded-2xl`, largeurs `w-80 lg:w-96`. */
function EventMediaBlockSkeleton() {
  return (
    <div className="w-full max-w-md shrink-0 sm:max-w-none md:w-80 lg:w-96">
      <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-200/40 bg-muted animate-pulse shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-border/50 dark:bg-muted/60" />
    </div>
  );
}

/** Colonne texte — titre + paragraphe, toujours alignés à gauche (bloc poussé vers l’axe par le parent). */
function EventTextBlockSkeleton({ towardSpine }: { towardSpine: "left" | "right" }) {
  return (
    <div
      className={cn(
        "max-w-md space-y-3 text-left",
        towardSpine === "right" ? "ml-auto pr-10" : "pl-10",
      )}
    >
      <PulseBar className="h-7 w-[92%] rounded-lg sm:h-8 md:h-9" />
      <PulseBar className="h-4 w-full" />
      <PulseBar className="h-4 w-full" />
      <PulseBar className="h-4 w-[88%]" />
    </div>
  );
}

/**
 * Desktop : deux lignes (date sur un côté du fil, texte / média en alternance).
 * `isImageOnLeft` = index impair dans `EventsSection` (image à gauche, date à gauche en ligne 1).
 */
function DesktopTimelineItemSkeleton({ isImageOnLeft }: { isImageOnLeft: boolean }) {
  return (
    <div className="relative pb-2">
      {/* Ligne 1 : date + point + date (un seul côté rempli selon l’alternance) */}
      <div className="mb-3 flex w-full items-center">
        <div className="flex w-1/2 justify-end pr-2">
          {isImageOnLeft ? (
            <DateLocationRowSkeleton alignEnd={true} />
          ) : (
            <span className="inline-block min-h-[2rem] min-w-[1px]" aria-hidden />
          )}
        </div>
        <TimelineDotSkeleton />
        <div className="flex w-1/2 justify-start pl-2">
          {!isImageOnLeft ? (
            <DateLocationRowSkeleton alignEnd={false} />
          ) : (
            <span className="inline-block min-h-[2rem] min-w-[1px]" aria-hidden />
          )}
        </div>
      </div>

      {/* Ligne 2 : texte | média ou média | texte */}
      <div className="flex w-full items-start">
        <div className="flex w-1/2 justify-end pr-2">
          {!isImageOnLeft ? (
            <EventTextBlockSkeleton towardSpine="right" />
          ) : (
            <EventMediaBlockSkeleton />
          )}
        </div>
        <div className="w-4 shrink-0" aria-hidden />
        <div className="flex w-1/2 justify-start pl-2">
          {isImageOnLeft ? (
            <EventTextBlockSkeleton towardSpine="left" />
          ) : (
            <EventMediaBlockSkeleton />
          )}
        </div>
      </div>
    </div>
  );
}

/** Mobile : même ordre que `TimelineItem` mobile — pastille, date, titre, texte, média. */
function MobileTimelineItemSkeleton() {
  return (
    <div className="relative flex flex-col gap-4 pl-12">
      <div
        className="absolute top-6 left-4 z-10 size-3 rounded-full border-2 border-white bg-gradient-to-r from-amber-400 to-yellow-400 shadow-md dark:border-background"
        aria-hidden
      />
      <div className="flex flex-wrap items-center gap-2">
        <PulseBar className="h-8 w-36 rounded-full sm:w-40" />
        <PulseBar className="h-4 w-24 rounded-md" />
      </div>
      <PulseBar className="h-7 w-[92%] max-w-xl rounded-lg sm:h-8" />
      <div className="space-y-2">
        <PulseBar className="h-4 w-full" />
        <PulseBar className="h-4 w-full" />
        <PulseBar className="h-4 w-[88%]" />
      </div>
      <EventMediaBlockSkeleton />
    </div>
  );
}

/** Bouton « Voir plus d’événements » — forme et couleurs proches du CTA réel. */
function SeeMoreButtonSkeleton() {
  return (
    <div className="flex justify-center">
      <div
        className={cn(
          "relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full px-7 md:h-12 md:px-8",
          "bg-gradient-to-r from-amber-500 via-yellow-500 to-lime-500",
          "shadow-[0_2px_8px_rgba(245,158,11,0.25)]",
        )}
      >
        <div className="absolute inset-0 animate-pulse bg-white/15" aria-hidden />
        <PulseBar className="relative z-[1] h-4 w-44 rounded-md bg-white/35 md:w-52" />
        <PulseBar className="relative z-[1] size-4 shrink-0 rounded bg-white/30 md:size-5" />
      </div>
    </div>
  );
}

/**
 * Skeleton section Nos Événements — aligné sur `EventsSection` :
 * - mobile : ligne à `left-4`, items `pl-12`, `space-y-6`
 * - md+ : ligne centrée (`left-1/2`), alternance image gauche / droite comme `TimelineItem`
 */
export function EventsSectionSkeleton() {
  const desktopIndices = [0, 1, 2, 3] as const

  return (
    <section className="relative w-full overflow-hidden py-10 md:py-12">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-slate-50/50 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center md:mb-10">
          <PulseBar className="mx-auto mb-4 h-10 max-w-[260px] rounded-lg sm:h-12 md:h-14 md:max-w-[300px]" />
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-transparent via-amber-300/80 to-transparent dark:via-amber-500/50" />
          <div className="mx-auto max-w-3xl space-y-2">
            <PulseBar className="mx-auto h-4 w-full sm:h-5" />
            <PulseBar className="mx-auto h-4 w-[88%] sm:h-5" />
          </div>
        </div>

        {/* Timeline mobile */}
        <div className="relative md:hidden">
          <div className={cn(TIMELINE_LINE, "left-4")} />
          <div className="space-y-6">
            {desktopIndices.map((i) => (
              <MobileTimelineItemSkeleton key={`m-${i}`} />
            ))}
          </div>
        </div>

        {/* Timeline desktop */}
        <div className="relative hidden md:block">
          <div className={cn(TIMELINE_LINE, "left-8 md:left-1/2 md:-translate-x-1/2")} />
          <div className="space-y-8">
            {desktopIndices.map((i) => (
              <DesktopTimelineItemSkeleton
                key={`d-${i}`}
                isImageOnLeft={i % 2 === 1}
              />
            ))}
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <SeeMoreButtonSkeleton />
        </div>
      </div>
    </section>
  );
}
