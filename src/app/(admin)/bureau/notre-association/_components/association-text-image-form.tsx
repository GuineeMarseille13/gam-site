"use client"

import { useActionState, useCallback, useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { IconAlignLeft, IconTypography } from "@tabler/icons-react"
import { toast } from "sonner"

import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
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

type LayoutVariant = "stacked" | "split"
type ImageVariant = "portrait" | "landscape"

interface AssociationTextImageFormProps {
  action: (
    prev: SaveAssociationContentState,
    formData: FormData,
  ) => Promise<SaveAssociationContentState>
  savedTitle?: string
  savedText: string
  savedImageId?: string | null
  titleLabel?: string
  textLabel: string
  textHelper: string
  imageLabel?: string
  imageHelper?: string
  showTitle?: boolean
  maxChars?: number
  layout?: LayoutVariant
  imageVariant?: ImageVariant
}

/**
 * Formulaire bureau : texte + image pour une section association.
 */
export function AssociationTextImageForm({
  action,
  savedTitle = "",
  savedText,
  savedImageId,
  titleLabel = "Titre",
  textLabel,
  textHelper,
  imageLabel = "Image",
  imageHelper,
  showTitle = false,
  maxChars = 12_000,
  layout = "stacked",
  imageVariant = "landscape",
}: AssociationTextImageFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(action, null)
  const [title, setTitle] = useState(savedTitle)
  const [text, setText] = useState(savedText)
  const submitSequenceRef = useRef(0)
  const lastNotifiedSubmitSequenceRef = useRef(0)
  const charCount = text.length
  const isNearLimit = charCount > maxChars * 0.9
  const isSplit = layout === "split"

  useEffect(() => {
    setTitle(savedTitle)
    setText(savedText)
  }, [savedTitle, savedText])

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

  const handleTextChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }, [])

  const handleTitleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
  }, [])

  const titleField = showTitle ? (
    <AssociationFormField label={titleLabel} htmlFor="association-title" icon={IconTypography} compact>
      <Input
        id="association-title"
        name="title"
        value={title}
        onChange={handleTitleChange}
        className={associationInputClassName}
        required
      />
    </AssociationFormField>
  ) : null

  const imageBlock = (
    <div className={cn(isSplit && "lg:sticky lg:top-24 lg:self-start")}>
      <AssociationImageUploadField
        defaultValue={savedImageId}
        label={imageLabel}
        helper={imageHelper}
        variant={imageVariant}
      />
    </div>
  )

  const textBlock = (
    <AssociationFormPanel>
      <AssociationFormField
        label={textLabel}
        htmlFor="association-text"
        helper={textHelper}
        icon={IconAlignLeft}
        compact
      >
        <input type="hidden" name={showTitle ? "text" : "message"} value={text} readOnly />
        <Textarea
          id="association-text"
          value={text}
          onChange={handleTextChange}
          rows={isSplit ? 14 : 10}
          className={cn(
            associationTextareaClassName,
            "w-full resize-y",
            isSplit ? "min-h-[18rem]" : "min-h-[12rem]",
          )}
          required
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
            Paragraphes séparés par une ligne vide
          </span>
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold tabular-nums",
              isNearLimit
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                : "bg-muted text-muted-foreground",
            )}
            aria-live="polite"
          >
            {charCount.toLocaleString("fr-FR")} / {maxChars.toLocaleString("fr-FR")}
          </span>
        </div>
      </AssociationFormField>
    </AssociationFormPanel>
  )

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submitSequenceRef.current += 1
      }}
      className="flex w-full min-w-0 flex-col gap-6"
    >
      {titleField}

      {isSplit ? (
        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="order-2 lg:order-1 lg:col-span-5">{imageBlock}</div>
          <div className="order-1 lg:order-2 lg:col-span-7">{textBlock}</div>
        </div>
      ) : (
        <div className="space-y-6">
          {imageBlock}
          {textBlock}
        </div>
      )}

      <AssociationFormFooter hint="Les changements sont visibles après enregistrement sur le site public." />
    </form>
  )
}
