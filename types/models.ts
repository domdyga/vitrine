export interface Model {
  id: string
  name: string
  age: number
  city: string
  country: string
  height: string | null
  bio: string | null
  cover_image: string
  images: string[]
  model_username: string | null
  model_password_hash: string | null
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
