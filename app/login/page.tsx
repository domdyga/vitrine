'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

type Role = 'admin' | 'model'
type Phase = 'select' | 'form'

const slideVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

export default function LoginPage() {
  const [phase, setPhase] = useState<Phase>('select')
  const [role, setRole] = useState<Role>('admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function selectRole(r: Role) {
    setRole(r)
    setError(null)
    setPhase('form')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setError('Supabase non configuré. Ajoutez les variables d\'environnement.')
      setLoading(false)
      return
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : authError.message)
      setLoading(false)
      return
    }

    // Redirect based on user_metadata.role, fallback to chosen role
    const metaRole = data.user?.user_metadata?.role as string | undefined
    if (metaRole === 'admin' || (!metaRole && role === 'admin')) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
    router.refresh()
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/20'

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center px-6">
      {/* Back to feed */}
      <motion.div
        className="fixed top-4 left-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <span>←</span>
          <span className="tracking-widest uppercase text-xs">Feed</span>
        </Link>
      </motion.div>

      {/* Logo */}
      <motion.div
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">Vitrine</h1>
        <p className="text-white/30 text-xs tracking-widest uppercase mt-2">Accès sécurisé</p>
      </motion.div>

      {/* Phase container */}
      <div className="w-full max-w-sm overflow-hidden">
        <AnimatePresence mode="wait">
          {phase === 'select' ? (
            <motion.div
              key="select"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              <p className="text-white/50 text-sm text-center mb-6">
                Choisissez votre type de compte
              </p>

              {/* Role cards */}
              <button
                onClick={() => selectRole('admin')}
                className="w-full group p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-lg">Admin</p>
                    <p className="text-white/40 text-xs mt-1 tracking-wide">
                      Gestion des profils et statistiques
                    </p>
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 transition-colors text-xl">→</span>
                </div>
              </button>

              <button
                onClick={() => selectRole('model')}
                className="w-full group p-6 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-white/20 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-lg">Mannequin</p>
                    <p className="text-white/40 text-xs mt-1 tracking-wide">
                      Accès à votre espace personnel
                    </p>
                  </div>
                  <span className="text-white/20 group-hover:text-white/60 transition-colors text-xl">→</span>
                </div>
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="space-y-4"
            >
              {/* Role badge + back */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => { setPhase('select'); setError(null) }}
                  className="text-white/40 hover:text-white text-sm transition-colors"
                >
                  ← Retour
                </button>
                <span className="px-3 py-1 rounded-full bg-white/10 text-white/70 text-xs tracking-widest uppercase">
                  {role === 'admin' ? 'Admin' : 'Mannequin'}
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  required
                  autoFocus
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  required
                />

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-white text-black font-semibold rounded-xl text-sm tracking-widest uppercase disabled:opacity-50 hover:bg-white/90 transition-colors mt-2"
                >
                  {loading ? 'Connexion…' : 'Se connecter'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
