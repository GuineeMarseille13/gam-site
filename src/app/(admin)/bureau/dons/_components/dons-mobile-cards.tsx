import type { DonWithRelations } from "../_types/don-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatDonDate,
  getDonAvatarClass,
  getDonInitials,
} from "../_utils/don-display"

interface DonsMobileCardsProps {
  readonly dons: DonWithRelations[]
}

/**
 * Cartes empilées pour viewport < md (lisibilité sans défilement horizontal forcé).
 */
export function DonsMobileCards({ dons }: DonsMobileCardsProps) {
  return (
    <div className="space-y-3 md:hidden" aria-label="Liste des dons">
      {dons.map((don) => {
        const person = don.person

        return (
          <article
            key={don.id}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start gap-3 border-border border-b pb-3">
              {person ? (
                <div
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${getDonAvatarClass(
                    person.firstName,
                  )}`}
                >
                  {getDonInitials(person.firstName, person.lastName)}
                </div>
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                  ?
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground text-sm leading-tight">
                  {person ? `${person.firstName} ${person.lastName}` : "Anonyme"}
                </p>
                {person?.email ? (
                  <p className="mt-1 truncate text-muted-foreground text-xs">
                    {person.email}
                  </p>
                ) : null}
              </div>

              <div className="text-right">
                <p className="font-semibold tabular-nums text-foreground text-sm">
                  {formatCurrency(don.amount, { maximumFractionDigits: 0 })}
                </p>
                <p className="mt-0.5 text-muted-foreground text-xs tabular-nums">
                  {formatDonDate(don.createdAt)}
                </p>
              </div>
            </div>

            <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Titre</dt>
                <dd className="font-medium text-right sm:text-left">
                  {don.title}
                </dd>
              </div>

              <div className="flex justify-between gap-2 sm:block sm:gap-0">
                <dt className="text-muted-foreground shrink-0">Message</dt>
                <dd className="text-muted-foreground text-right sm:text-left">
                  {don.message ? (
                    <span className="line-clamp-2">{don.message}</span>
                  ) : (
                    "—"
                  )}
                </dd>
              </div>
            </dl>
          </article>
        )
      })}
    </div>
  )
}

