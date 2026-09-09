import { PROFILE } from "@/shared/profile"
import { getSiteUrl } from "@/lib/siteUrl"

export function JsonLd() {
  const siteUrl = getSiteUrl()
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: PROFILE.name,
    jobTitle: PROFILE.role,
    url: siteUrl,
    email: `mailto:${PROFILE.socials.email}`,
    sameAs: [PROFILE.socials.github, PROFILE.socials.linkedin],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
    />
  )
}
