import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { AskDanielButton } from '@/app/components/ui/ask-daniel-button'
import { AnalyticsTracker } from '@/app/components/ui/analytics-tracker'
import { getProjectBySlug, PROJECTS } from '@/shared/projects'

type ProjectPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) {
    return { title: 'Project not found' }
  }

  return {
    title: `${project.name} - ${project.tagline} | Daniel Rodrigues`,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} - ${project.tagline}`,
      description: project.description,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const index = PROJECTS.findIndex((p) => p.slug === project.slug) + 1

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <AnalyticsTracker event="project_view" contextId={project.slug} />
      <Link
        href="/#work"
        className="inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-500 transition-colors hover:text-surface-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Back to work
      </Link>

      <header className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
          Project {String(index).padStart(2, '0')}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-surface-50 sm:text-6xl">
          {project.name}
        </h1>
        <p className="mt-3 text-lg text-surface-400">{project.tagline}</p>
        {project.placeholder && (
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-surface-500">
            Draft content — full write-up coming soon
          </p>
        )}
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-surface-400">
          {project.description}
        </p>

        {(project.links.github || project.links.live) && (
          <div className="mt-6 flex flex-wrap gap-6">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1.5 text-sm text-surface-200 underline decoration-surface-700 underline-offset-8 transition-colors hover:text-glow hover:decoration-glow"
              >
                GitHub
                <ArrowUpRight className="h-4 w-4 text-surface-500" aria-hidden />
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-1.5 text-sm text-surface-200 underline decoration-surface-700 underline-offset-8 transition-colors hover:text-glow hover:decoration-glow"
              >
                Live
                <ArrowUpRight className="h-4 w-4 text-surface-500" aria-hidden />
              </a>
            )}
          </div>
        )}
      </header>

      {project.metrics && project.metrics.length > 0 && (
        <dl className="mt-14 flex flex-wrap gap-x-14 gap-y-8 border-t border-surface-800/70 pt-10">
          {project.metrics.map((metric) => (
            <div key={metric.label}>
              <dd className="font-display text-4xl tracking-tight text-glow sm:text-5xl">
                {metric.value}
              </dd>
              <dt className="mt-2 max-w-56 text-sm leading-relaxed text-surface-400">
                {metric.label}
              </dt>
            </div>
          ))}
        </dl>
      )}

      {project.visual && (
        <div className="mt-14 overflow-hidden rounded-lg border border-surface-800/60">
          <Image
            src={project.visual.src}
            alt={project.visual.alt}
            width={1600}
            height={900}
            className="h-auto w-full"
            priority
          />
        </div>
      )}

      <div className="mt-14 space-y-12 border-t border-surface-800/70 pt-12">
        <Section title="Problem" body={project.problem} />
        <Section title="Solution" body={project.solution} />
        <Section title="Architecture" body={project.architecture} />
        <ListSection title="Engineering decisions" items={project.decisions} />

        <div>
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-surface-500">
            Technology
          </h2>
          <p className="mt-3 font-mono text-sm leading-relaxed text-surface-300">
            {project.technologies.join(' · ')}
          </p>
        </div>

        <ListSection title="Results" items={project.impact} />
        <Section title="What Daniel learned" body={project.learnings} />
      </div>

      <div className="mt-14 border-t border-surface-800/70 pt-10">
        <AskDanielButton
          context={{ type: 'project', id: project.slug }}
          label="Ask Daniel about this project"
        />
      </div>
    </main>
  )
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-surface-500">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface-400">{body}</p>
    </div>
  )
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-surface-500">{title}</h2>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-surface-400">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
