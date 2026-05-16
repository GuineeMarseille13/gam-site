import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { BureauContent } from "@/components/bureau/bureau-content"
import { fetchInvoiceDataByPaymentId } from "@/app/(admin)/bureau/factures/_services/fetch-invoice-data"
import { InvoiceActionsBar } from "@/app/(admin)/bureau/factures/_components/invoice-actions-bar"
import { InvoiceDocumentView } from "@/app/(admin)/bureau/factures/_components/invoice-document-view"

export const metadata: Metadata = {
  title: "Facture",
  description: "Aperçu et téléchargement de facture / reçu",
}

interface FacturePageProps {
  readonly params: Promise<{ paymentId: string }>
  readonly searchParams: Promise<{ section?: string }>
}

/**
 * Page bureau : facture / reçu lié à un paiement (affichage + impression + PDF).
 */
export default async function FacturePage({ params, searchParams }: FacturePageProps) {
  const { paymentId } = await params
  const sp = await searchParams
  const result = await fetchInvoiceDataByPaymentId({ paymentId })
  if (!result.success) {
    notFound()
  }

  const { data } = result

  if (sp.section !== data.bureauSection) {
    redirect(`/bureau/factures/${paymentId}?section=${data.bureauSection}`)
  }

  return (
    <BureauContent
      title={data.invoiceNumber}
      description={`${data.paymentTypeLabel} — ${data.customer.fullName}`}
      backHref={`/bureau/${data.bureauSection}`}
      hideShellHeaderOnPrint
    >
      <div className="flex flex-1 flex-col gap-6 print:min-h-0 print:flex-1 print:gap-0">
        <InvoiceActionsBar paymentId={paymentId} />
        <InvoiceDocumentView data={data} />
      </div>
    </BureauContent>
  )
}
