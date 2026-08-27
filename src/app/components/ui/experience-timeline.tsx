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
                        <DetailRow label="Problem" body={job.problem} />
                        <DetailRow label="What Daniel built" body={job.built} />
                        <DetailRow label="Architecture" body={job.architecture} />
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
                        <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-surface-400">
                          {job.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
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

function DetailRow({ label, body }: { label: string; body: string }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.15em] text-surface-500">{label}</p>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-400">{body}</p>
    </div>
  )
}
