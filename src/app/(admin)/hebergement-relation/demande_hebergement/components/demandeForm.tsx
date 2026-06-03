"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SubmitButton } from "@/components/bureau/submit-button"

interface DemandeFormProps {
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  cancelHref: string
  /**
   * Si `true` → mode création : le champ statut est masqué (forcé EN_ATTENTE côté serveur).
   * Si `false` (défaut) → mode modification : le champ statut est visible et éditable.
   */
  isCreating?: boolean
  defaultValues?: {
    prenom?: string
    nom?: string
    email?: string
    telephone?: string
    adresse?: string
    nbPersonnes?: number
    dateArrivee?: Date
    dateFin?: Date | null
    dureeJours?: number
    description?: string | null
    statut?: "EN_ATTENTE" | "TRAITEE" | "REFUSEE"
    notesAdmin?: string | null
  }
}

export function DemandeForm({
  action,
  submitLabel = "Enregistrer",
  cancelHref,
  isCreating = false,
  defaultValues,
}: DemandeFormProps) {

  const toDateInputValue = (d?: Date | null) => {
    if (!d) return ""
    return new Date(d).toISOString().slice(0, 10) // "YYYY-MM-DD"
  }

  return (
    <form action={action} className="space-y-6 max-w-xl">

      {/* ── Statut : masqué à la création, visible en modification ── */}
      {isCreating ? (
        // Champ caché pour forcer EN_ATTENTE sans que l'utilisateur puisse le changer
        <input type="hidden" name="statut" value="EN_ATTENTE" />
      ) : (
        <div className="space-y-2">
          <Label className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Statut
          </Label>
          <select
            name="statut"
            defaultValue={defaultValues?.statut ?? "EN_ATTENTE"}
            className="w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EN_ATTENTE">⏳ En attente</option>
            <option value="TRAITEE">✅ Traitée</option>
            <option value="REFUSEE">❌ Refusée</option>
          </select>
        </div>
      )}

      {!isCreating && <div className="border-t" />}

      {/* ── Prénom + Nom ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="prenom" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Prénom <span className="text-destructive">*</span>
          </Label>
          <Input id="prenom" name="prenom" required
            defaultValue={defaultValues?.prenom ?? ""}
            className="h-10 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nom" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Nom <span className="text-destructive">*</span>
          </Label>
          <Input id="nom" name="nom" required
            defaultValue={defaultValues?.nom ?? ""}
            className="h-10 rounded-xl" />
        </div>
      </div>

      {/* ── Téléphone ── */}
      <div className="space-y-2">
        <Label htmlFor="telephone" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Téléphone <span className="text-destructive">*</span>
        </Label>
        <Input id="telephone" name="telephone" type="tel" required
          defaultValue={defaultValues?.telephone ?? ""}
          className="h-10 rounded-xl" />
      </div>

      {/* ── Email (optionnel) ── */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Email{" "}
          <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
        </Label>
        <Input id="email" name="email" type="email"
          defaultValue={defaultValues?.email ?? ""}
          className="h-10 rounded-xl" />
      </div>

      {/* ── Adresse (optionnel) ── */}
      <div className="space-y-2">
        <Label htmlFor="adresse" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Adresse actuelle{" "}
          <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
        </Label>
        <Input id="adresse" name="adresse"
          defaultValue={defaultValues?.adresse ?? ""}
          className="h-10 rounded-xl" />
      </div>

      <div className="border-t" />

      {/* ── Nombre de demandeurs ── */}
      <div className="space-y-2">
        <Label htmlFor="nbPersonnes" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Nombre de personnes <span className="text-destructive">*</span>
        </Label>
        <Input id="nbPersonnes" name="nbPersonnes" type="number" min={1} required
          defaultValue={defaultValues?.nbPersonnes ?? 1}
          className="h-10 rounded-xl" />
      </div>

      {/* ── Intervalle de temps : date d'arrivée → date de fin ── */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateArrivee" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Date d'arrivée <span className="text-destructive">*</span>
          </Label>
          <Input id="dateArrivee" name="dateArrivee" type="date" required
            defaultValue={toDateInputValue(defaultValues?.dateArrivee)}
            className="h-10 rounded-xl" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateFin" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Date de départ{" "}
            <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
          </Label>
          <Input id="dateFin" name="dateFin" type="date"
            defaultValue={toDateInputValue(defaultValues?.dateFin)}
            className="h-10 rounded-xl" />
        </div>
      </div>

      {/* ── Durée en jours ── */}
      <div className="space-y-2">
        <Label htmlFor="dureeJours" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Durée estimée (jours) <span className="text-destructive">*</span>
        </Label>
        <Input id="dureeJours" name="dureeJours" type="number" min={1} required
          defaultValue={defaultValues?.dureeJours ?? 1}
          className="h-10 rounded-xl" />
      </div>

      {/* ── Description / message ── */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Message / description{" "}
          <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
        </Label>
        <textarea
          id="description" name="description"
          defaultValue={defaultValues?.description ?? ""}
          rows={3}
          placeholder="Informations complémentaires sur la demande..."
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="border-t" />

      {/* ── Notes admin ── */}
      <div className="space-y-2">
        <Label htmlFor="notesAdmin" className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Notes admin{" "}
          <span className="normal-case font-normal text-muted-foreground/60">(optionnel)</span>
        </Label>
        <textarea
          id="notesAdmin" name="notesAdmin"
          defaultValue={defaultValues?.notesAdmin ?? ""}
          rows={4}
          placeholder="Note interne visible uniquement par l'équipe..."
          className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* ── Boutons ── */}
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton className="h-10 rounded-xl px-5 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white">
          {submitLabel}
        </SubmitButton>
        <Button variant="ghost" asChild className="h-10 rounded-xl px-4 text-sm font-medium">
          <Link href={cancelHref}>Annuler</Link>
        </Button>
      </div>
    </form>
  )
}