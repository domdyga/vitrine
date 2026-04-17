'use client'

import { motion } from 'framer-motion'
import ImageGallery from './ImageGallery'
import type { Model } from '@/types/models'

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
}

interface ProfileModalProps {
  model: Model
  onClose: () => void
}

export default function ProfileModal({ model, onClose }: ProfileModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-lg max-h-[90dvh] overflow-y-auto bg-zinc-950 rounded-t-3xl sm:rounded-3xl"
        variants={panelVariants}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.3 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose()
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Image gallery */}
        <ImageGallery images={model.images.length ? model.images : [model.cover_image]} name={model.name} />

        {/* Info */}
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-3xl font-bold">{model.name}</h2>
            <p className="text-white/50 text-sm mt-1 tracking-widest uppercase">
              {model.city}, {model.country}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-2xl p-4">
              <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Age</p>
              <p className="text-2xl font-light">{model.age}</p>
            </div>
            {model.height && (
              <div className="bg-white/5 rounded-2xl p-4">
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Height</p>
                <p className="text-2xl font-light">{model.height}</p>
              </div>
            )}
          </div>

          <button
            className="w-full py-4 bg-white text-black font-semibold rounded-2xl text-sm tracking-widest uppercase hover:bg-white/90 active:scale-[0.98] transition-all"
            onClick={() => alert('Contact feature coming soon')}
          >
            Contact
          </button>
        </div>

        {/* Safe area bottom padding */}
        <div className="h-4" />
      </motion.div>
    </motion.div>
  )
}
