import { describe, expect, it } from "vitest";
import { getTheme, resolve, schemesOf, themeIds } from "../theme";
import { sceneIds, sceneRegistry, getScene } from "./registry";
import { defaultsOf, validateParams } from "./contract";
import { planScenes, structuralKey } from "./plan";
import { updateSceneRuntime } from "./runtime";
const quality = { backdrop: "full", reducedMotion: false, saveData: false } as const;

describe("the authored scene catalog", () => {
  it("retains every authored scene, deriving ids from one registry", () => {
    expect(sceneIds).toHaveLength(36);
    expect(Object.values(sceneRegistry).filter((scene) => scene.themeable === false)).toHaveLength(6);
    expect(Object.values(sceneRegistry).filter((scene) => scene.surface === "r3f")).toHaveLength(5);
  });
  it.each(sceneIds)("%s validates defaults and rejects unrecognized controls", (id) => {
    const scene = sceneRegistry[id];
    expect(scene.schema.safeParse(defaultsOf(scene)).success).toBe(true);
    expect(validateParams(scene, scene.defaults).issues).toEqual([]);
    expect(scene.schema.safeParse({ unexpected: 1 }).success).toBe(false);
  });
  it("resolves every migrated scene reference and scene mark", () => {
    for (const id of themeIds) {
      const theme = getTheme(id);
      for (const reference of theme.backdrop?.scenes ?? []) expect(getScene(reference.id), `${id}/${reference.id}`).toBeDefined();
      if (theme.mark?.sceneId !== undefined) expect(getScene(theme.mark.sceneId), `${id} mark`).toBeDefined();
    }
    expect(getScene("gallery3D")?.id).toBe("gallery-3d");
    expect(getScene("birthday20")?.id).toBe("birthday-20");
    expect(getScene("toString")).toBeUndefined();
  });
  it("honors route restriction and validates arbitrary scene params at the boundary", () => {
    const source = getTheme("home");
    const resolved = resolve({ ...source, backdrop: { scenes: [{ id: "sky", only: ["blog"], params: { speed: 99 } }] } }, schemesOf(source)[0] ?? "light");
    expect(planScenes(resolved, "home", quality)).toEqual([]);
    const plan = planScenes(resolved, "blog", quality);
    expect(plan[0]?.input.params.speed).toBe(4);
  });
  it("motion preference keeps a static composition and off removes the stack", () => {
    const source = getTheme("home");
    const theme = resolve(source, schemesOf(source)[0] ?? "light");
    expect(planScenes(theme, "home", { ...quality, reducedMotion: true })[0]?.input.quality).toBe("still");
    expect(planScenes(theme, "home", { ...quality, backdrop: "off" })).toEqual([]);
  });
  it("distinguishes structural changes from palette and continuous uniform changes", () => {
    const source = getTheme("home");
    const scheme = schemesOf(source)[0] ?? "light";
    const sceneSource = { ...source, backdrop: { scenes: [{ id: "velvet" }] } };
    const first = planScenes(resolve(sceneSource, scheme), "home", quality);
    const changed = planScenes(resolve({ ...sceneSource, ramp: { ...source.ramp, hue: 150 }, backdrop: { scenes: [{ id: "velvet", params: { noiseAmplitude: 1.5, opacity: 0.4, speed: 2 } }] } }, scheme), "home", quality);
    expect(structuralKey(first)).toBe(structuralKey(changed));
    const still = planScenes(resolve(sceneSource, scheme), "home", { ...quality, reducedMotion: true });
    expect(structuralKey(first)).not.toBe(structuralKey(still));
    const input = first[0]?.input; const replacement = changed[0]?.input;
    if (input === undefined || replacement === undefined) throw new Error("Scene plan is empty");
    let updates = 0;
    const runtime = { input, listeners: new Set([() => { updates++; }]) };
    updateSceneRuntime(runtime, replacement);
    expect(runtime.input).toBe(replacement);
    expect(updates).toBe(1);
  });
});
