import dynamic from 'next/dynamic'
import { HeroActions } from '@/app/components/ui/hero-actions'
import { PROFILE } from '@/shared/profile'

const HeroTerminal = dynamic(
  () =>
    import('@/app/components/terminal/hero-terminal').then((mod) => mod.HeroTerminal),
  {
    loading: () => (
      <div
        className="h-40 rounded-2xl border border-surface-800 bg-surface-950/90"
        aria-hidden
      />
    ),
  }
)

export function Hero() {
  return (
    <section
      id="hero"
      className="relative scroll-mt-20 overflow-hidden px-4 pb-16 pt-12 sm:px-6 sm:pt-16"
    >
      <div className="pointer-events-none absolute inset-0 ambient-glow" aria-hidden />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="fade-up inline-flex items-center gap-2 rounded-full border border-surface-800 bg-surface-900/60 px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-glow" aria-hidden />
          {PROFILE.statusIndicator}
        </span>

        <h1 className="fade-up-delay-1 mt-5 text-4xl font-semibold tracking-tight text-surface-50 sm:text-5xl">
          {PROFILE.name}
        </h1>
        <p className="fade-up-delay-1 mt-2 font-mono text-sm uppercase tracking-[0.2em] text-surface-400">
          {PROFILE.role} · {PROFILE.tagline}
        </p>
        <p className="fade-up-delay-2 mx-auto mt-4 max-w-xl text-base leading-relaxed text-surface-400 sm:text-lg">
          {PROFILE.pitch}
        </p>

        <div className="fade-up-delay-2 mt-6 flex flex-wrap items-center justify-center gap-2">
          {[PROFILE.status, PROFILE.location, PROFILE.yearsExperience].map(
            (badge) => (
              <span
                key={badge}
                className="rounded-full border border-surface-800 bg-surface-900/60 px-3 py-1 text-xs text-surface-400"
              >
                {badge}
              </span>
            )
          )}
        </div>

        <HeroActions />
      </div>

      <div className="fade-up-delay-2 relative mx-auto mt-10 max-w-2xl">
        <HeroTerminal />
      </div>
    </section>
  )
}
