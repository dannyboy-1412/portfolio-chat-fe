const raw = process.env.VERIFY_URL ?? "http://localhost:3017/"
const url = raw.endsWith("/") ? raw : `${raw}/`

const res = await fetch(url, { redirect: "manual" })
if (res.status !== 200) {
  console.error(`doctor: GET ${url} returned ${res.status}`)
  process.exit(1)
}

const html = await res.text()
if (!html.includes("Daniel Rodrigues")) {
  console.error(`doctor: GET ${url} did not look like this portfolio`)
  process.exit(1)
}

const projectUrl = new URL("projects/portfolio", url)
const project = await fetch(projectUrl)
if (project.status !== 200) {
  console.error(`doctor: GET ${projectUrl} returned ${project.status}`)
  process.exit(1)
}

console.log(
  JSON.stringify({
    ok: true,
    url,
    homeStatus: res.status,
    projectStatus: project.status,
  })
)
