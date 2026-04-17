function post(body: Record<string, unknown>): void {
  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Analytics must never crash the app
  })
}

export function trackView(profileId: string): void {
  post({ profileId, type: 'view' })
}

export function trackClick(profileId: string): void {
  post({ profileId, type: 'click' })
}

export function trackTimeSpent(profileId: string, seconds: number): void {
  if (seconds < 1) return
  post({ profileId, type: 'time', value: seconds })
}
