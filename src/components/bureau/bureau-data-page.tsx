import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconPlus, IconArrowLeft } from "@tabler/icons-react"

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
  children: React.ReactNode
}

export function BureauDataPage({
  title,
  description,
  backHref,
  addHref,
  addLabel = "Nouveau",
  actions,
  children,
}: BureauDataPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {actions}
          {addHref && (
            <Button asChild className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
              <Link href={addHref}>
                <IconPlus className="size-4" />
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
