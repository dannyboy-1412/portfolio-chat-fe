import { PROFILE } from "@/shared/profile"

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
            About
          </p>
        </header>

        <p className="mt-6 max-w-3xl font-display text-3xl leading-snug tracking-tight text-surface-50 sm:text-4xl">
          {PROFILE.aboutHeadline}
        </p>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-surface-400">
          {PROFILE.about}
        </p>

        <p className="mt-6 text-sm text-surface-500">
          Speaks {PROFILE.languages.join(", ")}.
        </p>
      </div>
    </section>
  )
}
