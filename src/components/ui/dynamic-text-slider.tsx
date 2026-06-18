"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"

import { cn } from "@/helpers/utils"
import {
  getPageHeroSliderTheme,
  type PageHeroSliderVariant,
} from "@/config/page-hero-slider-theme"

const MIN_RANGE = 50
const ROTATION_DEG = -2.76
const THETA = ROTATION_DEG * (Math.PI / 180)
const COS_THETA = Math.cos(THETA)
const SIN_THETA = Math.sin(THETA)

const DEFAULT_TEXT_WIDTH = 408

const TITLE_TYPOGRAPHY =
  "font-bold tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl"

type SliderHandle = "left" | "right"

interface SliderChangePayload {
  left: number
  right: number
  range: number
}

interface DynamicTextSliderProps {
  readonly width: number
  readonly text: string
  readonly variant?: PageHeroSliderVariant
  readonly height?: number
  readonly handleSize?: number
  readonly className?: string
  readonly onChange?: (payload: SliderChangePayload) => void
}

interface DynamicTextSliderTitleProps {
  readonly text: string
  readonly variant?: PageHeroSliderVariant
  readonly className?: string
}

interface DragState {
  handle: SliderHandle
  startX: number
  startY: number
  initialLeft: number
  initialRight: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Slider à deux poignées incliné, avec texte révélé via clip-path.
 */
function DynamicTextSlider({
  width: initialWidth,
  text,
  variant,
  height = 70,
  handleSize = 28,
  className,
  onChange,
}: DynamicTextSliderProps) {
  const width = initialWidth > 0 ? initialWidth + 35 : 0
  const theme = getPageHeroSliderTheme(variant)

  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(width)
  const [draggingHandle, setDraggingHandle] = useState<SliderHandle | null>(null)
  const [dynamicRotation, setDynamicRotation] = useState(ROTATION_DEG)

  const leftRef = useRef(left)
  const rightRef = useRef(right)
  const dragRef = useRef<DragState | null>(null)

  useEffect(() => {
    leftRef.current = left
    rightRef.current = right
    onChange?.({ left, right, range: right - left })
  }, [left, right, onChange])

  useEffect(() => {
    if (width <= 0) return

    const handleMidpoint = (left + right) / 2
    const sliderCenter = width / 2
    const deviationFactor = (handleMidpoint - sliderCenter) / sliderCenter
    const maxAdditionalTilt = 3
    setDynamicRotation(ROTATION_DEG + deviationFactor * maxAdditionalTilt)
  }, [left, right, width])

  useEffect(() => {
    setRight(width)
  }, [width])

  const startDrag = useCallback((handle: SliderHandle, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      handle,
      startX: event.clientX,
      startY: event.clientY,
      initialLeft: leftRef.current,
      initialRight: rightRef.current,
    }
    setDraggingHandle(handle)
  }, [])

  const moveDrag = useCallback(
    (event: PointerEvent) => {
      if (!dragRef.current) return

      const { handle, startX, startY, initialLeft, initialRight } = dragRef.current
      const deltaX = event.clientX - startX
      const deltaY = event.clientY - startY
      const projected = deltaX * COS_THETA + deltaY * SIN_THETA

      if (handle === "left") {
        setLeft(clamp(initialLeft + projected, 0, rightRef.current - MIN_RANGE))
        return
      }

      setRight(clamp(initialRight + projected, leftRef.current + MIN_RANGE, width))
    },
    [width],
  )

  const endDrag = useCallback(() => {
    dragRef.current = null
    setDraggingHandle(null)
  }, [])

  useEffect(() => {
    window.addEventListener("pointermove", moveDrag)
    window.addEventListener("pointerup", endDrag)
    window.addEventListener("pointercancel", endDrag)

    return () => {
      window.removeEventListener("pointermove", moveDrag)
      window.removeEventListener("pointerup", endDrag)
      window.removeEventListener("pointercancel", endDrag)
    }
  }, [moveDrag, endDrag])

  const nudgeHandle = useCallback(
    (handle: SliderHandle) => (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return

      event.preventDefault()
      const delta = event.key === "ArrowLeft" ? -10 : 10

      if (handle === "left") {
        setLeft((previous) => clamp(previous + delta, 0, rightRef.current - MIN_RANGE))
        return
      }

      setRight((previous) => clamp(previous + delta, leftRef.current + MIN_RANGE, width))
    },
    [width],
  )

  const handles: SliderHandle[] = ["left", "right"]

  return (
    <div
      className={cn(
        "relative select-none transition-transform duration-300 ease-out",
        className,
      )}
      style={{ width, height, transform: `rotate(${dynamicRotation}deg)` }}
    >
      <div className={cn("pointer-events-none absolute inset-0 rounded-2xl border", theme.border)} />

      {handles.map((handle) => {
        const positionX = handle === "left" ? left : right - handleSize
        const scaleClass =
          draggingHandle === handle ? "scale-125" : "hover:scale-110"

        return (
          <button
            key={handle}
            type="button"
            aria-label={handle === "left" ? "Ajuster le début" : "Ajuster la fin"}
            onPointerDown={(event) => startDrag(handle, event)}
            onKeyDown={nudgeHandle(handle)}
            className={cn(
              "absolute top-0 z-20 flex h-full w-7 cursor-ew-resize items-center justify-center rounded-full",
              "border bg-card opacity-100 transition-transform duration-150 ease-in-out",
              "focus:outline-none focus:ring-2",
              theme.handleBorder,
              theme.handleRing,
              scaleClass,
            )}
            style={{ left: positionX, touchAction: "none" }}
          >
            <span className={cn("h-8 w-1 rounded-full", theme.handleBar)} />
          </button>
        )
      })}

      <div
        className={cn(
          "pointer-events-none z-10 flex h-full w-full items-center justify-center overflow-hidden px-4",
          TITLE_TYPOGRAPHY,
          theme.text,
        )}
        style={{ clipPath: `inset(0 ${width - right}px 0 ${left}px round 1rem)` }}
      >
        {text}
      </div>
    </div>
  )
}

/**
 * Titre interactif : texte complet révélé via le slider incliné.
 */
function DynamicTextSliderTitle({ text, variant, className }: DynamicTextSliderTitleProps) {
  const measureRef = useRef<HTMLSpanElement>(null)
  const [textWidth, setTextWidth] = useState(DEFAULT_TEXT_WIDTH)
  const theme = getPageHeroSliderTheme(variant)

  useEffect(() => {
    const measure = () => {
      setTextWidth(measureRef.current?.clientWidth ?? DEFAULT_TEXT_WIDTH)
    }

    measure()
    window.addEventListener("resize", measure)

    const resizeObserver = new ResizeObserver(measure)
    const element = measureRef.current
    if (element) resizeObserver.observe(element)

    return () => {
      window.removeEventListener("resize", measure)
      resizeObserver.disconnect()
    }
  }, [text])

  return (
    <div className={cn("flex justify-center text-center", className)}>
      <span
        ref={measureRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute -left-[9999px] whitespace-nowrap px-4",
          TITLE_TYPOGRAPHY,
          theme.text,
        )}
      >
        {text}
      </span>

      <DynamicTextSlider width={textWidth} text={text} variant={variant} />
    </div>
  )
}

export { DynamicTextSlider, DynamicTextSliderTitle }
