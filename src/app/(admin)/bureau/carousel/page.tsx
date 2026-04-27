import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { BureauContent } from "@/components/bureau/bureau-content"
import { Button } from "@/components/ui/button"
import { IconPlus, IconPhoto, IconPencil, IconEye, IconEyeOff } from "@tabler/icons-react"
import { DeleteSlideButton }  from "./_components/delete-slide-button"
import { ToggleActiveButton } from "./_components/toggle-active-button"

export const metadata: Metadata = { title: "Carousel principal" }

export default async function CarouselPage() {
  const slides = await prisma.image.findMany({
    where:   { page: "HOME", section: "CAROUSEL" },
    orderBy: { order: "asc" },
  })

  const activeCount = slides.filter((s) => s.isActive).length

  return (
    <BureauContent
      title="Carousel principal"
      description={`${slides.length} slide${slides.length !== 1 ? "s" : ""} · ${activeCount} visible${activeCount !== 1 ? "s" : ""}`}
      actions={
        <Button asChild size="sm" className="gap-1.5 bg-amber-500 hover:bg-amber-600 text-white shadow-sm">
          <Link href="/bureau/carousel/nouveau">
            <IconPlus className="size-4" />
            <span className="hidden sm:inline">Ajouter un slide</span>
            <span className="sm:hidden">Ajouter</span>
          </Link>
        </Button>
      }
    >
      {slides.length === 0 ? (
        /* ── État vide ── */
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed bg-muted/30 py-24 text-center text-muted-foreground">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
            <IconPhoto className="size-8 opacity-40" />
          </div>
          <div>
            <p className="font-medium">Aucun slide pour l&apos;instant</p>
            <p className="mt-1 text-sm">Ajoutez des images pour alimenter le carousel de la page d&apos;accueil</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/bureau/carousel/nouveau">
              <IconPlus className="size-4" />
              Ajouter le premier slide
            </Link>
          </Button>
        </div>
      ) : (
        /* ── Grille de slides ── */
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {slides.map((slide, index) => (
            <article
              key={slide.id}
              className={`group flex flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-200 hover:shadow-md ${
                !slide.isActive ? "ring-1 ring-border/50" : ""
              }`}
            >
              {/* ── Vignette image ── */}
              <div className="relative overflow-hidden bg-muted" style={{ aspectRatio: "16/9" }}>
                {slide.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={slide.url}
                    alt={slide.alt ?? slide.title ?? "Slide"}
                    className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${
                      !slide.isActive ? "grayscale" : ""
                    }`}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <IconPhoto className="size-8 text-muted-foreground opacity-30" />
                  </div>
                )}

                {/* Gradient + texte */}
                {(slide.title || slide.description) && (
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent">
                  </div>
                )}

                {/* Numéro de position */}
                <div className="absolute left-2.5 top-2.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-black/50 text-[11px] font-bold text-white backdrop-blur-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Statut */}
                <div className="absolute right-2.5 top-2.5">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium backdrop-blur-sm ${
                    slide.isActive
                      ? "bg-emerald-500/90 text-white"
                      : "bg-black/50 text-white/80"
                  }`}>
                    {slide.isActive
                      ? <><IconEye className="size-3" /> Visible</>
                      : <><IconEyeOff className="size-3" /> Masqué</>
                    }
                  </span>
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="flex items-center justify-between gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {slide.title ?? <span className="italic text-muted-foreground">Sans titre</span>}
                  </p>
                  {slide.description && (
                    <p className="truncate text-xs text-muted-foreground">{slide.description}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-center gap-0.5">
                  <ToggleActiveButton id={slide.id} isActive={slide.isActive} />
                  <Button asChild variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                    <Link href={`/bureau/carousel/${slide.id}/modifier`} title="Modifier">
                      <IconPencil className="size-4" />
                    </Link>
                  </Button>
                  <DeleteSlideButton id={slide.id} title={slide.title} />
                </div>
              </div>
            </article>
          ))}

          {/* ── Card d'ajout rapide ── */}
          <Link
            href="/bureau/carousel/nouveau"
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-colors hover:border-amber-400/60 hover:bg-amber-50/50 hover:text-amber-700 dark:hover:bg-amber-950/20"
            style={{ minHeight: "180px" }}
          >
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-current opacity-60">
              <IconPlus className="size-5" />
            </div>
            <span className="text-sm font-medium">Ajouter un slide</span>
          </Link>
        </div>
      )}
    </BureauContent>
  )
}
