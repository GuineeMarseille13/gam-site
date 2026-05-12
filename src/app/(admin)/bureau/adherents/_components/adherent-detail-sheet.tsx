"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  getAdhesionAvatarClass,
  getAdhesionInitials,
} from "@/app/(admin)/bureau/adhesions/_utils/adhesion-display";
import { IconLoader2, IconMail, IconPhone } from "@tabler/icons-react";

import { useAdherentDetail } from "../_hooks/use-adherent-detail";
import { AdherentDetailMemberships } from "./adherent-detail-memberships";

interface AdherentDetailSheetProps {
  readonly personId: string | null;
  readonly onClose: () => void;
}

/**
 * Panneau latéral : contact + liste complète des cotisations et paiements.
 */
export function AdherentDetailSheet({ personId, onClose }: AdherentDetailSheetProps) {
  const open = personId !== null;
  const { data, isPending, isError, error, refetch } = useAdherentDetail(personId);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      onClose();
    }
  };

  const displayName = data
    ? `${data.firstName} ${data.lastName}`.trim()
    : "Adhérent";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton
        className="flex w-full flex-col gap-0 overflow-hidden border-l border-border/40 bg-background/95 p-0 shadow-2xl shadow-black/40 backdrop-blur-xl sm:max-w-xl"
      >
        <SheetHeader className="space-y-0 border-b border-border/40 bg-gradient-to-br from-amber-500/12 via-muted/30 to-transparent px-6 pb-5 pt-7 dark:from-amber-500/10 dark:via-muted/20">
          <div className="flex gap-4">
            <Avatar className="size-16 shrink-0 ring-2 ring-amber-500/25 ring-offset-2 ring-offset-background">
              <AvatarImage src={data?.image ?? ""} alt={displayName} />
              <AvatarFallback
                className={`text-base font-bold ${data ? getAdhesionAvatarClass(data.firstName) : "bg-muted"}`}
              >
                {data
                  ? getAdhesionInitials(data.firstName, data.lastName)
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Fiche adhérent
              </p>
              <SheetTitle className="text-left text-2xl font-bold tracking-tight">
                {isPending ? "Chargement…" : displayName}
              </SheetTitle>
              <SheetDescription asChild>
                <div className="flex flex-col gap-2.5 text-left text-sm text-muted-foreground">
                  {data?.phone ? (
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/60 text-muted-foreground shadow-inner ring-1 ring-border/40">
                        <IconPhone className="size-4" aria-hidden />
                      </span>
                      <span className="tabular-nums text-foreground/90">{data.phone}</span>
                    </span>
                  ) : null}
                  {data?.email ? (
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background/60 text-muted-foreground shadow-inner ring-1 ring-border/40">
                        <IconMail className="size-4" aria-hidden />
                      </span>
                      <span className="truncate text-foreground/90">{data.email}</span>
                    </span>
                  ) : null}
                  {data ? (
                    <span className="inline-flex w-fit items-center rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-500/25 dark:text-amber-200">
                      {data.memberships.length} adhésion
                      {data.memberships.length > 1 ? "s" : ""} enregistrée
                      {data.memberships.length > 1 ? "s" : ""}
                    </span>
                  ) : null}
                </div>
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6">
          {isPending && (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
              <IconLoader2 className="size-9 animate-spin text-amber-500/80" aria-hidden />
              <p className="text-sm font-medium">Chargement des cotisations…</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center gap-4 rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {error?.message ?? "Impossible de charger la fiche."}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
              >
                Réessayer
              </Button>
            </div>
          )}

          {data && !isPending && (
            <>
              <div className="mb-5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Historique des adhésions
                </h3>
                <Separator className="mt-3 bg-gradient-to-r from-border via-border/50 to-transparent" />
              </div>
              <AdherentDetailMemberships memberships={data.memberships} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
