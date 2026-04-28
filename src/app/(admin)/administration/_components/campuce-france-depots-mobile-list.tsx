"use client"

import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Phone } from "lucide-react"

import type { CampuceFranceSubmissionAdminRow } from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

import {
  progressBackgroundClassName,
  rowLabel,
} from "./campuce-france-depots-helpers"

interface CampuceFranceDepotsMobileListProps {
  rows: CampuceFranceSubmissionAdminRow[]
  onOpenDetail: (row: CampuceFranceSubmissionAdminRow) => void
}

export function CampuceFranceDepotsMobileList({
  rows,
  onOpenDetail,
}: CampuceFranceDepotsMobileListProps) {
  return (
    <ul className="grid gap-3 md:hidden">
      {rows.map((row) => (
        <li key={row.id}>
          <Card
            className={[
              "border-border/70 shadow-sm",
              progressBackgroundClassName(row),
            ].join(" ")}
          >
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-foreground">{rowLabel(row)}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(row.createdAt), "d MMM yyyy à HH:mm", {
                      locale: fr,
                    })}
                  </p>
                </div>
                <Badge variant="secondary" className="shrink-0 tabular-nums">
                  {row.filesIds.length} fichier{row.filesIds.length > 1 ? "s" : ""}
                </Badge>
              </div>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4 shrink-0" aria-hidden />
                <span className="break-all">{row.phone}</span>
              </p>
              <p className="text-sm text-muted-foreground">{row.country}</p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => onOpenDetail(row)}
              >
                Voir le dossier et les fichiers
              </Button>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  )
}

