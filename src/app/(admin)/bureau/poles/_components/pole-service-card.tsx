"use client"

import { useCallback } from "react"
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import type { DetailsPoleService } from "../_schemas/details-pole-service.schema"

interface PoleServiceCardProps {
  service: DetailsPoleService
  onEdit: (service: DetailsPoleService) => void
  onDelete: (serviceId: string) => void
  isDeleting?: boolean
}

/**
 * Composant: PoleServiceCard
 * Rôle: Afficher un service + actions (edit/supprimer).
 */
export function PoleServiceCard({
  service,
  onEdit,
  onDelete,
  isDeleting,
}: PoleServiceCardProps) {
  const handleEdit = useCallback(() => onEdit(service), [onEdit, service])
  const handleDelete = useCallback(() => onDelete(service.id), [onDelete, service.id])

  return (
    <Card className="group rounded-2xl border-border/60 bg-background p-5 shadow-sm transition-shadow hover:shadow-md">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-xl">
              {service.icon ?? "🧩"}
            </div>
            <div className="min-w-0">
              <p className="line-clamp-2 text-sm font-semibold text-foreground">
                {service.title}
              </p>
              <p className="text-xs text-muted-foreground">Ordre {service.order}</p>
            </div>
          </div>

          <p className="line-clamp-4 text-sm leading-relaxed text-muted-foreground">
            {service.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge
            variant={service.isActive ? "default" : "secondary"}
            className={service.isActive ? "bg-emerald-600 text-white" : undefined}
          >
            {service.isActive ? "Actif" : "Inactif"}
          </Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-9 w-9 rounded-xl opacity-80 transition-opacity group-hover:opacity-100"
                aria-label="Actions"
              >
                <IconDotsVertical className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit} className="gap-2">
                <IconPencil className="size-4" />
                Modifier
              </DropdownMenuItem>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="gap-2 text-destructive focus:text-destructive"
                  >
                    <IconTrash className="size-4" />
                    Supprimer
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer ce service ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est définitive. Le service ne sera plus affiché.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </Card>
  )
}

