"use client"

import * as React from "react"
import { cn } from "@/helpers/utils"

/** Timings — affichage lisible, morph assez long pour l'effet bloom gooey */
export const GOOEY_TEXT_DEFAULTS = {
  morphTime: 1.2,
  cooldownTime: 2.5,
} as const

const GOOEY_BLUR_INTENSITY = 8

interface GooeyTextProps {
  texts: string[]
  morphTime?: number
  cooldownTime?: number
  className?: string
  textClassName?: string
}

function setMorphStyles(
  text1: HTMLSpanElement,
  text2: HTMLSpanElement,
  fraction: number,
) {
  const clamped = Math.min(Math.max(fraction, 0), 1)

  text2.style.filter = `blur(${Math.min(GOOEY_BLUR_INTENSITY / clamped - GOOEY_BLUR_INTENSITY, 100)}px)`
  text2.style.opacity = `${Math.pow(clamped, 0.4) * 100}%`

  const inverse = 1 - clamped
  text1.style.filter = `blur(${Math.min(GOOEY_BLUR_INTENSITY / inverse - GOOEY_BLUR_INTENSITY, 100)}px)`
  text1.style.opacity = `${Math.pow(inverse, 0.4) * 100}%`
}

function setDisplayStyles(text1: HTMLSpanElement, text2: HTMLSpanElement) {
  text2.style.filter = ""
  text2.style.opacity = "100%"
  text1.style.filter = ""
  text1.style.opacity = "0%"
}

/**
 * Composant: GooeyText
 * Rôle: Rotation de mots avec effet gooey bloom (filtre SVG threshold + blur croisé)
 */
export function GooeyText({
  texts,
  morphTime = GOOEY_TEXT_DEFAULTS.morphTime,
  cooldownTime = GOOEY_TEXT_DEFAULTS.cooldownTime,
  className,
  textClassName,
}: GooeyTextProps) {
  const filterId = React.useId().replace(/:/g, "")
  const text1Ref = React.useRef<HTMLSpanElement>(null)
  const text2Ref = React.useRef<HTMLSpanElement>(null)
  const textsRef = React.useRef(texts)
  textsRef.current = texts

  const textsKey = texts.join("\0")

  React.useEffect(() => {
    const items = textsRef.current
    if (items.length === 0) return

    const text1 = text1Ref.current
    const text2 = text2Ref.current
    if (!text1 || !text2) return

    if (items.length === 1) {
      text1.textContent = items[0] ?? ""
      text2.textContent = items[0] ?? ""
      text2.style.opacity = "100%"
      return
    }

    let textIndex = items.length - 1
    let morph = 0
    let cooldown = cooldownTime
    let lastTime = performance.now()
    let frameId = 0
    let isActive = true

    const doCooldown = () => {
      morph = 0
      setDisplayStyles(text1, text2)
    }

    const doMorph = () => {
      morph -= cooldown
      cooldown = 0

      let fraction = morph / morphTime
      if (fraction > 1) {
        cooldown = cooldownTime
        fraction = 1
      }

      setMorphStyles(text1, text2, fraction)
    }

    const animate = (now: number) => {
      if (!isActive) return

      const shouldIncrementIndex = cooldown > 0
      const dt = (now - lastTime) / 1000
      lastTime = now

      cooldown -= dt

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % items.length
          text1.textContent = items[textIndex % items.length] ?? ""
          text2.textContent = items[(textIndex + 1) % items.length] ?? ""
        }
        doMorph()
      } else {
        doCooldown()
      }

      frameId = requestAnimationFrame(animate)
    }

    frameId = requestAnimationFrame(animate)

    return () => {
      isActive = false
      cancelAnimationFrame(frameId)
    }
  }, [textsKey, morphTime, cooldownTime])

  return (
    <div className={cn("relative", className)} aria-live="polite" aria-atomic="true">
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="flex items-center justify-center"
        style={{ filter: `url(#${filterId})` }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inline-block select-none text-center",
            "text-foreground",
            textClassName,
          )}
        />
        <span
          ref={text2Ref}
          className={cn(
            "absolute inline-block select-none text-center",
            "text-foreground",
            textClassName,
          )}
        />
      </div>
    </div>
  )
}
