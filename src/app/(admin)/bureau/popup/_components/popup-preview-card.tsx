"use client"

import { useState } from "react"
import { IconFileDescription, IconPresentationAnalytics, IconEye, IconEyeOff, IconPhoto } from "@tabler/icons-react"
import { RowActions } from "@/components/bureau/row-actions"
import { TogglePopupButton } from "./toggle-popup-button"
import { deletePopup } from "../_actions/actions"
import { cloudinaryImageUrl } from "@/lib/cloudinary-delivery"

function thumbLg(id: string) {
  return cloudinaryImageUrl(id, "w_480,h_640,c_fill,q_auto,f_auto")
}
function thumbSm(id: string) {
  return cloudinaryImageUrl(id, "w_96,h_128,c_fill,q_auto,f_auto")
}

interface Props {
  id: string
  type: "IMAGE_TEXT" | "PROSPECTUS"
  isActive: boolean
  title: string | null
  date: string | null
  imageId: string | null
  prospectusIds: string[]
}

export function PopupPreviewCard({ id, type, isActive, title, date, imageId, prospectusIds }: Props) {
  const isProspectus = type === "PROSPECTUS"
  const allIds = isProspectus ? prospectusIds : (imageId ? [imageId] : [])
  const [activeIdx, setActiveIdx] = useState(0)

  const currentId = allIds[activeIdx] ?? null

  return (
    <div className={`group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md ${
      isActive ? "border-emerald-300 ring-1 ring-emerald-300/50" : "border-border"
    }`}>

      {/* ── Aperçu principal portrait ── */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {currentId ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={currentId}
            src={thumbLg(currentId)}
            alt=""
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground/30">
            {isProspectus
              ? <IconPresentationAnalytics className="size-10" />
              : <IconFileDescription className="size-10" />
            }
            <span className="text-[10px]">Pas d&apos;image</span>
          </div>
        )}

        {/* Gradient bas */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Badge statut */}
        <div className="absolute left-2 top-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow backdrop-blur-sm ${
            isActive ? "bg-emerald-500/90 text-white" : "bg-black/50 text-white/70"
          }`}>
            {isActive
              ? <><IconEye className="size-3" />Actif</>
              : <><IconEyeOff className="size-3" />Inactif</>
            }
          </span>
        </div>

        {/* Badge type */}
        <div className="absolute right-2 top-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shadow backdrop-blur-sm ${
            isProspectus ? "bg-purple-500/80 text-white" : "bg-blue-500/80 text-white"
          }`}>
            {isProspectus
              ? <IconPresentationAnalytics className="size-3" />
              : <IconFileDescription className="size-3" />
            }
            {isProspectus ? "Flyer" : "Image"}
          </span>
        </div>

        {/* Compteur — bas droit */}
        {allIds.length > 1 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
            <IconPhoto className="size-3" />
            {activeIdx + 1} / {allIds.length}
          </div>
        )}
      </div>

      {/* ── Strip de vignettes (PROSPECTUS multi-images) ── */}
      {allIds.length > 1 && (
        <div className="flex gap-1.5 overflow-x-auto px-3 pt-3 scrollbar-none">
          {allIds.map((imgId, i) => (
            <button
              key={imgId}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                i === activeIdx
                  ? "border-primary shadow-sm scale-105"
                  : "border-transparent opacity-60 hover:opacity-90 hover:border-muted-foreground/30"
              }`}
              style={{ width: 40, height: 54 }}
              title={`Flyer ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbSm(imgId)} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Footer ── */}
      <div className="flex flex-col gap-2.5 p-3">
        <p className="truncate text-sm font-semibold leading-tight text-foreground">
          {isProspectus
            ? `${prospectusIds.length} flyer${prospectusIds.length !== 1 ? "s" : ""}`
            : (title ?? <span className="italic text-muted-foreground">Sans titre</span>)
          }
        </p>
        {!isProspectus && date && (
          <p className="truncate text-[11px] text-muted-foreground">{date}</p>
        )}
        <div className="flex items-center gap-1.5 border-t border-border/50 pt-2.5">
          <TogglePopupButton
            id={id}
            isActive={isActive}
            className="min-h-8 flex-1"
          />
          <RowActions
            variant="compact"
            editHref={`/bureau/popup/${id}/modifier`}
            onDelete={deletePopup.bind(null, id)}
          />
        </div>
      </div>
    </div>
  )
}
