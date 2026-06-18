"use client"

import { motion } from "framer-motion"

import { cn } from "@/helpers/utils"

type AssociationSectionTitleAlign = "center" | "start"

interface AssociationSectionTitleProps {
  readonly title: string
  readonly description?: string
  readonly align?: AssociationSectionTitleAlign
  readonly className?: string
  readonly titleClassName?: string
  readonly animationDelay?: number
}

const TITLE_TYPOGRAPHY = {
  center: "text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] sm:text-3xl md:text-4xl",
  start: "text-xl font-semibold leading-[1.12] tracking-[-0.025em] sm:text-2xl md:text-3xl",
} as const

const TITLE_GRADIENT =
  "bg-gradient-to-br from-theme-green via-emerald-500 to-theme-green-dark bg-clip-text text-transparent dark:from-theme-green-light dark:via-emerald-300 dark:to-theme-green"

/**
 * Titre de section pour les onglets « Notre association ».
 * `align="start"` pour les titres au-dessus du contenu en colonnes ; `center` pour les onglets pleine largeur.
 */
function AssociationSectionTitle({
  title,
  description,
  align = "center",
  className,
  titleClassName,
  animationDelay = 0,
}: AssociationSectionTitleProps) {
  const isStart = align === "start"
  const HeadingTag = isStart ? "h3" : "h2"

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: animationDelay,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn(
        "relative mb-8 w-full min-w-0 sm:mb-10 md:mb-12",
        isStart ? "max-w-7xl text-left" : "mx-auto max-w-3xl text-center",
        className,
      )}
    >
      {!isStart ? (
        <div
          className="pointer-events-none absolute inset-x-8 top-1/2 -z-10 h-24 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--theme-green)/0.12,transparent_70%)] blur-2xl dark:bg-[radial-gradient(ellipse_at_center,var(--theme-green)/0.18,transparent_68%)]"
          aria-hidden
        />
      ) : null}

      <HeadingTag
        className={cn(
          "text-balance break-words",
          TITLE_TYPOGRAPHY[align],
          TITLE_GRADIENT,
          isStart ? "max-w-3xl" : "mx-auto max-w-2xl",
          titleClassName,
        )}
      >
        {title}
      </HeadingTag>

      {isStart ? (
        <div
          className="mt-4 h-0.5 w-14 rounded-full bg-gradient-to-r from-theme-green via-emerald-500/80 to-theme-green/20 sm:mt-5 sm:w-16 dark:from-theme-green-light dark:via-emerald-400/70 dark:to-theme-green/25"
          aria-hidden
        />
      ) : (
        <div className="relative mx-auto mt-5 w-full max-w-xs sm:mt-6 sm:max-w-sm" aria-hidden>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-theme-green/55 to-transparent dark:via-theme-green-light/45" />
          <div className="absolute inset-x-[15%] top-1/2 h-2 -translate-y-1/2 rounded-full bg-theme-green/25 blur-md dark:bg-theme-green-light/20" />
        </div>
      )}

      {description ? (
        <p
          className={cn(
            "mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base md:text-[1.0625rem]",
            isStart ? "max-w-xl" : "mx-auto mt-5 sm:mt-6",
          )}
        >
          {description}
        </p>
      ) : null}
    </motion.header>
  )
}

interface AssociationSectionTitleSkeletonProps {
  readonly align?: AssociationSectionTitleAlign
  readonly withDescription?: boolean
  readonly className?: string
}

/**
 * Placeholder de chargement aligné sur `AssociationSectionTitle`.
 */
function AssociationSectionTitleSkeleton({
  align = "center",
  withDescription = false,
  className,
}: AssociationSectionTitleSkeletonProps) {
  const isStart = align === "start"

  return (
    <div
      className={cn(
        "mb-8 w-full animate-pulse sm:mb-10 md:mb-12",
        isStart ? "max-w-7xl text-left" : "mx-auto max-w-3xl text-center",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "rounded-xl bg-muted",
          isStart ? "h-8 w-4/5 max-w-sm sm:h-9 md:h-10" : "mx-auto h-9 w-full max-w-md sm:h-11 md:h-12",
        )}
      />
      <div
        className={cn(
          "mt-4 rounded-full bg-muted/80 sm:mt-5",
          isStart ? "h-0.5 w-14 sm:w-16" : "mx-auto h-px w-full max-w-xs sm:max-w-sm",
        )}
      />
      {withDescription ? (
        <div className={cn("mt-4 space-y-2 sm:mt-5", !isStart && "mx-auto")}>
          <div className={cn("h-4 rounded-md bg-muted/60", isStart ? "w-full max-w-lg" : "mx-auto w-full max-w-lg")} />
          <div className={cn("h-4 rounded-md bg-muted/45", isStart ? "w-4/5 max-w-md" : "mx-auto w-4/5 max-w-md")} />
        </div>
      ) : null}
    </div>
  )
}

export { AssociationSectionTitle, AssociationSectionTitleSkeleton }
