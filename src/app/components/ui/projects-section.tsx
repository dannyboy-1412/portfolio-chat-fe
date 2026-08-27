import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AskDanielButton } from '@/app/components/ui/ask-daniel-button'
import { PERSONAL_PROJECTS } from '@/shared/projects'

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-20 px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
            Projects
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-surface-50 sm:text-4xl">
            What I build outside work
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface-400">
            Personal projects I build on my own time. The work I shipped at each
            company lives with its role under Experience.
          </p>
        </header>

        <ol className="mt-14 border-t border-surface-800/70">
          {PERSONAL_PROJECTS.map((project, index) => (
            <li key={project.slug} className="border-b border-surface-800/70">
              <article className="group grid gap-y-6 py-12 sm:py-14 md:grid-cols-12 md:gap-x-8">
                <div className="md:col-span-2">
                  <span className="font-mono text-sm text-surface-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="md:col-span-10">
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="inline-flex items-baseline gap-2 font-display text-3xl tracking-tight text-surface-50 transition-colors hover:text-glow sm:text-4xl"
                      >
                        {project.name}
                        <ArrowUpRight
                          className="h-5 w-5 self-center text-surface-500 transition-all group-hover:translate-x-0.5 group-hover:text-glow"
                          aria-hidden
                        />
                      </Link>
                    </h3>
                  </div>

                  <p className="mt-1 text-sm text-surface-400">{project.tagline}</p>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-surface-400">
                    {project.description}
                  </p>

                  {project.metrics && project.metrics.length > 0 && (
                    <dl className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
                      {project.metrics.map((metric) => (
                        <div key={metric.label}>
                          <dd className="font-display text-3xl tracking-tight text-glow sm:text-4xl">
                            {metric.value}
                          </dd>
                          <dt className="mt-1 max-w-56 text-xs leading-relaxed text-surface-400">
                            {metric.label}
                          </dt>
                        </div>
                      ))}
                    </dl>
                  )}

                  <p className="mt-8 font-mono text-xs tracking-wide text-surface-500">
                    {project.technologies.join(' · ')}
                  </p>

                  <div className="mt-6">
                    <AskDanielButton
                      context={{ type: 'project', id: project.slug }}
                      label="Ask about this project"
                    />
                  </div>
                </div>

                {project.visual && (
                  <div className="md:col-span-12">
                    <div className="mt-2 overflow-hidden rounded-lg border border-surface-800/60">
                      <Image
                        src={project.visual.src}
                        alt={project.visual.alt}
                        width={1600}
                        height={900}
                        className="h-auto w-full"
                      />
                    </div>
                  </div>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
