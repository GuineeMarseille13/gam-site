"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Button } from "@/components/ui/button"
import { IconDotsVertical, IconEdit, IconLoader2, IconTrash } from "@tabler/icons-react"
import { deleteBenevole } from "../_actions/actions"

interface BenevoleActionsProps {
  personId: string
}

export function BenevoleActions({ personId }: BenevoleActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [openDelete, setOpenDelete]  = useState(false)
  const router = useRouter()

  const editHref = `/bureau/membres/benevole/${personId}/modifier`

  function confirmDelete() {
    setOpenDelete(false)
    startTransition(async () => {
      await deleteBenevole(personId)
      router.refresh()
    })
  }

  return (
    <>
      {/* ── Boutons inline — lg+ ─────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-end gap-0.5">
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
        <Button
          variant="ghost" size="sm"
          onClick={() => setOpenDelete(true)}
          disabled={isPending}
          className="h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
        >
          {isPending
            ? <IconLoader2 className="size-3.5 animate-spin" />
            : <IconTrash className="size-3.5" />
          }
          Supprimer
        </Button>
      </div>

      {/* ── Menu ⋮ — mobile / tablette ──────────────────────────────────── */}
      <div className="flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 cursor-pointer hover:bg-gray-200 hover:text-foreground" disabled={isPending}>
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
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpenDelete(true)}
              className="rounded-lg px-3 py-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
            >
              <IconTrash className="size-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Dialogue de confirmation ─────────────────────────────────────── */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent className="max-w-sm gap-0 overflow-hidden p-0">
          <div className="flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60 dark:bg-rose-900/40 dark:ring-rose-900/20">
              <IconTrash className="size-6 text-rose-600 dark:text-rose-400" />
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
