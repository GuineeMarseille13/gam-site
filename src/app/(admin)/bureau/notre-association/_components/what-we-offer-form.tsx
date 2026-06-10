"use client"

import { useActionState, useCallback, useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { IconListDetails, IconPlus, IconTrash, IconTypography } from "@tabler/icons-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/helpers/utils"

import type { SaveAssociationContentState } from "../_actions/save-association-content"
import { AssociationImageUploadField } from "./association-image-upload-field"
import {
  AssociationFormField,
  AssociationFormFooter,
  AssociationFormPanel,
  associationInputClassName,
  associationTextareaClassName,
} from "./association-form-ui"

interface WhatWeOfferFormProps {
  action: (
    prev: SaveAssociationContentState,
    formData: FormData,
  ) => Promise<SaveAssociationContentState>
  savedTitle: string
  savedIntro: string
  savedItems: string[]
  savedConclusion: string
  savedImageId?: string | null
}

/**
 * Formulaire bureau : section « Que propose l'association » (intro, axes, conclusion, image).
 */
export function WhatWeOfferForm({
  action,
  savedTitle,
  savedIntro,
  savedItems,
  savedConclusion,
  savedImageId,
}: WhatWeOfferFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(action, null)
  const [title, setTitle] = useState(savedTitle)
  const [intro, setIntro] = useState(savedIntro)
  const [items, setItems] = useState<string[]>(savedItems.length > 0 ? savedItems : [""])
  const [conclusion, setConclusion] = useState(savedConclusion)
  const submitSequenceRef = useRef(0)
  const lastNotifiedSubmitSequenceRef = useRef(0)

  useEffect(() => {
    setTitle(savedTitle)
    setIntro(savedIntro)
    setItems(savedItems.length > 0 ? savedItems : [""])
    setConclusion(savedConclusion)
  }, [savedTitle, savedIntro, savedItems, savedConclusion])

  useEffect(() => {
    if (state && "success" in state && state.success) {
      router.refresh()
    }
  }, [state, router])

  useEffect(() => {
    if (!state) return
    if (lastNotifiedSubmitSequenceRef.current >= submitSequenceRef.current) return

    if ("success" in state && state.success) {
      toast.success("Enregistrement effectué.", {
        description: "Les modifications ont bien été prises en compte.",
      })
      lastNotifiedSubmitSequenceRef.current = submitSequenceRef.current
      return
    }

    if ("error" in state) {
      toast.error("Enregistrement impossible.", { description: state.error })
      lastNotifiedSubmitSequenceRef.current = submitSequenceRef.current
    }
  }, [state])

  const handleAddItem = useCallback(() => {
    setItems((prev) => [...prev, ""])
  }, [])

  const handleRemoveItem = useCallback((index: number) => {
    setItems((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)))
  }, [])

  const handleItemChange = useCallback((index: number, value: string) => {
    setItems((prev) => prev.map((item, i) => (i === index ? value : item)))
  }, [])

  const cleanedItems = items.map((item) => item.trim()).filter(Boolean)

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submitSequenceRef.current += 1
      }}
      className="flex w-full min-w-0 flex-col gap-6"
    >
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
        <div className="space-y-6 lg:col-span-7">
          <AssociationFormField label="Titre de la section" htmlFor="offer-title" icon={IconTypography} compact>
            <Input
              id="offer-title"
              name="title"
              value={title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className={associationInputClassName}
              required
            />
          </AssociationFormField>

          <AssociationFormPanel>
            <AssociationFormField
              label="Introduction"
              htmlFor="offer-intro"
              helper="Texte d'ouverture affiché avant la liste des axes majeurs."
              icon={IconListDetails}
              compact
            >
              <Textarea
                id="offer-intro"
                name="intro"
                value={intro}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setIntro(e.target.value)}
                rows={4}
                className={cn(associationTextareaClassName, "min-h-[6rem]")}
                required
              />
            </AssociationFormField>
          </AssociationFormPanel>

          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold tracking-tight">Axes majeurs</p>
                <p className="text-xs text-muted-foreground sm:text-sm">
                  Chaque ligne devient un point de la liste sur le site public.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 shrink-0 rounded-xl border-amber-300/50 bg-background hover:bg-amber-50/60"
                onClick={handleAddItem}
                disabled={items.length >= 12}
              >
                <IconPlus className="mr-1.5 size-4" />
                Ajouter un axe
              </Button>
            </div>

            <input type="hidden" name="items" value={JSON.stringify(cleanedItems)} readOnly />

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-xl border border-border/50 bg-background/80 p-2 pl-3 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-600/10 text-xs font-bold text-amber-700">
                    {index + 1}
                  </span>
                  <Input
                    value={item}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleItemChange(index, e.target.value)
                    }
                    placeholder={`Axe ${index + 1}`}
                    className="h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "size-9 shrink-0 rounded-lg opacity-60 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100",
                      items.length <= 1 && "pointer-events-none opacity-0",
                    )}
                    onClick={() => handleRemoveItem(index)}
                    aria-label={`Supprimer l'axe ${index + 1}`}
                  >
                    <IconTrash className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <AssociationFormPanel>
            <AssociationFormField label="Conclusion" htmlFor="offer-conclusion" compact>
              <Textarea
                id="offer-conclusion"
                name="conclusion"
                value={conclusion}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setConclusion(e.target.value)}
                rows={4}
                className={cn(associationTextareaClassName, "min-h-[6rem]")}
                required
              />
            </AssociationFormField>
          </AssociationFormPanel>
        </div>

        <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <AssociationImageUploadField
            defaultValue={savedImageId}
            label="Image de la section"
            helper="Visuel affiché à côté de la liste des axes sur le site public."
            variant="landscape"
          />
        </div>
      </div>

      <AssociationFormFooter
        hint={`${cleanedItems.length} axe${cleanedItems.length > 1 ? "s" : ""} seront affichés sur le site public après enregistrement.`}
      />
    </form>
  )
}
