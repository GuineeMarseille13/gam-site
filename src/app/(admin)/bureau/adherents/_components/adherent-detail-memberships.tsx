import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdherentMembershipLine } from "@/lib/schemas/adherent-detail.schema";
import { formatCurrency } from "@/helpers/format-currency";

import { AdhesionPaymentRef } from "@/app/(admin)/bureau/adhesions/_components/adhesion-payment-ref";
import { AdhesionStatusBadge } from "@/app/(admin)/bureau/adhesions/_components/adhesion-status-badge";

function formatIsoDateFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(iso));
}

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  PAID: "Payé",
  PENDING: "En attente",
  FAILED: "Échoué",
  CANCELLED: "Annulé",
  REFUNDED: "Remboursé",
  EXPIRED: "Expiré",
};

interface AdherentDetailMembershipsProps {
  readonly memberships: AdherentMembershipLine[];
}

/**
 * Liste des cotisations : cartes sur petit écran, tableau dès md.
 */
export function AdherentDetailMemberships({
  memberships,
}: AdherentDetailMembershipsProps) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {memberships.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-border/50 bg-gradient-to-b from-card/90 to-muted/20 p-4 shadow-md shadow-black/10 ring-1 ring-white/[0.03] dark:shadow-black/40"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-lg font-bold tabular-nums text-foreground">
                  {m.year}
                </p>
                <p className="text-xs text-muted-foreground">Année de cotisation</p>
              </div>
              <AdhesionStatusBadge isActive={m.isActive} />
            </div>
            <dl className="mt-3 grid gap-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Montant</dt>
                <dd className="font-semibold tabular-nums">
                  {formatCurrency(m.amount)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Adhésion enregistrée</dt>
                <dd className="tabular-nums text-foreground/90">
                  {formatIsoDateFr(m.createdAt)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Fin adhésion</dt>
                <dd className="tabular-nums text-foreground/90">
                  {m.membershipEndDateFormatted}
                </dd>
              </div>
              <div className="flex flex-col gap-1 border-t border-border/60 pt-2">
                <dt className="text-xs text-muted-foreground">Type de paiement</dt>
                <dd>
                  <AdhesionPaymentRef
                    paymentMethod={m.payment.paymentMethod}
                    paymentReference={m.payment.paymentReference}
                  />
                </dd>
                <dd className="text-xs text-muted-foreground">
                  {formatIsoDateFr(m.payment.paymentDate)} ·{" "}
                  {PAYMENT_STATUS_LABEL[m.payment.status] ?? m.payment.status}
                </dd>
              </div>
            </dl>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-border/50 bg-card/40 shadow-inner ring-1 ring-white/[0.03] md:block dark:bg-card/25">
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 bg-gradient-to-r from-muted/50 to-transparent hover:bg-muted/50">
              <TableHead className="pl-4">Année</TableHead>
              <TableHead className="text-right">Montant</TableHead>
              <TableHead className="text-center">Cotisation</TableHead>
              <TableHead>Date d&apos;adhésion</TableHead>
              <TableHead>Fin d&apos;adhésion</TableHead>
              <TableHead>Type de paiement</TableHead>
              <TableHead className="pr-4 text-right">Statut paiement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {memberships.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="pl-4 font-semibold tabular-nums">
                  {m.year}
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  {formatCurrency(m.amount)}
                </TableCell>
                <TableCell className="text-center">
                  <AdhesionStatusBadge isActive={m.isActive} />
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatIsoDateFr(m.createdAt)}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {m.membershipEndDateFormatted}
                </TableCell>
                <TableCell>
                  <AdhesionPaymentRef
                    paymentMethod={m.payment.paymentMethod}
                    paymentReference={m.payment.paymentReference}
                  />
                </TableCell>
                <TableCell className="pr-4 text-right text-sm text-muted-foreground">
                  <span className="block">
                    {PAYMENT_STATUS_LABEL[m.payment.status] ?? m.payment.status}
                  </span>
                  <span className="text-xs tabular-nums">
                    {formatIsoDateFr(m.payment.paymentDate)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
