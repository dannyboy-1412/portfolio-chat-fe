import { SKILL_GROUPS } from '@/shared/profile'
import { SKILL_ICON_BY_NAME } from '@/shared/skillIcons'

function SkillIcon({ name }: { name: string }) {
  const icon = SKILL_ICON_BY_NAME[name]
  if (!icon) {
    return <span className="h-1.5 w-1.5 rounded-full bg-glow/70" aria-hidden />
  }

  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      aria-hidden
      className="h-4 w-4 shrink-0 fill-surface-400"
    >
      <title>{icon.title}</title>
      <path d={icon.path} />
    </svg>
  )
}

export function SkillsGrid() {
  return (
    <section
      id="skills"
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          Skills
        </h2>
        <p className="mt-2 text-sm text-surface-400">
          Tools and languages I use across backend, frontend, data, and cloud.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-surface-800/80 bg-surface-900/40 p-5"
            >
              <h3 className="text-sm font-medium tracking-wide text-surface-300">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {group.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-2 text-sm text-surface-400"
                  >
                    <SkillIcon name={skill} />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
