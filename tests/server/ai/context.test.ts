import { describe, expect, it } from "vitest";
import { resolveContextBlock, validSourceSlugs } from "@/server/ai/context";
import { EXPERIENCES } from "@/shared/profile";
import { PROJECTS } from "@/shared/projects";

describe("resolveContextBlock", () => {
  it("returns null when type or id is missing", () => {
    expect(resolveContextBlock({})).toBeNull();
    expect(resolveContextBlock({ type: "project" })).toBeNull();
    expect(resolveContextBlock({ id: "portfolio" })).toBeNull();
  });

  it("returns null for an unknown project slug", () => {
    expect(resolveContextBlock({ type: "project", id: "not-real" })).toBeNull();
  });

  it("returns null for an unknown experience id", () => {
    expect(resolveContextBlock({ type: "experience", id: "not-real" })).toBeNull();
  });

  it("builds a personal project context block with key facts", () => {
    const block = resolveContextBlock({ type: "project", id: "portfolio" });
    expect(block).toContain("Portfolio");
    expect(block).toContain("slug \"portfolio\"");
  });

  it("builds a work project context block with key facts", () => {
    const block = resolveContextBlock({ type: "project", id: "dociq" });
    expect(block).toContain("DocIQ");
    expect(block).toContain("slug \"dociq\"");
  });

  it("builds an experience context block that lists the role's projects", () => {
    const block = resolveContextBlock({ type: "experience", id: "infrrd" });
    expect(block).toContain("INFRRD");
    expect(block).toContain("id \"infrrd\"");
    expect(block).toContain("DocIQ");
    expect(block).toContain("Document AI");
  });

  it("falls back to role-level detail for a role without projects", () => {
    const block = resolveContextBlock({ type: "experience", id: "wipro" });
    expect(block).toContain("Wipro Limited");
    expect(block).toContain("Problem:");
  });
});

describe("validSourceSlugs", () => {
  it("returns every project slug and experience id", () => {
    const { projects, experiences } = validSourceSlugs();
    expect(projects).toEqual(PROJECTS.map((project) => project.slug));
    expect(experiences).toEqual(EXPERIENCES.map((experience) => experience.id));
  });
});
