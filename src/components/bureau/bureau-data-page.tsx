import Link from "next/link"
import { administrationPrimaryButtonClassName } from "@/config/administration-dashboard-theme"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { IconPlus, IconArrowLeft } from "@tabler/icons-react"

export type BureauDataPageDashboard = "bureau" | "administration"

interface BureauDataPageProps {
  title: string
  description?: string
  /** Lien "Retour" affiché au-dessus du titre */
  backHref?: string
  /** Bouton d'ajout rapide */
  addHref?: string
  addLabel?: string
  /** Slot libre pour des actions custom dans l'en-tête */
  actions?: React.ReactNode
  /** Palette du shell : Administration (sky) vs Bureau (ambre) */
  dashboard?: BureauDataPageDashboard
  children: React.ReactNode
}

export function BureauDataPage({
  title,
  description,
  backHref,
  addHref,
  addLabel = "Nouveau",
  actions,
  dashboard = "bureau",
  children,
}: BureauDataPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 sm:gap-8 p-4 sm:p-6 lg:p-8 xl:p-10">
      {/* Retour */}
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <IconArrowLeft className="size-4" />
          Retour
        </Link>
      )}

      {/* En-tête */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {addHref && (
            <Button
              asChild
              className={cn(
                "gap-2 rounded-xl px-5 py-2.5 text-base",
                dashboard === "administration"
                  ? administrationPrimaryButtonClassName
                  : "bg-amber-500 text-white shadow-md transition-shadow hover:bg-amber-600 hover:shadow-lg",
              )}
            >
              <Link href={addHref}>
                <IconPlus className="size-4 sm:size-5" />
                {addLabel}
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Contenu */}
      {children}
    </div>
  )
}
