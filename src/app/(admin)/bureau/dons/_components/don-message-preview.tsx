"use client"

import { MessageSquareText } from "lucide-react"

import { cn } from "@/helpers/utils"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DonMessagePreviewProps {
  readonly message: string | null
  /** Colonne tableau compacte vs carte mobile */
  readonly variant: "table" | "card"
}

/**
 * Affiche un extrait du message du don ; ouverture d’un popover pour lire le texte intégral (clavier / tactile).
 */
export function DonMessagePreview({ message, variant }: DonMessagePreviewProps) {
  const text = message?.trim() ?? ""

  if (!text) {
    return <span className="text-muted-foreground">—</span>
  }

  const lineClamp =
    variant === "table" ? "line-clamp-2" : "line-clamp-3"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex max-w-full items-start gap-1.5 rounded-md text-left text-muted-foreground transition-colors",
            "hover:bg-muted/60 hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            variant === "table" ? "text-sm" : "text-sm leading-snug",
          )}
        >
          <span
            className={cn("min-w-0 flex-1 break-words", lineClamp)}
          >
            {text}
          </span>
          <MessageSquareText
            className="mt-0.5 size-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100"
            aria-hidden
          />
          <span className="sr-only">Afficher le message en entier</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={variant === "table" ? "start" : "center"}
        className="w-[min(calc(100vw-2rem),28rem)] max-h-[min(70vh,22rem)] overflow-y-auto p-0"
      >
        <PopoverHeader className="border-border border-b px-4 py-3">
          <PopoverTitle>Message du donateur</PopoverTitle>
        </PopoverHeader>
        <p className="whitespace-pre-wrap break-words px-4 py-3 text-foreground text-sm leading-relaxed">
          {text}
        </p>
      </PopoverContent>
    </Popover>
  )
}
