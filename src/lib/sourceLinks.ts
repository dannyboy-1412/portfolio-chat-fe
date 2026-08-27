export type SourceLinkType = "project" | "experience";

export type SourceLink = {
  type: SourceLinkType;
  id: string;
};

const SOURCE_LINK_REGEX = /\[\[LINK:(project|experience):([a-z0-9-]+)\]\]/gi;

/**
 * Event name used to tell the experience timeline to expand a project anchor.
 * Work projects only render once their role's Details is open, so same-page
 * links to `/#project-<slug>` dispatch this instead of relying on the hash.
 */
export const PROJECT_ANCHOR_EVENT = "portfolio:project-anchor";

/**
 * Extracts `[[LINK:project:mesha]]` / `[[LINK:experience:infrrd]]` markers the
 * assistant appends to ground answers back in the portfolio, mirroring the
 * `[[CONTACT_CTA]]` convention in `contactCta.ts`.
 */
export function extractSourceLinks(content: string): {
  text: string;
  links: SourceLink[];
} {
  const links: SourceLink[] = [];
  const withoutMarkers = content.replace(SOURCE_LINK_REGEX, (_match, type: string, id: string) => {
    links.push({ type: type as SourceLinkType, id });
    return "";
  });

  const text = stripPartialMarkerSuffix(withoutMarkers.trimEnd());
  const uniqueLinks = links.filter(
    (link, index) =>
      links.findIndex((other) => other.type === link.type && other.id === link.id) === index
  );

  return { text, links: uniqueLinks };
}

/** Hides an in-progress `[[LINK:...` suffix while it is still streaming in. */
function stripPartialMarkerSuffix(text: string): string {
  const start = text.lastIndexOf("[[");
  if (start === -1) {
    return text;
  }

  const tail = text.slice(start);
  if (!tail.includes("]]") && tail.length < 40) {
    return text.slice(0, start).trimEnd();
  }

  return text;
}
