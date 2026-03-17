"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconPhoto } from "@tabler/icons-react"

const CLOUD_NAME = "df3ymbrqe"

function buildUrl(imageId: string, transformations = "") {
  const transforms = transformations ? `${transformations}/` : ""
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}${imageId}`
}

interface CloudinaryImageProps {
  imageId: string | null | undefined
  alt?: string
  thumbSize?: number
}

export function CloudinaryImage({ imageId, alt = "Image", thumbSize = 40 }: CloudinaryImageProps) {
  const [open, setOpen] = useState(false)
  const [thumbError, setThumbError] = useState(false)
  const [fullError, setFullError] = useState(false)

  if (!imageId) {
    return (
      <div
        className="flex items-center justify-center rounded bg-muted text-muted-foreground"
        style={{ width: thumbSize, height: thumbSize }}
      >
        <IconPhoto className="h-4 w-4" />
      </div>
    )
  }

  const thumbUrl = buildUrl(imageId, `w_${thumbSize * 2},h_${thumbSize * 2},c_fill,q_auto,f_auto`)
  const fullUrl = buildUrl(imageId, "q_auto,f_auto,w_1200")

  const placeholder = (
    <div
      className="flex items-center justify-center rounded bg-muted text-muted-foreground"
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
        className="overflow-hidden rounded border border-border transition-opacity hover:opacity-80"
        style={{ width: thumbSize, height: thumbSize }}
        title="Voir l'image"
      >
        <Image
          src={thumbUrl}
          alt={alt}
          width={thumbSize}
          height={thumbSize}
          className="h-full w-full object-cover"
          onError={() => setThumbError(true)}
          unoptimized
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
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
