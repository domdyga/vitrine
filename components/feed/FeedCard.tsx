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
      className="feed-card cursor-pointer flex flex-col items-center justify-center bg-black px-5 pt-6 pb-8 gap-5"
      data-model-id={model.id}
      onClick={onClick}
    >
      {/* Portrait photo frame */}
      <motion.div
        className="relative w-full rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxWidth: 480, aspectRatio: '3/4' }}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={isActive ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 0.97 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <Image
          src={model.cover_image}
          alt={model.name}
          fill
          className="object-cover object-top"
          priority={priority}
          sizes="(max-width: 480px) 100vw, 480px"
        />
        {/* Subtle bottom gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </motion.div>

      {/* Text below the frame */}
      <motion.div
        className="w-full text-center"
        style={{ maxWidth: 480 }}
        initial={{ opacity: 0, y: 10 }}
        animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
      >
        <h1 className="text-2xl font-bold tracking-tight leading-none">
          {model.name}
        </h1>
        <div className="flex items-center justify-center gap-2 text-white/50 text-xs font-light tracking-widest uppercase mt-2">
          <span>{model.city}, {model.country}</span>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>{model.age} ans</span>
        </div>
        <p className="mt-3 text-white/20 text-xs tracking-widest uppercase">
          Appuyer pour voir le profil
        </p>
      </motion.div>
    </div>
  )
}
