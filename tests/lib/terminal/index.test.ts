import { describe, expect, it } from "vitest";
import { commandNames, executeCommand } from "@/lib/terminal";
import { PROFILE } from "@/shared/profile";

describe("executeCommand", () => {
  it("returns an error result for an unknown command", () => {
    const result = executeCommand("frobnicate");
    expect(result?.kind).toBe("output");
    if (result?.kind === "output") {
      expect(result.segments[0]).toMatchObject({ tone: "error" });
    }
  });

  it("returns null for empty input", () => {
    expect(executeCommand("   ")).toBeNull();
  });

  it("clear returns a clear result", () => {
    expect(executeCommand("clear")).toEqual({ kind: "clear" });
  });

  it("help lists every visible command as a clickable run action", () => {
    const result = executeCommand("help");
    expect(result?.kind).toBe("output");
    if (result?.kind !== "output") throw new Error("expected output");

    const runCommands = result.segments
      .filter((segment) => segment.kind === "link")
      .map((segment) => (segment.kind === "link" ? segment.action : null));

    for (const action of runCommands) {
      expect(action).toMatchObject({ type: "run" });
    }
    expect(commandNames()).toContain("help");
    expect(commandNames()).not.toContain("chat"); // hidden alias
  });

  it("about scrolls to the about section", () => {
    const result = executeCommand("about");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "scroll", targetId: "about" },
    });
  });

  it("project <slug> navigates to the matching project route", () => {
    const result = executeCommand("project mesha");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "navigate", href: "/projects/mesha" },
    });
  });

  it("project with an unknown slug returns an error listing valid slugs", () => {
    const result = executeCommand("project not-a-real-project");
    expect(result?.kind).toBe("output");
    if (result?.kind !== "output") throw new Error("expected output");
    expect(result.segments[0]).toMatchObject({ tone: "error" });
  });

  it("project with no args returns usage help", () => {
    const result = executeCommand("project");
    expect(result?.kind).toBe("output");
  });

  it('ask "<question>" opens chat with the question as the prompt', () => {
    const result = executeCommand('ask "what did you build at mesha"');
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "open-chat", prompt: "what did you build at mesha" },
    });
  });

  it("ask with no question returns usage help instead of opening chat", () => {
    const result = executeCommand("ask");
    expect(result?.kind).toBe("output");
  });

  it("start-chat with no context opens a general conversation", () => {
    const result = executeCommand("start-chat");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "open-chat", context: null },
    });
  });

  it("start-chat --context=<project slug> resolves to a project context", () => {
    const result = executeCommand("start-chat --context=mesha");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "open-chat", context: { type: "project", id: "mesha" } },
    });
  });

  it("start-chat --context=<experience id> resolves to an experience context", () => {
    const result = executeCommand("start-chat --context=infrrd");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "open-chat", context: { type: "experience", id: "infrrd" } },
    });
  });

  it("start-chat --context=<unknown> falls back to a general conversation", () => {
    const result = executeCommand("start-chat --context=not-real");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "open-chat", context: null },
    });
  });

  it("resume navigates to the resume asset", () => {
    const result = executeCommand("resume");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "navigate", href: PROFILE.socials.resume },
    });
  });

  it("experience scrolls to the experience section", () => {
    const result = executeCommand("experience");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "scroll", targetId: "experience" },
    });
  });

  it("skills scrolls to the skills section", () => {
    const result = executeCommand("skills");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "scroll", targetId: "skills" },
    });
  });

  it("contact scrolls to the contact section", () => {
    const result = executeCommand("contact");
    expect(result).toMatchObject({
      kind: "action",
      action: { type: "scroll", targetId: "contact" },
    });
  });
});
