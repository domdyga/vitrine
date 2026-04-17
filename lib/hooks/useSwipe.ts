'use client'

import { useRef, useCallback } from 'react'

interface SwipeHandlers {
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipe({ onSwipeUp, onSwipeDown }: SwipeHandlers) {
  const startYRef = useRef<number | null>(null)
  const THRESHOLD = 50

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (startYRef.current === null) return
      const delta = startYRef.current - e.changedTouches[0].clientY
      if (Math.abs(delta) > THRESHOLD) {
        if (delta > 0) onSwipeUp?.()
        else onSwipeDown?.()
      }
      startYRef.current = null
    },
    [onSwipeUp, onSwipeDown]
  )

  return { onTouchStart, onTouchEnd }
}
