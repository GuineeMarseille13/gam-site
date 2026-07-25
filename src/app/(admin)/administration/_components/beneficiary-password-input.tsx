"use client"

import { useCallback, useState } from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/helpers/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { beneficiarySuiviInputClassName } from "./beneficiary-suivi-form-classes"

interface BeneficiaryPasswordInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  error?: boolean
  autoComplete?: string
  className?: string
}

/**
 * Champ mot de passe avec bascule afficher / masquer (évite les erreurs de saisie).
 */
export function BeneficiaryPasswordInput({
  id,
  value,
  onChange,
  disabled = false,
  error = false,
  autoComplete = "new-password",
  className,
}: BeneficiaryPasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleToggle = useCallback(() => {
    setIsVisible((prev) => !prev)
  }, [])

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <Input
        id={id}
        type={isVisible ? "text" : "password"}
        autoComplete={autoComplete}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        className={cn(
          beneficiarySuiviInputClassName,
          "w-full min-w-0 pr-10",
          error && "border-destructive",
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={disabled}
        onClick={handleToggle}
        aria-label={isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        aria-pressed={isVisible}
        className={cn(
          "absolute top-1/2 right-1 size-8 -translate-y-1/2",
          "text-sky-700/80 hover:bg-sky-100/80 hover:text-sky-950",
          "dark:text-sky-300 dark:hover:bg-sky-950/50 dark:hover:text-sky-50",
        )}
      >
        {isVisible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </Button>
    </div>
  )
}
