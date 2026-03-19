"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconEdit, IconTrash, IconDotsVertical } from "@tabler/icons-react"

interface RowActionsProps {
  editHref: string
  onDelete: () => Promise<void>
}

export function RowActions({ editHref, onDelete }: RowActionsProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function confirmDelete() {
    setOpen(false)
    startTransition(() => onDelete())
  }

  return (
    <>
      {/* ── Boutons inline — lg+ ─────────────────────────────────────────── */}
      <div className="hidden lg:flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" asChild>
          <Link href={editHref}>
            <IconEdit className="h-4 w-4" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive"
          disabled={pending}
          onClick={() => setOpen(true)}
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>

      {/* ── Menu ⋮ — mobile / tablette ──────────────────────────────────── */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
            <IconDotsVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl p-1">
          <DropdownMenuItem asChild className="rounded-lg px-3 py-2 cursor-pointer">
            <Link href={editHref} className="flex items-center gap-2">
              <IconEdit className="size-4 text-muted-foreground" />
              Modifier
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="rounded-lg px-3 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            onClick={() => setOpen(true)}
            disabled={pending}
          >
            <IconTrash className="size-4" />
            {pending ? "Suppression…" : "Supprimer"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ── Dialogue de confirmation ─────────────────────────────────────── */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet élément ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. L&apos;élément sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              {pending ? "Suppression…" : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
