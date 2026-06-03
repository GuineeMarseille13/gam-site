"use client"

import {
  startTransition,
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  
} from "react"
import { motion } from "framer-motion"
import { Home, Icon, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

import {
  submitHebergement,
  type HebergementFormState,
} from "@/app/(public)/poles/_actions/submit-hebrgment"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import type { Pole } from "@/data/poles"
import { cn } from "@/helpers/utils"
import { IconFile } from "@tabler/icons-react"

const initialState: HebergementFormState = { kind: "idle" }

// Style de focus cohérent avec le reste du site
const FIELD_FOCUS =
  "focus-visible:border-green-600 focus-visible:ring-[3px] focus-visible:ring-green-600/35"

interface Props {
  colorScheme: Pole["colorScheme"]
}

export function PoleHebergementForm({ colorScheme }: Props) {
  const [open, setOpen] = useState(false)
  const [formNonce, setFormNonce] = useState(0)

  // Réinitialise le formulaire à chaque fermeture
  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) setFormNonce((n) => n + 1)
  }, [])

  const handleSuccessClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>

      {/* ===== CARTE D'APERÇU (visible sur la page du pôle) ===== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 md:mb-16"
      >
        <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04]">
          {/* Barre colorée en haut */}
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${colorScheme.primary}`}
            aria-hidden
          />
          <CardHeader className="relative gap-4">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                {/* Icône */}
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorScheme.primary} text-white shadow-lg shadow-black/15`}>
                  <Home className="h-7 w-7" aria-hidden />
                </span>
                <div className="space-y-2">
                  <CardTitle className="text-xl font-semibold tracking-tight sm:text-2xl">
                    Ouvrir sa porte | Faciliter un nouveau départ
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                  Vous souhaitez accueillir un personne de la communauté en lui offrant un hébergement temporaire ? 
                 Renseignez vos disponibilités en quelques secondes.
                  </CardDescription>
                </div>
              </div>

              {/* Bouton qui ouvre le dialog */}
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className={`h-11 shrink-0 gap-2 rounded-xl bg-gradient-to-r ${colorScheme.primary} px-7 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-105 active:scale-[0.98] sm:self-center`}
                >
                  <IconFile className="size-5" />
                  Proposer un hébergement
                </Button>
              </DialogTrigger>
            </div>
          </CardHeader>
        </Card>
      </motion.section>

      {/* ===== DIALOG (formulaire complet) ===== */}
      <DialogContent
        showCloseButton
        className="flex max-h-[min(92dvh,880px)] w-[calc(100vw-1.5rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-border/80 p-0 shadow-2xl shadow-black/20 sm:w-[calc(100vw-2rem)]"
      >
        {/* En-tête coloré */}
        <div className={cn(
          "relative shrink-0 overflow-visible text-white",
          "px-4 pb-6 pt-10 pr-14 sm:px-6 sm:pb-7 sm:pr-6 sm:pt-9",
          `bg-gradient-to-br ${colorScheme.primary}`,
        )}>
          <div className="relative flex max-w-full flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm">
              <Home className="h-6 w-6 text-white" aria-hidden />
            </span>
            <div className="min-w-0 space-y-2">
              <DialogTitle className="text-lg font-semibold text-white sm:text-xl md:text-2xl">
                Proposition d'hébergement
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-white/95 sm:text-base">
                Remplissez ce formulaire pour proposer un hébergement temporaire.
                Notre équipe vous contactera après validation.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Corps du formulaire */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-muted/40 to-background px-5 py-6 sm:px-8 sm:py-7">
          <HebergementFormBody
            key={formNonce}
            colorScheme={colorScheme}
            onSuccessWithinDialog={handleSuccessClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ===== Corps du formulaire =====
interface FormBodyProps {
  colorScheme: Pole["colorScheme"]
  onSuccessWithinDialog: () => void
}

function HebergementFormBody({ colorScheme, onSuccessWithinDialog }: FormBodyProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, isPending] = useActionState(submitHebergement, initialState)

  // Ferme le dialog 2.2s après un succès, pour laisser le temps de lire le message de confirmation
  
  useEffect(() => {
    if (state.kind !== "success") return
    formRef.current?.reset()
    const t = window.setTimeout(() => onSuccessWithinDialog(), 2200)
    return () => window.clearTimeout(t)
  }, [state.kind, onSuccessWithinDialog])

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.reportValidity()) return
    startTransition(() => {
      void formAction(new FormData(form))
    })
  }, [formAction])

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-8"
      aria-busy={isPending}
    >
      {/* ─── Identité ─── */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Vos coordonnées
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="h-nom">Nom *</Label>
            <Input id="h-nom" name="nom" required maxLength={120} disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-prenom">Prénom *</Label>
            <Input id="h-prenom" name="prenom" required maxLength={120} disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="h-email">Email *</Label>
            <Input id="h-email" name="email" type="email" required maxLength={254}
              placeholder="exemple@email.com" disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-tel">Téléphone *</Label>
            <Input id="h-tel" name="telephone" type="tel" required maxLength={30}
              placeholder="+33 6 XX XX XX XX" disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-adresse">Adresse *</Label>
            <Input id="h-adresse" name="adresse" required maxLength={300}
              placeholder="13001 Marseille…" disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* ─── Détails hébergement ─── */}
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Détails de l'hébergement
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="h-nbPersonnes">Nb. de personnes *</Label>
            <Input id="h-nbPersonnes" name="nbPersonnes" type="number" min="1" max="20"
              required defaultValue="1" disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
          {/* <div className="space-y-2">
            <Label htmlFor="h-nbLits">Nb. de lits *</Label>
            <Input id="h-nbLits" name="nbLits" type="number" min="1" max="20"
              required defaultValue="1" disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div> */}
          <div className="space-y-2">
            <Label htmlFor="h-dateDebut">Date de disponibilité *</Label>
            <Input id="h-dateDebut" name="dateDebut" type="date" required disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="h-dureeJours">Durée (jours) *</Label>
            <Input id="h-dureeJours" name="dureeJours" type="number" min="1" max="365"
              required defaultValue="7" disabled={isPending}
              className={cn("h-11 rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)} />
          </div>
        </div>
      </div>
      {/* plus de détails */}
<div className="space-y-4">
  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
    Plus de détails
  </p>

  {/* Description qui sera afficher dans le détail directement de la proposition */}
  <div className="space-y-2">
    <Label htmlFor="h-description">Description de votre offre (optionnel)</Label>
    <Textarea
      id="h-description" name="description" rows={4} maxLength={1000}
      placeholder="Ex : J'ai une chambre avec un lit double, un canapé convertible dans le salon, et je peux fournir des draps et des serviettes. Je vis dans un quartier calme à proximité des transports en commun."
      disabled={isPending}
      className={cn("rounded-xl border-border/80 bg-background/80 shadow-sm", FIELD_FOCUS)}
    />
  </div>
</div>

      {/* ─── Messages état ─── */}
      {state.kind === "error" && (
        <p role="alert" className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {state.message}
        </p>
      )}
      {state.kind === "success" && (
        <p role="status" className="rounded-xl border border-emerald-200/80 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900">
          Merci. Votre proposition a bien été enregistrée. <br />
          Nous vous contacterons ultérieurement.
        </p>
      )}

      {/* ─── Bouton soumission ─── */}
      <div className="flex flex-col gap-3 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="submit"
          disabled={isPending || state.kind === "success"}
          className={cn(
            "h-12 min-w-[180px] rounded-xl text-base font-semibold shadow-lg transition hover:brightness-105",
            `bg-gradient-to-r ${colorScheme.primary} text-white`,
          )}
        >
          {isPending ? (
            <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Envoi en cours…</>
          ) : "Envoyer ma proposition"}
        </Button>
      </div>
    </form>
  )
}