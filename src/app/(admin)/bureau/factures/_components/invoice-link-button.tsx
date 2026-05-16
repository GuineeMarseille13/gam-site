import Link from "next/link"
import { FileText } from "lucide-react"
import { ActionTooltip } from "@/components/ui/action-tooltip"
import { Button } from "@/components/ui/button"
import type { InvoiceBureauSection } from "@/app/(admin)/bureau/factures/_schemas/invoice.schema"

interface InvoiceLinkButtonProps {
  readonly paymentId?: string | null
  readonly bureauSection: InvoiceBureauSection
}

/**
 * Lien discret vers la page facture / reçu (aperçu + PDF) pour un paiement bureau.
 */
export function InvoiceLinkButton({ paymentId, bureauSection }: InvoiceLinkButtonProps) {
  if (!paymentId?.trim()) {
    return <span className="text-muted-foreground text-xs">—</span>
  }

  const href = `/bureau/factures/${paymentId}?section=${bureauSection}`

  return (
    <ActionTooltip label="Voir la facture ou le reçu de ce paiement">
      <Button variant="ghost" size="icon" className="size-8 shrink-0" asChild>
        <Link href={href} aria-label="Ouvrir la facture ou le reçu">
          <FileText className="size-4 text-amber-600/90" aria-hidden />
        </Link>
      </Button>
    </ActionTooltip>
  )
}
