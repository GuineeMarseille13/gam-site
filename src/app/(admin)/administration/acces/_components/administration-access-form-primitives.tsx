import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { IconKey, IconLink, IconShieldLock, IconUser } from "@tabler/icons-react"
import { cn } from "@/helpers/utils"
import {
  bureauSelectContentClassName,
  bureauSelectItemClassName,
  bureauSelectTriggerClassName,
} from "@/config/bureau-select-theme"

export const administrationAccessInputClassName =
  "h-11 rounded-xl border-border/60 bg-background/80 shadow-sm transition-shadow focus-visible:ring-sky-500/30"

/** Évite le survol vert du token `accent` global — thème ambre bureau. */
export const administrationAccessSelectItemClassName = bureauSelectItemClassName

export const administrationAccessSelectContentClassName = bureauSelectContentClassName

export const administrationAccessSelectTriggerClassName = cn(
  bureauSelectTriggerClassName,
  "h-11 border-border/60 bg-background/80 shadow-sm focus-visible:ring-sky-500/30",
)

interface AdministrationAccessSectionTitleProps {
  kicker: string
  title: string
  description?: string
  icon?: React.ComponentType<{ className?: string }>
}

export function AdministrationAccessSectionTitle({ kicker, title, description, icon: Icon }: AdministrationAccessSectionTitleProps) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80">{kicker}</p>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="size-5 text-sky-600 dark:text-sky-400" aria-hidden />}
        <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      </div>
      {description && <p className="max-w-xl text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

function personInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?"
}

interface AdministrationSelectedPersonHeroProps {
  firstName?: string
  lastName?: string
  profileKind?: string | null
  posteLabel?: string | null
  email?: string | null
  empty?: boolean
}

/**
 * Bandeau d’en-tête du formulaire : aperçu de la personne sélectionnée ou invitation à choisir.
 */
export function AdministrationSelectedPersonHero({
  firstName,
  lastName,
  profileKind,
  posteLabel,
  email,
  empty = false,
}: AdministrationSelectedPersonHeroProps) {
  const hasPerson = !empty && firstName && lastName

  return (
    <div className="relative border-b border-sky-200/35 bg-gradient-to-br from-sky-50/95 via-background to-background px-5 py-8 sm:px-8 sm:py-10 dark:border-sky-900/35 dark:from-sky-950/45 dark:via-background dark:to-background">
      <div
        className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-45"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 18% 0%, rgba(14, 165, 233, 0.16), transparent 52%), radial-gradient(ellipse 70% 50% at 100% 100%, rgba(2, 132, 199, 0.08), transparent 45%)",
        }}
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-800/70 dark:text-sky-300/70">
            Fiche liée
          </p>
          {hasPerson ? (
            <>
              <p className="text-2xl font-semibold tracking-tight text-foreground">
                {firstName} {lastName}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {profileKind && (
                  <span className="rounded-full border border-sky-200/60 bg-background/80 px-3 py-1 text-xs font-medium text-sky-900 shadow-sm backdrop-blur-sm dark:border-sky-800/50 dark:bg-background/40 dark:text-sky-200">
                    {profileKind}
                  </span>
                )}
                {posteLabel && (
                  <span className="rounded-full border border-border/50 bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                    {posteLabel}
                  </span>
                )}
              </div>
              {email && <p className="text-sm text-muted-foreground">{email}</p>}
            </>
          ) : (
            <>
              <p className="text-lg font-medium text-foreground">Choisissez une personne</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Membre du bureau, bénévole ou adhérent sans compte dashboard.
              </p>
            </>
          )}
        </div>

        <Avatar
          className={cn(
            "size-20 shrink-0 ring-4 ring-background shadow-lg sm:size-24",
            hasPerson ? "ring-sky-200/80 dark:ring-sky-800/50" : "ring-border/60",
          )}
        >
          <AvatarFallback
            className={cn(
              "text-xl font-bold sm:text-2xl",
              hasPerson
                ? "bg-gradient-to-br from-sky-100 to-sky-200 text-sky-900 dark:from-sky-950/80 dark:to-sky-900/60 dark:text-sky-200"
                : "bg-muted text-muted-foreground",
            )}
          >
            {hasPerson ? personInitials(firstName, lastName) : <IconUser className="size-8 opacity-50" />}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export const ADMINISTRATION_ACCESS_FORM_ICONS = {
  person: IconLink,
  connection: IconKey,
  security: IconShieldLock,
} as const
