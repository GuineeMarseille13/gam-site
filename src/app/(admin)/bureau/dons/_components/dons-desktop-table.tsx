import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DonWithRelations } from "../_types/don-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatDonDate,
  getDonAvatarClass,
  getDonInitials,
} from "../_utils/don-display"
import { AdhesionPaymentRef } from "@/app/(admin)/bureau/adhesions/_components/adhesion-payment-ref"
import { InvoiceLinkButton } from "@/app/(admin)/bureau/factures/_components/invoice-link-button"
import { DonMessagePreview } from "./don-message-preview"

interface DonsDesktopTableProps {
  readonly dons: DonWithRelations[]
}

/**
 * Tableau dense à partir de md, avec défilement horizontal si la largeur est insuffisante.
 */
export function DonsDesktopTable({ dons }: DonsDesktopTableProps) {
  return (
    <Card className="hidden md:block">
      <CardContent className="overflow-x-auto px-0">
        <Table className="table-fixed min-w-[48rem] w-full">
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "6.25rem" }} />
            <col style={{ width: "12rem" }} />
            <col />
            <col style={{ width: "2.75rem" }} />
            <col style={{ width: "6.75rem" }} />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Donateur</TableHead>
              <TableHead className="px-3 text-center">Montant</TableHead>
              <TableHead className="pl-4 pr-3">Paiement</TableHead>
              <TableHead className="px-3">Message</TableHead>
              <TableHead className="w-10 px-0 text-center">
                <span className="sr-only">Facture</span>
              </TableHead>
              <TableHead className="pr-6 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dons.map((don) => {
              const person = don.person

              return (
                <TableRow key={don.id}>
                  <TableCell className="pl-6">
                    <div className="flex min-w-0 items-center gap-3">
                      {person ? (
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getDonAvatarClass(
                            person.firstName,
                          )}`}
                        >
                          {getDonInitials(person.firstName, person.lastName)}
                        </div>
                      ) : (
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                          ?
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="truncate font-medium text-sm">
                          {person
                            ? `${person.firstName} ${person.lastName}`
                            : "Anonyme"}
                        </div>
                        {person?.email ? (
                          <div className="truncate text-xs text-muted-foreground">
                            {person.email}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-3 text-center align-middle font-semibold tabular-nums text-sm">
                    {formatCurrency(don.amount, { maximumFractionDigits: 0 })}
                  </TableCell>

                  <TableCell className="pl-4 pr-3 align-top whitespace-normal">
                    <AdhesionPaymentRef
                      paymentMethod={don.payment?.paymentMethod}
                      paymentReference={don.payment?.paymentReference}
                    />
                  </TableCell>

                  <TableCell className="min-w-0 px-3 align-top whitespace-normal">
                    <DonMessagePreview message={don.message} variant="table" />
                  </TableCell>

                  <TableCell className="px-0 text-center align-middle">
                    <InvoiceLinkButton paymentId={don.payment?.id} bureauSection="dons" />
                  </TableCell>

                  <TableCell className="pr-6 text-right tabular-nums whitespace-nowrap text-muted-foreground">
                    {formatDonDate(don.createdAt)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

