'use client'

import { PROFILE } from '@/shared/profile'
import { Chatbot } from '@/app/components/ui/chatbot'

export function Hero() {
  return (
    <section
      id="chat"
      className="relative scroll-mt-20 overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-16"
    >
      <div className="pointer-events-none absolute inset-0 ambient-glow" aria-hidden />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="fade-up text-sm font-medium tracking-wide text-zinc-400">
          {PROFILE.role} · {PROFILE.tagline}
        </p>
        <h1 className="fade-up-delay-1 mt-3 text-4xl font-semibold tracking-tight text-zinc-50 sm:text-5xl">
          {PROFILE.name}
        </h1>
        <p className="fade-up-delay-2 mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
          {PROFILE.pitch}
        </p>

        <div className="fade-up-delay-2 mt-6 flex flex-wrap items-center justify-center gap-2">
          {[PROFILE.location, PROFILE.yearsExperience, PROFILE.openTo].map(
            (badge) => (
              <span
                key={badge}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-400"
              >
                {badge}
              </span>
            )
          )}
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-2xl fade-up-delay-2">
        <Chatbot />
      </div>
    </section>
  )
}
