'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { ModelWithStats } from '@/types/models'

interface StatsTableProps {
  models: ModelWithStats[]
  onDelete: (id: string) => void
}

export default function StatsTable({ models, onDelete }: StatsTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return
    setDeletingId(id)
    try {
      const res = await fetch(`/api/models/${id}`, { method: 'DELETE' })
      if (res.ok) onDelete(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (models.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-white/20 text-sm tracking-widest uppercase">No models yet</p>
        <Link href="/admin/models/new" className="text-white/50 text-sm hover:text-white underline">
          Add your first model
        </Link>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-white/40 text-xs uppercase tracking-widest border-b border-white/10">
            <th className="text-left py-3 pr-6">Model</th>
            <th className="text-right py-3 px-4">Views</th>
            <th className="text-right py-3 px-4">Clicks</th>
            <th className="text-right py-3 px-4">CTR</th>
            <th className="text-right py-3 px-4">Avg Time</th>
            <th className="text-right py-3 pl-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((model) => (
            <tr key={model.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="py-4 pr-6 font-medium">{model.name}</td>
              <td className="py-4 px-4 text-right text-white/60">{model.stats?.impressions ?? 0}</td>
              <td className="py-4 px-4 text-right text-white/60">{model.stats?.clicks ?? 0}</td>
              <td className="py-4 px-4 text-right text-white/60">
                {model.stats ? `${(model.stats.ctr * 100).toFixed(1)}%` : '—'}
              </td>
              <td className="py-4 px-4 text-right text-white/60">
                {model.stats ? `${Math.round(model.stats.avg_time_spent)}s` : '—'}
              </td>
              <td className="py-4 pl-4 text-right space-x-4">
                <Link href={`/admin/models/${model.id}`} className="text-white/40 hover:text-white transition-colors">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(model.id, model.name)}
                  disabled={deletingId === model.id}
                  className="text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30"
                >
                  {deletingId === model.id ? '…' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
