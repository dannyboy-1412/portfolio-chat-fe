import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..")
const distDir = path.join(rootDir, "dist")
const indexFile = path.join(distDir, "index.html")

const projectsSource = readFileSync(
  path.join(rootDir, "src/shared/projects.ts"),
  "utf8"
)
const slugs = [...projectsSource.matchAll(/slug:\s*'([^']+)'/g)].map(
  (match) => match[1]
)

copyFileSync(indexFile, path.join(distDir, "404.html"))
writeFileSync(path.join(distDir, ".nojekyll"), "")

for (const slug of slugs) {
  const dir = path.join(distDir, "projects", slug)
  mkdirSync(dir, { recursive: true })
  copyFileSync(indexFile, path.join(dir, "index.html"))
}

const siteUrl = (
  process.env.VITE_SITE_URL ?? "https://dannyboy-1412.github.io/portfolio-fe"
).replace(/\/$/, "")
const lastmod = new Date().toISOString().slice(0, 10)
const urls = [
  siteUrl,
  ...slugs.map((slug) => `${siteUrl}/projects/${slug}`),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>
`
writeFileSync(path.join(distDir, "sitemap.xml"), sitemap)
