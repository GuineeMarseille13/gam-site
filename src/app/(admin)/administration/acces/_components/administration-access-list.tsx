"use client"

import { useState, useTransition, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { IconEdit, IconLoader2, IconMail, IconPhone, IconTrash } from "@tabler/icons-react"
import type { AdministrationAccessRow } from "../../_schemas/administration-access.schema"
import { deleteAdministrationAccessUser } from "../../_actions/administration-access-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

function initials(first: string, last: string, fallbackName: string) {
  const a = first[0] ?? ""
  const b = last[0] ?? ""
  if (a || b) return `${a}${b}`.toUpperCase()
  return fallbackName
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?"
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "medium",
    }).format(new Date(iso))
  } catch {
    return "—"
  }
}

interface AdministrationAccessListProps {
  rows: AdministrationAccessRow[]
  isAdmin: boolean
  currentUserId: string
}

/**
 * Liste responsive des accès « administration » : lecture pour tous les rôles du dashboard,
 * actions modifier / supprimer réservées aux administrateurs.
 */
export function AdministrationAccessList({
  rows,
  isAdmin,
  currentUserId,
}: AdministrationAccessListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{ userId: string; name: string } | null>(null)

  const handleDelete = useCallback(
    (userId: string) => {
      setError(null)
      startTransition(async () => {
        const result = await deleteAdministrationAccessUser(userId)
        if (result.success) {
          setPendingDelete(null)
          router.refresh()
          return
        }
        setError(result.error)
      })
    },
    [router],
  )

  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-muted/15 py-16 text-center">
        <p className="text-sm font-medium text-foreground">Aucun accès « Administration »</p>
        <p className="max-w-sm text-xs text-muted-foreground">
          Créez un premier compte depuis le bouton « Nouveau compte » (réservé aux administrateurs).
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="rounded-xl border border-rose-200/60 bg-rose-50/90 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/35 dark:text-rose-200">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-border/60 bg-muted/25 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
          <span>Personne</span>
          <span className="hidden sm:block">Contact</span>
          <span className="hidden lg:block">Créé le</span>
          <span className="text-right">{isAdmin ? "Actions" : ""}</span>
        </div>

        <ul className="divide-y divide-border/60">
          {rows.map((row) => {
            const displayName = row.person
              ? `${row.person.firstName} ${row.person.lastName}`
              : row.name
            const photo = row.person?.image ?? null
            const isSelf = row.userId === currentUserId
            const canDelete = isAdmin && !isSelf

            return (
              <li
                key={row.userId}
                className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-4 transition-colors hover:bg-muted/15 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="size-10 shrink-0 ring-2 ring-border/40">
                    <AvatarImage src={photo ?? ""} alt="" />
                    <AvatarFallback className="bg-sky-100 text-xs font-semibold text-sky-800 dark:bg-sky-950/50 dark:text-sky-200">
                      {row.person
                        ? initials(row.person.firstName, row.person.lastName, row.name)
                        : initials("", "", row.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{row.email}</p>
                    {row.banned && (
                      <span className="mt-0.5 inline-block rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-medium text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
                        Compte restreint
                      </span>
                    )}
                  </div>
                </div>

                <div className="hidden min-w-0 flex-col gap-0.5 text-sm sm:flex">
                  <span className="flex items-center gap-1.5 truncate text-muted-foreground">
                    <IconMail className="size-3.5 shrink-0 opacity-70" aria-hidden />
                    {row.email}
                  </span>
                  {row.person?.phone && (
                    <span className="flex items-center gap-1.5 truncate text-muted-foreground">
                      <IconPhone className="size-3.5 shrink-0 opacity-70" aria-hidden />
                      {row.person.phone}
                    </span>
                  )}
                </div>

                <div className="hidden text-sm text-muted-foreground lg:block">
                  {formatDate(row.createdAt)}
                </div>

                <div className="flex justify-end gap-1">
                  {isAdmin && (
                    <>
                      <Button variant="ghost" size="icon" className="size-9 shrink-0" asChild>
                        <Link
                          href={`/administration/acces/${row.userId}/modifier`}
                          aria-label={`Modifier ${displayName}`}
                        >
                          <IconEdit className="size-4" />
                        </Link>
                      </Button>

                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-9 shrink-0 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-950/40"
                          aria-label={`Supprimer ${displayName}`}
                          type="button"
                          onClick={() => {
                            setError(null)
                            setPendingDelete({ userId: row.userId, name: displayName })
                          }}
                        >
                          <IconTrash className="size-4" />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cet accès ?</AlertDialogTitle>
            <AlertDialogDescription>
              Le compte de <strong>{pendingDelete?.name}</strong> sera définitivement retiré. Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 text-white hover:bg-rose-700"
              disabled={isPending || !pendingDelete}
              onClick={(e) => {
                e.preventDefault()
                if (pendingDelete) handleDelete(pendingDelete.userId)
              }}
            >
              {isPending ? (
                <>
                  <IconLoader2 className="size-4 animate-spin" />
                  Suppression…
                </>
              ) : (
                "Supprimer"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
