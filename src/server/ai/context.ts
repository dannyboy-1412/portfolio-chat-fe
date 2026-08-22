import { EXPERIENCES, getExperienceById } from "@/shared/profile";
import { getProjectBySlug, PROJECTS } from "@/shared/projects";

export type ChatContextType = "project" | "experience";

export type ChatContextInput = {
  type?: ChatContextType | null;
  id?: string | null;
};

/**
 * Builds the "visitor is currently looking at X" block injected into the
 * system prompt. Returns null when the context is missing or unresolvable,
 * so the caller can fall back to a general answer instead of failing.
 */
export function resolveContextBlock(context: ChatContextInput): string | null {
  if (!context.type || !context.id) {
    return null;
  }

  if (context.type === "project") {
    const project = getProjectBySlug(context.id);
    if (!project) return null;

    return [
      `The visitor is currently viewing the project "${project.name}" (${project.tagline}), slug "${project.slug}".`,
      `Description: ${project.description}`,
      `Problem: ${project.problem}`,
      `Solution: ${project.solution}`,
      `Architecture: ${project.architecture}`,
      `Technologies: ${project.technologies.join(", ")}`,
      `Impact: ${project.impact.join("; ")}`,
      "Prioritise answering about this project unless the visitor clearly asks about something else.",
    ].join("\n");
  }

  const experience = getExperienceById(context.id);
  if (!experience) return null;

  return [
    `The visitor is currently viewing Daniel's role at "${experience.company}" (${experience.role}, ${experience.period}), id "${experience.id}".`,
    `Summary: ${experience.summary}`,
    `Problem: ${experience.problem}`,
    `What Daniel built: ${experience.built}`,
    `Architecture: ${experience.architecture}`,
    `Impact: ${experience.impact.join("; ")}`,
    "Prioritise answering about this role unless the visitor clearly asks about something else.",
  ].join("\n");
}

export function validSourceSlugs(): { projects: string[]; experiences: string[] } {
  return {
    projects: PROJECTS.map((project) => project.slug),
    experiences: EXPERIENCES.map((experience) => experience.id),
  };
}
