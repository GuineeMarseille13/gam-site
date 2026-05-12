"use client";

import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatCurrency } from "@/helpers/format-currency";
import {
  formatCommandeDate,
  getCommandeAvatarClass,
  getCommandeInitials,
} from "../_utils/commande-display";
import { CommandeStatusBadge } from "./commande-status-badge";
import { CommandeDetailProductsTable } from "./commande-detail-products-table";
import type { OrderWithRelations } from "../_types/order-with-relations.type";
import { IconMail, IconPhone } from "@tabler/icons-react";

interface CommandeDetailSheetProps {
  readonly commande: OrderWithRelations | null;
  readonly onClose: () => void;
}

function truncateStripeRef(ref: string): string {
  if (ref.length <= 24) return ref;
  return `${ref.slice(0, 20)}…`;
}

/**
 * Panneau latéral : récap commande, client, paiement et lignes produits.
 */
export function CommandeDetailSheet({
  commande,
  onClose,
}: CommandeDetailSheetProps) {
  const open = commande !== null;

  const handleOpenChange = (next: boolean) => {
    if (!next) onClose();
  };

  const person = commande?.person;
  const payment = commande?.payment;
  const displayName = person
    ? `${person.firstName} ${person.lastName}`.trim()
    : "";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full flex-col gap-0 overflow-hidden border-l border-border/40 bg-background/95 p-0 shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-xl"
      >
        {commande && person ? (
          <>
            <SheetHeader className="space-y-0 border-b border-border/40 bg-gradient-to-br from-amber-500/12 via-muted/30 to-transparent px-6 pb-5 pt-7 dark:from-amber-500/10 dark:via-muted/20">
              <p className="text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Détail commande
              </p>
              <SheetTitle className="text-left font-mono text-base tracking-tight">
                {commande.orderNumber}
              </SheetTitle>
              <SheetDescription asChild>
                <div className="flex flex-col gap-3 text-left">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {formatCommandeDate(commande.createdAt)}
                    </span>
                    <CommandeStatusBadge paymentStatus={payment?.status} />
                  </div>
                  <p className="text-lg font-bold tabular-nums text-foreground">
                    {formatCurrency(commande.totalAmount, {
                      unit: "cent",
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </SheetDescription>
            </SheetHeader>

            <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
              <section aria-labelledby="commande-client-heading">
                <h3
                  id="commande-client-heading"
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Client
                </h3>
                <Separator className="my-3 bg-gradient-to-r from-border via-border/50 to-transparent" />
                <div className="flex gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${getCommandeAvatarClass(person.firstName)}`}
                  >
                    {getCommandeInitials(person.firstName, person.lastName)}
                  </div>
                  <div className="min-w-0 space-y-2">
                    <p className="font-semibold text-foreground">{displayName}</p>
                    {person.phone ? (
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <IconPhone className="size-4 shrink-0" aria-hidden />
                        <span className="tabular-nums">{person.phone}</span>
                      </p>
                    ) : null}
                    {person.email ? (
                      <p className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                        <IconMail className="size-4 shrink-0" aria-hidden />
                        <span className="truncate">{person.email}</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              {payment ? (
                <section aria-labelledby="commande-paiement-heading">
                  <h3
                    id="commande-paiement-heading"
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Paiement
                  </h3>
                  <Separator className="my-3 bg-gradient-to-r from-border via-border/50 to-transparent" />
                  <dl className="grid gap-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Réf. Stripe</dt>
                      <dd
                        className="max-w-[60%] truncate font-mono text-xs text-foreground"
                        title={payment.paymentReference}
                      >
                        {truncateStripeRef(payment.paymentReference)}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Montant encaissé</dt>
                      <dd className="font-medium tabular-nums">
                        {formatCurrency(payment.amount, {
                          unit: "cent",
                          maximumFractionDigits: 2,
                        })}
                      </dd>
                    </div>
                  </dl>
                </section>
              ) : null}

              <section aria-labelledby="commande-lignes-heading">
                <h3
                  id="commande-lignes-heading"
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground"
                >
                  Articles ({commande.items.length})
                </h3>
                <Separator className="my-3 bg-gradient-to-r from-border via-border/50 to-transparent" />
                <CommandeDetailProductsTable items={commande.items} />
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
