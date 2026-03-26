"use client"

import * as React from "react"
import { Check, Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const OPTIONS = [
  { value: "light" as const, label: "Clair", Icon: Sun },
  { value: "dark" as const, label: "Sombre", Icon: Moon },
  { value: "system" as const, label: "Système", Icon: Monitor },
]

/**
 * Sélecteur de thème (clair / sombre / système), sans flash SSR.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className={cn("size-9 shrink-0", className)}
        disabled
        aria-label="Thème, chargement…"
      >
        <Sun className="size-4 opacity-35" aria-hidden />
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-9 shrink-0", className)}
          aria-label="Choisir le thème d’affichage"
        >
          <span className="relative flex size-4 items-center justify-center">
            <Sun
              className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
              aria-hidden
            />
            <Moon
              className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
              aria-hidden
            />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10.5rem]">
        {OPTIONS.map(({ value, label, Icon }) => (
          <DropdownMenuItem
            key={value}
            className="gap-2"
            onClick={() => {
              setTheme(value)
            }}
          >
            <Icon className="size-4 opacity-70" aria-hidden />
            <span className="flex-1">{label}</span>
            {theme === value ? <Check className="size-4 text-foreground" aria-hidden /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
