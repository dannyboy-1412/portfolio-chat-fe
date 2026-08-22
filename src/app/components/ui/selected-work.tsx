import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AskDanielButton } from '@/app/components/ui/ask-daniel-button'
import { PROJECTS } from '@/shared/projects'

export function SelectedWork() {
  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          Selected Work
        </h2>
        <p className="mt-2 text-sm text-surface-400">
          Projects that show how I think about engineering problems, not just the tech list.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <article
              key={project.slug}
              className="flex flex-col rounded-2xl border border-surface-800/80 bg-surface-900/40 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-xs text-surface-500">
                  ~/projects/{project.slug}
                </p>
                {project.placeholder && (
                  <span className="rounded-full border border-surface-700 bg-surface-950/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-surface-500">
                    Draft
                  </span>
                )}
              </div>
              <p className="mt-2 font-mono text-xs uppercase tracking-wide text-glow">
                {project.tagline}
              </p>
              <h3 className="mt-1 text-lg font-medium text-surface-100">{project.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-400">
                {project.description}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-surface-800 bg-surface-950/60 px-2 py-0.5 text-xs text-surface-400"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <ul className="mt-4 space-y-1">
                {project.impact.map((item) => (
                  <li key={item} className="flex items-start gap-1.5 text-sm text-surface-300">
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-glow" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap gap-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-surface-800 px-3 text-xs text-surface-100 transition-colors hover:bg-surface-700"
                >
                  Explore
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <AskDanielButton
                  context={{ type: 'project', id: project.slug }}
                  label="Ask Daniel"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
