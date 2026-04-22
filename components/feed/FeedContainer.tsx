'use client'

import { useState, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useFeed } from '@/lib/hooks/useFeed'
import { useProfileModal } from '@/lib/hooks/useProfileModal'
import { trackClick } from '@/lib/analytics'
import FeedCard from './FeedCard'
import LoginButton from './LoginButton'
import SearchFilter, { type Filters } from './SearchFilter'
import ProfileModal from '@/components/profile/ProfileModal'
import type { Model } from '@/types/models'

interface FeedContainerProps {
  models: Model[]
}

export default function FeedContainer({ models }: FeedContainerProps) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({ city: '', ageMin: '', ageMax: '' })

  const cities = useMemo(
    () => Array.from(new Set(models.map((m) => m.city))).sort(),
    [models]
  )

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (filters.city && !m.city.toLowerCase().includes(filters.city.toLowerCase())) return false
      if (filters.ageMin && m.age < parseInt(filters.ageMin)) return false
      if (filters.ageMax && m.age > parseInt(filters.ageMax)) return false
      return true
    })
  }, [models, filters])

  const { activeIndex, containerRef } = useFeed(filtered)
  const { selectedModel, open, close } = useProfileModal()

  const hasFilters = filters.city || filters.ageMin || filters.ageMax

  const handleCardClick = (model: Model) => {
    trackClick(model.id)
    open(model)
  }

  if (models.length === 0) {
    return (
      <div className="flex items-center justify-center h-dvh bg-black">
        <div className="text-center space-y-3">
          <p className="text-white/20 text-xs tracking-widest uppercase">Aucun modèle</p>
          <a href="/admin/models/new" className="text-white/40 text-xs underline">
            Ajouter depuis l'admin
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <LoginButton />

      {/* Search button — top left */}
      <motion.button
        onClick={() => setFilterOpen((v) => !v)}
        className="fixed top-4 left-4 z-30 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-colors"
        style={{
          background: hasFilters ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          border: hasFilters ? '1px solid rgba(255,255,255,0.35)' : '1px solid rgba(255,255,255,0.15)',
          color: hasFilters ? '#fff' : 'rgba(255,255,255,0.6)',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        Recherche
        {hasFilters && (
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        )}
      </motion.button>

      {/* Filter panel */}
      <SearchFilter
        open={filterOpen}
        filters={filters}
        cities={cities}
        onChange={setFilters}
        onClose={() => setFilterOpen(false)}
        resultCount={filtered.length}
      />

      {/* Feed */}
      {filtered.length === 0 ? (
        <div className="flex items-center justify-center h-dvh bg-zinc-950">
          <div className="text-center space-y-3">
            <p className="text-white/20 text-xs tracking-widest uppercase">Aucun résultat</p>
            <button
              onClick={() => setFilters({ city: '', ageMin: '', ageMax: '' })}
              className="text-white/40 text-xs underline"
            >
              Effacer les filtres
            </button>
          </div>
        </div>
      ) : (
        <div ref={containerRef} className="feed-container">
          {filtered.map((model, index) => (
            <FeedCard
              key={model.id}
              model={model}
              isActive={index === activeIndex}
              onClick={() => handleCardClick(model)}
              priority={index === 0}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selectedModel && (
          <ProfileModal model={selectedModel} onClose={close} />
        )}
      </AnimatePresence>
    </>
  )
}
