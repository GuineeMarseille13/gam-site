import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdhesionWithRelations } from "../_types/adhesion-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatAdhesionDate,
  getAdhesionAvatarClass,
  getAdhesionInitials,
  getMembershipEndDate,
} from "../_utils/adhesion-display"
import { AdhesionPaymentRef } from "./adhesion-payment-ref"
import { AdhesionStatusBadge } from "./adhesion-status-badge"
import { AdhesionRenewalDialog } from "./adhesion-renewal-dialog"
import { InvoiceLinkButton } from "@/app/(admin)/bureau/factures/_components/invoice-link-button"

interface AdhesionsDesktopTableProps {
  adhesions: AdhesionWithRelations[]
}

/**
 * Tableau dense à partir de md, avec défilement horizontal si la largeur est insuffisante.
 */
export function AdhesionsDesktopTable({ adhesions }: AdhesionsDesktopTableProps) {
  return (
    <Card className="hidden md:block">
      <CardContent className="overflow-x-auto px-0">
        <Table className="min-w-[56rem]">
          <TableHeader>
            <TableRow>
              <TableHead className="pl-6">Adhérent</TableHead>
              <TableHead className="text-center">Année</TableHead>
              <TableHead className="text-center">Montant</TableHead>
              <TableHead>Type de paiement</TableHead>
              <TableHead className="text-center">Statut</TableHead>
              <TableHead className="text-right">Date d&apos;adhésion</TableHead>
              <TableHead className="pr-6 text-right">Fin d&apos;adhésion</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {adhesions.map((adhesion) => {
              const person = adhesion.person
              const start = adhesion.createdAt
              const end = getMembershipEndDate(adhesion.year)

              return (
                <TableRow key={adhesion.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      {person ? (
                        <div
                          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAdhesionAvatarClass(person.firstName)}`}
                        >
                          {getAdhesionInitials(person.firstName, person.lastName)}
                        </div>
                      ) : null}
                      <div className="min-w-0">
                        <div className="font-medium text-sm leading-tight">
                          {person ? `${person.firstName} ${person.lastName}` : "—"}
                        </div>
                        {person?.email ? (
                          <div className="truncate text-muted-foreground text-xs">{person.email}</div>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center tabular-nums">{adhesion.year}</TableCell>
                  <TableCell className="text-center font-medium tabular-nums">
                    {formatCurrency(adhesion.amount)}
                  </TableCell>
                  <TableCell>
                    <AdhesionPaymentRef
                      paymentMethod={adhesion.payment?.paymentMethod}
                      paymentReference={adhesion.payment?.paymentReference}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <AdhesionStatusBadge isActive={adhesion.isActive} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatAdhesionDate(start)}
                  </TableCell>
                  <TableCell className="pr-6 text-right tabular-nums">{formatAdhesionDate(end)}</TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <InvoiceLinkButton paymentId={adhesion.payment?.id} bureauSection="adhesions" />
                      <AdhesionRenewalDialog adhesion={adhesion} />
                    </div>
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
