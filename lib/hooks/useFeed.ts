'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { trackView, trackTimeSpent } from '@/lib/analytics'
import type { Model } from '@/types/models'

export function useFeed(models: Model[]) {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const entryTimeRef = useRef<Record<string, number>>({})

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-model-id]')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).dataset.modelId!
          const index = models.findIndex((m) => m.id === id)

          if (entry.isIntersecting) {
            setActiveIndex(index)
            trackView(id)
            entryTimeRef.current[id] = Date.now()
          } else {
            if (entryTimeRef.current[id]) {
              const seconds = Math.round((Date.now() - entryTimeRef.current[id]) / 1000)
              trackTimeSpent(id, seconds)
              delete entryTimeRef.current[id]
            }
          }
        })
      },
      {
        root: container,
        threshold: 0.6,
      }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [models])

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return
    const cards = container.querySelectorAll('[data-model-id]')
    cards[index]?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return { activeIndex, containerRef, scrollToIndex }
}
