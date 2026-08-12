import { PROFILE } from '@/shared/profile'

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-zinc-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
          About
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-sm leading-relaxed text-zinc-400">{PROFILE.about}</p>
            <ul className="mt-4 space-y-1.5">
              {PROFILE.education.map((item) => (
                <li key={item} className="text-sm text-zinc-500">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-zinc-500">
              Speaks {PROFILE.languages.join(', ')}.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-zinc-300">Outside work</h3>
            <ul className="mt-3 space-y-2">
              {PROFILE.interests.map((interest) => (
                <li key={interest} className="text-sm text-zinc-400">
                  {interest}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
