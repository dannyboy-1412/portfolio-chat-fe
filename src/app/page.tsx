'use client'

import { ChatProvider } from '@/app/components/ui/chat-provider'
import { Navbar } from '@/app/components/ui/navbar'
import { Hero } from '@/app/components/ui/hero'
import { ExperienceTimeline } from '@/app/components/ui/experience-timeline'
import { SkillsGrid } from '@/app/components/ui/skills-grid'
import { AboutSection } from '@/app/components/ui/about-section'
import { SiteFooter } from '@/app/components/ui/site-footer'

export default function Home() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar />
        <main>
          <Hero />
          <ExperienceTimeline />
          <SkillsGrid />
          <AboutSection />
        </main>
        <SiteFooter />
      </div>
    </ChatProvider>
  )
}
