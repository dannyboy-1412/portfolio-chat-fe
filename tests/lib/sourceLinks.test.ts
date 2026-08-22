import { describe, expect, it } from "vitest";
import { extractSourceLinks } from "@/lib/sourceLinks";

describe("extractSourceLinks", () => {
  it("leaves ordinary text unchanged with no links", () => {
    expect(extractSourceLinks("Daniel built a document AI pipeline.")).toEqual({
      text: "Daniel built a document AI pipeline.",
      links: [],
    });
  });

  it("extracts a single trailing project marker", () => {
    expect(
      extractSourceLinks("He built the Closing agent at Mesha.\n[[LINK:project:mesha]]")
    ).toEqual({
      text: "He built the Closing agent at Mesha.",
      links: [{ type: "project", id: "mesha" }],
    });
  });

  it("extracts multiple markers of different types", () => {
    const result = extractSourceLinks(
      "Daniel worked on document extraction.\n[[LINK:experience:infrrd]]\n[[LINK:project:document-ai]]"
    );
    expect(result.text).toBe("Daniel worked on document extraction.");
    expect(result.links).toEqual([
      { type: "experience", id: "infrrd" },
      { type: "project", id: "document-ai" },
    ]);
  });

  it("deduplicates repeated markers", () => {
    const result = extractSourceLinks(
      "[[LINK:project:mesha]] some text [[LINK:project:mesha]]"
    );
    expect(result.links).toEqual([{ type: "project", id: "mesha" }]);
  });

  it("hides a partial marker suffix while streaming", () => {
    expect(extractSourceLinks("Ask him about Mesha [[LINK:proj")).toEqual({
      text: "Ask him about Mesha",
      links: [],
    });
  });

  it("keeps unrelated double-bracket text that is not a marker", () => {
    expect(extractSourceLinks("See [[notes]] for details.")).toEqual({
      text: "See [[notes]] for details.",
      links: [],
    });
  });
});
