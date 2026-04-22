'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Model } from '@/types/models'

interface ModelFormProps {
  model?: Model
}

export default function ModelForm({ model }: ModelFormProps) {
  const isEditing = !!model
  const router = useRouter()

  const [name, setName] = useState(model?.name ?? '')
  const [age, setAge] = useState(model?.age.toString() ?? '')
  const [city, setCity] = useState(model?.city ?? '')
  const [country, setCountry] = useState(model?.country ?? '')
  const [height, setHeight] = useState(model?.height ?? '')
  const [coverImage, setCoverImage] = useState(model?.cover_image ?? '')
  const [galleryImages, setGalleryImages] = useState<string[]>(model?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadImage(file: File): Promise<string> {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) throw new Error('Supabase not configured')

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { error: uploadError, data } = await supabase.storage
      .from('image du modèle')
      .upload(filename, file, { cacheControl: '3600', upsert: false })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('image du modèle')
      .getPublicUrl(data.path)

    return urlData.publicUrl
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const url = await uploadImage(file)
      setCoverImage(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
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
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!coverImage) {
      setError('Cover image is required')
      return
    }
    setSaving(true)
    setError(null)

    const payload = {
      name,
      age: parseInt(age),
      city,
      country,
      height: height || null,
      cover_image: coverImage,
      images: galleryImages.length ? galleryImages : [coverImage],
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
        throw new Error(data.error || 'Save failed')
      }

      router.push('/admin/models')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors placeholder:text-white/20'
  const labelClass = 'text-xs uppercase tracking-widest text-white/40 block mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      <div>
        <label className={labelClass}>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Age</label>
          <input type="number" min="16" max="80" value={age} onChange={(e) => setAge(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Height (optional)</label>
          <input type="text" placeholder="e.g. 178cm" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Country</label>
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required className={inputClass} />
        </div>
      </div>

      {/* Cover image */}
      <div>
        <label className={labelClass}>Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCoverUpload}
          disabled={uploading}
          className="text-sm text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:bg-white/10 file:text-white file:border-0 file:text-xs file:uppercase file:tracking-widest file:cursor-pointer"
        />
        {coverImage && (
          <p className="text-xs text-green-400 mt-2">✓ Cover uploaded</p>
        )}
      </div>

      {/* Gallery */}
      <div>
        <label className={labelClass}>
          Gallery images ({galleryImages.length} uploaded)
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryUpload}
          disabled={uploading}
          className="text-sm text-white/50 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:bg-white/10 file:text-white file:border-0 file:text-xs file:uppercase file:tracking-widest file:cursor-pointer"
        />
        {galleryImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {galleryImages.map((url, i) => (
              <div key={i} className="relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg opacity-80" />
                <button
                  type="button"
                  onClick={() => setGalleryImages((prev) => prev.filter((_, j) => j !== i))}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {uploading && (
        <p className="text-white/40 text-sm">Uploading…</p>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex-1 py-3 bg-white text-black font-semibold rounded-xl text-sm tracking-widest uppercase disabled:opacity-50 hover:bg-white/90 transition-colors"
        >
          {saving ? 'Saving…' : isEditing ? 'Update Model' : 'Create Model'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-white/10 rounded-xl text-sm text-white/60 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
