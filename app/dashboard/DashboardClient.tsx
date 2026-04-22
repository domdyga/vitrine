'use client'

import { useRouter } from 'next/navigation'

interface ModelData {
  id: string
  name: string
  city: string
  country: string
  age: number
  height: string | null
  bio: string | null
  cover_image: string
  model_username: string | null
}

export default function DashboardClient({ model }: { model: ModelData }) {
  const router = useRouter()

  async function handleSignOut() {
    await fetch('/api/model/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Mon espace</p>
        <h1 className="text-3xl font-bold">{model.name}</h1>
        <p className="text-white/40 text-sm mt-1 tracking-widest uppercase">
          {model.city}, {model.country}
        </p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={model.cover_image}
        alt={model.name}
        className="w-full h-64 object-cover rounded-2xl"
      />

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Âge</p>
          <p className="text-2xl font-light">{model.age}</p>
        </div>
        {model.height && (
          <div className="bg-white/5 rounded-2xl p-4">
            <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Taille</p>
            <p className="text-2xl font-light">{model.height}</p>
          </div>
        )}
      </div>

      {model.bio && (
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">À propos</p>
          <p className="text-white/80 text-sm leading-relaxed">{model.bio}</p>
        </div>
      )}

      {model.model_username && (
        <div className="bg-white/5 rounded-2xl p-4">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Identifiant</p>
          <p className="text-sm font-mono text-white/70">{model.model_username}</p>
        </div>
      )}

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
