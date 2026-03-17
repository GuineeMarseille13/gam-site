"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { IconEye, IconEyeOff, IconLoader2 } from "@tabler/icons-react"
import { toggleCarouselSlideActive } from "../_actions/actions"

export function ToggleActiveButton({ id, isActive }: { id: string; isActive: boolean }) {
  const [pending, start] = useTransition()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-muted-foreground hover:text-foreground"
      title={isActive ? "Masquer" : "Rendre visible"}
      disabled={pending}
      onClick={() => start(() => toggleCarouselSlideActive(id, !isActive))}
    >
      {pending
        ? <IconLoader2 className="size-4 animate-spin" />
        : isActive
          ? <IconEye className="size-4" />
          : <IconEyeOff className="size-4" />
      }
    </Button>
  )
}
