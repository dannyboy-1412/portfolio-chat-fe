import { Download, Github, Linkedin } from 'lucide-react'
import { PROFILE } from '@/shared/profile'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-900 px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-zinc-200">{PROFILE.name}</p>
          <p className="mt-1 text-xs text-zinc-500">
            {PROFILE.role} · {PROFILE.location}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={PROFILE.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-400 transition-colors hover:text-white"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href={PROFILE.socials.resume}
            download={PROFILE.socials.resumeDownloadName}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            Resume
          </a>
        </div>
      </div>
    </footer>
  )
}
