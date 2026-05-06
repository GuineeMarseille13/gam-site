"use client"

import { useActionState, useCallback, useEffect, useRef, useState } from "react"
import type { ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { SubmitButton } from "@/components/bureau/submit-button"
import { BUREAU_POLE_DETAILS_SECTION_UI } from "@/config/bureau-pole-details-section-ui"
import type { BureauPoleContentSlug } from "@/config/bureau-poles-content"
import type { BureauPoleDetailsSection } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"
import { DETAILS_POLE_BUREAU_SECTION_MAX_CHARS } from "@/helpers/details-pole-bureau/_schemas/details-pole-bureau-section.schema"
import { cn } from "@/helpers/utils"

import type { SaveDetailsPoleBureauSectionState } from "../_actions/save-details-pole-bureau-section"

interface PoleDetailsSectionFormProps {
  action: (
    prev: SaveDetailsPoleBureauSectionState,
    formData: FormData,
  ) => Promise<SaveDetailsPoleBureauSectionState>
  poleSlug: BureauPoleContentSlug
  section: BureauPoleDetailsSection
  savedText: string | null
}

/**
 * Formulaire bureau : section éditable synchronisée avec `DetailsPole` et `/poles/{slug}`.
 */
export function PoleDetailsSectionForm({
  action,
  poleSlug,
  section,
  savedText,
}: PoleDetailsSectionFormProps) {
  const router = useRouter()
  const [state, formAction] = useActionState(action, null)
  const [text, setText] = useState(() => savedText ?? "")
  const submitSequenceRef = useRef(0)
  const lastNotifiedSubmitSequenceRef = useRef(0)
  const ui = BUREAU_POLE_DETAILS_SECTION_UI[section]
  const fieldId = `pole-section-${section}`
  const charCount = text.length
  const isNearLimit =
    charCount > DETAILS_POLE_BUREAU_SECTION_MAX_CHARS * 0.9

  useEffect(() => {
    setText(savedText ?? "")
  }, [savedText])

  useEffect(() => {
    if (state && "success" in state && state.success) {
      router.refresh()
    }
  }, [state, router])

  useEffect(() => {
    if (!state) return
    if (lastNotifiedSubmitSequenceRef.current >= submitSequenceRef.current) {
      return
    }

    if ("success" in state && state.success) {
      toast.success("Enregistrement effectué.", {
        description: "Les modifications ont bien été prises en compte.",
      })
      lastNotifiedSubmitSequenceRef.current = submitSequenceRef.current
      return
    }

    if ("error" in state) {
      toast.error("Enregistrement impossible.", {
        description: state.error,
      })
      lastNotifiedSubmitSequenceRef.current = submitSequenceRef.current
    }
  }, [state])

  const handleTextChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }, [])

  return (
    <form
      action={formAction}
      onSubmit={() => {
        submitSequenceRef.current += 1
      }}
      className="flex w-full min-w-0 flex-col gap-6 lg:gap-8"
    >
      <input type="hidden" name="poleSlug" value={poleSlug} readOnly />
      <input type="hidden" name="section" value={section} readOnly />

      <div className="grid w-full min-w-0 grid-cols-1 gap-8 xl:grid-cols-12 xl:gap-10">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="min-w-0 space-y-1">
              <Label
                htmlFor={fieldId}
                className="text-base font-semibold text-foreground"
              >
                {ui.fieldLabel}
              </Label>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {ui.editorHelper}
              </p>
            </div>
          </div>

          <input type="hidden" name="sectionText" value={text} readOnly />
          <Textarea
            id={fieldId}
            value={text}
            onChange={handleTextChange}
            rows={16}
            className={cn(
              "min-h-[14rem] w-full min-w-0 resize-y text-base leading-relaxed",
              "sm:min-h-[18rem] md:min-h-[20rem]",
              "rounded-xl border-input bg-background shadow-sm transition-shadow",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
            )}
            placeholder="Saisissez le texte affiché sur le site public…"
            aria-describedby={`${fieldId}-meta ${fieldId}-fallback-hint`}
          />
          <div
            id={`${fieldId}-meta`}
            className="flex items-center justify-end gap-2"
          >
            <p
              className={cn(
                "tabular-nums text-xs font-medium sm:text-right",
                isNearLimit ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
              )}
              aria-live="polite"
            >
              {charCount.toLocaleString("fr-FR")} /{" "}
              {DETAILS_POLE_BUREAU_SECTION_MAX_CHARS.toLocaleString("fr-FR")}
            </p>
          </div>

          <Separator className="my-1 xl:hidden" />

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <SubmitButton
              intent="bureau"
              className="h-11 w-full rounded-xl px-6 text-base font-semibold shadow-md sm:w-auto sm:min-w-[11rem]"
            >
              Enregistrer
            </SubmitButton>
          </div>
        </div>

      </div>
    </form>
  )
}
