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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  IconDotsVertical,
  IconEdit,
  IconTrash,
  IconBan,
  IconCircleCheck,
  IconLoader2,
} from "@tabler/icons-react"
import { banUser, unbanUser, deleteUser } from "../_actions/actions"

interface UserActionsProps {
  userId: string
  isBanned: boolean
  isSelf: boolean
}

export function UserActions({ userId, isBanned, isSelf }: UserActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const router = useRouter()

  function handleBanToggle() {
    startTransition(async () => {
      if (isBanned) {
        await unbanUser(userId)
      } else {
        await banUser(userId)
      }
      router.refresh()
    })
  }

  function handleDeleteConfirm() {
    startTransition(async () => {
      await deleteUser(userId)
      setShowDeleteModal(false)
      router.refresh()
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 hover:bg-gray-200 hover:text-foreground" disabled={isPending}>
            {isPending ? (
              <IconLoader2 className="size-4 animate-spin" />
            ) : (
              <IconDotsVertical className="size-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild className="focus:bg-muted focus:text-foreground cursor-pointer">
            <Link href={`/bureau/utilisateurs/${userId}/modifier`}>
              <IconEdit className="size-4" />
              Modifier
            </Link>
          </DropdownMenuItem>

          {!isSelf && (
            <>
              <DropdownMenuItem onClick={handleBanToggle} className="focus:bg-muted focus:text-foreground cursor-pointer">
                {isBanned ? (
                  <><IconCircleCheck className="size-4 text-emerald-600" />Débannir</>
                ) : (
                  <><IconBan className="size-4 text-amber-600" />Bannir</>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setShowDeleteModal(true)}
                className="text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30 cursor-pointer"
              >
                <IconTrash className="size-4" />
                Supprimer
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
          {/* Zone icône */}
          <div className="flex flex-col items-center gap-3 bg-rose-50/60 px-8 pb-6 pt-8 dark:bg-rose-950/20">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-100 ring-4 ring-rose-100/60 dark:bg-rose-900/40 dark:ring-rose-900/20">
              <IconTrash className="size-6 text-rose-600 dark:text-rose-400" />
            </div>
            <DialogTitle className="text-base font-semibold text-foreground">
              Supprimer l&apos;utilisateur
            </DialogTitle>
          </div>

          {/* Corps */}
          <div className="px-8 py-5">
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Cette action est <span className="font-medium text-foreground">irréversible</span>. L&apos;utilisateur sera définitivement supprimé et perdra tout accès au dashboard.
            </DialogDescription>
          </div>

          {/* Actions */}
          <DialogFooter className="flex-row gap-2 border-t px-8 py-5 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1 rounded-xl border-border/60 text-sm font-medium"
              disabled={isPending}
              onClick={() => setShowDeleteModal(false)}
            >
              Annuler
            </Button>
            <Button
              className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-sm font-semibold shadow-sm shadow-rose-600/20 focus-visible:ring-rose-500"
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
