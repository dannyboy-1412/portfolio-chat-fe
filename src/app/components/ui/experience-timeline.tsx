'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { track } from '@vercel/analytics'
import { AskDanielButton } from '@/app/components/ui/ask-daniel-button'
import { EXPERIENCES } from '@/shared/profile'
import { cn } from '@/lib/utils'

export function ExperienceTimeline() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const toggle = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
  }

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

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs text-surface-500">$ experience</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          Experience
        </h2>
        <p className="mt-2 text-sm text-surface-400">
          Selected roles - inspect one for the full story, or ask the assistant.
        </p>

        <ol className="relative mt-12 space-y-6 border-l border-surface-800 pl-8">
          {EXPERIENCES.map((job, index) => {
            const isExpanded = expandedId === job.id
            return (
              <li key={job.id} className="relative">
                <span
                  className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-glow bg-surface-950"
                  aria-hidden
                />
                <article className="rounded-2xl border border-surface-800/80 bg-surface-900/40 p-5 sm:p-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-mono text-xs text-surface-500">
                      {String(index + 1).padStart(2, '0')} {job.company}
                    </p>
                    <time className="text-xs text-surface-500">{job.period}</time>
                  </div>
                  <h3 className="mt-1 text-lg font-medium text-surface-100">{job.role}</h3>
                  <p className="mt-1 font-mono text-xs text-glow">{job.keyMetric}</p>
                  <p className="mt-3 text-sm leading-relaxed text-surface-400">{job.summary}</p>

                  {isExpanded && (
                    <div className="mt-4 space-y-4 border-t border-surface-800/80 pt-4">
                      <DetailRow label="Problem" body={job.problem} />
                      <DetailRow label="What Daniel built" body={job.built} />
                      <DetailRow label="Architecture" body={job.architecture} />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-surface-300">
                          Impact
                        </p>
                        <ul className="mt-2 space-y-1">
                          {job.impact.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-1.5 text-sm text-surface-400"
                            >
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-glow" aria-hidden />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <ul className="list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-surface-400">
                        {job.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-surface-800 bg-surface-950/60 px-2 py-0.5 text-xs text-surface-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => toggle(job.id)}
                      aria-expanded={isExpanded}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-surface-700 bg-transparent px-3 text-xs text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
                    >
                      {isExpanded ? 'Collapse' : 'Inspect'}
                      <ChevronDown
                        className={cn('h-3.5 w-3.5 transition-transform', isExpanded && 'rotate-180')}
                      />
                    </button>
                    <AskDanielButton context={{ type: 'experience', id: job.id }} />
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function DetailRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-surface-300">{label}</p>
      <p className="mt-1 text-sm leading-relaxed text-surface-400">{body}</p>
    </div>
  )
}
