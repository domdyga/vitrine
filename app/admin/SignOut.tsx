'use client'

import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminSignOut() {
  const router = useRouter()

  async function handleSignOut() {
    // Clear Supabase session if active
    const supabase = getSupabaseBrowserClient()
    if (supabase) await supabase.auth.signOut()

    // Clear env-var admin token cookie
    await fetch('/api/admin/logout', { method: 'POST' })

    router.push('/admin/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      className="text-sm text-white/30 hover:text-white/60 transition-colors"
    >
      Déconnexion
    </button>
  )
}
