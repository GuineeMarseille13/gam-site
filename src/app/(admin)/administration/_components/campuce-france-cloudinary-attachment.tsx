"use client"

import { useCallback, useState } from "react"
import { Download, ExternalLink, Loader2, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  cloudinaryImageUrl,
} from "@/lib/cloudinary-delivery"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/helpers/utils"

import {
  fetchCampuceAttachmentBlob,
  filenameForCampuceBlob,
  sanitizeFilenameSegment,
  triggerBrowserDownload,
} from "../_lib/campuce-france-download"

interface CampuceFranceCloudinaryAttachmentProps {
  /** Identifiant Cloudinary (`gam/campuce-france/...`). */
  publicId: string
  /** Libellé accessibilité (ex. « Pièce 1 »). */
  label: string
  index: number
  /** Préfixe optionnel pour le nom du fichier téléchargé (ex. Nom_Prénom). */
  downloadBasenamePrefix?: string
  /** Suppression (gérée par le parent, car nécessite submissionId). */
  onDelete?: () => void
  isDeleting?: boolean
}

/**
 * Aperçu image (Cloudinary image) ou PDF brut : bascule automatiquement si l’image échoue.
 */
export function CampuceFranceCloudinaryAttachment({
  publicId,
  label,
  index,
  downloadBasenamePrefix,
  onDelete,
  isDeleting = false,
}: CampuceFranceCloudinaryAttachmentProps) {
  const imageSrc = cloudinaryImageUrl(publicId, "f_auto,q_auto")
  const rawSrc = `/api/administration/campuce-france/attachment?publicId=${encodeURIComponent(
    publicId,
  )}`
  const [showRaw, setShowRaw] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleImageError = useCallback(() => {
    setShowRaw(true)
  }, [])

  const handleDownload = useCallback(async () => {
    setIsDownloading(true)
    try {
      const blob = await fetchCampuceAttachmentBlob(publicId)
      const base = filenameForCampuceBlob(publicId, index, blob)
      const prefix = downloadBasenamePrefix?.trim()
        ? `${sanitizeFilenameSegment(downloadBasenamePrefix)}_`
        : ""
      triggerBrowserDownload(blob, `${prefix}${base}`)
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de télécharger ce fichier.",
      )
    } finally {
      setIsDownloading(false)
    }
  }, [publicId, index, downloadBasenamePrefix])

  const overlayActionsClassName =
    "absolute bottom-3 right-3 z-10 flex items-center gap-1 rounded-xl border border-border/70 bg-background/80 p-1 shadow-md backdrop-blur supports-[backdrop-filter]:bg-background/60 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"

  const deleteAction = onDelete ? (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Supprimer"
          className="hover:bg-destructive/10 hover:text-destructive dark:hover:bg-destructive/20"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Trash2 className="size-4" aria-hidden />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2 aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle>Supprimer ce fichier ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action supprime le fichier du dossier
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={isDeleting}
            onClick={() => {
              onDelete()
            }}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null

  if (showRaw) {
    return (
      <div className="group relative">
        <iframe
          title={`${label} — PDF ou document`}
          src={rawSrc}
          className={cn(
            "min-h-[280px] w-full rounded-lg border border-border bg-muted/40",
            "sm:min-h-[420px]",
          )}
        />
        <div className={overlayActionsClassName}>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="Télécharger"
              disabled={isDownloading}
              onClick={handleDownload}
              className="hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500"
            >
              {isDownloading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : (
                <Download className="size-4" aria-hidden />
              )}
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Ouvrir"
              className="hover:bg-sky-500/10 hover:text-sky-800 dark:hover:bg-sky-400/15 dark:hover:text-sky-100"
            >
              <a href={rawSrc} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" aria-hidden />
              </a>
            </Button>
            {deleteAction}
        </div>
      </div>
    )
  }

  return (
    <figure className="group relative overflow-hidden rounded-lg border border-border bg-muted/30">
      {/* eslint-disable-next-line @next/next/no-img-element -- dimensions sources inconnues ; fallback PDF géré au onError */}
      <img
        src={imageSrc}
        alt={`${label}, pièce jointe ${index + 1}`}
        className="max-h-[min(55vh,520px)] w-full object-contain"
        loading="lazy"
        decoding="async"
        onError={handleImageError}
      />
      <figcaption className="sr-only">{label}</figcaption>
      <div className={overlayActionsClassName}>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Télécharger"
          disabled={isDownloading}
          onClick={handleDownload}
          className="hover:bg-sky-600 hover:text-white dark:hover:bg-sky-500"
        >
          {isDownloading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Download className="size-4" aria-hidden />
          )}
        </Button>
        <Button
          asChild
          variant="ghost"
          size="icon"
          aria-label="Voir en plein écran"
          className="hover:bg-sky-500/10 hover:text-sky-800 dark:hover:bg-sky-400/15 dark:hover:text-sky-100"
        >
          <a href={imageSrc} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" aria-hidden />
          </a>
        </Button>
        {deleteAction}
      </div>
    </figure>
  )
}
