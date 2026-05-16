import { headers } from "next/headers"
import { createElement } from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { auth } from "@/lib/auth"
import { isBureauDashboardRole } from "@/helpers/dashboard-roles"
import { fetchInvoiceDataByPaymentId } from "@/app/(admin)/bureau/factures/_services/fetch-invoice-data"
import { InvoicePdfDocument } from "@/app/(admin)/bureau/factures/_components/invoice-pdf-document"
import { invoicePaymentParamsSchema } from "@/app/(admin)/bureau/factures/_schemas/invoice.schema"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function sanitizePdfFilename(invoiceNumber: string): string {
  return `${invoiceNumber.replace(/[^a-zA-Z0-9-]/g, "_")}.pdf`
}

/**
 * GET — PDF facture / reçu (même contenu que la page d’aperçu). Accès réservé au bureau.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ paymentId: string }> },
): Promise<Response> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !isBureauDashboardRole(session.user.role)) {
    return new Response("Unauthorized", { status: 401 })
  }

  const rawParams = await context.params
  const parsed = invoicePaymentParamsSchema.safeParse(rawParams)
  if (!parsed.success) {
    return new Response("Not Found", { status: 404 })
  }

  const result = await fetchInvoiceDataByPaymentId(parsed.data)
  if (!result.success) {
    return new Response("Not Found", { status: 404 })
  }

  const pdfElement = createElement(InvoicePdfDocument, { data: result.data })
  const buffer = await renderToBuffer(
    pdfElement as unknown as Parameters<typeof renderToBuffer>[0],
  )
  const filename = sanitizePdfFilename(result.data.invoiceNumber)

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  })
}
