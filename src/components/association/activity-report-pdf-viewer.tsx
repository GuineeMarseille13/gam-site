"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/helpers/utils"

interface ActivityReportPdfViewerProps {
  src: string
  title: string
  className?: string
}

/**
 * Composant: ActivityReportPdfViewer
 * Rôle: Afficher un PDF page par page (canvas) pour un scroll natif fiable sur mobile.
 */
export function ActivityReportPdfViewer({
  src,
  title,
  className,
}: ActivityReportPdfViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let cancelled = false
    container.replaceChildren()
    setIsLoading(true)
    setError(null)

    async function renderPdf(): Promise<void> {
      try {
        const pdfjs = await import("pdfjs-dist")
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

        const pdf = await pdfjs.getDocument(src).promise
        if (cancelled) return

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        const containerWidth = container!.clientWidth || window.innerWidth - 24

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
          if (cancelled) return

          const page = await pdf.getPage(pageNum)
          const baseViewport = page.getViewport({ scale: 1 })
          const scale = containerWidth / baseViewport.width
          const viewport = page.getViewport({ scale: scale * pixelRatio })

          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          if (!context) continue

          canvas.width = viewport.width
          canvas.height = viewport.height
          canvas.style.width = `${viewport.width / pixelRatio}px`
          canvas.style.height = `${viewport.height / pixelRatio}px`
          canvas.className = "mx-auto block max-w-full shadow-sm"
          canvas.setAttribute("role", "img")
          canvas.setAttribute("aria-label", `${title} — page ${pageNum}`)

          await page.render({ canvasContext: context, viewport }).promise
          if (cancelled) return

          container!.appendChild(canvas)
        }
      } catch {
        if (!cancelled) {
          setError("Impossible de charger l’aperçu du document.")
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void renderPdf()

    return () => {
      cancelled = true
      container.replaceChildren()
    }
  }, [src, title])

  if (error) {
    return (
      <p className="px-4 py-10 text-center text-destructive text-sm">{error}</p>
    )
  }

  return (
    <div className={cn("relative w-full", className)}>
      {isLoading ? (
        <div
          className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground"
          aria-live="polite"
        >
          <Loader2 className="size-8 animate-spin text-theme-green" aria-hidden />
          <p className="text-sm">Chargement du document…</p>
        </div>
      ) : null}
      <div
        ref={containerRef}
        className={cn(
          "flex w-full flex-col items-center gap-2 p-0 sm:gap-3 sm:p-0",
          isLoading && "sr-only",
        )}
      />
    </div>
  )
}
