import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    // Vérifier le cookie admin
    const adminToken = req.cookies.get('admin_token')?.value
    if (!adminToken) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    const { getSupabaseServiceClient } = await import('@/lib/supabase/server')
    const supabase = getSupabaseServiceClient()

    const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const buffer = await file.arrayBuffer()

    const { error, data } = await supabase.storage
      .from('model-images')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    const { data: urlData } = supabase.storage
      .from('model-images')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Upload échoué'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
