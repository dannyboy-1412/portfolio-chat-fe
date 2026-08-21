import { describe, expect, it } from "vitest";
import { CONTACT_CTA_MARKER, extractContactCta } from "@/lib/contactCta";

describe("extractContactCta", () => {
  it("leaves ordinary text unchanged and hides the CTA", () => {
    expect(extractContactCta("Daniel prefers to keep that private.")).toEqual({
      text: "Daniel prefers to keep that private.",
      showCta: false,
    });
  });

  it("strips a marker at the end of a reply and shows the CTA", () => {
    expect(
      extractContactCta(
        `You can reach him at danielantorodri@gmail.com.\n${CONTACT_CTA_MARKER}`
      )
    ).toEqual({
      text: "You can reach him at danielantorodri@gmail.com.",
      showCta: true,
    });
  });

  it("strips a marker in the middle of a reply and shows the CTA", () => {
    expect(
      extractContactCta(`Reach him here ${CONTACT_CTA_MARKER} if you like.`)
    ).toEqual({
      text: "Reach him here  if you like.",
      showCta: true,
    });
  });

  it("hides a partial marker suffix while tokens are still streaming", () => {
    expect(extractContactCta("You can email him. [[CONT")).toEqual({
      text: "You can email him.",
      showCta: false,
    });
    expect(extractContactCta("You can email him. [[")).toEqual({
      text: "You can email him.",
      showCta: false,
    });
  });

  it("shows the CTA with empty text when the content is only the marker", () => {
    expect(extractContactCta(CONTACT_CTA_MARKER)).toEqual({
      text: "",
      showCta: true,
    });
  });

  it("keeps unrelated double-bracket text that is not a marker prefix", () => {
    expect(extractContactCta("See the table [[notes]] for details.")).toEqual({
      text: "See the table [[notes]] for details.",
      showCta: false,
    });
  });
});
