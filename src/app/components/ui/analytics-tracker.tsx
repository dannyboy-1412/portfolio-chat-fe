'use client'

import { useEffect } from 'react'
import { track } from '@vercel/analytics'

/**
 * Fires a single analytics event on mount. Renders nothing — lets server
 * components (e.g. project pages) trigger a client-only `track()` call.
 */
export function AnalyticsTracker({
  event,
  contextId,
}: {
  event: string
  contextId?: string
}) {
  useEffect(() => {
    track(event, contextId ? { contextId } : undefined)
  }, [event, contextId])

  return null
}
