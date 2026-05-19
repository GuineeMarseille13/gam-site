"use client"

import { useCallback, useMemo, useRef, useState } from "react"
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react"

import type { BureauPoleAchievementsEditorUi } from "@/config/bureau-pole-achievements-ui"
import type { EditablePolePublicSlug } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

import { uploadPoleAchievementImageAction } from "../_actions/upload-pole-achievement-image"
import type { DetailsPoleAchievement } from "../_schemas/details-pole-achievement.schema"
import {
  detailsPoleAchievementUpsertSchema,
  type DetailsPoleAchievementUpsertInput,
} from "../_schemas/details-pole-achievement-form.schema"

type FormErrors = Partial<Record<keyof DetailsPoleAchievementUpsertInput, string>>

function toErrors(input: DetailsPoleAchievementUpsertInput): FormErrors {
  const parsed = detailsPoleAchievementUpsertSchema.safeParse(input)
  if (parsed.success) return {}
  const flat = parsed.error.flatten().fieldErrors
  return {
    title: flat.title?.[0],
    description: flat.description?.[0],
    imageUrl: flat.imageUrl?.[0],
    order: flat.order?.[0],
    isActive: flat.isActive?.[0],
  }
}

function buildFromAchievement(
  achievement: DetailsPoleAchievement,
): DetailsPoleAchievementUpsertInput {
  return {
    title: achievement.title,
    description: achievement.description,
    imageUrl: achievement.imageUrl,
    order: achievement.order,
    isActive: achievement.isActive,
  }
}

interface PoleAchievementEditorProps {
  poleSlug: EditablePolePublicSlug
  ui: BureauPoleAchievementsEditorUi
  trigger: React.ReactNode
  initialValue: DetailsPoleAchievementUpsertInput
  editing: DetailsPoleAchievement | null
  isSaving: boolean
  onOpen: () => void
  onSubmit: (value: DetailsPoleAchievementUpsertInput) => Promise<void>
  open?: boolean
  onOpenChange?: (next: boolean) => void
}

/**
 * Composant: PoleAchievementEditor
 * Rôle: Éditeur responsive des cartes réalisations (image + texte).
 */
export function PoleAchievementEditor({
  poleSlug,
  ui,
  trigger,
  initialValue,
  editing,
  isSaving,
  onOpen,
  onSubmit,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PoleAchievementEditorProps) {
  const isMobile = useIsMobile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [value, setValue] = useState<DetailsPoleAchievementUpsertInput>(initialValue)
  const [errors, setErrors] = useState<FormErrors>({})
  const [previewSrc, setPreviewSrc] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen

  const title = editing ? ui.editTitle : ui.createTitle
  const description = ui.dialogDescription

  const displayImageSrc = previewSrc ?? (value.imageUrl.trim() ? value.imageUrl : null)

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next)
      if (!next) return
      onOpen()
      setValue(editing ? buildFromAchievement(editing) : initialValue)
      setPreviewSrc(null)
      setErrors({})
      setUploadError(null)
    },
    [editing, initialValue, onOpen, setOpen],
  )

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      setUploadError(null)
      setIsUploading(true)
      setPreviewSrc(URL.createObjectURL(file))

      const formData = new FormData()
      formData.set("poleSlug", poleSlug)
      formData.set("imageFile", file)

      const result = await uploadPoleAchievementImageAction(null, formData)
      setIsUploading(false)

      if (result && "imageUrl" in result) {
        setValue((s) => ({ ...s, imageUrl: result.imageUrl }))
        setPreviewSrc(result.imageUrl)
        return
      }

      const message =
        result && "error" in result ? result.error : "Upload impossible."
      setUploadError(message)
    },
    [poleSlug],
  )

  const handleRemoveImage = useCallback(() => {
    setValue((s) => ({ ...s, imageUrl: "" }))
    setPreviewSrc(null)
    setUploadError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const canSubmit = useMemo(() => !isSaving && !isUploading, [isSaving, isUploading])

  const handleSubmit = useCallback(async () => {
    const nextErrors = toErrors(value)
    if (Object.values(nextErrors).some(Boolean)) {
      setErrors(nextErrors)
      return
    }
    await onSubmit(value)
    setOpen(false)
  }, [onSubmit, setOpen, value])

  const content = (
    <div className="flex min-h-0 flex-col gap-4">
      <div className="grid min-h-0 grid-cols-1 gap-4 overflow-y-auto pr-1">
        <div className="space-y-2">
          <Label>{ui.imageLabel}</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {displayImageSrc ? (
            <div className="relative h-40 w-full overflow-hidden rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={displayImageSrc}
                alt="Aperçu"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end justify-end gap-1 p-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                  title="Changer l’image"
                  disabled={isUploading}
                >
                  <IconUpload className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                  title="Supprimer l’image"
                  disabled={isUploading}
                >
                  <IconX className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/40 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/70"
            >
              <IconPhoto className="size-6" />
              <span className="text-sm">
                {isUploading ? ui.uploadingImageLabel : ui.chooseImageLabel}
              </span>
            </button>
          )}
          {uploadError ? <p className="text-xs text-destructive">{uploadError}</p> : null}
          {errors.imageUrl ? (
            <p className="text-xs text-destructive">{errors.imageUrl}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="achievement-title">Titre</Label>
          <Input
            id="achievement-title"
            value={value.title}
            onChange={(e) => setValue((s) => ({ ...s, title: e.target.value }))}
            placeholder={ui.titlePlaceholder}
          />
          {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="achievement-description">Description</Label>
          <Textarea
            id="achievement-description"
            value={value.description}
            onChange={(e) => setValue((s) => ({ ...s, description: e.target.value }))}
            rows={5}
            className="rounded-xl"
            placeholder={ui.descriptionPlaceholder}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="achievement-order">Ordre</Label>
            <Input
              id="achievement-order"
              type="number"
              inputMode="numeric"
              value={String(value.order)}
              onChange={(e) => setValue((s) => ({ ...s, order: Number(e.target.value) }))}
            />
            {errors.order ? <p className="text-xs text-destructive">{errors.order}</p> : null}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 px-3">
            <p className="text-sm font-medium text-foreground">Actif</p>
            <Switch
              checked={value.isActive}
              onCheckedChange={(checked) => setValue((s) => ({ ...s, isActive: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-xl"
          onClick={() => setOpen(false)}
        >
          Annuler
        </Button>
        <Button
          type="button"
          className="h-11 rounded-xl bg-amber-500 text-white hover:bg-amber-600"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          {editing ? "Enregistrer" : "Créer"}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={handleOpenChange}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="rounded-t-2xl">
          <DrawerHeader className="px-5">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div className="min-h-0 px-5 pb-4">{content}</div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[calc(100vh-3rem)] max-w-2xl overflow-hidden rounded-2xl p-0">
        <div className="flex max-h-[calc(100vh-3rem)] flex-col gap-4 p-6">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}
