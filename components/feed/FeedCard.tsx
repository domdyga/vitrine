'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Model } from '@/types/models'

interface FeedCardProps {
  model: Model
  isActive: boolean
  onClick: () => void
  priority?: boolean
}

export default function FeedCard({ model, isActive, onClick, priority = false }: FeedCardProps) {
  return (
    <div
      className="feed-card cursor-pointer"
      data-model-id={model.id}
      onClick={onClick}
    >
      {/* Fullscreen cover image */}
      <Image
        src={model.cover_image}
        alt={model.name}
        fill
        className="object-cover"
        priority={priority}
        sizes="100vw"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />

      {/* Text overlay */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 p-8 pb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
      >
        <h1 className="text-5xl font-bold tracking-tight leading-none mb-3">
          {model.name}
        </h1>
        <div className="flex items-center gap-3 text-white/70 text-sm font-light tracking-widest uppercase">
          <span>{model.city}, {model.country}</span>
          <span className="w-1 h-1 rounded-full bg-white/40" />
          <span>{model.age}</span>
        </div>
        <p className="mt-6 text-white/30 text-xs tracking-widest uppercase">
          Tap to view profile
        </p>
      </motion.div>
    </div>
  )
}
