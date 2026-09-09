import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { getExperienceById } from "@/shared/profile"
import { getProjectBySlug, PERSONAL_PROJECTS } from "@/shared/projects"
import { publicUrl } from "@/lib/publicUrl"

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const project = slug ? getProjectBySlug(slug) : undefined

  useEffect(() => {
    if (!project) {
      document.title = "Project not found | Daniel Rodrigues"
      return
    }
    document.title = `${project.name} - ${project.tagline} | Daniel Rodrigues`
    return () => {
      document.title = "Daniel Rodrigues | Software Engineer & AI Engineer"
    }
  }, [project])

  if (!project) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
        <h1 className="font-display text-4xl tracking-tight text-surface-50">
          Project not found
        </h1>
        <Link
          to="/"
          className="mt-8 inline-flex h-11 items-center font-mono text-xs uppercase tracking-[0.15em] text-surface-500 transition-colors hover:text-surface-100"
        >
          Back to home
        </Link>
      </main>
    )
  }

  const isPersonal = project.origin === "personal"
  const personalIndex = PERSONAL_PROJECTS.findIndex((p) => p.slug === project.slug) + 1
  const company = project.relatedExperienceId
    ? getExperienceById(project.relatedExperienceId)?.company
    : undefined
  const eyebrow = isPersonal
    ? `Project ${String(personalIndex).padStart(2, "0")}`
    : (company ?? "Work")
  const backHash = isPersonal ? "projects" : "experience"
  const backLabel = isPersonal ? "Back to projects" : "Back to experience"

  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <Link
        to={{ pathname: "/", hash: backHash }}
        className="inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-500 transition-colors hover:text-surface-100"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        {backLabel}
      </Link>

      <header className="mt-10">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-surface-50 sm:text-6xl">
          {project.name}
        </h1>
        <p className="mt-3 text-lg text-surface-400">{project.tagline}</p>
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
          <img
            src={publicUrl(project.visual.src)}
            alt={project.visual.alt}
            width={1600}
            height={900}
            className="h-auto w-full"
          />
        </div>
      )}

      <div className="mt-14 space-y-12 border-t border-surface-800/70 pt-12">
        <Section title="Problem" body={project.problem} />
        <Section title="Solution" body={project.solution} />
        <Section title="Architecture" body={project.architecture} />
        <ListSection title="Engineering decisions" items={project.decisions} />
        {project.technologies.length > 0 && (
          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-surface-500">
              Technology
            </h2>
            <p className="mt-3 font-mono text-sm leading-relaxed text-surface-300">
              {project.technologies.join(" · ")}
            </p>
          </div>
        )}

        <ListSection title="Results" items={project.impact} />
        <Section title="What Daniel learned" body={project.learnings} />
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
