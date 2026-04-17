'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Model } from '@/types/models'

export function useProfileModal() {
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)

  const open = useCallback((model: Model) => {
    setSelectedModel(model)
  }, [])

  const close = useCallback(() => {
    setSelectedModel(null)
  }, [])

  useEffect(() => {
    if (selectedModel) {
      document.body.classList.add('modal-open')
    } else {
      document.body.classList.remove('modal-open')
    }
    return () => document.body.classList.remove('modal-open')
  }, [selectedModel])

  return { selectedModel, open, close }
}
