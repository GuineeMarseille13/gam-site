"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { IconAlertCircle, IconInfoCircle } from "@tabler/icons-react"

import { cn } from "@/helpers/utils"

type AlertVariant = "error" | "info"

interface AlertConfig {
  message: string
  variant: AlertVariant
}

function resolveAlert(searchParams: URLSearchParams): AlertConfig | null {
  const error = searchParams.get("error")
  const info = searchParams.get("info")

  if (error === "forbidden") {
    return {
      variant: "error",
      message: "Vous n’avez pas les droits pour accéder à cette page.",
    }
  }

  if (error === "unauthorized") {
    return {
      variant: "error",
      message: "Accès refusé à cet espace avec votre compte.",
    }
  }

  if (info === "wrong_dashboard") {
    return {
      variant: "info",
      message: "Vous avez été redirigé vers l’espace correspondant à votre rôle.",
    }
  }

  return null
}

function DashboardAccessAlertInner({ className }: { className?: string }) {
  const searchParams = useSearchParams()
  const alert = resolveAlert(searchParams)

  if (!alert) return null

  const isError = alert.variant === "error"
  const Icon = isError ? IconAlertCircle : IconInfoCircle

  return (
    <div
      role="alert"
      className={cn(
        "mx-4 mt-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm md:mx-6 lg:mx-8",
        isError
          ? "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-800/40 dark:bg-rose-950/30 dark:text-rose-300"
          : "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/40 dark:bg-sky-950/30 dark:text-sky-200",
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <p>{alert.message}</p>
    </div>
  )
}

interface DashboardAccessAlertProps {
  className?: string
}

/** Bandeau d’alerte (accès refusé / redirection) lu depuis les query params. */
export function DashboardAccessAlert({ className }: DashboardAccessAlertProps) {
  return (
    <Suspense fallback={null}>
      <DashboardAccessAlertInner className={className} />
    </Suspense>
  )
}
