'use client'

import { ArrowUpRight } from 'lucide-react'
import { PROFILE } from '@/shared/profile'

export function HeroActions() {
  const scrollToWork = () => {
    document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="fade-up-delay-2 mt-10 flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={scrollToWork}
        className="inline-flex h-11 items-center rounded-full bg-surface-100 px-6 text-sm font-medium text-surface-950 transition-colors hover:bg-cream"
      >
        View my work
      </button>
      <a
        href={PROFILE.socials.resume}
        download={PROFILE.socials.resumeDownloadName}
        className="inline-flex h-11 items-center gap-1.5 rounded-full border border-surface-700 px-6 text-sm text-surface-200 transition-colors hover:border-surface-500 hover:text-surface-50"
      >
        Resume
        <ArrowUpRight className="h-4 w-4" aria-hidden />
      </a>
    </div>
  )
}
