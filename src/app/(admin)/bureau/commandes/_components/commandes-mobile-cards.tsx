import type { OrderWithRelations } from "../_types/order-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatCommandeDate,
  getCommandeAvatarClass,
  getCommandeInitials,
} from "../_utils/commande-display"
import { CommandeStatusBadge } from "./commande-status-badge"

interface CommandesMobileCardsProps {
  readonly commandes: OrderWithRelations[]
}

/**
 * Cartes empilées pour viewport &lt; md.
 */
export function CommandesMobileCards({ commandes }: CommandesMobileCardsProps) {
  return (
    <div className="space-y-3 md:hidden" aria-label="Liste des commandes">
      {commandes.map((commande) => {
        const person = commande.person
        const itemCount = commande.items.length

        return (
          <article
            key={commande.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-border border-b pb-3">
              <div className="min-w-0 flex-1">
                <p className="font-mono text-muted-foreground text-xs">
                  {commande.orderNumber}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getCommandeAvatarClass(
                      person.firstName,
                    )}`}
                  >
                    {getCommandeInitials(person.firstName, person.lastName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm leading-tight">
                      {person.firstName} {person.lastName}
                    </p>
                  </div>
                </div>
              </div>
              <CommandeStatusBadge paymentStatus={commande.payment?.status} />
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Articles</dt>
                <dd className="text-right font-medium tabular-nums sm:text-left">
                  {itemCount} article{itemCount > 1 ? "s" : ""}
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Total</dt>
                <dd className="text-right font-semibold tabular-nums sm:text-left">
                  {formatCurrency(commande.totalAmount, {
                    unit: "cent",
                    maximumFractionDigits: 0,
                  })}
                </dd>
              </div>
              <div className="flex justify-between gap-2 sm:col-span-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Date</dt>
                <dd className="tabular-nums text-muted-foreground text-right sm:text-left">
                  {formatCommandeDate(commande.createdAt)}
                </dd>
              </div>
            </dl>
          </article>
        )
      })}
    </div>
  )
}
