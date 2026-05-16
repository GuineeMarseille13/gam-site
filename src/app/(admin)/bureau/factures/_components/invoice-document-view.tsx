import Image from "next/image"

import type { InvoiceDocument } from "@/app/(admin)/bureau/factures/_schemas/invoice.schema"
import { formatCurrency } from "@/helpers/format-currency"

interface InvoiceDocumentViewProps {
  readonly data: InvoiceDocument
}

function formatInvoiceDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso))
}

/**
 * Rendu HTML de la facture / reçu (aperçu écran et support impression).
 */
export function InvoiceDocumentView({ data }: InvoiceDocumentViewProps) {
  const issuedLabel = formatInvoiceDate(data.issuedAtIso)

  return (
    <article
      className="
        invoice-print-a4
        relative overflow-hidden
        mx-auto flex max-w-3xl flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm
        sm:p-8 md:p-10
        print:box-border print:break-inside-avoid
        print:h-[calc(297mm-24mm)] print:min-h-[calc(297mm-24mm)] print:max-h-[calc(297mm-24mm)]
        print:max-w-none print:w-full print:overflow-hidden print:border-0 print:bg-white print:p-5 print:text-black
        print:shadow-none
      "
      aria-label={`Facture ${data.invoiceNumber}`}
    >
      <div className="invoice-document-bg-logo-layer" aria-hidden>
        <Image
          src="/images/gam-logo.png"
          alt=""
          width={1000}
          height={1000}
          className="h-auto w-full object-contain"
          quality={75}
        />
      </div>

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <header
          className="
            shrink-0
            flex flex-col gap-6 border-b border-border pb-6
            sm:flex-row sm:items-start sm:justify-between
            print:gap-4 print:border-zinc-300 print:pb-4
          "
        >
          <div className="space-y-1">
          <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl print:text-black">
            {data.issuer.legalName}
          </h1>
          {data.issuer.tagline ? (
            <p className="text-muted-foreground text-sm">{data.issuer.tagline}</p>
          ) : null}
          <address className="not-italic text-muted-foreground text-sm leading-relaxed">
            {data.issuer.addressLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
            {data.issuer.email ? (
              <span className="mt-1 block text-foreground">{data.issuer.email}</span>
            ) : null}
            {data.issuer.phone ? (
              <span className="block text-foreground">{data.issuer.phone}</span>
            ) : null}
          </address>
        </div>

        <div className="rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm print:border-zinc-300 print:bg-zinc-50">
          <p className="font-semibold text-foreground text-xs uppercase tracking-wide print:text-black">
            Facture
          </p>
          <p className="mt-1 font-mono font-semibold text-base text-foreground tabular-nums print:text-black">
            {data.invoiceNumber}
          </p>
          <p className="mt-2 text-muted-foreground text-xs">
            Émise le <span className="text-foreground">{issuedLabel}</span>
          </p>
          <p className="mt-1 text-muted-foreground text-xs">
            Type :{" "}
            <span className="font-medium text-foreground">{data.paymentTypeLabel}</span>
          </p>
        </div>
      </header>

      <section className="mt-8 grid shrink-0 gap-8 sm:grid-cols-2 print:mt-4 print:gap-6">
        <div>
          <h2 className="font-semibold text-foreground text-sm print:text-black">Client</h2>
          <p className="mt-2 font-medium text-foreground print:text-black">
            {data.customer.fullName}
          </p>
          {data.customer.addressLines.length > 0 ? (
            <address className="mt-1 not-italic text-muted-foreground text-sm leading-relaxed">
              {data.customer.addressLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          ) : null}
          {data.customer.email ? (
            <p className="mt-2 text-muted-foreground text-sm">{data.customer.email}</p>
          ) : null}
          {data.customer.phone ? (
            <p className="text-muted-foreground text-sm">{data.customer.phone}</p>
          ) : null}
        </div>

        <div className="rounded-lg border border-dashed border-border/80 p-4 text-sm print:border-zinc-300">
          <dl className="space-y-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Réf. paiement</dt>
              <dd
                className="min-w-0 truncate font-mono text-xs text-foreground"
                title={data.paymentReference}
              >
                {data.paymentReference}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Mode de règlement</dt>
              <dd className="text-right font-medium text-foreground">{data.paymentMethodLabel}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mt-10 shrink-0 overflow-x-auto print:mt-5">
        <table className="w-full min-w-[20rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground text-xs uppercase tracking-wide print:border-zinc-400">
              <th className="pb-3 pr-4 font-medium">Désignation</th>
              <th className="pb-3 pr-4 text-right font-medium tabular-nums">Qté</th>
              <th className="pb-3 pr-4 text-right font-medium tabular-nums">P.U.</th>
              <th className="pb-3 text-right font-medium tabular-nums">Montant</th>
            </tr>
          </thead>
          <tbody className="print:[&_tr:last-child]:border-b print:[&_tr:last-child]:border-zinc-200">
            {data.lines.map((line, index) => (
              <tr
                key={`${line.label}-${String(index)}`}
                className="border-b border-border/60 print:border-zinc-200"
              >
                <td className="py-3 pr-4 align-top text-foreground">
                  <span className="font-medium">{line.label}</span>
                </td>
                <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                  {line.quantity}
                </td>
                <td className="py-3 pr-4 text-right tabular-nums text-muted-foreground">
                  {formatCurrency(line.unitAmountEur)}
                </td>
                <td className="py-3 text-right font-medium tabular-nums text-foreground">
                  {formatCurrency(line.totalAmountEur)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Remplit la hauteur page à l’impression (A4) pour coller totaux + mentions en bas */}
      <div
        aria-hidden="true"
        className="hidden min-h-0 print:flex print:flex-1 print:basis-0"
      />

      <footer
        className="
          shrink-0 space-y-6 border-t border-border pt-6
          print:space-y-3 print:border-zinc-300 print:pt-4
        "
      >
        <div className="flex flex-col items-end gap-2 print:gap-1.5">
          <div
            className="
              flex w-full max-w-xs items-center justify-between rounded-lg bg-amber-500/10 px-4 py-3 font-semibold text-base text-foreground
              print:bg-zinc-100 print:text-black
            "
          >
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(data.totalEur)}</span>
          </div>
        </div>

        <div className="space-y-2 text-muted-foreground text-xs leading-relaxed print:space-y-1 print:leading-snug">
          {data.legalFooterLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </footer>
      </div>
    </article>
  )
}
