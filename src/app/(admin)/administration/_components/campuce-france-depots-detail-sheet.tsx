"use client"

import { useCallback, useState } from "react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Archive, Loader2, User } from "lucide-react"
import { toast } from "sonner"

import type { CampuceFranceSubmissionAdminRow } from "@/app/(admin)/administration/_schemas/campuce-france-submission-admin.schema"
import { updateCampuceFranceSubmissionTrackingAction } from "@/app/(admin)/administration/_actions/update-campuce-france-submission-tracking"
import { deleteCampuceFranceAttachmentAction } from "@/app/(admin)/administration/_actions/delete-campuce-france-attachment"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"

import {
  fetchCampuceAttachmentBlob,
  filenameForCampuceBlob,
  sanitizeFilenameSegment,
  triggerBrowserDownload,
} from "../_lib/campuce-france-download"
import { CampuceFranceCloudinaryAttachment } from "./campuce-france-cloudinary-attachment"
import { rowLabel } from "./campuce-france-depots-helpers"

function hasHelpType(
  helpTypes: readonly string[],
  helpType: "hosting_attestation" | "housing",
): boolean {
  return helpTypes.includes(helpType)
}

function formatHelpTypes(helpTypes: readonly string[]): string {
  const labels: Record<string, string> = {
    hosting_attestation: "Attestation d’hébergement",
    housing: "Logement",
  }
  const mapped = helpTypes.map((t) => labels[t] ?? t)
  return mapped.join(", ")
}

interface CampuceFranceDepotsDetailSheetProps {
  detail: CampuceFranceSubmissionAdminRow | null
  onDetailChange: (next: CampuceFranceSubmissionAdminRow | null) => void
  onRowPatched: (next: CampuceFranceSubmissionAdminRow) => void
}

export function CampuceFranceDepotsDetailSheet({
  detail,
  onDetailChange,
  onRowPatched,
}: CampuceFranceDepotsDetailSheetProps) {
  const [zipPending, setZipPending] = useState(false)
  const [trackingPending, setTrackingPending] = useState(false)
  const [deletingPublicId, setDeletingPublicId] = useState<string | null>(null)

  const handleTrackingChange = useCallback(
    async (
      next: Pick<
        CampuceFranceSubmissionAdminRow,
        "isComplete" | "hasHostingAttestation" | "hasHousingFound" | "hasVisa"
      >,
    ) => {
      if (!detail) return

      const previous = detail
      const patched: CampuceFranceSubmissionAdminRow = { ...detail, ...next }

      setTrackingPending(true)
      onDetailChange(patched)
      onRowPatched(patched)

      try {
        const result = await updateCampuceFranceSubmissionTrackingAction({
          submissionId: detail.id,
          isComplete: next.isComplete,
          hasHostingAttestation: next.hasHostingAttestation,
          hasHousingFound: next.hasHousingFound,
          hasVisa: next.hasVisa,
        })
        if (!result.success) throw new Error(result.error)
      } catch (error: unknown) {
        onDetailChange(previous)
        onRowPatched(previous)
        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de mettre à jour le suivi.",
        )
      } finally {
        setTrackingPending(false)
      }
    },
    [detail, onDetailChange, onRowPatched],
  )

  const handleDownloadAllZip = useCallback(async () => {
    if (!detail || detail.filesIds.length === 0) return
    setZipPending(true)
    try {
      const JSZip = (await import("jszip")).default
      const zip = new JSZip()
      const dossierSlug = sanitizeFilenameSegment(
        `${detail.lastName}_${detail.firstName}`,
      )
      for (let i = 0; i < detail.filesIds.length; i++) {
        const pid = detail.filesIds[i]
        const blob = await fetchCampuceAttachmentBlob(pid)
        const name = filenameForCampuceBlob(pid, i, blob)
        zip.file(`${dossierSlug}_${i + 1}_${name}`, blob)
      }
      const archive = await zip.generateAsync({ type: "blob" })
      triggerBrowserDownload(archive, `${dossierSlug}_campus-france.zip`)
      toast.success("Archive téléchargée.")
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Impossible de créer l’archive. Téléchargez les fichiers un par un.",
      )
    } finally {
      setZipPending(false)
    }
  }, [detail])

  const handleDeleteAttachment = useCallback(
    async (publicId: string) => {
      if (!detail) return

      const previous = detail
      const next: CampuceFranceSubmissionAdminRow = {
        ...detail,
        filesIds: detail.filesIds.filter((x) => x !== publicId),
      }

      setDeletingPublicId(publicId)
      onDetailChange(next)
      onRowPatched(next)

      try {
        const result = await deleteCampuceFranceAttachmentAction({
          submissionId: detail.id,
          publicId,
        })
        if (!result.success) throw new Error(result.error)
        toast.success("Fichier supprimé.")
      } catch (error: unknown) {
        onDetailChange(previous)
        onRowPatched(previous)
        toast.error(
          error instanceof Error
            ? error.message
            : "Impossible de supprimer ce fichier.",
        )
      } finally {
        setDeletingPublicId(null)
      }
    },
    [detail, onDetailChange, onRowPatched],
  )

  return (
    <Sheet
      open={detail !== null}
      onOpenChange={(open) => {
        if (!open) onDetailChange(null)
      }}
    >
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 overflow-y-auto p-0 sm:max-w-xl"
      >
        {detail ? (
          <>
            <SheetHeader className="shrink-0 space-y-1 border-b border-border px-6 py-5 text-left">
              <SheetTitle className="flex items-center gap-2 text-lg">
                <User className="size-5 shrink-0 opacity-80" aria-hidden />
                {rowLabel(detail)}
              </SheetTitle>
              <SheetDescription>
                Déposé le{" "}
                {format(parseISO(detail.createdAt), "d MMMM yyyy à HH:mm", {
                  locale: fr,
                })}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-6 px-6 py-6">
              <dl className="grid gap-4 text-sm sm:grid-cols-2">
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Téléphone</dt>
                  <dd className="break-all text-foreground">{detail.phone}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Email</dt>
                  <dd className="break-all text-foreground">{detail.email}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Pays</dt>
                  <dd className="text-foreground">{detail.country}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Ville d’acceptation</dt>
                  <dd className="text-foreground">{detail.acceptanceCity}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Site universitaire</dt>
                  <dd className="text-foreground">{detail.universitySite}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Niveau</dt>
                  <dd className="text-foreground">{detail.academicLevel}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Parcours / formation</dt>
                  <dd className="text-foreground">{detail.program}</dd>
                </div>
                <div className="grid gap-1">
                  <dt className="font-medium text-muted-foreground">Aide sollicitée</dt>
                  <dd className="text-foreground">
                    {formatHelpTypes(detail.helpTypes)}
                  </dd>
                </div>
                {detail.visaAppointmentDate ? (
                  <div className="grid gap-1">
                    <dt className="font-medium text-muted-foreground">
                      Rendez-vous visa
                    </dt>
                    <dd className="text-foreground">
                      {format(parseISO(detail.visaAppointmentDate), "d MMM yyyy", {
                        locale: fr,
                      })}
                    </dd>
                  </div>
                ) : null}
                {detail.comment ? (
                  <div className="grid gap-1 sm:col-span-2">
                    <dt className="font-medium text-muted-foreground">Commentaire</dt>
                    <dd className="text-foreground whitespace-pre-wrap">{detail.comment}</dd>
                  </div>
                ) : null}
              </dl>

              <section
                className="space-y-3 rounded-xl border border-border bg-muted/20 p-4"
                aria-labelledby="campuce-tracking-heading"
              >
                <h3
                  id="campuce-tracking-heading"
                  className="text-base font-semibold text-foreground"
                >
                  Suivi du dossier
                </h3>
                <div className="grid gap-3">
                  {hasHelpType(detail.helpTypes, "housing") ? (
                    <div className="flex items-center justify-between gap-4">
                      <Label
                        htmlFor="campuce-housing-found"
                        className="min-w-0 flex-1"
                      >
                        <span className="truncate">Logement trouvé</span>
                      </Label>
                      <Switch
                        id="campuce-housing-found"
                        checked={detail.hasHousingFound}
                        disabled={trackingPending}
                        onCheckedChange={(checked) => {
                          void handleTrackingChange({
                            isComplete: detail.isComplete,
                            hasHostingAttestation: detail.hasHostingAttestation,
                            hasHousingFound: checked,
                            hasVisa: detail.hasVisa,
                          })
                        }}
                      />
                    </div>
                  ) : null}

                  {hasHelpType(detail.helpTypes, "hosting_attestation") ? (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <Label
                          htmlFor="campuce-is-complete"
                          className="min-w-0 flex-1"
                        >
                          <span className="truncate">Dossier complet</span>
                        </Label>
                        <Switch
                          id="campuce-is-complete"
                          checked={detail.isComplete}
                          disabled={trackingPending}
                          onCheckedChange={(checked) => {
                            void handleTrackingChange({
                              isComplete: checked,
                              hasHostingAttestation: detail.hasHostingAttestation,
                              hasHousingFound: detail.hasHousingFound,
                              hasVisa: detail.hasVisa,
                            })
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <Label
                          htmlFor="campuce-has-hosting"
                          className="min-w-0 flex-1"
                        >
                          <span className="truncate">
                            Attestation d’hébergement fournie
                          </span>
                        </Label>
                        <Switch
                          id="campuce-has-hosting"
                          checked={detail.hasHostingAttestation}
                          disabled={trackingPending}
                          onCheckedChange={(checked) => {
                            void handleTrackingChange({
                              isComplete: detail.isComplete,
                              hasHostingAttestation: checked,
                              hasHousingFound: detail.hasHousingFound,
                              hasVisa: detail.hasVisa,
                            })
                          }}
                        />
                      </div>
                    </>
                  ) : null}

                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="campuce-has-visa" className="min-w-0 flex-1">
                      <span className="truncate">Visa obtenu</span>
                    </Label>
                    <Switch
                      id="campuce-has-visa"
                      checked={detail.hasVisa}
                      disabled={trackingPending}
                      onCheckedChange={(checked) => {
                        void handleTrackingChange({
                          isComplete: detail.isComplete,
                          hasHostingAttestation: detail.hasHostingAttestation,
                          hasHousingFound: detail.hasHousingFound,
                          hasVisa: checked,
                        })
                      }}
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4" aria-labelledby="campuce-files-heading">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <h3
                    id="campuce-files-heading"
                    className="text-base font-semibold text-foreground"
                  >
                    Pièces jointes ({detail.filesIds.length})
                  </h3>
                  {detail.filesIds.length >= 2 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      disabled={zipPending}
                      className="shrink-0 gap-2 sm:self-center"
                      onClick={handleDownloadAllZip}
                    >
                      {zipPending ? (
                        <>
                          <Loader2
                            className="size-4 animate-spin shrink-0"
                            aria-hidden
                          />
                          Préparation du ZIP…
                        </>
                      ) : (
                        <>
                          <Archive className="size-4 shrink-0" aria-hidden />
                          Télécharger tout (ZIP)
                        </>
                      )}
                    </Button>
                  ) : null}
                </div>

                {detail.filesIds.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucun fichier pour ce dépôt.
                  </p>
                ) : (
                  <ul className="space-y-8">
                    {detail.filesIds.map((publicId, index) => (
                      <li
                        key={`${detail.id}-${publicId}-${index}`}
                        className="group"
                      >
                        <p className="mb-2 text-sm font-medium text-foreground">
                          Pièce {index + 1}
                        </p>
                        <CampuceFranceCloudinaryAttachment
                          publicId={publicId}
                          label={`Pièce ${index + 1}`}
                          index={index}
                          downloadBasenamePrefix={`${detail.lastName}_${detail.firstName}`}
                            onDelete={() => {
                              void handleDeleteAttachment(publicId)
                            }}
                            isDeleting={deletingPublicId === publicId}
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

