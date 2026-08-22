import { PROFILE } from "@/shared/profile";

export const CONTACT_CTA_MARKER = "[[CONTACT_CTA]]";

const CONTACT_INTENT =
  /\b(e-?mail|contact|reach(?:\s+out)?|get in touch|hire|hiring|enquir(?:y|ies)|inquir(?:y|ies)|collaborate|collaboration|work with (?:you|him|daniel))\b/i;

/**
 * Strips the contact CTA marker from streamed assistant text.
 * Partial suffixes of the marker are hidden so they do not flash while tokens arrive.
 */
export function extractContactCta(content: string): {
  text: string;
  showCta: boolean;
} {
  const withoutMarker = content.replaceAll(CONTACT_CTA_MARKER, "");
  const text = stripPartialMarkerSuffix(withoutMarker).trimEnd();
  const showCta =
    content.includes(CONTACT_CTA_MARKER) ||
    content.toLowerCase().includes(PROFILE.socials.email.toLowerCase());
  return { text, showCta };
}

export function isContactIntent(content: string): boolean {
  return CONTACT_INTENT.test(content);
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
