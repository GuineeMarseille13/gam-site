"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconLoader2,
  IconMail,
  IconMapPin,
  IconPhone,
  IconTrash,
} from "@tabler/icons-react"
import {
  administrationDeleteDialogHeaderClassName,
  administrationDeleteDialogIconClassName,
  administrationDestructiveButtonClassName,
  administrationDestructiveGhostClassName,
  administrationPrimaryButtonClassName,
} from "@/config/administration-dashboard-theme"
import { cn } from "@/helpers/utils"
import { useAdministrationPermissionsOptional } from "@/app/(admin)/administration/_components/administration-permissions-provider"
import { useBureauPermissionsOptional } from "@/app/(admin)/bureau/_components/bureau-permissions-provider"
import { deleteBenevole } from "../_actions/actions"

// ── Types ──────────────────────────────────────────────────────────────────────

interface Address {
  address:  string
  zipCode:  string
  city:     string
  country:  string
}

interface Person {
  firstName:  string
  lastName:   string
  email:      string | null
  phone:      string | null
  image:      string | null
  showOnSite: boolean
  createdAt:  Date
  address:    Address | null
}

type DashboardBase = "/bureau" | "/administration"

type BenevoleDashboardChrome = "bureau" | "administration"

interface BenevoleRowActionsProps {
  volunteerId: string
  person: Person | null
  basePath?: DashboardBase
  /** Palette visuelle : alignée sur le shell Bureau (ambre) ou Administration (sky). */
  dashboard?: BenevoleDashboardChrome
  canEdit?: boolean
  canDelete?: boolean
}

// ── Composant ──────────────────────────────────────────────────────────────────

export function BenevoleRowActions({
  volunteerId,
  person,
  basePath = "/bureau",
  dashboard = "bureau",
  canEdit: canEditProp,
  canDelete: canDeleteProp,
}: BenevoleRowActionsProps) {
  const isAdministration = dashboard === "administration"
  const bureauPermissions = useBureauPermissionsOptional()
  const adminPermissions = useAdministrationPermissionsOptional()
  const canEdit =
    canEditProp ??
    (isAdministration
      ? adminPermissions?.canManageAdminBenevoles === true
      : bureauPermissions?.canAccessAdminBenevoles !== false)
  const canDelete =
    canDeleteProp ??
    (isAdministration
      ? adminPermissions?.canDeleteAdminBenevole === true
      : bureauPermissions?.canDeleteAdminEntities === true)
  const [openSheet, setOpenSheet]   = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const editHref = `${basePath}/benevoles/${volunteerId}/modifier`

  const ini = person
    ? `${person.firstName[0]}${person.lastName[0]}`.toUpperCase()
    : "?"

  function confirmDelete() {
    setOpenDelete(false)
    startTransition(async () => {
      await deleteBenevole(volunteerId)
      router.refresh()
    })
  }

  // ── Rendu ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Boutons inline — lg+ ─────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-end gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpenSheet(true)}
          className={cn(
            "h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground",
            isAdministration &&
              "hover:bg-sky-100/80 dark:hover:bg-sky-950/45",
          )}
        >
          <IconEye className="size-3.5" />
          Détails
        </Button>
        {canEdit && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn(
              "h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground",
              isAdministration &&
                "hover:bg-sky-100/80 dark:hover:bg-sky-950/45",
            )}
            disabled={isPending}
          >
            <Link href={editHref}>
              <IconEdit className="size-3.5" />
              Modifier
            </Link>
          </Button>
        )}
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpenDelete(true)}
            disabled={isPending}
            className={cn(
              "h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-medium",
              isAdministration
                ? administrationDestructiveGhostClassName
                : "text-rose-600 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30",
            )}
          >
            {isPending ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : (
              <IconTrash className="size-3.5" />
            )}
            Supprimer
          </Button>
        )}
      </div>

      {/* ── Menu ⋮ — mobile / tablette ──────────────────────────────────── */}
      <div className="flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "size-8 cursor-pointer",
                isAdministration ? "hover:bg-sky-100/80 dark:hover:bg-sky-950/45" : "hover:bg-muted",
              )}
              disabled={isPending}
            >
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
            {canEdit && (
              <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer focus:bg-muted focus:text-foreground">
                <Link href={editHref}>
                  <IconEdit className="size-4 text-muted-foreground" />
                  Modifier
                </Link>
              </DropdownMenuItem>
            )}
            {canDelete && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setOpenDelete(true)}
                  className={cn(
                    "cursor-pointer rounded-lg px-3 py-2",
                    isAdministration
                      ? "text-destructive focus:bg-destructive/10 focus:text-destructive"
                      : "text-rose-600 focus:bg-rose-50 focus:text-rose-600 dark:focus:bg-rose-950/30",
                  )}
                >
                  <IconTrash className="size-4" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Sheet détails ─────────────────────────────────────────────────── */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>
              {person ? `${person.firstName} ${person.lastName}` : "Détails du bénévole"}
            </SheetTitle>
          </SheetHeader>

          {person ? (
            <div className="flex flex-col">

              {/* ── Hero ── */}
              <div className="relative flex flex-col items-center gap-4 overflow-hidden px-8 pb-8 pt-12">
                {/* Fond décoratif */}
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-b to-background",
                    isAdministration
                      ? "from-sky-50/90 via-sky-50/35 dark:from-sky-950/30 dark:via-sky-950/12"
                      : "from-amber-50 via-amber-50/40 dark:from-amber-950/20 dark:via-amber-950/10",
                  )}
                />
                <div
                  className={cn(
                    "absolute top-0 left-1/2 size-64 -translate-x-1/2 rounded-full blur-3xl",
                    isAdministration
                      ? "bg-sky-200/50 dark:bg-sky-800/25"
                      : "bg-amber-100/60 dark:bg-amber-900/20",
                  )}
                />

                {/* Avatar */}
                <div className="relative z-10">
                  <Avatar className="size-32 ring-4 ring-background shadow-xl">
                    <AvatarImage src={person.image ?? ""} alt={`${person.firstName} ${person.lastName}`} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-muted to-muted/60 text-3xl font-bold text-muted-foreground">
                      {ini}
                    </AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute bottom-2 right-2 size-4 rounded-full ring-2 ring-background shadow-sm",
                      person.showOnSite
                        ? isAdministration
                          ? "bg-sky-400"
                          : "bg-emerald-400"
                        : "bg-muted-foreground/40",
                    )}
                    title={person.showOnSite ? "Visible sur le site" : "Masqué du site"}
                  />
                </div>

                {/* Identité */}
                <div className="relative z-10 text-center space-y-1">
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    {person.firstName} {person.lastName}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Bénévole</p>
                </div>

                {/* Badge visibilité */}
                <div className="relative z-10">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset",
                      person.showOnSite
                        ? isAdministration
                          ? "bg-sky-100 text-sky-900 ring-sky-200/80 dark:bg-sky-950/50 dark:text-sky-200 dark:ring-sky-700/50"
                          : "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:ring-emerald-800/40"
                        : "bg-muted text-muted-foreground ring-border",
                    )}
                  >
                    {person.showOnSite ? <IconEye className="size-3" /> : <IconEyeOff className="size-3" />}
                    {person.showOnSite ? "Visible sur le site" : "Masqué du site"}
                  </span>
                </div>
              </div>

              {/* ── Corps ── */}
              <div className="flex flex-col gap-5 px-8 py-6">

                {/* Contact */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Contact</p>
                  <div className="rounded-xl border overflow-hidden divide-y divide-border/60">
                    <div className={`flex items-center gap-3 px-4 py-3 bg-card transition-colors ${person.phone ? "hover:bg-muted/30" : ""}`}>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <IconPhone className={`size-3.5 ${person.phone ? "text-muted-foreground" : "text-muted-foreground/30"}`} />
                      </div>
                      <span className={`text-sm ${person.phone ? "text-foreground/80" : "text-muted-foreground/40 italic"}`}>
                        {person.phone ?? "Non renseigné"}
                      </span>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-3 bg-card transition-colors ${person.email ? "hover:bg-muted/30" : ""}`}>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <IconMail className={`size-3.5 ${person.email ? "text-muted-foreground" : "text-muted-foreground/30"}`} />
                      </div>
                      {person.email
                        ? <a href={`mailto:${person.email}`} className="text-sm text-foreground/80 hover:underline truncate">{person.email}</a>
                        : <span className="text-sm text-muted-foreground/40 italic">Non renseigné</span>
                      }
                    </div>
                  </div>
                </div>

                {/* Adresse */}
                {person.address && (
                  <div className="space-y-2">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Adresse</p>
                    <div className="rounded-xl border overflow-hidden">
                      <div className="flex items-start gap-3 px-4 py-3 bg-card">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                          <IconMapPin className="size-3.5 text-muted-foreground" />
                        </div>
                        <span className="text-sm text-foreground/80 leading-relaxed">
                          {person.address.address}<br />
                          {person.address.zipCode} {person.address.city}<br />
                          {person.address.country}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informations */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Informations</p>
                  <div className="rounded-xl border overflow-hidden">
                    <div className="flex items-center justify-between bg-card px-4 py-3">
                      <span className="text-sm text-muted-foreground">Ajouté le</span>
                      <span className="text-sm font-semibold text-foreground">
                        {new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(person.createdAt))}
                      </span>
                    </div>
                  </div>
                </div>

                {canEdit && (
                  <Button
                    asChild
                    className={cn(
                      "h-11 w-full cursor-pointer gap-2 rounded-xl font-semibold",
                      isAdministration
                        ? administrationPrimaryButtonClassName
                        : "bg-amber-500 text-white shadow-sm shadow-amber-500/20 hover:bg-amber-600",
                    )}
                  >
                    <Link href={editHref}>
                      <IconEdit className="size-4" />
                      Modifier le profil
                    </Link>
                  </Button>
                )}

              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground pt-4 px-6">Aucune donnée disponible.</p>
          )}
        </SheetContent>
      </Sheet>

      {canDelete && (
        <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent
          className={cn(
            "max-w-sm gap-0 overflow-hidden p-0",
            isAdministration && "rounded-2xl border-[var(--admin-card-border)]",
          )}
        >
          <div
            className={
              isAdministration
                ? administrationDeleteDialogHeaderClassName
                : "flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20"
            }
          >
            <div
              className={
                isAdministration
                  ? administrationDeleteDialogIconClassName
                  : "flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60 dark:bg-rose-900/40 dark:ring-rose-900/20"
              }
            >
              <IconTrash
                className={cn(
                  "size-6",
                  isAdministration ? "text-destructive" : "text-rose-600 dark:text-rose-400",
                )}
              />
            </div>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Supprimer le bénévole ?
            </AlertDialogTitle>
          </div>
          <AlertDialogHeader className="px-8 py-5">
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              Cette action est <span className="font-medium text-foreground">irréversible</span>. Le bénévole sera définitivement retiré de la base de contacts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter
            className={cn(
              "flex-row gap-2 border-t px-8 py-5",
              isAdministration && "border-[var(--admin-card-border)]",
            )}
          >
            <AlertDialogCancel
              className={cn(
                "flex-1 cursor-pointer rounded-xl text-sm font-medium",
                isAdministration ? "border-[var(--admin-secondary-border)]" : "border-border/60",
              )}
            >
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className={cn(
                "flex-1 cursor-pointer rounded-xl text-sm font-semibold",
                isAdministration
                  ? administrationDestructiveButtonClassName
                  : "bg-rose-600 text-white shadow-sm hover:bg-rose-700",
              )}
            >
              {isPending ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  Suppression…
                </>
              ) : (
                <>
                  <IconTrash className="size-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

