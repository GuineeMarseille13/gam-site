"use client"

import { useCallback } from "react"
import Image from "next/image"
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

import type { DetailsPoleAchievement } from "../_schemas/details-pole-achievement.schema"

interface PoleAchievementCardProps {
  achievement: DetailsPoleAchievement
  onEdit: (achievement: DetailsPoleAchievement) => void
  onDelete: (achievementId: string) => void
  isDeleting?: boolean
}

/**
 * Composant: PoleAchievementCard
 * Rôle: Afficher une réalisation + actions (modifier / supprimer).
 */
export function PoleAchievementCard({
  achievement,
  onEdit,
  onDelete,
  isDeleting,
}: PoleAchievementCardProps) {
  const handleEdit = useCallback(() => onEdit(achievement), [onEdit, achievement])
  const handleDelete = useCallback(
    () => onDelete(achievement.id),
    [onDelete, achievement.id],
  )

  const shouldUnoptimize =
    achievement.imageUrl.startsWith("https://ui-avatars.com") ||
    achievement.imageUrl.includes("res.cloudinary.com")

  return (
    <Card className="group overflow-hidden rounded-2xl border-border/60 bg-background shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] w-full bg-muted">
        <Image
          src={achievement.imageUrl}
          alt={achievement.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 50vw"
          unoptimized={shouldUnoptimize}
        />
      </div>

      <header className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">
            {achievement.title}
          </p>
          <p className="text-xs text-muted-foreground">Ordre {achievement.order}</p>
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {achievement.description}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Badge
            variant={achievement.isActive ? "default" : "secondary"}
            className={achievement.isActive ? "bg-emerald-600 text-white" : undefined}
          >
            {achievement.isActive ? "Actif" : "Inactif"}
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
                    <AlertDialogTitle>Supprimer cette réalisation ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action est définitive. La carte ne sera plus affichée sur la page
                      publique.
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
