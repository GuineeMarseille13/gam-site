"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  IconEye, IconPencil, IconTrash,
  IconClock, IconCheck, IconX
} from "@tabler/icons-react"
import { deleteDemande } from "../actions/demande_actions"
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

type Demande = {
  id: string
  prenom: string
  nom: string
  email: string
  telephone: string
  adresse: string
  nbPersonnes: number
  dateArrivee: Date
  dureeJours: number
  statut: "EN_ATTENTE" | "TRAITEE" | "REFUSEE"
  description: string | null
  notesAdmin: string | null
  createdAt: Date
}

function StatutBadge({ statut }: { statut: Demande["statut"] }) {
  if (statut === "TRAITEE") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
      <IconCheck className="size-3" /> Traitée
    </span>
  )
  if (statut === "REFUSEE") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
      <IconX className="size-3" /> Refusée
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600">
      <IconClock className="size-3" /> En attente
    </span>
  )
}

// Sous-composant pour afficher un champ label + valeur dans le Sheet
function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    /* EXPLICATION RESPONSIVE :
      - w-full & min-w-0 : Forcent le bloc à respecter la largeur du Sheet sans pousser les murs.
      - break-all : Si un e-mail ou un texte n'a pas d'espace (ex: fofaminataa@gmail.com), il est coupé proprement pour aller à la ligne.
      - sm:break-words : Sur des écrans plus grands, on coupe normalement par mot.
    */
    <div className="space-y-1 w-full min-w-0">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/70">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground break-all sm:break-words whitespace-pre-wrap">
        {value || "Non renseigné"}
      </p>
    </div>
  )
}

export function DemandesTable({ initialData }: { initialData: Demande[] }) {
  const [demandes, setDemandes] = useState(initialData)
  const [idASupprimer, setIdASupprimer] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // État pour le Sheet détails
  const [selected, setSelected] = useState<Demande | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const ouvrirDetails = (demande: Demande) => {
    setSelected(demande)
    setSheetOpen(true)
  }

  const confirmerSuppression = () => {
    if (!idASupprimer) return
    startTransition(async () => {
      await deleteDemande(idASupprimer)
      setDemandes((prev) => prev.filter((d) => d.id !== idASupprimer))
      setIdASupprimer(null)
    })
  }

  if (demandes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
        <IconClock className="size-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          Aucune demande reçue pour l'instant.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* ─── Tableau ─── */}
      {/* EXPLICATION : w-full empêche le conteneur du tableau de dépasser de l'écran principal */}
      <div className="rounded-xl border border-border overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Demandeur
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
              {demandes.map((demande) => (
                <tr key={demande.id} className="hover:bg-muted/40 transition-colors">

                  {/* Demandeur */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold select-none">
                        {demande.prenom[0]}{demande.nom[0]}
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-emerald-500" />
                      </div>
                      {/* min-w-0 et truncate évitent que les très longs noms fassent bugger la ligne sur mobile */}
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">
                          {demande.prenom} {demande.nom}
                        </span>
                        <span className="sm:hidden mt-0.5">
                          <StatutBadge statut={demande.statut} />
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell">
                    {demande.telephone}
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground hidden md:table-cell">
                    {demande.email}
                  </td>

                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <StatutBadge statut={demande.statut} />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-3 sm:gap-4">
                      {/* Détails → ouvre le Sheet */}
                      {/* EXPLICATION RESPONSIVE : hidden md:inline cache le texte sur mobile (seule l'icône reste) pour gagner de la place */}
                      <button
                        type="button"
                        onClick={() => ouvrirDetails(demande)}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        title="Détails"
                      >
                        <IconEye className="size-4 shrink-0" />
                        <span className="hidden md:inline">Détails</span>
                      </button>

                      {/* Modifier → page pleine */}
                      <Link
                        href={`/hebergement-relation/demande_hebergement/${demande.id}/modifier`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        title="Modifier"
                      >
                        <IconPencil className="size-4 shrink-0" />
                        <span className="hidden md:inline">Modifier</span>
                      </Link>

                      {/* Supprimer */}
                      <button
                        type="button"
                        onClick={() => setIdASupprimer(demande.id)}
                        className="flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80 transition-colors font-semibold"
                        title="Supprimer"
                      >
                        <IconTrash className="size-4 shrink-0" />
                        <span className="hidden md:inline">Supprimer</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Sheet Détails ─── */}
      {/* EXPLICATION RESPONSIVE :
        - w-full : Occupe tout l'écran sur mobile pour donner un maximum d'espace de lecture.
        - sm:max-w-[450px] : Reprend une taille fixe et élégante sur ordinateur.
        - flex flex-col justify-between : Structure le contenu verticalement pour isoler le bouton modifier en bas.
      */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[450px] p-4 sm:p-6 overflow-y-auto bg-background text-foreground flex flex-col justify-between"
        >
          {selected && (
            <>
              <div className="space-y-6">
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-3">
                    {/* Avatar initiales */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 text-lg font-bold">
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
                  <div className="space-y-3 pl-0.5">
                    <InfoItem label="Email" value={selected.email} />
                    <InfoItem label="Téléphone" value={selected.telephone} />
                    <InfoItem label="Adresse" value={selected.adresse} />
                  </div>
                </div>

                <div className="border-t border-border" />

                {/* Hébergement recherché */}
                <div className="space-y-3">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                    Hébergement recherché
                  </p>
                  {/* EXPLICATION RESPONSIVE :
                    - grid-cols-1 : Les informations s'empilent verticalement sur smartphone.
                    - sm:grid-cols-2 : Elles se remettent côte à côte dès qu'on est sur un écran plus large.
                  */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-0.5">
                    <InfoItem
                      label="Nb. personnes"
                      value={`${selected.nbPersonnes} pers.`}
                    />
                    <InfoItem
                      label="Durée"
                      value={`${selected.dureeJours} jours`}
                    />
                    <InfoItem
                      label="Date d'arrivée"
                      value={new Date(selected.dateArrivee).toLocaleDateString("fr-FR")}
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

                {/* Message du demandeur */}
                {selected.description && (
                  <>
                    <div className="border-t border-border" />
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Message
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
                      <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
                        {selected.notesAdmin}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Bouton modifier */}
              {/* EXPLICATION : pt-4 et mt-6 rajoutent de l'air au-dessus du bouton pour qu'il soit bien lisible */}
              <div className="border-t border-border pt-4 mt-6">
                <Button
                  asChild
                  className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  <Link
                    href={`/hebergement-relation/demande_hebergement/${selected.id}/modifier`}
                  >
                    <IconPencil className="size-4 mr-2" />
                    Modifier cette demande
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
        {/* EXPLICATION : max-w-[90vw] empêche la modale de dépasser de l'écran sur les téléphones très étroits */}
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette demande ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible.
            </AlertDialogDescription>
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