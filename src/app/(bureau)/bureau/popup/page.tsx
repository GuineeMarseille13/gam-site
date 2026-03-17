import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RowActions } from "@/components/bureau/row-actions"
import {
  IconSpeakerphone, IconPlus, IconFileDescription, IconPresentationAnalytics,
  IconEye, IconEyeOff,
} from "@tabler/icons-react"
import { deletePopup, togglePopupActive } from "./_actions/actions"
import { TogglePopupButton } from "./_components/toggle-popup-button"

export const metadata: Metadata = { title: "Popup / Annonce" }

const CLOUD = "df3ymbrqe"
function thumb(id: string) {
  return `https://res.cloudinary.com/${CLOUD}/image/upload/w_200,h_130,c_fill,q_auto,f_auto/${id}`
}

export default async function PopupPage() {
  const popups = await prisma.popup.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <BureauDataPage
      title="Popup / Annonce"
      description="Gérez les annonces affichées à chaque visite du site"
      actions={
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/bureau/popup/nouveau">
            <IconPlus className="size-4" />
            <span className="hidden sm:inline">Nouvelle annonce</span>
            <span className="sm:hidden">Nouveau</span>
          </Link>
        </Button>
      }
    >
      {popups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/30 py-24 text-center text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <IconSpeakerphone className="size-8 opacity-40" />
          </div>
          <div>
            <p className="font-medium">Aucune annonce créée</p>
            <p className="mt-1 text-sm">Créez un popup pour promouvoir un événement ou afficher un prospectus</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/bureau/popup/nouveau">
              <IconPlus className="size-4" />
              Créer une annonce
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <ul className="divide-y">
            {popups.map((popup) => {
              const isProspectus = popup.type === "PROSPECTUS"
              const previewId = isProspectus ? popup.prospectusIds[0] : popup.imageId

              return (
                <li key={popup.id} className={`group flex gap-4 px-4 py-4 transition-colors hover:bg-muted/30 sm:px-6 border-l-4 ${
                  popup.isActive ? "border-l-emerald-400" : "border-l-transparent"
                }`}>
                  {/* Thumbnail */}
                  <div className="shrink-0">
                    {previewId ? (
                      <div className="h-14 w-20 overflow-hidden rounded-lg border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={thumb(previewId)} alt="" className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-14 w-20 items-center justify-center rounded-lg border bg-muted text-muted-foreground">
                        {isProspectus
                          ? <IconPresentationAnalytics className="size-6 opacity-30" />
                          : <IconFileDescription className="size-6 opacity-30" />
                        }
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {isProspectus
                            ? `Prospectus (${popup.prospectusIds.length} image${popup.prospectusIds.length !== 1 ? "s" : ""})`
                            : (popup.title ?? <span className="italic text-muted-foreground">Sans titre</span>)
                          }
                        </p>
                        {!isProspectus && popup.subtitle && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">{popup.subtitle}</p>
                        )}
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <Badge variant="outline" className={`text-[10px] h-[18px] px-1.5 border inline-flex items-center gap-0.5 ${
                          isProspectus
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }`}>
                          {isProspectus
                            ? <><IconPresentationAnalytics className="size-2.5" />Prospectus</>
                            : <><IconFileDescription className="size-2.5" />Image + texte</>
                          }
                        </Badge>
                        <Badge variant="outline" className={`text-[10px] h-[18px] px-1.5 border inline-flex items-center gap-0.5 ${
                          popup.isActive
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}>
                          {popup.isActive
                            ? <><IconEye className="size-2.5" />Actif</>
                            : <><IconEyeOff className="size-2.5" />Inactif</>
                          }
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <TogglePopupButton id={popup.id} isActive={popup.isActive} />
                      <RowActions
                        editHref={`/bureau/popup/${popup.id}/modifier`}
                        onDelete={deletePopup.bind(null, popup.id)}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </BureauDataPage>
  )
}
