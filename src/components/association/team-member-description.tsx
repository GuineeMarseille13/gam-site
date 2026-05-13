"use client"

import { ScrollText } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface TeamMemberDescriptionProps {
  memberName: string
  roleLabel: string
  description: string
}

/**
 * Biographie masquée : bouton icône seul en coin de carte (absolute), sans impact sur la hauteur du flux.
 */
export function TeamMemberDescription({
  memberName,
  roleLabel,
  description,
}: TeamMemberDescriptionProps) {
  const text = description.trim()
  if (!text) return null

  return (
    <div className="pointer-events-none absolute inset-0 z-[2]">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            title="Présentation"
            aria-label={`Afficher la présentation de ${memberName}`}
            className="pointer-events-auto absolute top-2.5 right-2.5 flex size-8 items-center justify-center rounded-full border border-border/55 bg-card/92 text-theme-green shadow-[0_2px_8px_-2px_rgba(15,23,42,0.12),0_1px_0_0_rgba(255,255,255,0.65)_inset] backdrop-blur-md transition-[transform,box-shadow,border-color,background-color] duration-200 hover:scale-105 hover:border-theme-green/45 hover:bg-card hover:text-theme-green hover:shadow-md focus-visible:ring-2 focus-visible:ring-theme-green/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:outline-none sm:top-3 sm:right-3 sm:size-9 dark:border-border/70 dark:bg-card/75 dark:shadow-[0_6px_20px_-4px_rgba(0,0,0,0.45)] dark:hover:border-theme-green/40 dark:hover:bg-card/90"
          >
            <ScrollText className="size-[0.95rem] sm:size-4" strokeWidth={2} aria-hidden />
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          showCloseButton
          className="max-h-[min(88vh,560px)] gap-0 rounded-t-2xl border-t px-0 pb-6 pt-2 sm:mx-auto sm:max-w-lg"
        >
          <SheetHeader className="border-border/60 border-b px-5 pb-4 text-left">
            <SheetTitle className="text-lg">{memberName}</SheetTitle>
            <SheetDescription className="text-xs font-medium text-theme-green dark:text-theme-green-light">
              {roleLabel}
            </SheetDescription>
          </SheetHeader>
          <div className="max-h-[min(60vh,420px)] overflow-y-auto overscroll-contain px-5 pt-4">
            <p className="text-pretty text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {text}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
