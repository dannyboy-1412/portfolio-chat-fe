import { ArrowUpRight } from "lucide-react"
import { PROFILE } from "@/shared/profile"
import { publicUrl } from "@/lib/publicUrl"

export function ContactSection() {
  return (
    <section
      id="contact"
      className="scroll-mt-20 border-t border-surface-800/70 px-4 py-28 sm:px-6 sm:py-32"
    >
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-surface-500">
          Contact
        </p>
        <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight text-surface-50 sm:text-6xl lg:text-7xl">
          Let&apos;s build something.
        </h2>
        <p className="mt-6 max-w-md text-base leading-relaxed text-surface-400">
          Have a project, opportunity or interesting problem? The fastest way to reach
          me is email.
        </p>

        <ul className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-5">
          <li>
            <a
              href={`mailto:${PROFILE.socials.email}`}
              className="text-lg text-surface-100 underline decoration-surface-700 underline-offset-8 transition-colors hover:text-glow hover:decoration-glow sm:text-xl"
            >
              {PROFILE.socials.email}
            </a>
          </li>
          <li>
            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-lg text-surface-100 underline decoration-surface-700 underline-offset-8 transition-colors hover:text-glow hover:decoration-glow sm:text-xl"
            >
              LinkedIn
              <ArrowUpRight className="h-4 w-4 text-surface-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
          <li>
            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-lg text-surface-100 underline decoration-surface-700 underline-offset-8 transition-colors hover:text-glow hover:decoration-glow sm:text-xl"
            >
              GitHub
              <ArrowUpRight className="h-4 w-4 text-surface-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
          <li>
            <a
              href={publicUrl(PROFILE.socials.resume)}
              download={PROFILE.socials.resumeDownloadName}
              className="group inline-flex items-center gap-1.5 text-lg text-surface-100 underline decoration-surface-700 underline-offset-8 transition-colors hover:text-glow hover:decoration-glow sm:text-xl"
            >
              Resume
              <ArrowUpRight className="h-4 w-4 text-surface-500 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </a>
          </li>
        </ul>
      </div>
    </section>
  )
}
