"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { IconTrash, IconLoader2, IconAlertTriangle } from "@tabler/icons-react"
import { deleteCarouselSlide } from "../_actions/actions"

export function DeleteSlideButton({ id, title }: { id: string; title?: string | null }) {
  const [open, setOpen]      = useState(false)
  const [pending, start]     = useTransition()

  function handleConfirm() {
    start(async () => {
      await deleteCarouselSlide(id)
      setOpen(false)
    })
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        title="Supprimer"
        onClick={() => setOpen(true)}
      >
        <IconTrash className="size-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <IconAlertTriangle className="size-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Supprimer ce slide ?</DialogTitle>
            <DialogDescription className="text-center">
              {title ? (
                <>Le slide <span className="font-medium text-foreground">«&nbsp;{title}&nbsp;»</span> sera supprimé définitivement.</>
              ) : (
                "Ce slide sera supprimé définitivement."
              )}
              {" "}Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-2 flex-col-reverse gap-2 sm:flex-row">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={pending}
              onClick={handleConfirm}
            >
              {pending && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
