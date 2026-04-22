'use client'

import { motion, AnimatePresence } from 'framer-motion'

export interface Filters {
  city: string
  ageMin: string
  ageMax: string
}

interface SearchFilterProps {
  open: boolean
  filters: Filters
  cities: string[]
  onChange: (f: Filters) => void
  onClose: () => void
  resultCount: number
}

export default function SearchFilter({
  open,
  filters,
  cities,
  onChange,
  onClose,
  resultCount,
}: SearchFilterProps) {
  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/20'

  function clear() {
    onChange({ city: '', ageMin: '', ageMax: '' })
  }

  const hasFilters = filters.city || filters.ageMin || filters.ageMax

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-panel"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed top-16 left-4 right-4 z-40 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
        >
          <div className="space-y-3">
            {/* City */}
            <div>
              <label className="text-xs uppercase tracking-widest text-white/40 block mb-1.5">
                Ville
              </label>
              <input
                type="text"
                placeholder="ex. Paris, Milan…"
                value={filters.city}
                onChange={(e) => onChange({ ...filters, city: e.target.value })}
                className={inputClass}
                list="city-list"
                autoComplete="off"
              />
              <datalist id="city-list">
                {cities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Age range */}
            <div>
              <label className="text-xs uppercase tracking-widest text-white/40 block mb-1.5">
                Âge
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  min={16}
                  max={99}
                  value={filters.ageMin}
                  onChange={(e) => onChange({ ...filters, ageMin: e.target.value })}
                  className={inputClass}
                />
                <span className="text-white/30 shrink-0">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  min={16}
                  max={99}
                  value={filters.ageMax}
                  onChange={(e) => onChange({ ...filters, ageMax: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-white/30 text-xs">
                {resultCount} résultat{resultCount !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-3">
                {hasFilters && (
                  <button
                    onClick={clear}
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    Effacer
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-lg tracking-widest uppercase"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
