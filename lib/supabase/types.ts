export type Database = {
  public: {
    Tables: {
      models: {
        Row: {
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
        Insert: {
          id?: string
          name: string
          age: number
          city: string
          country: string
          height?: string | null
          bio?: string | null
          cover_image: string
          images: string[]
          model_username?: string | null
          model_password_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          age?: number
          city?: string
          country?: string
          height?: string | null
          bio?: string | null
          cover_image?: string
          images?: string[]
          model_username?: string | null
          model_password_hash?: string | null
          created_at?: string
        }
        Relationships: []
      }
      analytics: {
        Row: {
          id: string
          model_id: string
          type: 'view' | 'click' | 'time'
          value: number | null
          created_at: string
        }
        Insert: {
          id?: string
          model_id: string
          type: 'view' | 'click' | 'time'
          value?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          model_id?: string
          type?: 'view' | 'click' | 'time'
          value?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'analytics_model_id_fkey'
            columns: ['model_id']
            isOneToOne: false
            referencedRelation: 'models'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      model_stats: {
        Row: {
          model_id: string
          impressions: number
          clicks: number
          ctr: number
          avg_time_spent: number
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
  }
}
