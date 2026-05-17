import { IconMail } from "@tabler/icons-react"
import type { AdministrationAccessRow } from "../_schemas/administration-access.schema"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/helpers/utils"
import {
  getAdministrationAccessDisplayName,
  getAdministrationAccessInitials,
} from "./administration-access-utils"

interface AdministrationAccessAccountCellProps {
  row: AdministrationAccessRow
  showStatusDot?: boolean
  avatarClassName?: string
}

/**
 * Bloc compte : avatar, nom, e-mail et type de profil.
 */
export function AdministrationAccessAccountCell({
  row,
  showStatusDot = false,
  avatarClassName,
}: AdministrationAccessAccountCellProps) {
  const displayName = getAdministrationAccessDisplayName(row)
  const initials = getAdministrationAccessInitials(row)
  const person = row.person

  return (
    <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
      <div className="relative shrink-0">
        <Avatar className={cn("size-11 ring-2 ring-background shadow-sm", avatarClassName)}>
          <AvatarImage src={person?.image ?? ""} alt={displayName} className="object-cover" />
          <AvatarFallback className="bg-gradient-to-br from-sky-100 to-sky-200 text-xs font-bold text-sky-900 dark:from-sky-950/80 dark:to-sky-900/50 dark:text-sky-200">
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
