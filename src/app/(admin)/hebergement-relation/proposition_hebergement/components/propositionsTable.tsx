"use client"

import { useState, useTransition, useRef, useEffect } from "react"
import Link from "next/link"
import {
  IconEye, IconPencil, IconTrash,
  IconClock, IconCheck, IconHome, IconDots, IconX, IconLock,
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
  description: string | null
  statut: "EN_ATTENTE" | "VALIDE" | "OCCUPE" | "REFUSE" | "CLOTURE"
  notesAdmin: string | null
  createdAt: Date
}

// ─── Badge statut ────────────────────────────────────────────────────────────

function StatutBadge({ statut }: { statut: Proposition["statut"] }) {
  switch (statut) {
    case "VALIDE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
          <IconCheck className="size-3" /> Validé
        </span>
      )
    case "OCCUPE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
          <IconHome className="size-3" /> Occupé
        </span>
      )
    case "REFUSE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
          <IconX className="size-3" /> Refusé
        </span>
      )
    case "CLOTURE":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
          <IconLock className="size-3" /> Clôturé
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
          <IconClock className="size-3" /> En attente
        </span>
      )
  }
}

// ─── InfoItem ────────────────────────────────────────────────────────────────

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 w-full min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground break-all sm:break-words whitespace-pre-wrap">
        {value || "Non renseigné"}
      </p>
    </div>
  )
}

// ─── Dropdown d'actions (mobile + desktop) ───────────────────────────────────

function ActionsDropdown({
  proposition,
  onDetail,
  onDelete,
}: {
  proposition: Proposition
  onDetail: () => void
  onDelete: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Ferme le menu si on clique ailleurs
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  return (
    <div ref={ref} className="relative flex items-center justify-end">
      {/* ── Desktop : boutons texte alignés ── */}
      <div className="hidden md:flex items-center gap-4">
        <button
          type="button"
          onClick={onDetail}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          title="Détails"
        >
          <IconEye className="size-4" />
          <span>Détails</span>
        </button>
        <Link
          href={`/hebergement-relation/proposition_hebergement/${proposition.id}/modifier`}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          title="Modifier"
        >
          <IconPencil className="size-4" />
          <span>Modifier</span>
        </Link>
        <button
          type="button"
          onClick={onDelete}
          className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors font-semibold"
          title="Supprimer"
        >
          <IconTrash className="size-4" />
          <span>Supprimer</span>
        </button>
      </div>

      {/* ── Mobile : bouton ··· → menu déroulant ── */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground"
          title="Actions"
        >
          <IconDots className="size-4" />
        </button>

        {open && (
          <div className="absolute right-0 top-full z-50 mt-1 w-44 rounded-xl border border-border bg-background shadow-lg py-1 text-sm">
            <button
              type="button"
              onClick={() => { onDetail(); setOpen(false) }}
              className="flex w-full items-center gap-2.5 px-3 py-2 hover:bg-muted/60 transition-colors text-foreground"
            >
              <IconEye className="size-4 text-muted-foreground" />
              Détails
            </button>
            <Link
              href={`/hebergement-relation/proposition_hebergement/${proposition.id}/modifier`}
              className="flex w-full items-center gap-2.5 px-3 py-2 hover:bg-muted/60 transition-colors text-foreground"
              onClick={() => setOpen(false)}
            >
              <IconPencil className="size-4 text-muted-foreground" />
              Modifier
            </Link>
            <div className="mx-2 border-t border-border my-1" />
            <button
              type="button"
              onClick={() => { onDelete(); setOpen(false) }}
              className="flex w-full items-center gap-2.5 px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-destructive font-medium"
            >
              <IconTrash className="size-4" />
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Composant principal ─────────────────────────────────────────────────────

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
      {/* ─── Tableau ─── */}
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
                  {/* Hébergeur */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-xs font-bold select-none">
                        {p.prenom[0]}{p.nom[0]}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">
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

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <ActionsDropdown
                      proposition={p}
                      onDetail={() => ouvrirDetails(p)}
                      onDelete={() => setIdASupprimer(p.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sheet Détails ─── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[460px] p-4 sm:p-6 overflow-y-auto bg-background text-foreground flex flex-col justify-between"
        >
          {selected && (
            <>
              <div className="space-y-6">
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 text-lg font-bold">
                      {selected.prenom[0]}{selected.nom[0]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <SheetTitle className="text-base truncate">
                        {selected.prenom} {selected.nom}
                      </SheetTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Reçu le {new Date(selected.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                </SheetHeader>

                {/* Contact */}
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

                <div className="border-t border-border" />

                {/* Hébergement */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Hébergement proposé
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
                      <div className="pt-0.5">
                        <StatutBadge statut={selected.statut} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selected.description && (
                  <>
                    <div className="border-t border-border" />
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Description du logement
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                        {selected.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Notes admin */}
                {selected.notesAdmin && (
                  <>
                    <div className="border-t border-border" />
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Notes admin
                      </p>
                      <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                        {selected.notesAdmin}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Bouton modifier */}
              <div className="border-t border-border pt-4 mt-6">
                <Button
                  asChild
                  className="w-full h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  <Link
                    href={`/hebergement-relation/proposition_hebergement/${selected.id}/modifier`}
                  >
                    <IconPencil className="size-4 mr-2" />
                    Modifier cette proposition
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* ─── Dialog suppression ─── */}
      <AlertDialog
        open={idASupprimer !== null}
        onOpenChange={(open) => { if (!open) setIdASupprimer(null) }}
      >
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette proposition ?</AlertDialogTitle>
            <AlertDialogDescription>Cette action est irréversible.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel className="mt-0">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmerSuppression}
              disabled={isPending}
            >
              {isPending ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}