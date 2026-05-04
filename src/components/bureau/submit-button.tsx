"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/helpers/utils"

interface SubmitButtonProps {
  children?: React.ReactNode
  className?: string
}

export function SubmitButton({ children = "Enregistrer", className }: SubmitButtonProps) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className={cn(className)}>
      {pending ? "Enregistrement..." : children}
    </Button>
  )
}
