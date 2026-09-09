import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { EXPERIENCES } from "@/shared/profile"
import { getProjectsByExperienceId, type Project } from "@/shared/projects"
import { cn } from "@/lib/utils"

export function ExperienceTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  return (
    <section
      id="experience"
      className="scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
            Experience
          </p>
          <h2 className="mt-3 font-display text-3xl tracking-tight text-surface-50 sm:text-4xl">
            Where I&apos;ve worked
          </h2>
        </header>

        <ol className="mt-14 border-t border-surface-800/70">
          {EXPERIENCES.map((job) => {
            const isExpanded = expandedId === job.id
            const projects = getProjectsByExperienceId(job.id)
            return (
              <li key={job.id} className="border-b border-surface-800/70 py-10 sm:py-12">
                <div className="grid gap-y-4 md:grid-cols-12 md:gap-x-8">
                  <div className="md:col-span-3">
                    <time className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500">
                      {job.period}
                    </time>
                  </div>

                  <div className="md:col-span-9">
                    <h3 className="font-display text-2xl tracking-tight text-surface-50 sm:text-3xl">
                      {job.company}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-surface-200">{job.role}</p>
                    <p className="mt-1 font-mono text-xs text-glow">{job.keyMetric}</p>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface-400">
                      {job.summary}
                    </p>
                    <p className="mt-4 font-mono text-xs tracking-wide text-surface-500">
                      {job.tech.join(" · ")}
                    </p>

                    <div className="mt-5">
                      <button
                        type="button"
                        onClick={() => toggle(job.id)}
                        aria-expanded={isExpanded}
                        className="inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-400 transition-colors hover:text-surface-100"
                      >
                        {isExpanded ? "Collapse" : "Details"}
                        <ChevronDown
                          className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-180")}
                          aria-hidden
                        />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-6 space-y-6 border-t border-surface-800/60 pt-6">
                        {job.problem && <DetailRow label="Problem" body={job.problem} />}
                        {job.built && <DetailRow label="What Daniel built" body={job.built} />}
                        {job.architecture && (
                          <DetailRow label="Architecture" body={job.architecture} />
                        )}
                        {projects.length === 0 && job.impact.length > 0 && (
                          <div>
                            <p className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500">
                              Impact
                            </p>
                            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-surface-400">
                              {job.impact.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-surface-400">
                          {job.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>

                        {projects.length > 0 && (
                          <div>
                            <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
                              What I shipped
                            </p>
                            <div className="mt-4 border-t border-surface-800/60">
                              {projects.map((project) => (
                                <ProjectSummary key={project.slug} project={project} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function ProjectSummary({ project }: { project: Project }) {
  return (
    <article className="border-b border-surface-800/60 py-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h4 className="font-display text-xl tracking-tight text-surface-50 sm:text-2xl">
          {project.name}
        </h4>
        <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-surface-500">
          {project.tagline}
        </p>
      </div>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-400">
        {project.description}
      </p>

      <div className="mt-4">
        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-400 transition-colors hover:text-surface-100"
        >
          Details
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </Link>
      </div>
    </article>
  )
}

function DetailRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500">{label}</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-400">{body}</p>
    </div>
  )
}
