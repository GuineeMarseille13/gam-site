"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPhoto, IconX } from "@tabler/icons-react"

const CLOUD_NAME = "df3ymbrqe"

function buildThumbUrl(imageId: string) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_320,h_200,c_fill,q_auto,f_auto/${imageId}`
}

interface ImageIdFieldProps {
  defaultValue?: string | null
  name?: string
}

export function ImageIdField({ defaultValue, name = "imageId" }: ImageIdFieldProps) {
  const [imageId, setImageId] = useState(defaultValue ?? "")
  const [error, setError] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>Image Cloudinary</Label>
      <Input
        id={name}
        name={name}
        value={imageId}
        onChange={(e) => {
          setImageId(e.target.value)
          setError(false)
        }}
        placeholder="ex: gam/boutique/mon-image"
      />
      {imageId && (
        <div className="relative w-40 h-24 overflow-hidden rounded-md border border-border bg-muted">
          {!error ? (
            <>
              <Image
                src={buildThumbUrl(imageId)}
                alt="Aperçu"
                fill
                className="object-cover"
                onError={() => setError(true)}
                sizes="160px"
              />
              <button
                type="button"
                onClick={() => setImageId("")}
                className="absolute top-1 right-1 rounded-full bg-black/50 p-0.5 text-white hover:bg-black/70"
                title="Supprimer l'image"
              >
                <IconX className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-xs text-muted-foreground">
              <IconPhoto className="h-5 w-5" />
              <span>ID invalide</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
