"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
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
  IconDotsVertical,
  IconEdit,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react"

type RowActionsVariant = "default" | "compact"

interface RowActionsProps {
  editHref:      string
  onDelete:      () => Promise<unknown>
  /** Fourni uniquement si le membre possède un compte dashboard */
  onBanToggle?:  () => Promise<unknown>
  isBanned?:     boolean
  /** `compact` : icônes seules, adapté aux cartes étroites */
  variant?:      RowActionsVariant
  className?:    string
}

export function RowActions({
  editHref,
  onDelete,
  onBanToggle,
  isBanned = false,
  variant = "default",
  className,
}: RowActionsProps) {
  const router = useRouter()
  const [openDelete, setOpenDelete]   = useState(false)
  const [isPending, startTransition]  = useTransition()

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

  const deleteDialog = (
    <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
      <AlertDialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <div className="flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60 dark:bg-rose-900/40 dark:ring-rose-900/20">
            <IconTrash className="size-6 text-rose-600 dark:text-rose-400" />
          </div>
          <AlertDialogTitle className="text-base font-semibold text-foreground">
            Supprimer cet élément ?
          </AlertDialogTitle>
        </div>
        <div className="px-8 py-5">
          <AlertDialogDescription className="text-center text-sm text-muted-foreground">
            Cette action est <span className="font-medium text-foreground">irréversible</span>. L&apos;élément sera définitivement supprimé.
          </AlertDialogDescription>
        </div>
        <AlertDialogFooter className="flex-row gap-2 border-t px-8 py-5">
          <AlertDialogCancel className="flex-1 cursor-pointer rounded-xl border-border/60 text-sm font-medium">
            Annuler
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 cursor-pointer rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-semibold shadow-sm"
            onClick={confirmDelete}
          >
            {isPending ? <><IconLoader2 className="size-4 animate-spin" />Suppression…</> : <><IconTrash className="size-4" />Supprimer</>}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )

  if (variant === "compact") {
    return (
      <>
        <div className={`flex shrink-0 items-center gap-1 ${className ?? ""}`}>
          <Button
            variant="outline"
            size="icon-sm"
            asChild
            className="rounded-lg"
            disabled={isPending}
          >
            <Link href={editHref} aria-label="Modifier">
              <IconEdit className="size-4" />
            </Link>
          </Button>

          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30"
            disabled={isPending}
            aria-label="Supprimer"
            onClick={() => setOpenDelete(true)}
          >
            <IconTrash className="size-4" />
          </Button>
        </div>
        {deleteDialog}
      </>
    )
  }

  return (
    <>
      {/* ── Boutons inline — lg+ ─────────────────────────────────────────── */}
      <div className={`hidden lg:flex items-center justify-end gap-0.5 ${className ?? ""}`}>
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
            ) : isBanned ? (
              <IconCircleCheck className="size-3.5 text-emerald-600" />
            ) : (
              <IconBan className="size-3.5 text-amber-600" />
            )}
            {isBanned ? "Débannir" : "Bannir"}
          </Button>
        )}

        <Button
          variant="ghost" size="sm"
          className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
          disabled={isPending}
          onClick={() => setOpenDelete(true)}
        >
          <IconTrash className="size-3.5" />
          Supprimer
        </Button>
      </div>

      {/* ── Menu ⋮ — mobile / tablette ──────────────────────────────────── */}
      <div className="flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 cursor-pointer hover:bg-muted hover:text-foreground" disabled={isPending}>
              {isPending
                ? <IconLoader2 className="size-4 animate-spin" />
                : <IconDotsVertical className="size-4" />
              }
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
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
                {isBanned ? (
                  <><IconCircleCheck className="size-4 text-emerald-600" />Débannir</>
                ) : (
                  <><IconBan className="size-4 text-amber-600" />Bannir</>
                )}
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="rounded-lg px-3 py-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
              onClick={() => setOpenDelete(true)}
              disabled={isPending}
            >
              <IconTrash className="size-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {deleteDialog}
    </>
  )
}
