"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
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

const toggleButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "size-9",
        dashboard:
          "size-9 rounded-full border border-border/60 bg-muted/40 shadow-sm hover:bg-muted/60 dark:border-border/50 dark:bg-muted/30 dark:hover:bg-muted/45",
      },
    },
    defaultVariants: {
      variant: "dashboard",
    },
  },
)

export interface ThemeToggleProps extends VariantProps<typeof toggleButtonVariants> {
  className?: string
}

/**
 * Sélecteur de thème pour les espaces Bureau et Administration uniquement
 * (hors de ces routes, le thème reste clair — voir `ThemeProvider`).
 */
export function ThemeToggle({ className, variant }: ThemeToggleProps) {
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
        className={cn(toggleButtonVariants({ variant }), className)}
        disabled
        aria-label="Thème du tableau de bord, chargement…"
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
          className={cn(toggleButtonVariants({ variant }), className)}
          aria-label="Choisir l’affichage clair ou sombre du tableau de bord"
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
      <DropdownMenuContent align="end" className="min-w-[11rem]">
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
