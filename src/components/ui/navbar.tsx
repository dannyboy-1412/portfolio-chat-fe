import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { ArrowUpRight, Menu, X } from "lucide-react"
import { CONTACT_NAV_LINK, NAV_LINKS, PROFILE } from "@/shared/profile"
import { cn } from "@/lib/utils"
import { publicUrl } from "@/lib/publicUrl"

const MOBILE_LINKS = [...NAV_LINKS, CONTACT_NAV_LINK]
const HOME_PATH = "/"

export function Navbar() {
  const location = useLocation()
  const [activeId, setActiveId] = useState<string>("experience")
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const onHome = location.pathname === HOME_PATH

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
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
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [onHome])

  const closeMobile = () => setMobileOpen(false)

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!onHome) return
    event.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    const base = import.meta.env.BASE_URL.replace(/\/$/, "")
    window.history.replaceState(null, "", `${base}/#${id}`)
    setActiveId(id)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors",
        scrolled
          ? "border-b border-surface-800/60 bg-surface-950/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.2em] text-surface-100 transition-colors hover:text-glow"
          onClick={closeMobile}
        >
          <img
            src={publicUrl("/profile.png")}
            alt="Daniel A. Rodrigues"
            width={28}
            height={28}
            className="h-7 w-7 rounded-full object-cover"
          />
          Daniel A. Rodrigues
        </Link>

        <ul className="hidden items-center gap-6 md:flex">
          {MOBILE_LINKS.map((link) => (
            <li key={link.id}>
              <Link
                to={{ pathname: "/", hash: link.id }}
                onClick={(event) => scrollToSection(event, link.id)}
                className={cn(
                  "py-2 text-sm transition-colors",
                  activeId === link.id
                    ? "text-surface-50 underline decoration-glow decoration-1 underline-offset-8"
                    : "text-surface-400 hover:text-surface-100"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href={publicUrl(PROFILE.socials.resume)}
              download={PROFILE.socials.resumeDownloadName}
              className="inline-flex items-center gap-1 py-2 text-sm text-surface-400 transition-colors hover:text-surface-100"
            >
              Resume
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </a>
          </li>
        </ul>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-surface-300 hover:text-surface-100 md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {mobileOpen && (
        <div className="border-t border-surface-800/60 bg-surface-950/95 px-4 py-4 backdrop-blur-md md:hidden">
          <ul className="flex flex-col">
            {MOBILE_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  to={{ pathname: "/", hash: link.id }}
                  onClick={(event) => {
                    scrollToSection(event, link.id)
                    closeMobile()
                  }}
                  className={cn(
                    "flex min-h-11 items-center px-1 text-base",
                    activeId === link.id
                      ? "text-surface-50"
                      : "text-surface-400 hover:text-surface-100"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={publicUrl(PROFILE.socials.resume)}
                download={PROFILE.socials.resumeDownloadName}
                className="flex min-h-11 items-center gap-1.5 px-1 text-base text-surface-400 hover:text-surface-100"
              >
                Resume
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
