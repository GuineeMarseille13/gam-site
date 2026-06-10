"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ReviewSourceLine } from "@/components/review-source-line"
import { ReviewRatingBadge } from "@/components/review-rating-badge"
import type { ReviewCardData } from "@/components/reviews-section-utils"

/** Dimensions fixes partagées carte / skeleton. */
export const TESTIMONIAL_CARD_SIZE_CLASS = "h-[170px] w-72 shrink-0 sm:w-80"

const QUOTE_PREVIEW_HEIGHT_CLASS = "h-[30px]"

type TestimonialCardProps = ReviewCardData
/**
 * Carte témoignage — dimensions uniformes, extrait 30px + dialogue « Lire la suite ».
 */
export function TestimonialCard({
  img,
  name,
  body,
  rating,
  sourceLabel,
  sourceImageUrl,
}: TestimonialCardProps) {
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const checkTruncation = useCallback(() => {
    const el = quoteRef.current
    if (!el) return
    setIsTruncated(el.scrollHeight > el.clientHeight + 1)
  }, [])

  useEffect(() => {
    checkTruncation()
    window.addEventListener("resize", checkTruncation)
    return () => window.removeEventListener("resize", checkTruncation)
  }, [body, checkTruncation])

  function handleOpenDialog(e: React.MouseEvent) {
    e.stopPropagation()
    setIsOpen(true)
  }

  return (
    <>
      <Card
        className={`${TESTIMONIAL_CARD_SIZE_CLASS} border-2 border-border/70 bg-card text-card-foreground shadow-md transition-colors duration-300 hover:border-primary/45 hover:shadow-lg dark:border-border dark:hover:border-primary/50 py-1`}
      >
        <CardContent className="flex h-full flex-col p-5">
          <div className="mb-1 flex shrink-0 items-start gap-3">
            <Avatar className="size-12 shrink-0 border-0 shadow-sm">
              <AvatarImage src={img} alt="" />
              <AvatarFallback className="bg-zinc-600 text-sm font-semibold text-white dark:bg-zinc-700">
                {(name[0] ?? "?").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <figcaption className="truncate text-sm font-medium leading-tight text-foreground">
                {name}
              </figcaption>
              <ReviewSourceLine sourceLabel={sourceLabel} sourceImageUrl={sourceImageUrl} />
              <ReviewRatingBadge rating={rating} />
            </div>
          </div>

          <div className="mt-auto flex min-h-0 flex-col">
            <div className={`relative ${QUOTE_PREVIEW_HEIGHT_CLASS} overflow-hidden`}>
              <blockquote
                ref={quoteRef}
                className={`${QUOTE_PREVIEW_HEIGHT_CLASS} overflow-hidden text-xs leading-[15px] text-muted-foreground`}
              >
                <span aria-hidden="true">&ldquo;</span>
                {body}
                <span aria-hidden="true">&rdquo;</span>
              </blockquote>
              {isTruncated ? (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[10px] bg-gradient-to-t from-card to-transparent"
                />
              ) : null}
            </div>

            <div className="flex h-[8px] mt-2 shrink-0 items-center">
              {isTruncated ? (
                <button
                  type="button"
                  onClick={handleOpenDialog}
                  className="text-xs font-medium text-primary underline-offset-2 transition-colors hover:text-primary/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Lire la suite
                </button>
              ) : (
                <span className="sr-only">Témoignage complet affiché</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md gap-4 sm:max-w-lg">
          <DialogHeader className="gap-3 text-left">
            <div className="flex items-start gap-3">
              <Avatar className="size-11 shrink-0 border-0 shadow-sm">
                <AvatarImage src={img} alt="" />
                <AvatarFallback className="bg-zinc-600 text-sm font-semibold text-white">
                  {(name[0] ?? "?").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-0.5">
                <DialogTitle className="text-base leading-tight">{name}</DialogTitle>
                <ReviewSourceLine sourceLabel={sourceLabel} sourceImageUrl={sourceImageUrl} />
                <ReviewRatingBadge rating={rating} />
              </div>
            </div>
            <DialogDescription asChild>
              <blockquote className="max-h-[min(50vh,20rem)] overflow-y-auto text-sm leading-relaxed text-muted-foreground">
                <span aria-hidden="true">&ldquo;</span>
                {body}
                <span aria-hidden="true">&rdquo;</span>
              </blockquote>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
