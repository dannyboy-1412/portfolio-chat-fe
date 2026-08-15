'use client'

import { ArrowUpRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useChat } from '@/app/components/ui/chat-provider'
import { EXPERIENCES } from '@/shared/profile'

export function ExperienceTimeline() {
  const { sendMessage } = useChat()

  const askAboutRole = (question: string) => {
    document.getElementById('chat')?.scrollIntoView({ behavior: 'smooth' })
    void sendMessage(question)
  }

  return (
    <section
      id="experience"
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          Experience
        </h2>
        <p className="mt-2 text-sm text-surface-400">
          Selected roles — ask the assistant about any of them.
        </p>

        <ol className="relative mt-12 space-y-10 border-l border-surface-800 pl-8">
          {EXPERIENCES.map((job) => (
            <li key={job.id} className="relative">
              <span
                className="absolute -left-[2.15rem] top-1.5 h-3 w-3 rounded-full border-2 border-glow bg-surface-950"
                aria-hidden
              />
              <article className="rounded-2xl border border-surface-800/80 bg-surface-900/40 p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-medium text-surface-100">{job.role}</h3>
                  <time className="text-xs text-surface-500">{job.period}</time>
                </div>
                <p className="mt-1 text-sm font-medium text-surface-300">
                  {job.company}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-surface-400">
                  {job.summary}
                </p>
                <ul className="mt-4 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-surface-400">
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
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
                <div className="mt-5 flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 rounded-lg border-surface-700 bg-transparent text-xs text-surface-300 hover:bg-surface-800 hover:text-surface-100"
                    onClick={() => askAboutRole(job.suggestedQuestion)}
                  >
                    Ask about this
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
