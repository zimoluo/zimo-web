import { describe, expect, it } from "vitest";
import { identityAvatarSource } from "./IdentityAvatar";
describe("authored identity avatar palette", () => {
  it.each([
    ["reader", "#17305f", "#3466c4", "#c6d4ee"],
    ["author", "#4a175f", "#9b34c4", "#e3c6ee"],
    ["10000", "#2b175f", "#5d34c4", "#d1c6ee"],
  ])("preserves the historical signature colors for %s", (sub, stroke, lower, upper) => {
    const source = identityAvatarSource(sub);
    expect(source.mark?.stroke).toEqual({ kind: "literal", value: stroke });
    expect(source.mark?.gradients?.[0]?.stops.map((stop) => stop.color)).toEqual([{ kind: "literal", value: lower }, { kind: "literal", value: upper }]);
  });
});
