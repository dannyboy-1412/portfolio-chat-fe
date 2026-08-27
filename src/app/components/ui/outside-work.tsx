import { INTERESTS } from '@/shared/profile'

export function OutsideWork() {
  return (
    <section
      id="outside-work"
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
            Outside the IDE
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-surface-50 sm:text-4xl">
            When I&apos;m not building
          </h2>
        </header>

        <dl className="mt-14 grid gap-x-8 gap-y-10 border-t border-surface-800/70 pt-10 sm:grid-cols-2">
          {INTERESTS.map((category) => (
            <div key={category.id}>
              <dt className="font-mono text-xs uppercase tracking-[0.2em] text-surface-500">
                {category.label}
              </dt>
              <dd className="mt-2 text-lg leading-relaxed text-surface-200">
                {category.items.join(' · ')}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
