"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconPhoto, IconX } from "@tabler/icons-react"

const CLOUD_NAME = "df3ymbrqe"

function buildUrl(imageId: string, transformations = "") {
  const transforms = transformations ? `${transformations}/` : ""
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}${imageId}`
}

interface CloudinaryImageProps {
  imageId: string | null | undefined
  alt?: string
  thumbSize?: number
  className?: string
  /** Tailles responsive (ex: "size-20 sm:size-24 lg:size-28"). Prioritaire sur style si fourni. */
  sizeClassName?: string
  /** Attribut sizes pour Image (quand sizeClassName). Défaut: "80px" pour miniatures. */
  imageSizes?: string
}

export function CloudinaryImage({ imageId, alt = "Image", thumbSize = 40, className = "", sizeClassName, imageSizes = "80px" }: CloudinaryImageProps) {
  const [open, setOpen] = useState(false)
  const [thumbError, setThumbError] = useState(false)
  const [fullError, setFullError] = useState(false)

  if (!imageId) {
    return (
      <div
        className={`flex items-center justify-center rounded bg-muted text-muted-foreground ${className}`}
        style={{ width: thumbSize, height: thumbSize }}
      >
        <IconPhoto className="h-4 w-4" />
      </div>
    )
  }

  const thumbUrl = buildUrl(imageId, `w_${thumbSize * 2},h_${thumbSize * 2},c_fill,q_auto,f_auto`)
  const fullUrl = buildUrl(imageId, "q_auto,f_auto,w_1600")

  const placeholder = (
    <div
      className={`flex items-center justify-center rounded bg-muted text-muted-foreground ${className}`}
      style={{ width: thumbSize, height: thumbSize }}
    >
      <IconPhoto className="h-4 w-4" />
    </div>
  )

  if (thumbError) return placeholder

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`cursor-pointer overflow-hidden rounded border border-border transition-opacity hover:opacity-80 relative ${sizeClassName ?? ""} ${className}`}
        style={sizeClassName ? undefined : { width: thumbSize, height: thumbSize }}
        title="Voir l'image"
      >
        {sizeClassName ? (
          <Image
            src={thumbUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes={imageSizes}
            onError={() => setThumbError(true)}
            unoptimized
          />
        ) : (
          <Image
            src={thumbUrl}
            alt={alt}
            width={thumbSize}
            height={thumbSize}
            className="h-full w-full object-cover"
            onError={() => setThumbError(true)}
            unoptimized
          />
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-[95vw] sm:w-[90vw] max-w-4xl lg:max-w-5xl xl:max-w-6xl p-0 overflow-hidden rounded-2xl border-0 shadow-2xl shadow-black/25"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 sm:right-5 sm:top-5 z-10 flex size-10 sm:size-11 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm ring-1 ring-slate-200/50 transition hover:bg-white hover:shadow-md"
            aria-label="Fermer"
          >
            <IconX className="size-5 sm:size-6 text-slate-600" />
          </button>
          <div className="relative w-full max-h-[88vh] sm:max-h-[90vh]" style={{ aspectRatio: "16/9" }}>
            {fullError ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <IconPhoto className="h-12 w-12" />
              </div>
            ) : (
              <Image
                src={fullUrl}
                alt={alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 800px"
                onError={() => setFullError(true)}
                unoptimized
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
