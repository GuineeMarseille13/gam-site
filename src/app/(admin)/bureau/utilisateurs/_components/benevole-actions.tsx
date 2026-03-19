"use client"

import { useTransition, useState } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IconDotsVertical, IconTrash, IconLoader2 } from "@tabler/icons-react"
import { deleteBenevole } from "../_actions/actions"

interface BenevoleActionsProps {
  personId: string
}

export function BenevoleActions({ personId }: BenevoleActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  function handleDeleteConfirm() {
    startTransition(async () => {
      await deleteBenevole(personId)
      setShowDeleteModal(false)
      router.refresh()
    })
  }

  return (
    <>
      {/* ── Desktop : bouton inline ───────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDeleteModal(true)}
          disabled={isPending}
          className="cursor-pointer h-8 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-rose-600 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
        >
          {isPending ? (
            <IconLoader2 className="size-3.5 animate-spin" />
          ) : (
            <IconTrash className="size-3.5" />
          )}
          Supprimer
        </Button>
      </div>

      {/* ── Mobile / tablette : dropdown ─────────────────────────────────── */}
      <div className="flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 cursor-pointer hover:bg-gray-200 hover:text-foreground" disabled={isPending}>
              {isPending ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconDotsVertical className="size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem
              onClick={() => setShowDeleteModal(true)}
              className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
            >
              <IconTrash className="size-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ── Modale de confirmation ────────────────────────────────────────── */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
          <div className="flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60 dark:bg-rose-900/40 dark:ring-rose-900/20">
              <IconTrash className="size-6 text-rose-600 dark:text-rose-400" />
            </div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Supprimer le bénévole
            </DialogTitle>
          </div>

          <div className="px-8 py-5">
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Cette action est <span className="font-medium text-foreground">irréversible</span>. Le bénévole sera définitivement retiré de la base de contacts.
            </DialogDescription>
          </div>

          <DialogFooter className="flex-row gap-2 border-t px-8 py-5 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer rounded-xl border-border/60 text-sm font-medium"
              disabled={isPending}
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 cursor-pointer rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold shadow-sm shadow-rose-600/20 focus-visible:ring-rose-500"
              disabled={isPending}
              onClick={handleDeleteConfirm}
            >
              {isPending ? (
                <><IconLoader2 className="size-4 animate-spin" />Suppression…</>
              ) : (
                <><IconTrash className="size-4" />Supprimer</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
