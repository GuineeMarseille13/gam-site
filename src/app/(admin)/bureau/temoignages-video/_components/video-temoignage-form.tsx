"use client"

import { useActionState, useState, useRef } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton } from "@/components/bureau/submit-button"
import { Link2, Upload, X, Film } from "lucide-react"
import type { ActionState } from "../_actions/actions"

interface VideoTemoignageFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>
  defaultValues?: {
    url?: string
    title?: string | null
    description?: string | null
    thumbnail?: string | null
    order?: number | null
    isActive?: boolean
  }
}

type SourceMode = "url" | "file"

export function VideoTemoignageForm({ action, defaultValues }: VideoTemoignageFormProps) {
  const [state, formAction] = useActionState(action, null)
  const [mode, setMode] = useState<SourceMode>("url")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hasExistingUrl = !!defaultValues?.url

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSelectedFile(e.target.files?.[0] ?? null)
  }

  function clearFile() {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <form action={formAction} className="space-y-5 max-w-xl">
      {state?.error && (
        <p className="rounded-md bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {state.error}
        </p>
      )}

      {/* Source toggle */}
      <div className="space-y-2">
        <Label>Source de la vidéo</Label>
        <div className="flex rounded-lg border border-border overflow-hidden w-fit">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              mode === "url"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            <Link2 className="w-4 h-4" />
            Lien URL
          </button>
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              mode === "file"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            <Upload className="w-4 h-4" />
            Fichier local
          </button>
        </div>
      </div>

      {/* URL mode */}
      {mode === "url" && (
        <div className="space-y-2">
          <Label htmlFor="url">URL de la vidéo *</Label>
          <Input
            id="url"
            name="url"
            type="url"
            required
            placeholder="https://www.youtube.com/watch?v=... ou https://vimeo.com/..."
            defaultValue={defaultValues?.url ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            Accepte les liens YouTube, Vimeo ou une URL directe (mp4, Cloudinary…)
          </p>
        </div>
      )}

      {/* File mode */}
      {mode === "file" && (
        <div className="space-y-2">
          <Label htmlFor="videoFile">Fichier vidéo *</Label>
          {hasExistingUrl && !selectedFile && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              Une vidéo existe déjà. Choisir un fichier remplacera l&apos;URL actuelle.
            </p>
          )}

          {selectedFile ? (
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/40 px-4 py-3">
              <Film className="w-5 h-5 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(1)} Mo
                </p>
              </div>
              <button type="button" onClick={clearFile} className="text-muted-foreground hover:text-destructive transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="videoFile"
              className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer py-8"
            >
              <Upload className="w-6 h-6 text-muted-foreground" />
              <span className="text-sm font-medium">Cliquer pour choisir un fichier</span>
              <span className="text-xs text-muted-foreground">MP4, MOV, WebM — max recommandé 500 Mo</span>
            </label>
          )}

          <input
            ref={fileInputRef}
            id="videoFile"
            name="videoFile"
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,video/*"
            className="sr-only"
            onChange={handleFileChange}
            required={!hasExistingUrl}
          />
          {/* URL cachée pour conserver l'existante si aucun fichier choisi */}
          <input type="hidden" name="url" value={defaultValues?.url ?? ""} />
          <p className="text-xs text-muted-foreground">
            La miniature sera générée automatiquement par Cloudinary après l&apos;upload.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          placeholder="Nom du témoin ou du témoignage"
          defaultValue={defaultValues?.title ?? ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          placeholder="Courte description affichée sous la vignette"
          defaultValue={defaultValues?.description ?? ""}
        />
      </div>

      {/* Miniature — cachée en mode fichier car auto-générée */}
      {mode === "url" && (
        <div className="space-y-2">
          <Label htmlFor="thumbnail">URL de la vignette (miniature)</Label>
          <Input
            id="thumbnail"
            name="thumbnail"
            type="url"
            placeholder="https://... (optionnel, auto-générée pour YouTube)"
            defaultValue={defaultValues?.thumbnail ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            Pour YouTube, la miniature est automatiquement récupérée si ce champ est vide.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="order">Ordre d&apos;affichage</Label>
        <Input
          id="order"
          name="order"
          type="number"
          min="0"
          className="max-w-[120px]"
          defaultValue={defaultValues?.order ?? 0}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="isActive" name="isActive" defaultChecked={defaultValues?.isActive ?? true} />
        <Label htmlFor="isActive">Visible sur le site</Label>
      </div>

      <div className="flex gap-2">
        <SubmitButton>Enregistrer</SubmitButton>
        <Button variant="outline" asChild>
          <Link href="/bureau/temoignages-video">Annuler</Link>
        </Button>
      </div>
    </form>
  )
}
