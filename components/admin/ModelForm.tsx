'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Model } from '@/types/models'

interface ModelFormProps {
  model?: Model
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export default function ModelForm({ model }: ModelFormProps) {
  const isEditing = !!model
  const router = useRouter()

  const [name, setName] = useState(model?.name ?? '')
  const [age, setAge] = useState(model?.age.toString() ?? '')
  const [city, setCity] = useState(model?.city ?? '')
  const [country, setCountry] = useState(model?.country ?? '')
  const [height, setHeight] = useState(model?.height ?? '')
  const [bio, setBio] = useState(model?.bio ?? '')
  const [coverImage, setCoverImage] = useState(model?.cover_image ?? '')
  const [galleryImages, setGalleryImages] = useState<string[]>(model?.images ?? [])
  const [modelUsername, setModelUsername] = useState(model?.model_username ?? '')
  const [modelPassword, setModelPassword] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadImage(file: File): Promise<string> {
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Upload échoué')
    return data.url as string
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      setCoverImage(await uploadImage(file))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload échoué')
    } finally {
      setUploading(false)
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    setError(null)
    try {
      const urls = await Promise.all(files.map(uploadImage))
      setGalleryImages((prev) => [...prev, ...urls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload échoué')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!coverImage) { setError('Image de couverture requise'); return }
    setSaving(true)
    setError(null)

    // Hash du nouveau mot de passe si fourni
    let passwordHash = model?.model_password_hash ?? null
    if (modelPassword) {
      passwordHash = await hashPassword(modelPassword)
    }

    const payload = {
      name,
      age: parseInt(age),
      city,
      country,
      height: height || null,
      bio: bio || null,
      cover_image: coverImage,
      images: galleryImages.length ? galleryImages : [coverImage],
      model_username: modelUsername || null,
      model_password_hash: passwordHash,
    }

    try {
      const url = isEditing ? `/api/models/${model!.id}` : '/api/models'
      const method = isEditing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Échec de la sauvegarde')
      }
      router.push('/admin/models')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/20'
  const labelClass = 'text-xs uppercase tracking-widest text-white/40 block mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {/* Infos de base */}
      <div>
        <label className={labelClass}>Nom</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Âge</label>
          <input type="number" min="16" max="80" value={age} onChange={(e) => setAge(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Taille (optionnel)</label>
          <input type="text" placeholder="ex. 178cm" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Ville</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Pays</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required className={inputClass} />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className={labelClass}>Description / Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Quelques mots sur le mannequin…"
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Cover image */}
      <div>
        <label className={labelClass}>Image de couverture</label>
        <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading}
          className="text-sm text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:bg-white/10 file:text-white file:border-0 file:text-xs file:uppercase file:tracking-widest file:cursor-pointer" />
        {coverImage && <p className="text-xs text-green-400 mt-2">✓ Couverture uploadée</p>}
      </div>

      {/* Galerie */}
      <div>
        <label className={labelClass}>Galerie ({galleryImages.length} photos)</label>
        <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} disabled={uploading}
          className="text-sm text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:bg-white/10 file:text-white file:border-0 file:text-xs file:uppercase file:tracking-widest file:cursor-pointer" />
        {galleryImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg opacity-80" />
                <button type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploading && <p className="text-white/40 text-sm">Envoi en cours…</p>}

      {/* Séparateur — accès mannequin */}
      <div className="border-t border-white/10 pt-6">
        <p className="text-xs uppercase tracking-widest text-white/40 mb-4">Accès mannequin</p>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Nom d'utilisateur</label>
            <input type="text" value={modelUsername} onChange={(e) => setModelUsername(e.target.value)}
              placeholder="ex. sofia.laurent" autoComplete="off" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>
              {isEditing ? 'Nouveau mot de passe (laisser vide = inchangé)' : 'Mot de passe'}
            </label>
            <input type="password" value={modelPassword} onChange={(e) => setModelPassword(e.target.value)}
              placeholder={isEditing ? '••••••••' : 'Mot de passe du mannequin'}
              autoComplete="new-password" className={inputClass} />
          </div>
          {modelUsername && (
            <p className="text-white/30 text-xs">
              Ce mannequin pourra se connecter sur la page /login avec ces identifiants.
            </p>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading}
          className="flex-1 py-3 bg-white text-black font-semibold rounded-xl text-sm tracking-widest uppercase disabled:opacity-50 hover:bg-white/90 transition-colors">
          {saving ? 'Sauvegarde…' : isEditing ? 'Mettre à jour' : 'Créer le profil'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="px-6 py-3 bg-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors">
          Annuler
        </button>
      </div>
    </form>
  )
}
