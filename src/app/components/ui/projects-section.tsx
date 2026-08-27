import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { AskDanielButton } from '@/app/components/ui/ask-daniel-button'
import { PERSONAL_PROJECTS, type Project } from '@/shared/projects'

const TECH_PREVIEW_LIMIT = 4

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

        <ul className="mt-14 grid grid-cols-1 sm:grid-cols-2">
          {PERSONAL_PROJECTS.map((project, index) => (
            <li
              key={project.slug}
              className="flex flex-col border-t border-surface-800/70 py-8 sm:[&:nth-child(odd)]:pr-10 sm:[&:nth-child(even)]:border-l sm:[&:nth-child(even)]:border-surface-800/70 sm:[&:nth-child(even)]:pl-10"
            >
              <ProjectEntry project={project} index={index} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectEntry({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  return (
    <article className="group flex h-full flex-col">
      <span className="font-mono text-sm text-surface-500">
        {String(index + 1).padStart(2, '0')}
      </span>

      {project.visual && (
        <div className="mt-4 overflow-hidden rounded-lg border border-surface-800/60">
          <Image
            src={project.visual.src}
            alt={project.visual.alt}
            width={1600}
            height={900}
            sizes="(min-width: 640px) 50vw, 100vw"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      )}

      <h3 className="mt-4">
        <Link
          href={`/projects/${project.slug}`}
          className="inline-flex items-baseline gap-2 font-display text-2xl tracking-tight text-surface-50 transition-colors hover:text-glow"
        >
          {project.name}
          <ArrowUpRight
            className="h-4 w-4 self-center text-surface-500 transition-all group-hover:translate-x-0.5 group-hover:text-glow"
            aria-hidden
          />
        </Link>
      </h3>

      <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-surface-500">
        {project.tagline}
      </p>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-surface-400">
        {project.description}
      </p>

      <div className="mt-auto pt-6">
        <p className="font-mono text-xs tracking-wide text-surface-500">
          {formatTechPreview(project.technologies)}
        </p>
        <div className="mt-3">
          <AskDanielButton
            context={{ type: 'project', id: project.slug }}
            label="Ask about this project"
          />
        </div>
      </div>
    </article>
  )
}

function formatTechPreview(technologies: string[]): string {
  const visible = technologies.slice(0, TECH_PREVIEW_LIMIT)
  const overflow = technologies.length - visible.length
  const list = visible.join(' · ')
  return overflow > 0 ? `${list} · +${overflow}` : list
}
