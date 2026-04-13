import { AvisAvatarWithStatus } from "./avis-avatar-with-status"

interface AvisPersonCellProps {
  firstName: string
  lastName: string
  avatarUrl: string | null
  isActive: boolean
}

/**
 * Colonne tableau « Personne » : avatar + nom sur une ligne.
 */
export function AvisPersonCell({
  firstName,
  lastName,
  avatarUrl,
  isActive,
}: AvisPersonCellProps) {
  const displayName = `${firstName} ${lastName}`.trim()

  return (
    <div className="flex min-w-0 max-w-[min(100%,16rem)] items-center gap-3 sm:max-w-none">
      <AvisAvatarWithStatus
        firstName={firstName}
        lastName={lastName}
        avatarUrl={avatarUrl}
        isActive={isActive}
      />
      <span className="min-w-0 truncate font-medium text-foreground">{displayName}</span>
    </div>
  )
}
