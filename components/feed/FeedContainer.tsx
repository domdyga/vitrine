'use client'

import { AnimatePresence } from 'framer-motion'
import { useFeed } from '@/lib/hooks/useFeed'
import { useProfileModal } from '@/lib/hooks/useProfileModal'
import { trackClick } from '@/lib/analytics'
import FeedCard from './FeedCard'
import LoginButton from './LoginButton'
import ProfileModal from '@/components/profile/ProfileModal'
import type { Model } from '@/types/models'

interface FeedContainerProps {
  models: Model[]
}

export default function FeedContainer({ models }: FeedContainerProps) {
  const { activeIndex, containerRef } = useFeed(models)
  const { selectedModel, open, close } = useProfileModal()

  const handleCardClick = (model: Model) => {
    trackClick(model.id)
    open(model)
  }

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-dvh bg-black">
        <div className="text-center space-y-3">
          <p className="text-white/20 text-xs tracking-widest uppercase">No models yet</p>
          <a href="/admin/models/new" className="text-white/40 text-xs underline">
            Add one in admin
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoginButton />
      <div ref={containerRef} className="feed-container">
        {models.map((model, index) => (
          <FeedCard
            key={model.id}
            model={model}
            isActive={index === activeIndex}
            onClick={() => handleCardClick(model)}
            priority={index === 0}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedModel && (
          <ProfileModal model={selectedModel} onClose={close} />
        )}
      </AnimatePresence>
    </>
  )
}
