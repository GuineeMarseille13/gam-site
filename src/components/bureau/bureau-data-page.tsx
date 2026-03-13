import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconPlus } from "@tabler/icons-react"

interface BureauDataPageProps {
  title: string
  description?: string
  addHref?: string
  addLabel?: string
  children: React.ReactNode
}

export function BureauDataPage({
  title,
  description,
  addHref,
  addLabel = "Nouveau",
  children,
}: BureauDataPageProps) {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
      {/* En-tête */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {addHref && (
          <Button asChild className="shrink-0 gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
            <Link href={addHref}>
              <IconPlus className="size-4" />
              {addLabel}
            </Link>
          </Button>
        )}
      </div>

      {/* Contenu */}
      {children}
    </div>
  )
}
