import { Hero } from '@/app/components/ui/hero'
import { ExperienceTimeline } from '@/app/components/ui/experience-timeline'
import { ProjectsSection } from '@/app/components/ui/projects-section'
import { SkillsGrid } from '@/app/components/ui/skills-grid'
import { AboutSection } from '@/app/components/ui/about-section'
import { AskSection } from '@/app/components/ui/ask-section'
import { OutsideWork } from '@/app/components/ui/outside-work'
import { ContactSection } from '@/app/components/ui/contact-section'
import { AnalyticsTracker } from '@/app/components/ui/analytics-tracker'

export default function Home() {
  return (
    <main>
      <AnalyticsTracker event="portfolio_view" />
      <Hero />
      <ExperienceTimeline />
      <ProjectsSection />
      <SkillsGrid />
      <AboutSection />
      <AskSection />
      <OutsideWork />
      <ContactSection />
    </main>
  )
}
