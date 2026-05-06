"use client"

import { useCallback, useMemo, useState } from "react"

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

import type { DetailsPoleService } from "../_schemas/details-pole-service.schema"
import {
  detailsPoleServiceUpsertSchema,
  type DetailsPoleServiceUpsertInput,
} from "../_schemas/details-pole-service-form.schema"

type FormErrors = Partial<Record<keyof DetailsPoleServiceUpsertInput, string>>

function toErrors(input: DetailsPoleServiceUpsertInput): FormErrors {
  const parsed = detailsPoleServiceUpsertSchema.safeParse(input)
  if (parsed.success) return {}
  const flat = parsed.error.flatten().fieldErrors
  return {
    title: flat.title?.[0],
    description: flat.description?.[0],
    icon: flat.icon?.[0],
    order: flat.order?.[0],
    isActive: flat.isActive?.[0],
  }
}

function buildFromService(service: DetailsPoleService): DetailsPoleServiceUpsertInput {
  return {
    title: service.title,
    description: service.description,
    icon: service.icon ?? null,
    order: service.order,
    isActive: service.isActive,
  }
}

interface PoleServiceEditorProps {
  trigger: React.ReactNode
  initialValue: DetailsPoleServiceUpsertInput
  editing: DetailsPoleService | null
  isSaving: boolean
  onOpen: () => void
  onSubmit: (value: DetailsPoleServiceUpsertInput) => Promise<void>
  open?: boolean
  onOpenChange?: (next: boolean) => void
}

/**
 * Composant: PoleServiceEditor
 * Rôle: Éditeur responsive (Drawer mobile / Dialog desktop).
 */
export function PoleServiceEditor({
  trigger,
  initialValue,
  editing,
  isSaving,
  onOpen,
  onSubmit,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: PoleServiceEditorProps) {
  const isMobile = useIsMobile()
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [value, setValue] = useState<DetailsPoleServiceUpsertInput>(initialValue)
  const [errors, setErrors] = useState<FormErrors>({})

  const open = controlledOpen ?? uncontrolledOpen
  const setOpen = controlledOnOpenChange ?? setUncontrolledOpen

  const title = editing ? "Modifier le service" : "Nouveau service"
  const description = "Renseignez le contenu et l’ordre d’affichage."

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next)
      if (!next) return
      onOpen()
      setValue(editing ? buildFromService(editing) : initialValue)
      setErrors({})
    },
    [editing, initialValue, onOpen, setOpen],
  )

  const canSubmit = useMemo(() => !isSaving, [isSaving])

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="service-title">Titre</Label>
            <Input
              id="service-title"
              value={value.title}
              onChange={(e) => setValue((s) => ({ ...s, title: e.target.value }))}
              placeholder="Ex: Permanences régulières"
            />
            {errors.title ? <p className="text-xs text-destructive">{errors.title}</p> : null}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service-icon">Icône (emoji)</Label>
            <Input
              id="service-icon"
              value={value.icon ?? ""}
              onChange={(e) => setValue((s) => ({ ...s, icon: e.target.value }))}
              placeholder="Ex: 📅"
            />
            {errors.icon ? <p className="text-xs text-destructive">{errors.icon}</p> : null}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="service-description">Description</Label>
          <Textarea
            id="service-description"
            value={value.description}
            onChange={(e) => setValue((s) => ({ ...s, description: e.target.value }))}
            rows={6}
            className="rounded-xl"
            placeholder="Décrivez le service en quelques phrases…"
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="service-order">Ordre</Label>
            <Input
              id="service-order"
              type="number"
              inputMode="numeric"
              value={String(value.order)}
              onChange={(e) => setValue((s) => ({ ...s, order: Number(e.target.value) }))}
            />
            {errors.order ? <p className="text-xs text-destructive">{errors.order}</p> : null}
          </div>

          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 p-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">Actif</p>
              <p className="text-xs text-muted-foreground">Visible sur la page publique</p>
            </div>
            <Switch
              checked={value.isActive}
              onCheckedChange={(checked) => setValue((s) => ({ ...s, isActive: checked }))}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="h-11 rounded-xl" onClick={() => setOpen(false)}>
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

