import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/helpers/utils"

interface AvisAvatarWithStatusProps {
  firstName: string
  lastName: string
  avatarUrl: string | null
  isActive: boolean
  /** Taille visuelle (défaut : tableau bureau) */
  size?: "sm" | "md"
}

function initials(firstName: string, lastName: string): string {
  const a = firstName.trim()[0] ?? ""
  const b = lastName.trim()[0] ?? ""
  const pair = `${a}${b}`.toUpperCase()
  return pair || "?"
}

/**
 * Avatar rond + point de statut (visible site / masqué), partagé tableau & cartes mobile.
 */
export function AvisAvatarWithStatus({
  firstName,
  lastName,
  avatarUrl,
  isActive,
  size = "sm",
}: AvisAvatarWithStatusProps) {
  const box = size === "md" ? "size-11" : "size-9 sm:size-10"
  const fallbackText = size === "md" ? "text-xs" : "text-[10px] sm:text-xs"

  return (
    <div className={cn("relative shrink-0", box)}>
      <Avatar className={cn(box, "ring-2 ring-border/40")}>
        <AvatarImage src={avatarUrl ?? undefined} alt="" />
        <AvatarFallback
          className={cn(
            "bg-gradient-to-br from-amber-100 to-amber-200 font-bold text-amber-800 dark:from-amber-900/40 dark:to-amber-800/40 dark:text-amber-300",
            fallbackText,
          )}
        >
          {initials(firstName, lastName)}
        </AvatarFallback>
      </Avatar>
      <span
        role="status"
        aria-label={isActive ? "Visible sur le site" : "Masqué sur le site"}
        title={isActive ? "Visible sur le site" : "Masqué sur le site"}
        className={cn(
          "pointer-events-none absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-background shadow-sm",
          isActive
            ? "bg-emerald-500 dark:bg-emerald-400"
            : "bg-muted-foreground/50 dark:bg-muted-foreground/60",
        )}
      />
    </div>
  )
}
