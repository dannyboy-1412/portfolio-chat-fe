import { PROFILE } from "@/shared/profile"

export function Hero() {
  return (
    <section
      id="hero"
      className="scroll-mt-20 px-4 pb-20 pt-16 sm:px-6 sm:pt-24"
    >
      <div className="mx-auto max-w-5xl">
        <p className="fade-up inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-surface-400">
          <span className="h-1.5 w-1.5 rounded-full bg-glow" aria-hidden />
          {PROFILE.statusIndicator}
        </p>

        <h1 className="fade-up-delay-1 mt-6 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-surface-50 sm:text-6xl lg:text-7xl">
          {PROFILE.headline}
        </h1>

        <p className="fade-up-delay-2 mt-10 text-sm text-surface-500">
          {PROFILE.yearsExperience} · {PROFILE.location}
        </p>
      </div>
    </section>
  )
}
