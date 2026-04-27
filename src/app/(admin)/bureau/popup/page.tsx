import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconSpeakerphone, IconPlus } from "@tabler/icons-react"
import { PopupPreviewCard } from "./_components/popup-preview-card"

export const metadata: Metadata = { title: "Popup / Annonce" }

export default async function PopupPage() {
  const popups = await prisma.popup.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <BureauContent
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
            <p className="mt-1 text-sm opacity-70">
              Créez un popup pour promouvoir un événement ou afficher un prospectus
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/bureau/popup/nouveau">
              <IconPlus className="size-4" /> Créer une annonce
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {popups.map((popup) => (
            <PopupPreviewCard
              key={popup.id}
              id={popup.id}
              type={popup.type}
              isActive={popup.isActive}
              title={popup.title}
              date={popup.date}
              imageId={popup.imageId}
              prospectusIds={popup.prospectusIds}
            />
          ))}
        </div>
      )}
    </BureauContent>
  )
}
