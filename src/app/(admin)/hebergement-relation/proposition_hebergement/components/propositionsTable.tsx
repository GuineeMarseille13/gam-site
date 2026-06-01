"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  IconEye, IconPencil, IconTrash,
  IconClock, IconCheck, IconHome, IconUser
} from "@tabler/icons-react"
import { deleteProposition } from "../actions/propositions_Actions"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type Proposition = {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  nbPersonnes: number
  dateDebut: Date
  dureeJours: number
  statut: "EN_ATTENTE" | "VALIDE" | "OCCUPE"
  notesAdmin: string | null
  createdAt: Date
}


function StatutBadge({ statut }: { statut: Proposition["statut"] }) {
  if (statut === "VALIDE") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
      <IconCheck className="size-3" /> Validé
    </span>
  )
  if (statut === "OCCUPE") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
      <IconHome className="size-3" /> Occupé
    </span>
  ) 
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
      <IconClock className="size-3" /> En attente
    </span>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}

export function PropositionsTable({ initialData }: { initialData: Proposition[] }) {
  const [propositions, setPropositions] = useState(initialData)
  const [selected, setSelected] = useState<Proposition | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [idASupprimer, setIdASupprimer] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const ouvrirDetails = (p: Proposition) => {
    setSelected(p)
    setSheetOpen(true)
  }

  const confirmerSuppression = () => {
    if (!idASupprimer) return
    startTransition(async () => {
      await deleteProposition(idASupprimer)
      setPropositions((prev) => prev.filter((p) => p.id !== idASupprimer))
      setIdASupprimer(null)
    })
  }

  if (propositions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
        <IconHome className="size-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          Aucune proposition reçue pour l'instant.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden bg-background">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Hébergeur
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                  Téléphone
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hidden md:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hidden sm:table-cell">
                  Statut
                </th>
                <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {propositions.map((p) => (
                <tr key={p.id} className="hover:bg-muted/40 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold select-none">
                        {p.prenom[0]}{p.nom[0]}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {p.prenom} {p.nom}
                        </span>
                        <span className="sm:hidden mt-0.5">
                          <StatutBadge statut={p.statut} />
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell">
                    {p.telephone}
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">
                    {p.email}
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <StatutBadge statut={p.statut} />
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-2 sm:gap-4">
                      <button
                        type="button"
                        onClick={() => ouvrirDetails(p)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <IconEye className="size-4" />
                        <span className="hidden sm:inline">Détails</span>
                      </button>

                      <Link
                        href={`/hebergement-relation/proposition_hebergement/${p.id}/modifier`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <IconPencil className="size-4" />
                        <span className="hidden sm:inline">Modifier</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => setIdASupprimer(p.id)}
                        className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors font-semibold"
                      >
                        <IconTrash className="size-4" />
                        <span className="hidden sm:inline">Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sheet Détails (Ouverture latérale droite optimisée) ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[460px] overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 text-lg font-bold">
                    {selected.prenom[0]}{selected.nom[0]}
                  </div>
                  <div>
                    <SheetTitle className="text-base">
                      {selected.prenom} {selected.nom}
                    </SheetTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Reçu le {new Date(selected.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </SheetHeader>

              <div className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Contact
                  </p>
                  <div className="space-y-3 bg-muted/30 p-3 rounded-xl border border-border">
                    <InfoItem label="Email" value={selected.email} />
                    <InfoItem label="Téléphone" value={selected.telephone} />
                    <InfoItem label="Adresse" value={selected.adresse} />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Hébergement
                  </p>
                  <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-xl border border-border">
                    <InfoItem label="Nb. personnes" value={`${selected.nbPersonnes} pers.`} />
                    <InfoItem label="Durée" value={`${selected.dureeJours} jours`} />
                    <InfoItem
                      label="Disponible dès"
                      value={new Date(selected.dateDebut).toLocaleDateString("fr-FR")}
                    />
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                        Statut
                      </p>
                      <StatutBadge statut={selected.statut} />
                    </div>
                  </div>
                </div>

                {selected.notesAdmin && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Notes admin
                    </p>
                    <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl text-sm text-muted-foreground leading-relaxed">
                      {selected.notesAdmin}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button asChild className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href={`/hebergement-relation/proposition_hebergement/${selected.id}/modifier`}>
                      <IconPencil className="size-4 mr-2" />
                      Modifier cette proposition
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Dialog suppression ─── */}
      <AlertDialog open={idASupprimer !== null} onOpenChange={(open) => { if (!open) setIdASupprimer(null) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette proposition ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmerSuppression} disabled={isPending}>
              {isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}