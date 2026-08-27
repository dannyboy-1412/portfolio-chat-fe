import { SKILL_GROUPS } from '@/shared/profile'

export function SkillsGrid() {
  return (
    <section
      id="skills"
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
            Technologies
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-surface-50 sm:text-4xl">
            What I work with
          </h2>
        </header>

        <dl className="mt-14 border-t border-surface-800/70">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.title}
              className="grid gap-y-2 border-b border-surface-800/70 py-7 sm:grid-cols-12 sm:gap-x-8"
            >
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-surface-500 sm:col-span-3">
                {group.title}
              </dt>
              <dd className="text-lg leading-relaxed text-surface-200 sm:col-span-9">
                {group.skills.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
