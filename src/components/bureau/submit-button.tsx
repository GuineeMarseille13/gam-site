"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/helpers/utils"
import { administrationPrimaryButtonClassName } from "@/config/administration-dashboard-theme"

interface SubmitButtonProps {
  children?: React.ReactNode
  className?: string
  intent?: "default" | "bureau" | "administration"
}

function resolveIntentClassName(intent: SubmitButtonProps["intent"]): string {
  if (intent === "administration") return administrationPrimaryButtonClassName
  if (intent === "bureau") {
    return cn(
      "bg-amber-500 text-white",
      "shadow-[0_1px_2px_0_rgba(0,0,0,0.12)]",
      "transition-[background-color,box-shadow,filter]",
      "hover:bg-amber-600 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.14)]",
      "active:bg-amber-700 active:shadow-[0_1px_2px_0_rgba(0,0,0,0.12)]",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
    )
  }
  return ""
}

export function SubmitButton({
  children = "Enregistrer",
  className,
  intent = "default",
}: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className={cn(resolveIntentClassName(intent), className)}
    >
      {pending ? "Enregistrement..." : children}
    </Button>
  )
}
