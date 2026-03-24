"use client"

import * as React from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon, ClockIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  name: string
  label: string
  /** Date, ISO string (sérialisé depuis un Server Component), ou null */
  defaultValue?: Date | string | null
  required?: boolean
}

function toDate(v: Date | string | null | undefined): Date | undefined {
  if (v == null) return undefined
  return v instanceof Date ? v : new Date(v as string)
}

export function DateTimePicker({
  name,
  label,
  defaultValue,
  required,
}: DateTimePickerProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    () => toDate(defaultValue)
  )
  const [open, setOpen] = React.useState(false)

  const hours = date ? date.getHours() : 0
  const minutes = date ? date.getMinutes() : 0

  function handleDaySelect(day: Date | undefined) {
    if (!day) return
    const next = new Date(day)
    next.setHours(date?.getHours() ?? 0)
    next.setMinutes(date?.getMinutes() ?? 0)
    next.setSeconds(0)
    setDate(next)
  }

  function step(type: "hours" | "minutes", delta: number) {
    const next = new Date(date ?? new Date())
    if (type === "hours") {
      next.setHours((next.getHours() + delta + 24) % 24)
    } else {
      next.setMinutes((next.getMinutes() + delta + 60) % 60)
    }
    next.setSeconds(0)
    setDate(next)
  }

  // ISO string for the hidden input consumed by the Server Action
  const isoValue = date ? date.toISOString() : ""

  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && " *"}
      </Label>

      {/* Hidden input — lu par le Server Action */}
      <input type="hidden" name={name} value={isoValue} required={required} />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date
              ? format(date, "dd/MM/yyyy HH:mm", { locale: fr })
              : "Choisir une date et heure"}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDaySelect}
            locale={fr}
            captionLayout="dropdown"
            initialFocus
          />

          {/* Sélecteur d'heure */}
          <div className="border-t p-3 flex items-center gap-3">
            <ClockIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />

            <div className="flex items-center gap-1">
              {/* Heures */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => step("hours", 1)}
                  className="cursor-pointer p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(hours).padStart(2, "0")}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10)
                    if (isNaN(num)) return
                    const next = new Date(date ?? new Date())
                    next.setHours(Math.min(23, Math.max(0, num)))
                    next.setSeconds(0)
                    setDate(next)
                  }}
                  onFocus={(e) => e.target.select()}
                  className="tabular-nums text-sm font-medium w-8 text-center bg-transparent border-0 outline-none focus:bg-muted rounded"
                />
                <button
                  type="button"
                  onClick={() => step("hours", -1)}
                  className="cursor-pointer p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
              </div>

              <span className="text-muted-foreground font-medium pb-0.5">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => step("minutes", 1)}
                  className="cursor-pointer p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <ChevronUpIcon className="h-3.5 w-3.5" />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={String(minutes).padStart(2, "0")}
                  onChange={(e) => {
                    const num = parseInt(e.target.value, 10)
                    if (isNaN(num)) return
                    const next = new Date(date ?? new Date())
                    next.setMinutes(Math.min(59, Math.max(0, num)))
                    next.setSeconds(0)
                    setDate(next)
                  }}
                  onFocus={(e) => e.target.select()}
                  className="tabular-nums text-sm font-medium w-8 text-center bg-transparent border-0 outline-none focus:bg-muted rounded"
                />
                <button
                  type="button"
                  onClick={() => step("minutes", -1)}
                  className="cursor-pointer p-0.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              className="ml-auto"
              onClick={() => setOpen(false)}
            >
              Valider
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
