'use client'

import type { ComponentProps } from 'react'
import { track } from '@vercel/analytics'

export function TrackedAnchor({
  event,
  onClick,
  ...props
}: ComponentProps<'a'> & { event: string }) {
  return (
    <a
      {...props}
      onClick={(clickEvent) => {
        track(event)
        onClick?.(clickEvent)
      }}
    />
  )
}
