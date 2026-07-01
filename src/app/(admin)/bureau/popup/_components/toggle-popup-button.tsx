"use client"

import { useTransition } from "react"
import { togglePopupActive } from "../_actions/actions"
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"

interface TogglePopupButtonProps {
  id: string
  isActive: boolean
  className?: string
}

export function TogglePopupButton({ id, isActive, className }: TogglePopupButtonProps) {
  const [pending, start] = useTransition()

  return (
    <button
      type="button"
      onClick={() => start(() => togglePopupActive(id, !isActive))}
      disabled={pending}
      className={`inline-flex min-w-0 items-center justify-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
        isActive
          ? "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
      } ${className ?? ""}`}
    >
      {pending
        ? <IconLoader2 className="size-3.5 shrink-0 animate-spin" />
        : isActive
          ? <IconEyeOff className="size-3.5 shrink-0" />
          : <IconEye className="size-3.5 shrink-0" />
      }
      <span className="truncate">{isActive ? "Désactiver" : "Activer"}</span>
    </button>
  )
}
