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
  /** Alt text for accessibility */
  alt?: string
  /** Thumbnail size in px shown in the table cell */
  thumbSize?: number
}

export function CloudinaryImage({ imageId, alt = "Image", thumbSize = 40 }: CloudinaryImageProps) {
  const [open, setOpen] = useState(false)

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
        />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">{alt}</DialogTitle>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src={fullUrl}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
