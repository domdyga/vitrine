import Link from 'next/link'

async function getStats() {
  try {
    const { getSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await getSupabaseServerClient()

    const [modelsResult, analyticsResult] = await Promise.all([
      supabase.from('models').select('id', { count: 'exact', head: true }),
      supabase.from('analytics').select('type'),
    ])

    const analytics = (analyticsResult.data ?? []) as Array<{ type: string }>
    return {
      totalModels: modelsResult.count ?? 0,
      totalViews: analytics.filter((a) => a.type === 'view').length,
      totalClicks: analytics.filter((a) => a.type === 'click').length,
    }
  } catch {
    return { totalModels: 0, totalViews: 0, totalClicks: 0 }
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    { label: 'Models', value: stats.totalModels },
    { label: 'Total Views', value: stats.totalViews },
    { label: 'Total Clicks', value: stats.totalClicks },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/models/new"
          className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-xl tracking-widest uppercase hover:bg-white/90 transition-colors"
        >
          + Add Model
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white/5 rounded-2xl p-6">
            <p className="text-white/40 text-xs uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-light mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-6">
        <Link href="/admin/models" className="text-sm text-white/50 hover:text-white transition-colors">
          View all models →
        </Link>
      </div>
    </div>
  )
}
