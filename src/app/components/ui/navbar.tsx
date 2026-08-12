'use client'

import { useEffect, useState } from 'react'
import { Download, Github, Linkedin, Menu, X } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { NAV_LINKS, PROFILE } from '@/shared/profile'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [activeId, setActiveId] = useState<string>('chat')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = NAV_LINKS.map((link) =>
      document.getElementById(link.id)
    ).filter((el): el is HTMLElement => Boolean(el))

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled
          ? 'border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#chat" className="flex items-center gap-2" onClick={closeMobile}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 text-xs font-semibold text-zinc-100">
            DR
          </span>
          <span className="hidden text-sm font-medium text-zinc-100 sm:inline">
            {PROFILE.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <a
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm transition-colors',
                  activeId === link.id
                    ? 'text-zinc-100 underline decoration-glow decoration-2 underline-offset-8'
                    : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href={PROFILE.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-zinc-400 transition-colors hover:text-white sm:inline-flex"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
          <a
            href={PROFILE.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-zinc-400 transition-colors hover:text-white sm:inline-flex"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <Button
            asChild
            size="sm"
            className="hidden h-8 gap-1.5 rounded-lg bg-zinc-800 px-3 text-xs text-zinc-100 hover:bg-zinc-700 sm:inline-flex"
          >
            <a
              href={PROFILE.socials.resume}
              download={PROFILE.socials.resumeDownloadName}
            >
              <Download className="h-3.5 w-3.5" />
              Resume
            </a>
          </Button>

          <button
            type="button"
            className="inline-flex rounded-md p-2 text-zinc-300 hover:bg-zinc-800 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-zinc-800 bg-zinc-950/95 px-4 py-4 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  onClick={closeMobile}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm',
                    activeId === link.id
                      ? 'bg-zinc-800 text-zinc-100'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-4 border-t border-zinc-800 pt-4">
            <a
              href={PROFILE.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={PROFILE.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <Button
              asChild
              size="sm"
              className="ml-auto h-8 gap-1.5 rounded-lg bg-zinc-800 px-3 text-xs text-zinc-100 hover:bg-zinc-700"
            >
              <a
                href={PROFILE.socials.resume}
                download={PROFILE.socials.resumeDownloadName}
              >
                <Download className="h-3.5 w-3.5" />
                Resume
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
