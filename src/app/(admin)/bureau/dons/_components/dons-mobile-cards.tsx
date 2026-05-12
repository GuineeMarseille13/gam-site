import type { DonWithRelations } from "../_types/don-with-relations.type"
import { formatCurrency } from "@/helpers/format-currency"
import {
  formatDonDate,
  getDonAvatarClass,
  getDonInitials,
} from "../_utils/don-display"
import { DonMessagePreview } from "./don-message-preview"

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

            <section
              className="mt-3 border-border border-t pt-3"
              aria-label="Message du don"
            >
              <h3 className="text-muted-foreground text-xs font-medium tracking-wide">
                Message
              </h3>
              <div className="mt-2 text-foreground">
                <DonMessagePreview message={don.message} variant="card" />
              </div>
            </section>
          </article>
        )
      })}
    </div>
  )
}

