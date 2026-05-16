"use client"

import { useCallback } from "react"
import Link from "next/link"
import { Download, Printer } from "lucide-react"
import { ActionTooltip } from "@/components/ui/action-tooltip"
import { Button } from "@/components/ui/button"

interface InvoiceActionsBarProps {
  readonly paymentId: string
}

/**
 * Barre d’actions : impression navigateur et téléchargement PDF (route API sécurisée).
 */
export function InvoiceActionsBar({ paymentId }: InvoiceActionsBarProps) {
  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const pdfHref = `/api/bureau/invoices/${paymentId}`

  return (
    <div
      className="
        print:hidden
        flex flex-col gap-3 border-b border-border pb-6
        sm:flex-row sm:flex-wrap sm:items-center sm:justify-between
      "
    >
      <div className="flex flex-wrap gap-2">
        <ActionTooltip label="Imprimer cette facture depuis le navigateur">
          <Button type="button" variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="size-4" aria-hidden />
            Imprimer
          </Button>
        </ActionTooltip>
        <ActionTooltip label="Télécharger le PDF généré (même contenu que l’aperçu)">
          <Button type="button" className="gap-2" asChild>
            <Link href={pdfHref} rel="noopener noreferrer">
              <Download className="size-4" aria-hidden />
              Télécharger PDF
            </Link>
          </Button>
        </ActionTooltip>
      </div>
      <p className="text-muted-foreground text-xs sm:text-right">
        Le PDF est généré à la demande et reprend les mêmes informations que cet aperçu.
      </p>
    </div>
  )
}
