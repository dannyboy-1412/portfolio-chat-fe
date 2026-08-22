import { describe, expect, it } from "vitest";
import { resolveContextBlock, validSourceSlugs } from "@/server/ai/context";
import { EXPERIENCES } from "@/shared/profile";
import { PROJECTS } from "@/shared/projects";

describe("resolveContextBlock", () => {
  it("returns null when type or id is missing", () => {
    expect(resolveContextBlock({})).toBeNull();
    expect(resolveContextBlock({ type: "project" })).toBeNull();
    expect(resolveContextBlock({ id: "mesha" })).toBeNull();
  });

  it("returns null for an unknown project slug", () => {
    expect(resolveContextBlock({ type: "project", id: "not-real" })).toBeNull();
  });

  it("returns null for an unknown experience id", () => {
    expect(resolveContextBlock({ type: "experience", id: "not-real" })).toBeNull();
  });

  it("builds a project context block with key facts", () => {
    const block = resolveContextBlock({ type: "project", id: "mesha" });
    expect(block).toContain("Mesha");
    expect(block).toContain("AI Agent Builder");
    expect(block).toContain("slug \"mesha\"");
  });

  it("builds an experience context block with key facts", () => {
    const block = resolveContextBlock({ type: "experience", id: "infrrd" });
    expect(block).toContain("INFRRD");
    expect(block).toContain("id \"infrrd\"");
  });
});

describe("validSourceSlugs", () => {
  it("returns every project slug and experience id", () => {
    const { projects, experiences } = validSourceSlugs();
    expect(projects).toEqual(PROJECTS.map((project) => project.slug));
    expect(experiences).toEqual(EXPERIENCES.map((experience) => experience.id));
  });
});
