import Link from "next/link"
import { FileText } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AssociationEmptyStateProps {
  title: string
  description: string
}

/**
 * État vide lorsque le contenu association n'est pas encore publié en base.
 */
export function AssociationEmptyState({ title, description }: AssociationEmptyStateProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <FileText className="size-7" aria-hidden />
      </div>
      <h2 className="text-balance text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  )
}

interface AssociationEmptyStateAdminProps extends AssociationEmptyStateProps {
  adminHref: string
  adminLabel?: string
}

/**
 * État vide avec lien vers le bureau (aperçu interne).
 */
export function AssociationEmptyStateAdmin({
  title,
  description,
  adminHref,
  adminLabel = "Configurer dans le bureau",
}: AssociationEmptyStateAdminProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-center justify-center px-4 py-16 text-center sm:py-20">
      <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <FileText className="size-7" aria-hidden />
      </div>
      <h2 className="text-balance text-xl font-semibold text-foreground sm:text-2xl">{title}</h2>
      <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
        {description}
      </p>
      <Button asChild variant="outline" className="mt-6 rounded-xl">
        <Link href={adminHref}>{adminLabel}</Link>
      </Button>
    </div>
  )
}
