import { describe, expect, it } from "vitest";
import { parseCommand, tokenize } from "@/lib/terminal/tokenizer";

describe("tokenize", () => {
  it("splits on whitespace", () => {
    expect(tokenize("project mesha")).toEqual(["project", "mesha"]);
  });

  it("keeps a double-quoted substring as one token", () => {
    expect(tokenize('ask "what did you build at mesha"')).toEqual([
      "ask",
      "what did you build at mesha",
    ]);
  });

  it("collapses repeated whitespace", () => {
    expect(tokenize("help   about")).toEqual(["help", "about"]);
  });

  it("returns an empty array for blank input", () => {
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("parseCommand", () => {
  it("lowercases the command name and keeps arg casing", () => {
    expect(parseCommand("HELP")).toEqual({
      command: "help",
      args: [],
      rawInput: "HELP",
    });
  });

  it("splits command and args", () => {
    expect(parseCommand("project Mesha")).toEqual({
      command: "project",
      args: ["Mesha"],
      rawInput: "project Mesha",
    });
  });

  it("returns null for empty input", () => {
    expect(parseCommand("   ")).toBeNull();
  });
});
