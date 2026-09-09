import { describe, expect, it } from "vitest"
import {
  getProjectsByExperienceId,
  PERSONAL_PROJECTS,
} from "@/shared/projects"

describe("project helpers", () => {
  it("PERSONAL_PROJECTS contains only personal projects", () => {
    expect(PERSONAL_PROJECTS.length).toBeGreaterThan(0)
    expect(PERSONAL_PROJECTS.every((project) => project.origin === "personal")).toBe(
      true
    )
  })

  it("getProjectsByExperienceId returns only that role's work projects", () => {
    const infrrdProjects = getProjectsByExperienceId("infrrd")
    expect(infrrdProjects.map((project) => project.slug).sort()).toEqual([
      "dociq",
      "document-ai",
    ])
    expect(getProjectsByExperienceId("wipro")).toEqual([])
    expect(getProjectsByExperienceId("not-real")).toEqual([])
  })
})
