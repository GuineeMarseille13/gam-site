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

interface AdhesionsMobileCardsProps {
  adhesions: AdhesionWithRelations[]
}

/**
 * Cartes empilées pour viewport &lt; md (lisibilité sans défilement horizontal forcé).
 */
export function AdhesionsMobileCards({ adhesions }: AdhesionsMobileCardsProps) {
  return (
    <div className="space-y-3 md:hidden" aria-label="Liste des adhésions">
      {adhesions.map((adhesion) => {
        const person = adhesion.person
        const start = adhesion.createdAt
        const end = getMembershipEndDate(adhesion.year)

        return (
          <article
            key={adhesion.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 border-border border-b pb-3">
              {person ? (
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getAdhesionAvatarClass(person.firstName)}`}
                >
                  {getAdhesionInitials(person.firstName, person.lastName)}
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm leading-tight">
                  {person ? `${person.firstName} ${person.lastName}` : "—"}
                </p>
                {person?.email ? (
                  <p className="mt-1 truncate text-muted-foreground text-xs">{person.email}</p>
                ) : null}
              </div>
              <AdhesionStatusBadge isActive={adhesion.isActive} />
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Année</dt>
                <dd className="font-medium tabular-nums text-right sm:text-left">{adhesion.year}</dd>
              </div>
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Montant</dt>
                <dd className="font-medium tabular-nums text-right sm:text-left">
                  {formatCurrency(adhesion.amount)}
                </dd>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <dt className="text-muted-foreground">Paiement</dt>
                <dd className="min-w-0 break-all">
                  <AdhesionPaymentRef paymentReference={adhesion.payment?.paymentReference} />
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Date</dt>
                <dd className="tabular-nums text-muted-foreground text-right sm:text-left">
                  {formatAdhesionDate(start)}
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Fin d&apos;adhésion</dt>
                <dd className="tabular-nums text-right font-medium text-foreground sm:text-left">
                  {formatAdhesionDate(end)}
                </dd>
              </div>
            </dl>
          </article>
        )
      })}
    </div>
  )
}
