/** Styles des badges de rôle dashboard (User.role). */
export const MEMBRES_ROLE_STYLES: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  "SUPER-ADMIN": {
    label: "Super administrateur",
    dot: "text-amber-500",
    badge:
      "bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:ring-amber-800/40",
  },
  BUREAU: {
    label: "Bureau",
    dot: "text-blue-500",
    badge:
      "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:ring-blue-800/40",
  },
  "ADMIN-PERMADMIN": {
    label: "Admin permanence",
    dot: "text-sky-500",
    badge:
      "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:ring-sky-800/40",
  },
  PERMADMIN: {
    label: "Permanence",
    dot: "text-cyan-500",
    badge:
      "bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:ring-cyan-800/40",
  },
  "INVITE-BUREAU": {
    label: "Invité bureau",
    dot: "text-violet-500",
    badge:
      "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:ring-violet-800/40",
  },
  "INVITE-PERMADMIN": {
    label: "Invité permanence",
    dot: "text-slate-500",
    badge:
      "bg-slate-50 text-slate-700 ring-slate-200 dark:bg-slate-950/40 dark:text-slate-400 dark:ring-slate-800/40",
  },
}

export type MembresRoleStyle = {
  label: string
  dot: string
  badge: string
}

export function getMembresRoleStyle(
  role: string | null | undefined,
): MembresRoleStyle {
  if (!role) {
    return {
      label: "—",
      dot: "text-muted-foreground",
      badge: "bg-muted text-muted-foreground ring-border",
    }
  }

  return (
    MEMBRES_ROLE_STYLES[role] ?? {
      label: role,
      dot: "text-muted-foreground",
      badge: "bg-muted text-muted-foreground ring-border dark:bg-muted/40",
    }
  )
}
