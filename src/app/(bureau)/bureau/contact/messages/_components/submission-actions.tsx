"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconChevronDown, IconTrash } from "@tabler/icons-react"
import { ContactSubmissionStatus } from "@/lib/generated/prisma/enums"
import { updateSubmissionStatus, deleteSubmission } from "../../_actions/actions"

const STATUS_LABELS: Record<ContactSubmissionStatus, string> = {
  PENDING: "En attente",
  READ: "Lu",
  REPLIED: "Répondu",
  ARCHIVED: "Archivé",
}

interface SubmissionActionsProps {
  id: string
  currentStatus: ContactSubmissionStatus
}

export function SubmissionActions({ id, currentStatus }: SubmissionActionsProps) {
  const [pending, startTransition] = useTransition()

  const allStatuses = Object.keys(STATUS_LABELS) as ContactSubmissionStatus[]
  const otherStatuses = allStatuses.filter((s) => s !== currentStatus)

  return (
    <div className="flex items-center justify-end gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={pending} className="gap-1">
            {STATUS_LABELS[currentStatus]}
            <IconChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {otherStatuses.map((s) => (
            <DropdownMenuItem
              key={s}
              onClick={() => startTransition(() => updateSubmissionStatus(id, s))}
            >
              {STATUS_LABELS[s]}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => startTransition(() => deleteSubmission(id))}
          >
            <IconTrash className="size-4 mr-2" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
