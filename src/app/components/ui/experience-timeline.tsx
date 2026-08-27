'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { track } from '@vercel/analytics'
import { AskDanielButton } from '@/app/components/ui/ask-daniel-button'
import { EXPERIENCES } from '@/shared/profile'
import { getProjectsByExperienceId, type Project } from '@/shared/projects'
import { PROJECT_ANCHOR_EVENT } from '@/lib/sourceLinks'
import { cn } from '@/lib/utils'

const PROJECT_HASH_PREFIX = '#project-'

function readProjectHash(): string | null {
  if (typeof window === 'undefined') return null
  const hash = window.location.hash
  if (!hash.startsWith(PROJECT_HASH_PREFIX)) return null
  return hash.slice(PROJECT_HASH_PREFIX.length) || null
}

function findProjectOwner(slug: string) {
  return EXPERIENCES.find((job) =>
    getProjectsByExperienceId(job.id).some((project) => project.slug === slug)
  )
}

export function ExperienceTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedProjects, setExpandedProjects] = useState<ReadonlySet<string>>(
    () => new Set()
  )
  const sectionRef = useRef<HTMLElement>(null)

  const toggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

  const toggleProject = (slug: string) => {
    setExpandedProjects((current) => {
      const next = new Set(current)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      return next
    })
  }

  const expandProject = useCallback((slug: string) => {
    const owner = findProjectOwner(slug)
    if (!owner) return
    setExpandedId(owner.id)
    setExpandedProjects((current) => new Set(current).add(slug))
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          track('experience_view')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const expandFromHash = () => {
      const slug = readProjectHash()
      if (slug) expandProject(slug)
    }
    const onAnchorEvent = (event: Event) => {
      const slug = (event as CustomEvent<string>).detail
      if (typeof slug === 'string') expandProject(slug)
    }
    const frame = requestAnimationFrame(expandFromHash)
    window.addEventListener('hashchange', expandFromHash)
    window.addEventListener(PROJECT_ANCHOR_EVENT, onAnchorEvent)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('hashchange', expandFromHash)
      window.removeEventListener(PROJECT_ANCHOR_EVENT, onAnchorEvent)
    }
  }, [expandProject])

  useEffect(() => {
    const slug = readProjectHash()
    if (!slug || !expandedProjects.has(slug)) return
    document.getElementById(`project-${slug}`)?.scrollIntoView()
  }, [expandedId, expandedProjects])

  return (
    <section
      id="experience"
      ref={sectionRef}
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
                      {job.tech.join(' · ')}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
                      <button
                        type="button"
                        onClick={() => toggle(job.id)}
                        aria-expanded={isExpanded}
                        className="inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-400 transition-colors hover:text-surface-100"
                      >
                        {isExpanded ? 'Collapse' : 'Details'}
                        <ChevronDown
                          className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')}
                          aria-hidden
                        />
                      </button>
                      <AskDanielButton context={{ type: 'experience', id: job.id }} />
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
                              Projects here
                            </p>
                            <div className="mt-4 border-t border-surface-800/60">
                              {projects.map((project) => (
                                <ProjectSection
                                  key={project.slug}
                                  project={project}
                                  isExpanded={expandedProjects.has(project.slug)}
                                  onToggle={() => toggleProject(project.slug)}
                                />
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

function ProjectSection({
  project,
  isExpanded,
  onToggle,
}: {
  project: Project
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <article
      id={`project-${project.slug}`}
      className="scroll-mt-24 border-b border-surface-800/60 py-6"
    >
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

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isExpanded}
          className="inline-flex h-11 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-surface-400 transition-colors hover:text-surface-100"
        >
          {isExpanded ? 'Collapse' : 'Details'}
          <ChevronDown
            className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')}
            aria-hidden
          />
        </button>
        <AskDanielButton
          context={{ type: 'project', id: project.slug }}
          label="Ask about this project"
        />
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-6 border-t border-surface-800/60 pt-6">
          <DetailRow label="Problem" body={project.problem} />
          <DetailRow label="Solution" body={project.solution} />
          <DetailRow label="Architecture" body={project.architecture} />
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500">
              Engineering decisions
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-surface-400">
              {project.decisions.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ul>
          </div>
          <p className="font-mono text-xs tracking-wide text-surface-500">
            {project.technologies.join(' · ')}
          </p>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500">
              Results
            </p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-surface-400">
              {project.impact.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
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
