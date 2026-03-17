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
import {
  IconChevronDown,
  IconTrash,
  IconMailOpened,
  IconMailCheck,
  IconClock,
} from "@tabler/icons-react"
import { ContactSubmissionStatus } from "@/lib/generated/prisma/enums"
import { updateSubmissionStatus, deleteSubmission } from "../../_actions/actions"

const STATUS_CONFIG: Record<ContactSubmissionStatus, { label: string; icon: React.ElementType; hover: string; itemHover: string }> = {
  PENDING:  { label: "En attente", icon: IconClock,      hover: "hover:bg-amber-100 hover:text-amber-700",    itemHover: "focus:bg-amber-50 focus:text-amber-700"     },
  READ:     { label: "Lu",         icon: IconMailOpened, hover: "hover:bg-blue-100 hover:text-blue-700",      itemHover: "focus:bg-blue-50 focus:text-blue-700"       },
  REPLIED:  { label: "Répondu",    icon: IconMailCheck,  hover: "hover:bg-emerald-100 hover:text-emerald-700", itemHover: "focus:bg-emerald-50 focus:text-emerald-700" },
}

interface SubmissionActionsProps {
  id: string
  currentStatus: ContactSubmissionStatus
}

export function SubmissionActions({ id, currentStatus }: SubmissionActionsProps) {
  const [pending, startTransition] = useTransition()

  const allStatuses = Object.keys(STATUS_CONFIG) as ContactSubmissionStatus[]
  const otherStatuses = allStatuses.filter((s) => s !== currentStatus)

  const CurrentIcon = STATUS_CONFIG[currentStatus].icon

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            className={`h-7 gap-1.5 text-xs text-muted-foreground px-2 ${STATUS_CONFIG[currentStatus].hover}`}
          >
            <CurrentIcon className="size-3.5" />
            {STATUS_CONFIG[currentStatus].label}
            <IconChevronDown className="size-3 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {otherStatuses.map((s) => {
            const Icon = STATUS_CONFIG[s].icon
            return (
              <DropdownMenuItem
                key={s}
                className={`gap-2 text-sm ${STATUS_CONFIG[s].itemHover}`}
                onClick={() => startTransition(() => updateSubmissionStatus(id, s))}
              >
                <Icon className="size-4 text-muted-foreground" />
                {STATUS_CONFIG[s].label}
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="gap-2 text-sm text-red-600 focus:text-red-600 hover:bg-red-100 focus:bg-red-50"
            onClick={() => startTransition(() => deleteSubmission(id))}
          >
            <IconTrash className="size-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
