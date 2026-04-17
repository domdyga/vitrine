import { MOCK_MODELS } from '@/lib/mock-data'
import FeedContainer from '@/components/feed/FeedContainer'
import type { Model } from '@/types/models'

async function getModels(): Promise<Model[]> {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!url || !key) return MOCK_MODELS

    const { getSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false })

    if (error || !data?.length) return MOCK_MODELS
    return data as Model[]
  } catch {
    return MOCK_MODELS
  }
}

export default async function FeedPage() {
  const models = await getModels()
  return <FeedContainer models={models} />
}
