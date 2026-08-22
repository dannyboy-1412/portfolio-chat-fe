import { INTERESTS } from '@/shared/profile'

export function OutsideWork() {
  return (
    <section
      id="outside-work"
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs text-surface-500">~/outside-the-ide</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          Outside the IDE
        </h2>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {INTERESTS.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-surface-800/80 bg-surface-900/40 p-5"
            >
              <p className="font-mono text-xs uppercase tracking-wide text-glow">
                {category.label}
              </p>
              <p className="mt-2 text-sm text-surface-300">{category.items.join(' · ')}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
