export const CONTACT_CTA_MARKER = "[[CONTACT_CTA]]";

/**
 * Strips the contact CTA marker from streamed assistant text.
 * Partial suffixes of the marker are hidden so they do not flash while tokens arrive.
 */
export function extractContactCta(content: string): {
  text: string;
  showCta: boolean;
} {
  const showCta = content.includes(CONTACT_CTA_MARKER);
  const withoutMarker = content.replaceAll(CONTACT_CTA_MARKER, "");
  const text = stripPartialMarkerSuffix(withoutMarker).trimEnd();
  return { text, showCta };
}

function stripPartialMarkerSuffix(text: string): string {
  const start = text.lastIndexOf("[[");
  if (start === -1) {
    return text;
  }

  const tail = text.slice(start);
  if (
    tail.length > 0 &&
    tail.length < CONTACT_CTA_MARKER.length &&
    CONTACT_CTA_MARKER.startsWith(tail)
  ) {
    return text.slice(0, start);
  }

  return text;
}
