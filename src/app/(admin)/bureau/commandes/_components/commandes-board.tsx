"use client";

import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";
import type { OrderWithRelations } from "../_types/order-with-relations.type";
import { CommandeDetailSheet } from "./commande-detail-sheet";
import { CommandesDesktopTable } from "./commandes-desktop-table";
import { CommandesMobileCards } from "./commandes-mobile-cards";

interface CommandesBoardProps {
  readonly commandes: OrderWithRelations[];
}

/**
 * Liste des commandes : cartes sur petit écran, tableau à partir de md, détail en panneau latéral.
 */
export function CommandesBoard({ commandes }: CommandesBoardProps) {
  const [detailCommande, setDetailCommande] = useState<OrderWithRelations | null>(
    null,
  );

  if (commandes.length === 0) {
    return (
      <Card>
        <CardContent className="flex min-h-[12rem] items-center justify-center px-6 py-10 text-center text-sm text-muted-foreground">
          Aucune commande enregistrée
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <CommandeDetailSheet
        commande={detailCommande}
        onClose={() => setDetailCommande(null)}
      />
      <CommandesMobileCards
        commandes={commandes}
        onOpenDetail={setDetailCommande}
      />
      <CommandesDesktopTable
        commandes={commandes}
        onOpenDetail={setDetailCommande}
      />
    </>
  );
}
