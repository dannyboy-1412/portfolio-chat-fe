'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, TerminalSquare, X } from 'lucide-react'
import { track } from '@vercel/analytics'
import { Button } from '@/app/components/ui/button'
import { useChat } from '@/app/components/ui/chat-provider'
import { useTerminal } from '@/app/components/terminal/terminal-provider'
import { CONTACT_NAV_LINK, NAV_LINKS } from '@/shared/profile'
import { cn } from '@/lib/utils'

const MOBILE_LINKS = [...NAV_LINKS, CONTACT_NAV_LINK]

function sectionHref(href: string) {
  return href.startsWith('#') ? `/${href}` : href
}

export function Navbar() {
  const [activeId, setActiveId] = useState<string>('work')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { openChat } = useChat()
  const { open: openTerminal } = useTerminal()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = MOBILE_LINKS.map((link) =>
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

  const handleOpenTerminal = () => {
    closeMobile()
    openTerminal()
  }

  const handleOpenChat = () => {
    closeMobile()
    track('chat_started', { source: 'navbar' })
    openChat({ context: null })
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-colors',
        scrolled
          ? 'border-surface-800/80 bg-surface-950/80 backdrop-blur-md'
          : 'border-transparent bg-transparent'
      )}
    >
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-surface-100"
          onClick={closeMobile}
        >
          DANIEL<span className="text-glow">.</span>R
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                href={sectionHref(link.href)}
                className={cn(
                  'rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors',
                  activeId === link.id
                    ? 'text-surface-100 underline decoration-glow decoration-2 underline-offset-8'
                    : 'text-surface-400 hover:text-surface-200'
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleOpenTerminal}
            className="hidden h-9 gap-1.5 rounded-lg border-surface-700 bg-transparent font-mono text-xs text-surface-300 hover:bg-surface-800 hover:text-surface-100 sm:inline-flex"
          >
            <TerminalSquare className="h-3.5 w-3.5" />
            Terminal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleOpenChat}
            className="hidden h-9 rounded-lg bg-glow px-3 font-mono text-xs text-surface-950 hover:bg-glow/90 sm:inline-flex"
          >
            Ask Daniel
          </Button>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md text-surface-300 hover:bg-surface-800 md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-surface-800 bg-surface-950/95 px-4 py-4 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1">
            {MOBILE_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={sectionHref(link.href)}
                  onClick={closeMobile}
                  className={cn(
                    'flex min-h-11 items-center rounded-md px-3 font-mono text-sm',
                    activeId === link.id
                      ? 'bg-surface-800 text-surface-100'
                      : 'text-surface-400 hover:bg-surface-900 hover:text-surface-200'
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-surface-800 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleOpenTerminal}
              className="h-11 justify-start gap-2 rounded-lg border-surface-700 bg-transparent font-mono text-sm text-surface-300 hover:bg-surface-800 hover:text-surface-100"
            >
              <TerminalSquare className="h-4 w-4" />
              Terminal
            </Button>
            <Button
              type="button"
              onClick={handleOpenChat}
              className="h-11 justify-start rounded-lg bg-glow font-mono text-sm text-surface-950 hover:bg-glow/90"
            >
              Ask Daniel
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
