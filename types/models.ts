export interface Model {
  id: string
  name: string
  age: number
  city: string
  country: string
  height: string | null
  cover_image: string
  images: string[]
  created_at: string
}

export interface ModelStats {
  model_id: string
  impressions: number
  clicks: number
  ctr: number
  avg_time_spent: number
}

export interface ModelWithStats extends Model {
  stats?: ModelStats
}
