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

const SYMS = ['🔞', '💋', '🌹', '🔥', '✨', '💎']

// deterministic pseudo-random to avoid hydration mismatch
function sr(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

const COLS = 13
const ROWS = 24
const BG_SYMBOLS = Array.from({ length: COLS * ROWS }, (_, i) => {
  const col = i % COLS
  const row = Math.floor(i / COLS)
  return {
    s: SYMS[i % SYMS.length],
    // base grid position with small jitter
    x: (col / COLS) * 100 + (sr(i) - 0.5) * 5,
    y: (row / ROWS) * 100 + (sr(i + 500) - 0.5) * 3,
    size: 11 + sr(i + 200) * 4,
    rot: (sr(i + 400) - 0.5) * 30,
    op: 0.10 + sr(i + 600) * 0.08,
  }
})

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
