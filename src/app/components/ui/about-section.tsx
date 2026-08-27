import { PROFILE } from '@/shared/profile'

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

        <div className="mt-14 border-t border-surface-800/70">
          <p className="pt-7 font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
            Education
          </p>
          <ul>
            {PROFILE.education.map((entry) => (
              <li
                key={entry.degree}
                className="grid gap-y-1 border-b border-surface-800/70 py-6 sm:grid-cols-12 sm:gap-x-8"
              >
                <span className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500 sm:col-span-3">
                  {entry.period}
                </span>
                <div className="sm:col-span-9">
                  <p className="text-base font-medium text-surface-100">{entry.degree}</p>
                  <p className="mt-0.5 text-sm text-surface-400">{entry.institution}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-sm text-surface-500">
          Speaks {PROFILE.languages.join(', ')}.
        </p>
      </div>
    </section>
  )
}
