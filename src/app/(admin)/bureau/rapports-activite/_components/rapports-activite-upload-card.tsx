"use client"

import { useId } from "react"
import { IconPlus, IconTrash, IconUpload } from "@tabler/icons-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export interface UploadRow {
  key: string
  year: number
  label: string
  file: File | null
}

interface RapportsActiviteUploadCardProps {
  rows: UploadRow[]
  formError: string | null
  isPending: boolean
  /** Désactivé tant que la dernière ligne n’a pas année, titre et fichier. */
  canAddAnotherRow: boolean
  onAddRow: () => void
  onRemoveRow: (key: string) => void
  onChangeRow: (key: string, patch: Partial<UploadRow>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

/**
 * Formulaire multi-lignes : année, titre affiché et fichier obligatoires par ligne — envoi groupé.
 */
export function RapportsActiviteUploadCard({
  rows,
  formError,
  isPending,
  canAddAnotherRow,
  onAddRow,
  onRemoveRow,
  onChangeRow,
  onSubmit,
}: RapportsActiviteUploadCardProps) {
  const formId = useId()

  return (
    <Card className="lg:col-span-1 overflow-hidden rounded-2xl border-border/60 shadow-sm">
      <CardHeader className="border-border/50 border-b bg-muted/15 px-5 py-4 sm:px-6">
        <CardTitle className="text-lg font-semibold tracking-tight">Publier des rapports</CardTitle>
        <CardDescription>
          Une ligne = année, titre affiché et fichier (tous obligatoires). Vous ne pouvez ajouter une ligne suivante
          qu’une fois la précédente entièrement remplie. Si l’année existe déjà sur le site, le fichier est remplacé.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-4 sm:px-6">
        <form id={formId} onSubmit={onSubmit} className="space-y-5">
          <ul className="space-y-4">
            {rows.map((row) => (
              <li
                key={row.key}
                className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor={`${formId}-year-${row.key}`}>Année</Label>
                    <Input
                      id={`${formId}-year-${row.key}`}
                      type="number"
                      min={2000}
                      max={2100}
                      value={row.year}
                      onChange={(ev) => {
                        const v = Number(ev.target.value)
                        onChangeRow(row.key, { year: Number.isFinite(v) ? v : row.year })
                      }}
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`${formId}-label-${row.key}`}>Titre affiché</Label>
                    <Input
                      id={`${formId}-label-${row.key}`}
                      placeholder="Ex. Rapport d'activités 2024"
                      required
                      value={row.label}
                      onChange={(ev) => onChangeRow(row.key, { label: ev.target.value })}
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Label htmlFor={`${formId}-file-${row.key}`}>Fichier</Label>
                    <Input
                      id={`${formId}-file-${row.key}`}
                      type="file"
                      required
                      accept="application/pdf,.pdf"
                      className="cursor-pointer"
                      onChange={(ev) => {
                        const file = ev.target.files?.[0] ?? null
                        onChangeRow(row.key, { file })
                      }}
                    />
                  </div>
                  {rows.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-muted-foreground"
                      onClick={() => onRemoveRow(row.key)}
                    >
                      <IconTrash className="size-4" />
                      Retirer la ligne
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {formError && (
            <p className="text-sm text-destructive" role="alert">
              {formError}
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddRow}
              disabled={!canAddAnotherRow}
              title={
                canAddAnotherRow
                  ? undefined
                  : "Remplissez d’abord l’année, le titre affiché et le fichier de la ligne actuelle."
              }
              className="gap-1.5"
            >
              <IconPlus className="size-4" />
              Ajouter une année
            </Button>
            <Button type="submit" disabled={isPending} className="gap-1.5 bg-amber-500 hover:bg-amber-600">
              <IconUpload className="size-4" />
              {isPending ? "Envoi…" : "Enregistrer sur le site"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
