"use client"

import { useMemo, type ReactNode } from "react"
import { motion } from "motion/react"
import { ImageWithFallback } from "@/components/ui/image-with-fallback"
import { Button } from "@/components/ui/button"
import { useTeamData } from "@/hooks/use-association"
import { cn } from "@/helpers/utils"
import type { TeamMember } from "@/types/association"
import { partitionTeamByHierarchy } from "@/components/association/_utils/team-hierarchy"
import { TeamMemberDescription } from "@/components/association/team-member-description"
import { AssociationSectionTitle } from "@/components/association/association-section-title"

// Configuration des animations
const ANIMATION_CONFIG = {
  delays: {
    title: 0.1,
    president: 0.2,
    vicePresidents: 0.28,
    bureauTail: 0.36,
    overflow: 0.48,
  },
  duration: 0.6,
} as const

type TeamAnimationBand = keyof Omit<typeof ANIMATION_CONFIG.delays, "title">

const MOTION_EASE = [0.22, 1, 0.36, 1] as const
const MOTION_SPRING = { type: "spring" as const, stiffness: 420, damping: 30, mass: 0.85 }

/** Fond de section : profondeur, halo vert discret, grain léger (singularité vs autres onglets). */
const TEAM_SECTION_SHELL =
  "relative isolate overflow-hidden bg-gradient-to-b from-background via-muted/15 to-muted/35 dark:from-background dark:via-muted/8 dark:to-muted/20"
const TEAM_SECTION_AMBIENT =
  "pointer-events-none absolute inset-x-0 top-0 h-[min(55vh,26rem)] -translate-y-[18%] bg-[radial-gradient(ellipse_85%_55%_at_50%_0%,var(--theme-green)/0.14,transparent_68%)] dark:bg-[radial-gradient(ellipse_85%_55%_at_50%_0%,var(--theme-green)/0.22,transparent_62%)]"
const TEAM_SECTION_GRID =
  "pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,transparent_0%,var(--border)/0.35_50%,transparent_100%)] bg-size-[min(100%,48rem)_100%] bg-top bg-no-repeat opacity-[0.45] dark:opacity-[0.35]"
const TEAM_SECTION_DOTS =
  "pointer-events-none absolute inset-0 text-muted-foreground/25 opacity-[0.5] bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] [background-size:22px_22px] dark:text-muted-foreground/35 dark:opacity-[0.45]"

/** Carte président : contraste, anneau, léger dégradé (effet « mise en lumière »). */
const SURFACE_FEATURED =
  "relative overflow-hidden border border-theme-green/25 bg-gradient-to-br from-card via-card to-muted/30 shadow-[0_18px_48px_-26px_rgba(0,0,0,0.12),inset_0_1px_0_0_rgba(255,255,255,0.07)] ring-1 ring-black/[0.04] backdrop-blur-xl dark:from-card/90 dark:via-card/80 dark:to-muted/20 dark:shadow-[0_24px_56px_-22px_rgba(0,0,0,0.5)] dark:ring-white/[0.06]"
const SURFACE_CABINET =
  "relative overflow-hidden border border-border/50 bg-card/85 shadow-[0_1px_0_0_rgba(255,255,255,0.68)_inset,0_1px_2px_rgba(15,23,42,0.04),0_10px_24px_-6px_rgba(15,23,42,0.07),0_24px_48px_-14px_rgba(15,23,42,0.06)] ring-1 ring-black/[0.04] backdrop-blur-md dark:border-border/70 dark:bg-card/58 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_8px_26px_-4px_rgba(0,0,0,0.52),0_22px_50px_-12px_rgba(0,0,0,0.42)] dark:ring-white/[0.06]"
const SURFACE_TAIL =
  "relative overflow-hidden border border-border/45 bg-card/82 shadow-[0_1px_0_0_rgba(255,255,255,0.62)_inset,0_1px_2px_rgba(15,23,42,0.035),0_8px_20px_-6px_rgba(15,23,42,0.065),0_18px_40px_-12px_rgba(15,23,42,0.05)] ring-1 ring-black/[0.035] backdrop-blur-sm dark:border-border/60 dark:bg-card/52 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset,0_6px_22px_-4px_rgba(0,0,0,0.48),0_18px_44px_-10px_rgba(0,0,0,0.38)] dark:ring-white/[0.05]"
/** Autres membres : ton neutre, discret. */
const SURFACE_OVERFLOW =
  "relative overflow-hidden border border-border/40 bg-muted/30 shadow-[0_1px_0_0_rgba(255,255,255,0.55)_inset,0_1px_2px_rgba(15,23,42,0.03),0_6px_16px_-4px_rgba(15,23,42,0.055),0_14px_32px_-10px_rgba(15,23,42,0.045)] ring-1 ring-black/[0.03] backdrop-blur-sm dark:bg-muted/18 dark:shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset,0_8px_24px_-6px_rgba(0,0,0,0.48),0_16px_36px_-10px_rgba(0,0,0,0.38)] dark:ring-white/[0.04]"

/** Variantes : président (mise en page horizontale ≥ sm), autres fiches verticales. */
const CARD_VARIANTS = {
  president: {
    shell: "w-full max-w-md sm:max-w-lg md:max-w-xl",
    rounded: "rounded-2xl sm:rounded-3xl",
    padding:
      "gap-5 px-5 pb-6 pt-9 sm:flex-row sm:items-center sm:gap-6 sm:px-7 sm:pb-6 sm:pt-7 md:gap-7",
    photo: "size-[5.25rem] shrink-0 sm:size-24 md:size-28",
    name: "text-lg font-bold tracking-tight sm:text-xl md:text-2xl",
    role: "text-xs font-semibold leading-snug sm:text-sm",
    imageSizes: "(max-width: 640px) 88px, (max-width: 768px) 112px, 112px",
  },
  vicePresident: {
    shell: "w-full",
    rounded: "rounded-2xl",
    padding: "gap-4 px-5 pb-5 pt-8 sm:gap-4 sm:px-6 sm:pb-6 sm:pt-9",
    photo: "size-20 sm:size-24 md:size-28",
    name: "text-base font-bold tracking-tight sm:text-lg md:text-xl",
    role: "text-[11px] font-semibold leading-snug sm:text-xs",
    imageSizes: "(max-width: 640px) 80px, (max-width: 768px) 96px, 112px",
  },
  other: {
    shell: "w-full",
    rounded: "rounded-xl sm:rounded-2xl",
    padding: "gap-3 px-4 pb-4 pt-8 sm:gap-3 sm:px-5 sm:pb-5 sm:pt-9",
    photo: "size-[4.5rem] sm:size-20 md:size-24",
    name: "text-sm font-semibold sm:text-base md:text-lg",
    role: "text-[10px] font-semibold leading-snug sm:text-[11px]",
    imageSizes: "(max-width: 640px) 72px, (max-width: 768px) 80px, 96px",
  },
} as const

/** Grille 2 colonnes (vice-présidence). */
const TEAM_TWO_COL_GRID_CLASS =
  "mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5"
/** Trésorerie + secrétariat : une ligne à partir de md (4 colonnes). */
const TEAM_FOUR_COL_GRID_CLASS =
  "mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-4 lg:max-w-7xl lg:gap-5"
const TEAM_BAND_SPACING_CLASS = "mb-8 sm:mb-10 md:mb-11"
/** Encadrement type « vitrine » pour les rangées de cartes. */
const TEAM_BAND_FRAME =
  "relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-card/85 to-muted/20 p-4 shadow-sm backdrop-blur-md sm:rounded-3xl sm:p-5 md:p-6 dark:border-border/80 dark:from-card/60 dark:to-muted/10 dark:shadow-[0_12px_40px_-28px_rgba(0,0,0,0.35)]"
const TEAM_BAND_FRAME_ACCENT =
  "pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-theme-green/40 to-transparent sm:inset-x-14 dark:via-theme-green/50"

/**
 * Résout la surface de carte selon la bande hiérarchique (effet visuel distinct par rangée).
 */
function resolveCardSurface(band: TeamAnimationBand, isPresident: boolean): string {
  if (isPresident || band === "president") return SURFACE_FEATURED
  if (band === "overflow") return SURFACE_OVERFLOW
  if (band === "bureauTail") return SURFACE_TAIL
  return SURFACE_CABINET
}

/**
 * Enveloppe commune : fond atmosphérique de la section équipe.
 */
function TeamSectionScaffold({ children }: { children: ReactNode }) {
  return (
    <div className={cn(TEAM_SECTION_SHELL, "py-6 sm:py-9 md:py-11")}>
      <div className={TEAM_SECTION_AMBIENT} aria-hidden />
      <div className={TEAM_SECTION_GRID} aria-hidden />
      <div className={TEAM_SECTION_DOTS} aria-hidden />
      <div className="relative z-10 mx-auto max-w-7xl min-w-0 px-3 sm:px-5 lg:px-8">{children}</div>
    </div>
  )
}

/**
 * Onglet « Notre équipe » : hiérarchie bureau, palette sobre (neutre + vert marque).
 */
export default function TeamSection() {
  const { data: teamData, isLoading, error, refetch, isFetching } = useTeamData()

  const { president, vicePresidents, treasury, secretary, overflow } = useMemo(
    () => partitionTeamByHierarchy(teamData ?? []),
    [teamData],
  )

  const tailBureauFour = useMemo(
    () => [...treasury, ...secretary],
    [treasury, secretary],
  )

  if (isLoading) {
    return (
      <TeamSectionScaffold>
        <LoadingStateInner />
      </TeamSectionScaffold>
    )
  }

  if (error) {
    return (
      <TeamSectionScaffold>
        <SectionTitle />
        <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-2 text-center">
            <p className="text-muted-foreground text-sm sm:text-base">
              Impossible de charger les membres du bureau. Vérifiez votre connexion puis réessayez.
            </p>
            <Button
              type="button"
              variant="outline"
              disabled={isFetching}
              onClick={() => {
                void refetch()
              }}
            >
              {isFetching ? "Chargement…" : "Réessayer"}
            </Button>
          </div>
      </TeamSectionScaffold>
    )
  }

  const hasMembers =
    president != null ||
    vicePresidents.length > 0 ||
    tailBureauFour.length > 0 ||
    overflow.length > 0

  return (
    <TeamSectionScaffold>
        <SectionTitle />

        {!hasMembers ? (
          <div className="mx-auto max-w-xl px-2 text-center sm:px-4">
            <p className="text-pretty text-muted-foreground text-sm leading-relaxed sm:text-base">
              Aucun membre du bureau n&apos;est affiché pour le moment. Dans le tableau de bord,
              renseignez l&apos;équipe sur le site (menu Équipe) ou activez « Afficher sur le site »
              sur les fiches concernées. Sur le site, l&apos;ordre des blocs suit le rôle de chaque
              personne (présidence, vice-présidence, puis trésorerie et secrétariat sur une même ligne).
            </p>
          </div>
        ) : (
          <>
            {president ? (
              <section
                aria-labelledby="team-band-president"
                className={cn(TEAM_BAND_SPACING_CLASS, "flex justify-center px-3 sm:px-0")}
              >
                <h3 id="team-band-president" className="sr-only">
                  Présidence
                </h3>
                <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
                  <MemberCard
                    member={president}
                    variant="president"
                    animationBand="president"
                    index={0}
                  />
                </div>
              </section>
            ) : null}

            {vicePresidents.length > 0 ? (
              <section aria-labelledby="team-band-vice" className={TEAM_BAND_SPACING_CLASS}>
                <h3 id="team-band-vice" className="sr-only">
                  Vice-présidence
                </h3>
                <div className={cn(TEAM_BAND_FRAME, "mx-auto max-w-3xl")}>
                  <div className={TEAM_BAND_FRAME_ACCENT} aria-hidden />
                  <div className={TEAM_TWO_COL_GRID_CLASS}>
                  {vicePresidents.map((member, index) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      variant="vicePresident"
                      animationBand="vicePresidents"
                      index={index}
                    />
                  ))}
                  </div>
                </div>
              </section>
            ) : null}

            {tailBureauFour.length > 0 ? (
              <section
                aria-labelledby="team-band-treasury-secretary"
                className={TEAM_BAND_SPACING_CLASS}
              >
                <h3 id="team-band-treasury-secretary" className="sr-only">
                  Trésorerie et secrétariat
                </h3>
                <div className={cn(TEAM_BAND_FRAME, "mx-auto max-w-7xl")}>
                  <div className={TEAM_BAND_FRAME_ACCENT} aria-hidden />
                  <div className={TEAM_FOUR_COL_GRID_CLASS}>
                  {tailBureauFour.map((member, index) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      variant="vicePresident"
                      animationBand="bureauTail"
                      index={index}
                    />
                  ))}
                  </div>
                </div>
              </section>
            ) : null}

            {overflow.length > 0 ? (
              <section aria-labelledby="team-band-overflow" className="mt-6 sm:mt-8">
                <div className="mb-5 flex flex-col items-center gap-2">
                  <span className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent sm:w-24" />
                  <h3
                    id="team-band-overflow"
                    className="text-center font-semibold text-muted-foreground text-xs uppercase tracking-[0.2em] sm:text-sm"
                  >
                    Autres membres
                  </h3>
                  <span className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent sm:w-24" />
                </div>
                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {overflow.map((member, index) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      variant="other"
                      animationBand="overflow"
                      index={index}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
    </TeamSectionScaffold>
  )
}

/** En-tête : typographie forte, une seule couleur d’accent (vert marque). */
function SectionTitle() {
  return (
    <AssociationSectionTitle
      title="Notre équipe"
      description="Les membres du bureau qui portent les projets et la vie de l'association."
      animationDelay={ANIMATION_CONFIG.delays.title}
    />
  )
}

interface MemberCardProps {
  member: TeamMember
  variant: keyof typeof CARD_VARIANTS
  index: number
  /** Bande hiérarchique (délais d’animation), indépendante du gabarit visuel (`variant`). */
  animationBand?: TeamAnimationBand
}

/** Fiche membre : surface selon la bande, pastille rôle sobre (vert seul). */
function MemberCard({ member, variant, index, animationBand }: MemberCardProps) {
  const v = CARD_VARIANTS[variant]
  const isPresident = variant === "president"
  const band: TeamAnimationBand =
    animationBand ??
    (variant === "president" ? "president" : variant === "vicePresident" ? "vicePresidents" : "overflow")

  const baseDelay = ANIMATION_CONFIG.delays[band]
  const cardDelay =
    baseDelay +
    (band === "president" ? 0 : 0.06 + index * (band === "bureauTail" ? 0.05 : 0.1))
  const contentDelay =
    baseDelay +
    (band === "president" ? 0.08 : 0.08 + index * (band === "bureauTail" ? 0.05 : 0.1))

  const surface = resolveCardSurface(band, isPresident)
  const isTail = band === "bureauTail"

  /** Survol : élévation multicouche (plus marquée pour le cabinet, plus douce pour overflow). */
  const cardHoverShadow =
    isPresident || band === "president"
      ? "hover:shadow-[0_22px_56px_-24px_rgba(15,23,42,0.14),0_0_0_1px_rgba(22,163,74,0.12),0_36px_72px_-28px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_28px_64px_-20px_rgba(0,0,0,0.58),0_0_0_1px_rgba(34,197,94,0.18)]"
      : band === "bureauTail"
        ? "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.72)_inset,0_4px_12px_-2px_rgba(15,23,42,0.06),0_16px_36px_-8px_rgba(15,23,42,0.1),0_28px_52px_-14px_rgba(15,23,42,0.07)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_12px_36px_-6px_rgba(0,0,0,0.58),0_26px_56px_-12px_rgba(0,0,0,0.48)]"
        : band === "overflow"
          ? "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.6)_inset,0_3px_10px_-2px_rgba(15,23,42,0.05),0_14px_32px_-10px_rgba(15,23,42,0.09),0_24px_44px_-16px_rgba(15,23,42,0.06)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset,0_10px_30px_-6px_rgba(0,0,0,0.52),0_22px_44px_-12px_rgba(0,0,0,0.42)]"
          : "hover:shadow-[0_1px_0_0_rgba(255,255,255,0.75)_inset,0_4px_14px_-2px_rgba(15,23,42,0.07),0_20px_44px_-10px_rgba(15,23,42,0.11),0_36px_64px_-18px_rgba(15,23,42,0.08)] dark:hover:shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset,0_14px_40px_-6px_rgba(0,0,0,0.6),0_32px_64px_-14px_rgba(0,0,0,0.5)]"

  const photoShape = cn(
    "relative z-[1] shrink-0 overflow-hidden bg-muted shadow-inner ring-2 ring-background transition-[transform,box-shadow] duration-300 group-hover:shadow-lg group-hover:ring-theme-green/35 dark:ring-card",
    isPresident
      ? "mx-auto rounded-full sm:mx-0 sm:rounded-[1.35rem]"
      : "rounded-full",
    v.photo,
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: cardDelay, ...MOTION_SPRING }}
      whileHover={{ y: -5 }}
      className={cn("relative", v.shell)}
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: contentDelay, ...MOTION_SPRING }}
        className={cn(
          "group relative flex overflow-hidden",
          isPresident ? "flex-col items-center text-center sm:items-stretch sm:text-left" : "flex-col items-center text-center",
          surface,
          "transition-[box-shadow,transform,border-color] duration-300 ease-out",
          isPresident || band === "president"
            ? "hover:border-theme-green/40"
            : "hover:border-border/80 dark:hover:border-border",
          cardHoverShadow,
          v.rounded,
          v.padding,
          isTail && "md:!gap-3 md:!px-3 md:!pb-4 md:!pt-7",
        )}
      >
        {isPresident ? (
          <>
            <div
              className="pointer-events-none absolute -right-16 -top-28 h-56 w-56 rounded-full bg-theme-green/18 blur-3xl dark:bg-theme-green/25"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-theme-green/8 blur-3xl dark:bg-theme-green/12"
              aria-hidden
            />
          </>
        ) : (
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent opacity-55 dark:via-white/12"
            aria-hidden
          />
        )}

        <div className={photoShape}>
          <ImageWithFallback
            src={member.image}
            alt={member.name}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            sizes={v.imageSizes}
            priority={isPresident}
          />
        </div>

        <div
          className={cn(
            "relative z-[1] flex min-w-0 flex-1 flex-col",
            isPresident ? "w-full items-center sm:items-start" : "items-center",
          )}
        >
          <h3
            className={cn(
              "text-balance text-foreground",
              v.name,
              variant === "other" ? "line-clamp-2" : "",
            )}
          >
            {member.name}
          </h3>
          <div
            className={cn(
              "mt-2.5 flex w-full min-w-0",
              isPresident ? "justify-center sm:justify-start" : "justify-center",
            )}
          >
            <p
              className={cn(
                "inline-flex max-w-full items-center justify-center rounded-full border border-theme-green/22 bg-theme-green/[0.07] px-2.5 py-1 text-balance font-semibold text-theme-green shadow-none backdrop-blur-sm dark:border-theme-green/30 dark:bg-theme-green/12 dark:text-theme-green-light",
                "sm:px-3 sm:py-1.5",
                v.role,
                variant === "other" ? "line-clamp-2" : "",
              )}
            >
              {member.role}
            </p>
          </div>
        </div>

        {member.description ? (
          <TeamMemberDescription
            memberName={member.name}
            roleLabel={member.role}
            description={member.description}
          />
        ) : null}
      </motion.div>
    </motion.div>
  )
}

// État de chargement optimisé (même atmosphère que le contenu chargé).
function LoadingStateInner() {
  const SkeletonCard = ({
    variant,
    surface,
  }: {
    variant: keyof typeof CARD_VARIANTS
    surface?: string
  }) => {
    const v = CARD_VARIANTS[variant]
    const shellSurface =
      surface ??
      (variant === "president"
        ? SURFACE_FEATURED
        : variant === "vicePresident"
          ? SURFACE_CABINET
          : SURFACE_OVERFLOW)
    const spaceY = variant === "president" ? "space-y-3" : "space-y-2"
    const nameHeight = variant === "president" ? "h-6" : variant === "vicePresident" ? "h-5" : "h-4"
    const nameWidth = variant === "president" ? "w-40" : variant === "vicePresident" ? "w-36" : "w-32"
    const roleHeight = variant === "president" ? "h-4" : variant === "vicePresident" ? "h-3.5" : "h-3"
    const roleWidth = variant === "president" ? "w-28" : variant === "vicePresident" ? "w-24" : "w-20"

    const isPresidentSkeleton = variant === "president"

    return (
      <div
        className={cn(
          "flex animate-pulse flex-col items-center",
          shellSurface,
          v.rounded,
          v.padding,
        )}
      >
        <div className={cn("rounded-full bg-muted/90", v.photo, isPresidentSkeleton ? "mx-auto sm:mx-0" : "")} />
        <div
          className={cn(
            "w-full min-w-0 text-center",
            isPresidentSkeleton ? "sm:text-left" : "",
            spaceY,
          )}
        >
          <div className={cn(nameHeight, nameWidth, "mx-auto rounded-lg bg-muted/90 sm:mx-0", isPresidentSkeleton && "sm:mx-0")} />
          <div className={cn(roleHeight, roleWidth, "mx-auto rounded-full bg-muted/70 sm:mx-0", isPresidentSkeleton && "sm:mx-0")} />
        </div>
      </div>
    )
  }

  return (
    <>
        <div className="mb-8 text-center sm:mb-10 md:mb-11">
          <div className="mx-auto mb-4 h-10 w-52 animate-pulse rounded-lg bg-gradient-to-r from-muted via-muted-foreground/15 to-muted sm:w-60" />
          <div className="mx-auto h-1 w-24 animate-pulse rounded-full bg-muted-foreground/20 sm:w-28" />
        </div>

        <div className="mb-8 flex justify-center px-2 sm:mb-10 sm:px-0 md:mb-11">
          <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
            <SkeletonCard variant="president" />
          </div>
        </div>

        <div className={cn(TEAM_BAND_SPACING_CLASS, TEAM_BAND_FRAME, "mx-auto max-w-3xl")}>
          <div className={TEAM_BAND_FRAME_ACCENT} aria-hidden />
          <div className={TEAM_TWO_COL_GRID_CLASS}>
            <SkeletonCard variant="vicePresident" />
            <SkeletonCard variant="vicePresident" />
          </div>
        </div>

        <div className={cn(TEAM_BAND_SPACING_CLASS, TEAM_BAND_FRAME, "mx-auto max-w-7xl")}>
          <div className={TEAM_BAND_FRAME_ACCENT} aria-hidden />
          <div className={TEAM_FOUR_COL_GRID_CLASS}>
            <SkeletonCard variant="vicePresident" surface={SURFACE_TAIL} />
            <SkeletonCard variant="vicePresident" surface={SURFACE_TAIL} />
            <SkeletonCard variant="vicePresident" surface={SURFACE_TAIL} />
            <SkeletonCard variant="vicePresident" surface={SURFACE_TAIL} />
          </div>
        </div>
    </>
  )
}
