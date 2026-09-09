import type { ReactNode } from "react"
import { ThemeBackground } from "@/components/ui/theme-background"
import { Navbar } from "@/components/ui/navbar"

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-transparent text-surface-100">
      <ThemeBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
