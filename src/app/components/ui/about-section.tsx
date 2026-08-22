import { PROFILE } from '@/shared/profile'

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          About
        </h2>
        <p className="mt-6 text-base leading-relaxed text-surface-400">{PROFILE.about}</p>
        <ul className="mt-5 space-y-1.5">
          {PROFILE.education.map((item) => (
            <li key={item} className="text-sm text-surface-500">
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-surface-500">
          Speaks {PROFILE.languages.join(', ')}.
        </p>
      </div>
    </section>
  )
}
