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
import {
  GraduationCap,
  Loader2,
  Paperclip,
  Trash2,
  Upload,
} from "lucide-react"

import { submitCampuceFranceStudentApplication } from "@/app/(public)/poles/_actions/submit-campuce-france-student-application"
import type { CampuceFranceFormState } from "@/app/(public)/poles/_actions/submit-campuce-france-student-application"
import {
  CAMPUCE_MAX_FILES,
  CAMPUCE_MAX_FILE_BYTES,
  CAMPUCE_HELP_TYPES,
} from "@/app/(public)/poles/_schemas/campuce-france-submission.schema"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Pole } from "@/data/poles"
import { cn } from "@/helpers/utils"
import { IconFiles } from "@tabler/icons-react"

const initialActionState: CampuceFranceFormState = { kind: "idle" }

const ACCEPT_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
] as const

/** Focus des champs : teal / émeraude (cohérent avec le bandeau du dialogue). */
const CAMPUCE_FIELD_FOCUS =
  "focus-visible:border-teal-600 focus-visible:ring-[3px] focus-visible:ring-teal-600/35 dark:focus-visible:border-teal-400 dark:focus-visible:ring-teal-400/40"

interface CampuceFranceStudentFormProps {
  colorScheme: Pole["colorScheme"]
}

/**
 * Carte sur le pôle + formulaire Campus France dans un overlay (dialog) au clic.
 */
export function CampuceFranceStudentForm({
  colorScheme,
}: CampuceFranceStudentFormProps) {
  const [open, setOpen] = useState(false)
  const [formNonce, setFormNonce] = useState(0)

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next)
    if (!next) {
      setFormNonce((n) => n + 1)
    }
  }, [])

  const handleSuccessClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-labelledby="campuce-france-teaser-title"
        className="mb-12 md:mb-16"
      >
        <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl shadow-black/[0.06] ring-1 ring-black/[0.04] dark:ring-white/10">
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${colorScheme.primary}`}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-14 -top-14 size-44 rounded-full bg-muted blur-3xl opacity-70 dark:bg-muted/40"
            aria-hidden
          />
          <CardHeader className="relative gap-4 ">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${colorScheme.primary} text-white shadow-lg shadow-black/15`}
                >
                  <GraduationCap className="h-7 w-7" aria-hidden />
                </span>
                <div className="space-y-2">
                  <CardTitle
                    id="campuce-france-teaser-title"
                    className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
                  >
                    Campus France — votre dossier
                  </CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-relaxed text-muted-foreground">
                    Pour les étudiants que nous accompagnons dans cette démarche :
                    transmettez votre prénom, nom, email, téléphone et pays, et joignez
                    si besoin jusqu’à trois fichiers (PDF ou photos).
                  </CardDescription>
                </div>
              </div>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  className={`h-11 shrink-0 gap-2 rounded-xl bg-gradient-to-r ${colorScheme.primary} px-7 text-base font-semibold text-white shadow-lg shadow-black/20 transition hover:brightness-105 active:scale-[0.98] sm:self-center`}
                >
                  <IconFiles className="size-6" />
                  Ouvrir le formulaire
                </Button>
              </DialogTrigger>
            </div>
          </CardHeader>
        </Card>
      </motion.section>

      <DialogContent
        showCloseButton
        className="flex max-h-[min(92dvh,880px)] w-[calc(100vw-1.5rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-2xl border-border/80 p-0 shadow-2xl shadow-black/20 sm:w-[calc(100vw-2rem)] sm:max-w-2xl"
      >
        <div
          className={cn(
            "relative shrink-0 overflow-visible text-white",
            "px-4 pb-6 pt-10 pr-14 sm:px-6 sm:pb-7 sm:pr-6 sm:pt-9",
            `bg-gradient-to-br ${colorScheme.primary}`,
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, white 0%, transparent 45%), radial-gradient(circle at 80% 80%, white 0%, transparent 40%)",
            }}
            aria-hidden
          />
          <div className="relative flex max-w-full flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-inner backdrop-blur-sm sm:h-12 sm:w-12">
              <GraduationCap className="h-6 w-6 text-white" aria-hidden />
            </span>
            <div className="min-w-0 max-w-full flex-1 space-y-2 sm:space-y-2.5">
              <DialogTitle className="border-0 bg-transparent p-0 text-left text-lg font-semibold leading-snug tracking-tight text-white shadow-none sm:text-xl md:text-2xl">
                Envoi de votre dossier
              </DialogTitle>
              <DialogDescription className="border-0 bg-transparent p-0 text-left text-sm leading-relaxed text-white/95 sm:text-base">
                Prénom, nom, email, téléphone et pays sont requis ; jusqu’à{" "}
                {CAMPUCE_MAX_FILES} fichiers facultatifs (PDF ou images).
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-muted/40 to-background px-5 py-6 sm:px-8 sm:py-7">
          <CampuceFranceDialogFormBody
            key={formNonce}
            colorScheme={colorScheme}
            onSuccessWithinDialog={handleSuccessClose}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface CampuceFranceDialogFormBodyProps {
  colorScheme: Pole["colorScheme"]
  onSuccessWithinDialog: () => void
}

function CampuceFranceDialogFormBody({
  colorScheme,
  onSuccessWithinDialog,
}: CampuceFranceDialogFormBodyProps) {
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [helpType, setHelpType] = useState<string>(
    CAMPUCE_HELP_TYPES.hosting_attestation,
  )
  const [files, setFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [state, formAction, isPending] = useActionState(
    submitCampuceFranceStudentApplication,
    initialActionState,
  )

  useEffect(() => {
    if (state.kind !== "success") return
    formRef.current?.reset()
    setHelpType(CAMPUCE_HELP_TYPES.hosting_attestation)
    setFiles([])
    const t = window.setTimeout(() => {
      onSuccessWithinDialog()
    }, 2200)
    return () => {
      window.clearTimeout(t)
    }
  }, [state.kind, onSuccessWithinDialog])

  const mergeFiles = useCallback((incoming: File[]) => {
    const allowed = incoming.filter((f) =>
      (ACCEPT_FILE_TYPES as readonly string[]).includes(f.type),
    )
    setFiles((prev) => [...prev, ...allowed].slice(0, CAMPUCE_MAX_FILES))
  }, [])

  const canUploadFiles = helpType === CAMPUCE_HELP_TYPES.hosting_attestation

  const handlePickFiles = useCallback(() => {
    if (!canUploadFiles) return
    fileInputRef.current?.click()
  }, [canUploadFiles])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canUploadFiles) {
        e.target.value = ""
        return
      }
      const picked = Array.from(e.target.files ?? [])
      mergeFiles(picked)
      e.target.value = ""
    },
    [mergeFiles, canUploadFiles],
  )

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isPending) setIsDragging(true)
  }, [isPending])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
      if (isPending || !canUploadFiles) return
      const dropped = Array.from(e.dataTransfer.files)
      mergeFiles(dropped)
    },
    [isPending, mergeFiles, canUploadFiles],
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const fd = new FormData(e.currentTarget)
      fd.delete("files")
      if (canUploadFiles) {
        for (const f of files) {
          fd.append("files", f)
        }
      }
      startTransition(() => {
        void formAction(fd)
      })
    },
    [files, formAction, canUploadFiles],
  )

  const fileHintMb = Math.round(CAMPUCE_MAX_FILE_BYTES / (1024 * 1024))

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-8"
      aria-busy={isPending}
      aria-label="Formulaire — envoi de dossier Campus France"
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="pointer-events-none absolute left-[-9999px] top-0 h-0 w-0 opacity-0"
        aria-hidden
      />

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Vos coordonnées
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="campuce-firstName"
              className="text-sm font-medium text-foreground"
            >
              Prénom
            </Label>
            <Input
              id="campuce-firstName"
              name="firstName"
              required
              autoComplete="given-name"
              maxLength={120}
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="campuce-lastName"
              className="text-sm font-medium text-foreground"
            >
              Nom
            </Label>
            <Input
              id="campuce-lastName"
              name="lastName"
              required
              autoComplete="family-name"
              maxLength={120}
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="campuce-email"
              className="text-sm font-medium text-foreground"
            >
              Email
            </Label>
            <Input
              id="campuce-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder="exemple@email.com"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="campuce-phone"
              className="text-sm font-medium text-foreground"
            >
              Numéro whatsapp
            </Label>
            <Input
              id="campuce-phone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              inputMode="tel"
              maxLength={30}
              placeholder="Ex: +224 6 XX XX XX XX"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="campuce-country"
              className="text-sm font-medium text-foreground"
            >
              Pays
            </Label>
            <Input
              id="campuce-country"
              name="country"
              required
              autoComplete="country-name"
              maxLength={120}
              placeholder="Ex: Guinée, France…"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>
        </div>
      </div>

      <Separator className="bg-border/60" />

      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Informations universitaires
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="campuce-acceptanceCity"
              className="text-sm font-medium text-foreground"
            >
              Ville d’acceptation
            </Label>
            <Input
              id="campuce-acceptanceCity"
              name="acceptanceCity"
              required
              maxLength={160}
              placeholder="Marseille, Aix-en-Provence…"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="campuce-universitySite"
              className="text-sm font-medium text-foreground"
            >
              Site universitaire
            </Label>
            <Input
              id="campuce-universitySite"
              name="universitySite"
              required
              maxLength={160}
              placeholder="Luminy, Forbin…"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="campuce-academicLevel"
              className="text-sm font-medium text-foreground"
            >
              Niveau
            </Label>
            <Input
              id="campuce-academicLevel"
              name="academicLevel"
              required
              maxLength={80}
              placeholder="Licence 1, Master 2…"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="campuce-program"
              className="text-sm font-medium text-foreground"
            >
              Parcours / formation
            </Label>
            <Input
              id="campuce-program"
              name="program"
              required
              maxLength={200}
              placeholder="MIAGE, MIASHS, Économie…"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="campuce-helpType"
              className="text-sm font-medium text-foreground"
            >
              Type d’aide sollicité
            </Label>
            <Select
              value={helpType}
              onValueChange={(value) => {
                setHelpType(value)
                if (value !== CAMPUCE_HELP_TYPES.hosting_attestation) {
                  setFiles([])
                }
              }}
              disabled={isPending}
            >
              <SelectTrigger
                id="campuce-helpType"
                className={cn(
                  "h-11 w-full rounded-xl border-border/80 bg-background/80 shadow-sm",
                  CAMPUCE_FIELD_FOCUS,
                )}
              >
                <SelectValue placeholder="Sélectionner…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={CAMPUCE_HELP_TYPES.hosting_attestation}>
                  Attestation d’hébergement
                </SelectItem>
                <SelectItem value={CAMPUCE_HELP_TYPES.housing}>
                  Logement
                </SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="helpType" value={helpType} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="campuce-visaAppointmentDate"
              className="text-sm font-medium text-foreground"
            >
              Date de rendez-vous pour la demande de visa (optionnel)
            </Label>
            <Input
              id="campuce-visaAppointmentDate"
              name="visaAppointmentDate"
              type="date"
              disabled={isPending}
              className={cn(
                "h-11 rounded-xl border-border/80 bg-background/80 shadow-sm transition-[color,box-shadow,border-color] focus-visible:bg-background",
                CAMPUCE_FIELD_FOCUS,
              )}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label
              htmlFor="campuce-comment"
              className="text-sm font-medium text-foreground"
            >
              Commentaire (optionnel)
            </Label>
            <Textarea
              id="campuce-comment"
              name="comment"
              disabled={isPending}
              maxLength={2000}
              className={cn(
                "rounded-xl border-border/80 bg-background/80 shadow-sm",
                CAMPUCE_FIELD_FOCUS,
              )}
              placeholder="Ajoutez une précision utile (facultatif)…"
            />
          </div>
        </div>
      </div>

      {canUploadFiles ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Label className="text-base font-semibold text-foreground">
                Pièces jointes
              </Label>
              <p className="mt-1 text-sm text-muted-foreground">
                PDF, JPEG, PNG ou WebP — {fileHintMb} Mo max · jusqu’à{" "}
                {CAMPUCE_MAX_FILES} fichiers
              </p>
            </div>
            <span className="text-xs font-medium tabular-nums text-muted-foreground">
              {files.length}/{CAMPUCE_MAX_FILES}
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            accept=".pdf,image/jpeg,image/png,image/webp,application/pdf"
            multiple
            disabled={isPending || files.length >= CAMPUCE_MAX_FILES}
            onChange={handleFileChange}
          />

          <button
            type="button"
            disabled={isPending || files.length >= CAMPUCE_MAX_FILES}
            onClick={handlePickFiles}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "group relative w-full rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-all outline-none",
              "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border/80 bg-muted/30 hover:border-primary/40 hover:bg-muted/50",
              (isPending || files.length >= CAMPUCE_MAX_FILES) &&
                "pointer-events-none opacity-60",
            )}
          >
            <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                  `bg-gradient-to-br ${colorScheme.primary} text-white shadow-lg shadow-black/15`,
                  "group-hover:brightness-105",
                )}
              >
                <Upload className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  ou parcourez depuis votre appareil
                </p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                <Paperclip className="h-4 w-4 text-muted-foreground" aria-hidden />
                Choisir des fichiers
              </span>
            </div>
          </button>

          {files.length > 0 ? (
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li
                  key={`${file.name}-${file.size}-${index}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 shadow-sm"
                >
                  <span className="min-w-0 truncate text-sm font-medium">
                    {file.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    disabled={isPending}
                    onClick={() => {
                      handleRemoveFile(index)
                    }}
                    aria-label={`Retirer ${file.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {state.kind === "error" ? (
        <p
          role="alert"
          className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive"
        >
          {state.message}
        </p>
      ) : null}

      {state.kind === "success" ? (
        <p
          role="status"
          className="rounded-xl border border-emerald-200/80 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900 dark:border-emerald-900/50 dark:bg-emerald-950/50 dark:text-emerald-100"
        >
          Merci — votre envoi a bien été enregistré. Cette fenêtre va se fermer.
        </p>
      ) : null}

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
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden />
              Envoi en cours…
            </>
          ) : (
            "Envoyer le dossier"
          )}
        </Button>
      </div>
    </form>
  )
}
