import { Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/app-shell"
import { JsonLd } from "@/components/json-ld"
import { HomePage } from "@/pages/home"
import { ProjectDetailPage } from "@/pages/project-detail"

export function App() {
  return (
    <>
      <JsonLd />
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </>
  )
}

function NotFoundPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-24 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight text-surface-50">
        Page not found
      </h1>
      <p className="mt-4 text-surface-400">That URL is not a page on this site.</p>
    </main>
  )
}
