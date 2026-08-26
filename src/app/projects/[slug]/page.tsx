import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Github, Globe } from 'lucide-react'
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
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <AnalyticsTracker event="project_view" contextId={project.slug} />
      <Link
        href="/#work"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-surface-400 transition-colors hover:text-surface-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to work
      </Link>

      <div className="mt-8">
        <p className="font-mono text-xs text-surface-500">
          Project · {String(index).padStart(2, '0')}
        </p>
        {project.placeholder && (
          <span className="mt-2 inline-block rounded-full border border-surface-700 bg-surface-900/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-surface-500">
            Draft content - full write-up coming soon
          </span>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-surface-50 sm:text-4xl">
          {project.name}
        </h1>
        <p className="mt-1 font-mono text-sm uppercase tracking-wide text-glow">
          {project.tagline}
        </p>
        <p className="mt-4 text-base leading-relaxed text-surface-400">
          {project.description}
        </p>

        {(project.links.github || project.links.live) && (
          <div className="mt-4 flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-100"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-surface-400 hover:text-surface-100"
              >
                <Globe className="h-3.5 w-3.5" />
                Live
              </a>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 space-y-8">
        <Section title="Problem" body={project.problem} />
        <Section title="Solution" body={project.solution} />
        <Section title="Architecture" body={project.architecture} />
        <ListSection title="Engineering decisions" items={project.decisions} />

        <div>
          <h2 className="text-sm font-medium uppercase tracking-wide text-surface-300">
            Technology
          </h2>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-md border border-surface-800 bg-surface-950/60 px-2 py-0.5 text-xs text-surface-400"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <ListSection title="Results" items={project.impact} />
        <Section title="What Daniel learned" body={project.learnings} />
      </div>

      <div className="mt-12 border-t border-surface-900 pt-8">
        <AskDanielButton
          context={{ type: 'project', id: project.slug }}
          label="Ask Daniel about this project"
          size="default"
          className="h-11 border-glow/40 px-4 text-sm text-glow hover:bg-glow/10"
        />
      </div>
    </main>
  )
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="text-sm font-medium uppercase tracking-wide text-surface-300">{title}</h2>
      <p className="mt-3 text-sm leading-relaxed text-surface-400">{body}</p>
    </div>
  )
}

function ListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-sm font-medium uppercase tracking-wide text-surface-300">{title}</h2>
      <ul className="mt-3 space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-surface-400">
            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-glow" aria-hidden />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}
