import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Hero } from "@/components/ui/hero"
import { ExperienceTimeline } from "@/components/ui/experience-timeline"
import { ProjectsSection } from "@/components/ui/projects-section"
import { SkillsGrid } from "@/components/ui/skills-grid"
import { AboutSection } from "@/components/ui/about-section"
import { OutsideWork } from "@/components/ui/outside-work"
import { ContactSection } from "@/components/ui/contact-section"

export function HomePage() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = hash.replace("#", "")
    document.getElementById(id)?.scrollIntoView()
  }, [hash])

  return (
    <main>
      <Hero />
      <ExperienceTimeline />
      <ProjectsSection />
      <SkillsGrid />
      <AboutSection />
      <OutsideWork />
      <ContactSection />
    </main>
  )
}
