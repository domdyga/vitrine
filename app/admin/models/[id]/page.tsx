import { notFound } from 'next/navigation'
import ModelForm from '@/components/admin/ModelForm'
import type { Model } from '@/types/models'

async function getModel(id: string): Promise<Model | null> {
  try {
    const { getSupabaseServerClient } = await import('@/lib/supabase/server')
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase.from('models').select('*').eq('id', id).single()
    if (error) return null
    return data as Model
  } catch {
    return null
  }
}

export default async function EditModelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const model = await getModel(id)

  if (!model) notFound()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Model</h1>
      <ModelForm model={model} />
    </div>
  )
}
