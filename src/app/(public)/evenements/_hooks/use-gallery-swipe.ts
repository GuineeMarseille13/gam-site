import { useCallback, useRef, type TouchEvent } from "react"

const SWIPE_THRESHOLD_PX = 48

interface UseGallerySwipeOptions {
  enabled: boolean
  onPrev: () => void
  onNext: () => void
  onTap?: () => void
}

/**
 * Swipe horizontal sur la zone principale de la galerie (mobile).
 */
export function useGallerySwipe({
  enabled,
  onPrev,
  onNext,
  onTap,
}: UseGallerySwipeOptions) {
  const touchStartX = useRef(0)

  const handleTouchStart = useCallback((event: TouchEvent) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? 0
  }, [])

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      const endX = event.changedTouches[0]?.clientX ?? 0
      const diff = touchStartX.current - endX

      if (Math.abs(diff) < SWIPE_THRESHOLD_PX) {
        onTap?.()
        return
      }

      if (!enabled) return
      if (diff > 0) onNext()
      else onPrev()
    },
    [enabled, onNext, onPrev, onTap],
  )

  return { handleTouchStart, handleTouchEnd }
}
