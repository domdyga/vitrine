export type AnalyticsType = 'view' | 'click' | 'time'

export interface AnalyticsEvent {
  id: string
  model_id: string
  type: AnalyticsType
  value: number | null
  created_at: string
}
