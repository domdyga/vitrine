'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      router.push('/login')
      return
    }

    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
      }
      setLoading(false)
    })
  }, [router])

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-white/10 rounded-lg" />
        <div className="h-4 w-64 bg-white/5 rounded" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Bienvenue</p>
        <h1 className="text-3xl font-bold">{user?.user_metadata?.name ?? 'Mon espace'}</h1>
        <p className="text-white/40 text-sm mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Statut</p>
          <p className="text-lg font-light capitalize">
            {user?.user_metadata?.role ?? 'Mannequin'}
          </p>
        </div>
        <div className="bg-white/5 rounded-2xl p-6">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Compte créé</p>
          <p className="text-lg font-light">
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('fr-FR')
              : '—'}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 space-y-3">
        <p className="text-white/20 text-xs tracking-widest uppercase">Fonctionnalités à venir</p>
        {['Modifier mon profil', 'Voir mes statistiques', 'Gérer ma galerie'].map((item) => (
          <div key={item} className="flex items-center gap-3 text-white/20 text-sm">
            <span className="w-1 h-1 rounded-full bg-white/20" />
            {item}
          </div>
        ))}
      </div>

      <button
        onClick={handleSignOut}
        className="text-sm text-white/30 hover:text-white/60 transition-colors underline"
      >
        Se déconnecter
      </button>
    </div>
  )
}
