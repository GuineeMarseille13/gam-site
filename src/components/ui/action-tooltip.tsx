"use client"

import type { ReactNode } from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/helpers/utils"

type TooltipSide = "top" | "right" | "bottom" | "left"

interface ActionTooltipProps {
  readonly label: string
  readonly children: ReactNode
  readonly side?: TooltipSide
  readonly sideOffset?: number
  readonly className?: string
}

/**
 * Tooltip Radix pour actions (icône ou bouton) — à utiliser sous un TooltipProvider.
 */
export function ActionTooltip({
  label,
  children,
  side = "top",
  sideOffset = 6,
  className,
}: ActionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={sideOffset} className={cn(className)}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}
