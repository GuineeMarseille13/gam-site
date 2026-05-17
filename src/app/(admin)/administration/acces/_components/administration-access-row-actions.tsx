"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  IconBan,
  IconCircleCheck,
  IconDotsVertical,
  IconEdit,
  IconLoader2,
  IconTrash,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/helpers/utils"
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

interface AdministrationAccessRowActionsProps {
  userId: string
  displayName: string
  banned: boolean
  canManage: boolean
  isSelf: boolean
  onBan: () => Promise<{ success: boolean; error?: string }>
  onUnban: () => Promise<{ success: boolean; error?: string }>
  onRevoke: () => Promise<{ success: boolean; error?: string }>
  onError: (message: string) => void
}

/**
 * Actions admin sur un accès : modifier, bannir / débannir, révoquer.
 * Menu ⋮ sur mobile, boutons inline sur grand écran.
 */
export function AdministrationAccessRowActions({
  userId,
  displayName,
  banned,
  canManage,
  isSelf,
  onBan,
  onUnban,
  onRevoke,
  onError,
}: AdministrationAccessRowActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [openBan, setOpenBan] = useState(false)
  const [openRevoke, setOpenRevoke] = useState(false)

  if (!canManage) return null

  const editHref = `/administration/acces/${userId}/modifier`

  function runAction(action: () => Promise<{ success: boolean; error?: string }>) {
    startTransition(async () => {
      const result = await action()
      if (result.success) {
        setOpenBan(false)
        setOpenRevoke(false)
        router.refresh()
        return
      }
      onError(result.error ?? "Une erreur est survenue.")
    })
  }

  const banLabel = banned ? "Réactiver l'accès" : "Suspendre l'accès"
  const banLabelDesktop = banned ? "Réactiver" : "Suspendre"
  const BanIcon = banned ? IconCircleCheck : IconBan

  const desktopActionButtonClass =
    "h-8 shrink-0 gap-1.5 rounded-lg px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"

  return (
    <>
      <div className="hidden min-w-0 flex-nowrap items-center justify-end gap-0.5 lg:flex lg:w-full">
        <Button variant="ghost" size="sm" className={desktopActionButtonClass} asChild>
          <Link href={editHref}>
            <IconEdit className="size-3.5" />
            Modifier
          </Link>
        </Button>
        {!isSelf && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={desktopActionButtonClass}
            disabled={isPending}
            onClick={() => (banned ? runAction(onUnban) : setOpenBan(true))}
          >
            {isPending ? (
              <IconLoader2 className="size-3.5 animate-spin" />
            ) : (
              <BanIcon className={cnIcon(banned)} />
            )}
            {banLabelDesktop}
          </Button>
        )}
        {!isSelf && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className={cn(
              desktopActionButtonClass,
              "text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40",
            )}
            disabled={isPending}
            onClick={() => setOpenRevoke(true)}
          >
            <IconTrash className="size-3.5" />
            Révoquer
          </Button>
        )}
      </div>

      <div className="flex lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 rounded-lg hover:bg-muted"
              disabled={isPending}
              aria-label={`Actions pour ${displayName}`}
            >
              {isPending ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconDotsVertical className="size-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl p-1.5">
            <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
              <Link href={editHref}>
                <IconEdit className="size-4 text-muted-foreground" />
                Modifier
              </Link>
            </DropdownMenuItem>
            {!isSelf && (
              <>
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer"
                  disabled={isPending}
                  onClick={() => (banned ? runAction(onUnban) : setOpenBan(true))}
                >
                  <BanIcon className={cnIcon(banned)} />
                  {banLabel}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="rounded-lg cursor-pointer text-rose-600 focus:text-rose-600"
                  disabled={isPending}
                  onClick={() => setOpenRevoke(true)}
                >
                  <IconTrash className="size-4" />
                  Révoquer l&apos;accès
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openBan} onOpenChange={setOpenBan}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Suspendre l&apos;accès ?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{displayName}</strong> ne pourra plus se connecter au dashboard. Le compte seront conservés ; vous pourrez réactiver l&apos;accès plus tard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-sky-600 hover:bg-sky-700"
              onClick={() => runAction(onBan)}
            >
              {isPending ? <IconLoader2 className="size-4 animate-spin" /> : "Suspendre"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openRevoke} onOpenChange={setOpenRevoke}>
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Révoquer l&apos;accès ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de <strong>{displayName}</strong> sera supprimé. Aucune connexion ne sera possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-rose-600 hover:bg-rose-700"
              onClick={() => runAction(onRevoke)}
            >
              {isPending ? <IconLoader2 className="size-4 animate-spin" /> : "Révoquer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

function cnIcon(banned: boolean) {
  return banned
    ? "size-3.5 text-emerald-600"
    : "size-3.5 text-sky-600"
}
