"use client"

import { useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  IconBan,
  IconCircleCheck,
  IconCircleFilled,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMail,
  IconPhone,
  IconPhoto,
  IconTrash,
} from "@tabler/icons-react"
import { getPosteLabel } from "./postes"

// ── Types ──────────────────────────────────────────────────────────────────────

interface Person {
  firstName: string
  lastName:  string
  email:     string | null
  phone:     string | null
}

interface EquipeRowActionsProps {
  memberId:         string
  editHref:         string
  imageId:          string | null | undefined
  poste:            string | null
  role:             string | null
  description:      string | null
  order:            number
  showOnSite:       boolean
  banned:           boolean
  person:           Person | null
  onDelete:     () => Promise<unknown>
  onBanToggle?: () => Promise<unknown>
}

// ── Constantes ─────────────────────────────────────────────────────────────────

const CLOUD_NAME = "df3ymbrqe"

function buildThumb(imageId: string, size: number) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${size * 2},h_${size * 2},c_fill,q_auto,f_auto/${imageId}`
}

const ROLE_STYLES: Record<string, { label: string; dot: string; badge: string }> = {
  admin: {
    label: "Administrateur",
    dot:   "text-amber-500",
    badge: "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40",
  },
  bureau: {
    label: "Bureau",
    dot:   "text-blue-500",
    badge: "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40",
  },
}

// ── Composant ──────────────────────────────────────────────────────────────────

export function EquipeRowActions({
  editHref,
  imageId,
  poste,
  role,
  description,
  order,
  showOnSite,
  banned,
  person,
  onDelete,
  onBanToggle,
}: EquipeRowActionsProps) {
  const router = useRouter()
  const [openSheet, setOpenSheet] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [isPending, startTransition] = useTransition()

  const fullName = person ? `${person.firstName} ${person.lastName}` : "—"
  const posteLabel = getPosteLabel(poste)
  const roleStyle  = role ? ROLE_STYLES[role] : null

  function handleBan() {
    startTransition(async () => {
      await onBanToggle?.()
      router.refresh()
    })
  }

  function confirmDelete() {
    setOpenDelete(false)
    startTransition(async () => {
      await onDelete()
      router.refresh()
    })
  }

  // ── Rendu ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Boutons inline — lg+ ─────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-end gap-0.5">
        <Button
          variant="ghost" size="sm"
          onClick={() => setOpenSheet(true)}
          className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <IconEye className="size-3.5" />
          Détails
        </Button>
        <Button
          variant="ghost" size="sm" asChild
          className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          disabled={isPending}
        >
          <Link href={editHref}>
            <IconEdit className="size-3.5" />
            Modifier
          </Link>
        </Button>
        {onBanToggle && (
          <Button
            variant="ghost" size="sm"
            onClick={handleBan}
            disabled={isPending}
            className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
          >
            {isPending ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : banned ? (
              <IconCircleCheck className="size-3.5 text-emerald-600" />
            ) : (
              <IconBan className="size-3.5 text-amber-600" />
            )}
            {banned ? "Débannir" : "Bannir"}
          </Button>
        )}
        <Button
          variant="ghost" size="sm"
          onClick={() => setOpenDelete(true)}
          disabled={isPending}
          className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
        >
          <IconTrash className="size-3.5" />
          Supprimer
        </Button>
      </div>

      {/* ── Menu ⋮ — mobile / tablette ──────────────────────────────────── */}
      <div className="flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 cursor-pointer hover:bg-muted" disabled={isPending}>
              {isPending
                ? <IconLoader2 className="size-4 animate-spin" />
                : <IconDotsVertical className="size-4" />
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
            <DropdownMenuItem
              onClick={() => setOpenSheet(true)}
              className="rounded-lg px-3 py-2 cursor-pointer focus:bg-muted focus:text-foreground"
            >
              <IconEye className="size-4 text-muted-foreground" />
              Détails
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer focus:bg-muted focus:text-foreground">
              <Link href={editHref}>
                <IconEdit className="size-4 text-muted-foreground" />
                Modifier
              </Link>
            </DropdownMenuItem>
            {onBanToggle && (
              <DropdownMenuItem
                onClick={handleBan}
                disabled={isPending}
                className="rounded-lg px-3 py-2 cursor-pointer focus:bg-muted focus:text-foreground"
              >
                {banned
                  ? <><IconCircleCheck className="size-4 text-emerald-600" />Débannir</>
                  : <><IconBan className="size-4 text-amber-600" />Bannir</>
                }
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              disabled={isPending}
              className="rounded-lg px-3 py-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
            >
              <IconTrash className="size-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Sheet détails ─────────────────────────────────────────────────── */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>{fullName}</SheetTitle>
          </SheetHeader>

          <div className="flex flex-col">

            {/* ── Hero ── */}
            <div className="relative flex flex-col items-center gap-4 overflow-hidden px-8 pb-8 pt-12">
              {/* Fond décoratif */}
              <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-amber-50/40 to-background dark:from-amber-950/20 dark:via-amber-950/10 dark:to-background" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 size-64 rounded-full bg-amber-100/60 blur-3xl dark:bg-amber-900/20" />

              {/* Avatar */}
              <div className="relative z-10">
                {imageId ? (
                  <div className="size-32 overflow-hidden rounded-full ring-4 ring-background shadow-xl">
                    <Image
                      src={buildThumb(imageId, 128)}
                      alt={fullName}
                      width={128}
                      height={128}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-muted to-muted/60 ring-4 ring-background shadow-xl text-muted-foreground">
                    <IconPhoto className="size-10" />
                  </div>
                )}
                <span
                  className={`absolute bottom-2 right-2 size-4 rounded-full ring-2 ring-background shadow-sm ${
                    banned ? "bg-rose-400" : showOnSite ? "bg-emerald-400" : "bg-muted-foreground/40"
                  }`}
                  title={banned ? "Compte banni" : showOnSite ? "Visible sur le site" : "Masqué du site"}
                />
              </div>

              {/* Identité */}
              <div className="relative z-10 text-center space-y-1">
                <p className="text-2xl font-bold tracking-tight text-foreground">{fullName}</p>
                {posteLabel && (
                  <p className="text-sm font-medium text-muted-foreground">{posteLabel}</p>
                )}
              </div>

              {/* Badges */}
              <div className="relative z-10 flex flex-wrap items-center justify-center gap-2">
                {roleStyle && (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${roleStyle.badge}`}>
                    <IconCircleFilled className={`size-1.5 ${roleStyle.dot}`} />
                    {roleStyle.label}
                  </span>
                )}
                {banned ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40">
                    <IconBan className="size-3" />
                    Banni
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                    showOnSite
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40"
                      : "bg-muted text-muted-foreground ring-border"
                  }`}>
                    {showOnSite ? <IconEye className="size-3" /> : <IconEyeOff className="size-3" />}
                    {showOnSite ? "Visible sur le site" : "Masqué du site"}
                  </span>
                )}
              </div>
            </div>

            {/* ── Corps ── */}
            <div className="flex flex-col gap-5 px-8 py-6">

              {/* Description */}
              {description && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Description</p>
                  <p className="rounded-xl border bg-muted/30 px-4 py-3.5 text-sm text-foreground/80 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              {/* Contact */}
              {(person?.phone || person?.email) && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Contact</p>
                  <div className="rounded-xl border overflow-hidden divide-y divide-border/60">
                    {person.phone && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <IconPhone className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-foreground/80">{person.phone}</span>
                      </div>
                    )}
                    {person.email && (
                      <div className="flex items-center gap-3 px-4 py-3 bg-card hover:bg-muted/30 transition-colors">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <IconMail className="size-3.5 text-muted-foreground" />
                        </div>
                        <a href={`mailto:${person.email}`} className="text-sm text-foreground/80 hover:underline truncate">
                          {person.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informations */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Informations</p>
                <div className="rounded-xl border overflow-hidden">
                  <div className="flex items-center justify-between bg-card px-4 py-3">
                    <span className="text-sm text-muted-foreground">Ordre d&apos;affichage</span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{order}</span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button asChild className="w-full cursor-pointer gap-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm shadow-amber-500/20 h-11">
                <Link href={editHref}>
                  <IconEdit className="size-4" />
                  Modifier le profil
                </Link>
              </Button>

            </div>
          </div>
        </SheetContent>
      </Sheet>

{/* ── Dialogue de confirmation suppression ─────────────────────────── */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="max-w-sm gap-0 overflow-hidden p-0">
          <div className="flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60 dark:bg-rose-900/40 dark:ring-rose-900/20">
              <IconTrash className="size-6 text-rose-600 dark:text-rose-400" />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Supprimer ce membre ?
            </AlertDialogTitle>
          </div>
          <AlertDialogHeader className="px-8 py-5">
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              Cette action est <span className="font-medium text-foreground">irréversible</span>. Le membre sera définitivement retiré de l&apos;équipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2 border-t px-8 py-5">
            <AlertDialogCancel className="flex-1 cursor-pointer rounded-xl border-border/60 text-sm font-medium">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="flex-1 cursor-pointer rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm"
            >
              {isPending
                ? <><IconLoader2 className="size-4 animate-spin" />Suppression…</>
                : <><IconTrash className="size-4" />Supprimer</>
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// ── Sous-composants ────────────────────────────────────────────────────────────

function DetailRow({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-muted/40">
      <span className="shrink-0 text-muted-foreground">{icon}</span>
      <span className="min-w-0 truncate text-sm text-foreground/80">{children}</span>
    </div>
  )
}
