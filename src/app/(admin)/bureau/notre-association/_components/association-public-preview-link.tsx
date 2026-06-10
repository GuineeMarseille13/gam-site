import Link from "next/link"
import { IconExternalLink } from "@tabler/icons-react"

interface AssociationPublicPreviewLinkProps {
  tab: "president" | "about" | "reports" | "team"
  label?: string
}

/**
 * Lien rapide vers l'onglet correspondant sur la page publique Notre association.
 */
export function AssociationPublicPreviewLink({
  tab,
  label = "Voir sur le site",
}: AssociationPublicPreviewLinkProps) {
  return (
    <Link
      href={`/notre-association?tab=${tab}`}
      target="_blank"
      className="inline-flex items-center gap-2 rounded-xl border border-border/60 bg-background/80 px-4 py-2.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-sm transition-all hover:border-amber-400/50 hover:bg-background hover:text-foreground hover:shadow-md"
    >
      {label}
      <IconExternalLink className="size-4" />
    </Link>
  )
}
