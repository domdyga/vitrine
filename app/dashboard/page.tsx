import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase/server'
import DashboardClient from './DashboardClient'

async function getModelFromToken(): Promise<{ id: string; name: string; city: string; country: string; age: number; height: string | null; bio: string | null; cover_image: string; model_username: string | null } | null> {
  const cookieStore = await cookies()
  const modelToken = cookieStore.get('model_token')?.value
  if (!modelToken) return null

  const dotIndex = modelToken.indexOf('.')
  if (dotIndex === -1) return null
  const modelId = modelToken.substring(0, dotIndex)
  const tokenHash = modelToken.substring(dotIndex + 1)
  if (!modelId || tokenHash.length !== 64) return null

  const supabase = getSupabaseServiceClient()
  const { data: model, error } = await supabase
    .from('models')
    .select('id, name, city, country, age, height, bio, cover_image, model_username, model_password_hash')
    .eq('id', modelId)
    .single()

  if (error || !model || !model.model_password_hash) return null

  // Validate token
  const encoder = new TextEncoder()
  const tokenData = encoder.encode(`${model.id}:${model.model_password_hash}`)
  const hashBuffer = await crypto.subtle.digest('SHA-256', tokenData)
  const expected = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  if (expected !== tokenHash) return null

  return model
}

export default async function DashboardPage() {
  const model = await getModelFromToken()
  if (!model) redirect('/login')

  return <DashboardClient model={model} />
}
