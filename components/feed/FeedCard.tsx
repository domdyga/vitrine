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

const BG_SYMBOLS = [
  { s: '🔞', x: 8,  y: 6,  size: 28, rot: -12, op: 0.18 },
  { s: '💋', x: 78, y: 4,  size: 34, rot: 10,  op: 0.14 },
  { s: '🌹', x: 88, y: 18, size: 26, rot: -6,  op: 0.16 },
  { s: '🔥', x: 4,  y: 22, size: 30, rot: 8,   op: 0.14 },
  { s: '✨', x: 60, y: 2,  size: 22, rot: 15,  op: 0.20 },
  { s: '💎', x: 92, y: 50, size: 24, rot: -10, op: 0.13 },
  { s: '🌹', x: 2,  y: 55, size: 22, rot: 12,  op: 0.12 },
  { s: '🔞', x: 72, y: 88, size: 26, rot: 6,   op: 0.16 },
  { s: '💋', x: 15, y: 82, size: 30, rot: -8,  op: 0.14 },
  { s: '🔥', x: 88, y: 76, size: 28, rot: -14, op: 0.13 },
  { s: '✨', x: 40, y: 92, size: 20, rot: 20,  op: 0.18 },
  { s: '💎', x: 50, y: 14, size: 20, rot: -5,  op: 0.12 },
]

export default function FeedCard({ model, isActive, onClick, priority = false }: FeedCardProps) {
  return (
    <div
      className="feed-card cursor-pointer flex flex-col items-center justify-center bg-zinc-950 px-5 pt-6 pb-8 gap-5 relative overflow-hidden"
      data-model-id={model.id}
      onClick={onClick}
    >
      {/* Decorative background symbols */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {BG_SYMBOLS.map((sym, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${sym.x}%`,
              top: `${sym.y}%`,
              fontSize: sym.size,
              opacity: sym.op,
              transform: `rotate(${sym.rot}deg)`,
              lineHeight: 1,
            }}
          >
            {sym.s}
          </span>
        ))}
      </div>
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
