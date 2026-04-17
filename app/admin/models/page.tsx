'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import StatsTable from '@/components/admin/StatsTable'
import type { ModelWithStats } from '@/types/models'

export default function AdminModelsPage() {
  const [models, setModels] = useState<ModelWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [modelsRes, statsRes] = await Promise.all([
          fetch('/api/models'),
          fetch('/api/models/stats').catch(() => ({ ok: false, json: async () => [] })),
        ])
        const modelsData = await modelsRes.json()
        const statsData = statsRes.ok ? await (statsRes as Response).json() : []

        const withStats = modelsData.map((m: ModelWithStats) => ({
          ...m,
          stats: Array.isArray(statsData) ? statsData.find((s: { model_id: string }) => s.model_id === m.id) : undefined,
        }))
        setModels(withStats)
      } catch {
        setModels([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Models</h1>
        <Link
          href="/admin/models/new"
          className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-xl tracking-widest uppercase hover:bg-white/90 transition-colors"
        >
          + Add Model
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-14 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <StatsTable
          models={models}
          onDelete={(id) => setModels((prev) => prev.filter((m) => m.id !== id))}
        />
      )}
    </div>
  )
}
