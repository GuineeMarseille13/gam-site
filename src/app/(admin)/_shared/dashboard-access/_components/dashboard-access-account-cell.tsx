import { IconMail } from "@tabler/icons-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/helpers/utils"
import type { DashboardAccessScope } from "@/config/dashboard-access-scope"
import { getDashboardAccessAccentClasses } from "@/config/dashboard-access-accent-theme"
import type { DashboardAccessRow } from "../_types/dashboard-access-row"
import {
  getDashboardAccessDisplayName,
  getDashboardAccessInitials,
} from "./dashboard-access-utils"

interface DashboardAccessAccountCellProps {
  scope: DashboardAccessScope
  row: DashboardAccessRow
  showStatusDot?: boolean
  avatarClassName?: string
}

/**
 * Bloc compte : avatar, nom, e-mail et type de profil.
 */
export function DashboardAccessAccountCell({
  scope,
  row,
  showStatusDot = false,
  avatarClassName,
}: DashboardAccessAccountCellProps) {
  const accent = getDashboardAccessAccentClasses(scope)
  const displayName = getDashboardAccessDisplayName(row)
  const initials = getDashboardAccessInitials(row)
  const person = row.person

  return (
    <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
      <div className="relative shrink-0">
        <Avatar className={cn("size-11 ring-2 ring-background shadow-sm", avatarClassName)}>
          <AvatarImage src={person?.image ?? ""} alt={displayName} className="object-cover" />
          <AvatarFallback
            className={cn("bg-gradient-to-br text-xs font-bold", accent.avatarFallback)}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        {showStatusDot && (
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-background",
              row.banned ? "bg-rose-500" : "bg-emerald-500",
            )}
            aria-hidden
          />
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="truncate text-sm font-semibold leading-tight text-foreground sm:text-base">
          {displayName}
        </h3>
        <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
          <IconMail className="size-3.5 shrink-0 opacity-70" aria-hidden />
          <span className="truncate">{row.email}</span>
        </p>
        {person?.profileKind && (
          <p className="text-[11px] text-muted-foreground">{person.profileKind}</p>
        )}
      </div>
    </div>
  )
}
