"use client"

import { useTransition } from "react"
import { togglePopupActive } from "../_actions/actions"
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"

export function TogglePopupButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, start] = useTransition()

  return (
    <button
      onClick={() => start(() => togglePopupActive(id, !isActive))}
      disabled={pending}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
        isActive
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {pending
        ? <IconLoader2 className="size-3.5 animate-spin" />
        : isActive
          ? <IconEyeOff className="size-3.5" />
          : <IconEye className="size-3.5" />
      }
      {isActive ? "Désactiver" : "Activer"}
    </button>
  )
}
