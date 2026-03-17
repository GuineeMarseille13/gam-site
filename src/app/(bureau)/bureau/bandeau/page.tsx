import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauDataPage } from "@/components/bureau/bureau-data-page"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RowActions } from "@/components/bureau/row-actions"
import { IconLayoutNavbar, IconPlus, IconEye, IconEyeOff, IconCalendar, IconMapPin } from "@tabler/icons-react"
import { deleteBanner } from "./_actions/actions"
import { ToggleBannerButton } from "./_components/toggle-banner-button"

export const metadata: Metadata = { title: "Bandeau défilant" }

export default async function BandeauPage() {
  const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <BureauDataPage
      title="Bandeau défilant"
      description="Gérez le bandeau d'annonce affiché en haut puis en bas de page"
      actions={
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/bureau/bandeau/nouveau">
            <IconPlus className="size-4" />
            <span className="hidden sm:inline">Nouveau bandeau</span>
            <span className="sm:hidden">Nouveau</span>
          </Link>
        </Button>
      }
    >
      {banners.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/30 py-24 text-center text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <IconLayoutNavbar className="size-8 opacity-40" />
          </div>
          <div>
            <p className="font-medium">Aucun bandeau créé</p>
            <p className="mt-1 text-sm">Créez un bandeau défilant pour promouvoir un événement sur le site</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/bureau/bandeau/nouveau">
              <IconPlus className="size-4" />
              Créer un bandeau
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <ul className="divide-y">
            {banners.map((banner) => (
              <li key={banner.id} className={`group flex gap-4 px-4 py-4 transition-colors hover:bg-muted/30 sm:px-6 border-l-4 ${
                banner.isActive ? "border-l-amber-400" : "border-l-transparent"
              }`}>
                {/* Icon */}
                <div className="shrink-0 flex size-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/20 to-lime-400/20 border border-amber-200/50">
                  <IconLayoutNavbar className="size-6 text-amber-600 opacity-70" />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {banner.badge && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 border border-amber-200">
                            {banner.badge}
                          </span>
                        )}
                        <p className="truncate text-sm font-semibold text-foreground">{banner.title}</p>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {banner.date && (
                          <span className="flex items-center gap-1">
                            <IconCalendar className="size-3" />{banner.date}
                          </span>
                        )}
                        {banner.location && (
                          <span className="flex items-center gap-1">
                            <IconMapPin className="size-3" />{banner.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="outline" className={`shrink-0 text-[10px] h-[18px] px-1.5 border inline-flex items-center gap-0.5 ${
                      banner.isActive
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : "bg-gray-100 text-gray-500 border-gray-200"
                    }`}>
                      {banner.isActive
                        ? <><IconEye className="size-2.5" />Actif</>
                        : <><IconEyeOff className="size-2.5" />Inactif</>
                      }
                    </Badge>
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2">
                    <ToggleBannerButton id={banner.id} isActive={banner.isActive} />
                    <RowActions
                      editHref={`/bureau/bandeau/${banner.id}/modifier`}
                      onDelete={deleteBanner.bind(null, banner.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </BureauDataPage>
  )
}
