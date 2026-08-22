import { Download, Github, Linkedin, Mail } from 'lucide-react'
import { TrackedAnchor } from '@/app/components/ui/tracked-anchor'
import { PROFILE } from '@/shared/profile'

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-surface-900 px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-xs text-surface-500">$ contact</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-surface-50 sm:text-3xl">
          Get in touch
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-surface-400">
          Open to backend and AI roles. The fastest way to reach me is email — or ask my
          assistant to pass along a message.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TrackedAnchor
            href={`mailto:${PROFILE.socials.email}`}
            event="contact_clicked"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-glow px-4 text-sm font-medium text-surface-950 transition-colors hover:bg-glow/90"
          >
            <Mail className="h-4 w-4" />
            {PROFILE.socials.email}
          </TrackedAnchor>
          <TrackedAnchor
            href={PROFILE.socials.github}
            event="github_clicked"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-surface-700 px-4 text-sm text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
          >
            <Github className="h-4 w-4" />
            GitHub
          </TrackedAnchor>
          <TrackedAnchor
            href={PROFILE.socials.linkedin}
            event="linkedin_clicked"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-surface-700 px-4 text-sm text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </TrackedAnchor>
          <TrackedAnchor
            href={PROFILE.socials.resume}
            event="resume_clicked"
            download={PROFILE.socials.resumeDownloadName}
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-surface-700 px-4 text-sm text-surface-300 transition-colors hover:bg-surface-800 hover:text-surface-100"
          >
            <Download className="h-4 w-4" />
            Resume
          </TrackedAnchor>
        </div>
      </div>
    </section>
  )
}
