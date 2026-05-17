import { IconBriefcase, IconCircleFilled } from "@tabler/icons-react"
import type { MembresRoleStyle } from "./membres-role-styles"

interface DashboardRoleBadgeProps {
  style: MembresRoleStyle
}

/** Badge rôle d’accès dashboard. */
export function MembresDashboardRoleBadge({ style }: DashboardRoleBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
    >
      <IconCircleFilled className={`size-1.5 shrink-0 ${style.dot}`} />
      <span className="truncate">{style.label}</span>
    </span>
  )
}

interface PosteBadgeProps {
  label: string
}

/** Badge poste dans le bureau (fonction, pas rôle dashboard). */
export function MembresPosteBadge({ label }: PosteBadgeProps) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:ring-rose-800/40">
      <IconBriefcase className="size-3 shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  )
}

interface MobileRolePosteProps {
  roleStyle: MembresRoleStyle | null
  showRole: boolean
  posteLabel: string | null
}

/** Rôle + poste empilés sous le nom (mobile). */
export function MembresMobileRolePoste({
  roleStyle,
  showRole,
  posteLabel,
}: MobileRolePosteProps) {
  if (!showRole && !posteLabel) return null

  return (
    <div className="mt-1 flex flex-wrap items-center gap-1.5 sm:hidden">
      {showRole && roleStyle && <MembresDashboardRoleBadge style={roleStyle} />}
      {posteLabel && <MembresPosteBadge label={posteLabel} />}
    </div>
  )
}
