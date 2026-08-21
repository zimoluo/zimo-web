import { describe, expect, it } from "vitest";
import { defaultsOf, resolveQuality, validateParams } from "./contract";
import type { SceneModule } from "./contract";
import { dedupeChunks, glsl } from "./glsl/compose";
import { fresnel, lambert, simplex3d } from "./glsl/chunks";

const displacedField: SceneModule = {
  id: "displaced-field",
  name: "Displaced field",
  surface: "r3f",
  cost: "high",
  params: {
    noiseFrequency: { kind: "number", label: "Noise frequency", min: 0, max: 8, default: 1.2 },
    noiseAmplitude: { kind: "number", label: "Noise amplitude", min: 0, max: 2, default: 0.25 },
    timeScale: { kind: "number", label: "Speed", min: 0, max: 1, default: 0.06 },
    tilt: { kind: "number", label: "Tilt", min: -1, max: 1, default: 0.4545 },
    wireframe: { kind: "boolean", label: "Wireframe", default: false },
    geometry: {
      kind: "enum",
      label: "Geometry",
      options: ["plane", "sphere"],
      default: "plane",
    },
  },
  palette: {
    base: { kind: "role", role: "brand" },
    highlight: { kind: "tone", at: 0.3 },
  },
};

describe("T6 C8: a scene's defaults satisfy its own schema", () => {
  it("validates the defaults with no issues", () => {
    const { params, issues } = validateParams(displacedField, defaultsOf(displacedField));
    expect(issues).toEqual([]);
    expect(params).toEqual(defaultsOf(displacedField));
  });

  it("derives every default from the spec", () => {
    expect(defaultsOf(displacedField)).toEqual({
      noiseFrequency: 1.2,
      noiseAmplitude: 0.25,
      timeScale: 0.06,
      tilt: 0.4545,
      wireframe: false,
      geometry: "plane",
    });
  });
});

describe("validateParams", () => {
  it("fills an omitted parameter from its default", () => {
    const { params, issues } = validateParams(displacedField, { timeScale: 0.5 });
    expect(params.timeScale).toBe(0.5);
    expect(params.noiseFrequency).toBe(1.2);
    expect(issues).toEqual([]);
  });

  it("clamps a number to its range and says so", () => {
    const { params, issues } = validateParams(displacedField, { noiseFrequency: 99 });
    expect(params.noiseFrequency).toBe(8);
    expect(issues.join()).toContain("clamped to 8");
  });

  it("rejects a wrongly typed value and falls back", () => {
    const { params, issues } = validateParams(displacedField, {
      noiseFrequency: "fast",
      wireframe: 1,
      geometry: "torus",
    });
    expect(params.noiseFrequency).toBe(1.2);
    expect(params.wireframe).toBe(false);
    expect(params.geometry).toBe("plane");
    expect(issues).toHaveLength(3);
  });

  it("rejects a non-finite number", () => {
    const { params, issues } = validateParams(displacedField, { timeScale: Number.NaN });
    expect(params.timeScale).toBe(0.06);
    expect(issues.join()).toContain("finite number");
  });

  it("reports an unknown parameter rather than silently dropping it", () => {
    const { issues } = validateParams(displacedField, { mysteryKnob: 3 });
    expect(issues.join()).toContain("unknown parameter");
  });

  it("names the scene in every issue, so a report is actionable", () => {
    const { issues } = validateParams(displacedField, { noiseFrequency: "x", nope: 1 });
    for (const issue of issues) expect(issue.startsWith("displaced-field.")).toBe(true);
  });
});

describe("T6 §4: resolveQuality is one decision, not thirty-six", () => {
  const base = { backdrop: "full", reducedMotion: false, saveData: false } as const;

  it("does not mount the stack at all when the backdrop is off", () => {
    expect(resolveQuality({ ...base, backdrop: "off" })).toBe("unmounted");
    expect(resolveQuality({ ...base, backdrop: "off", reducedMotion: true })).toBe("unmounted");
  });

  it("F-18: reduced motion freezes the scene rather than removing it", () => {
    expect(resolveQuality({ ...base, reducedMotion: true })).toBe("still");
    expect(resolveQuality({ ...base, backdrop: "reduced", reducedMotion: true })).toBe("still");
  });

  it("gives full richness rich quality", () => {
    expect(resolveQuality(base)).toBe("rich");
  });

  it("caps reduced richness at reduced", () => {
    expect(resolveQuality({ ...base, backdrop: "reduced" })).toBe("reduced");
  });

  it("caps a save-data connection at reduced", () => {
    expect(resolveQuality({ ...base, saveData: true })).toBe("reduced");
  });

  it("drops an expensive scene to still under reduced", () => {
    expect(resolveQuality({ ...base, backdrop: "reduced", cost: "high" })).toBe("still");
    expect(resolveQuality({ ...base, saveData: true, cost: "high" })).toBe("still");
  });

  it("leaves an expensive scene rich under full richness", () => {
    expect(resolveQuality({ ...base, cost: "high" })).toBe("rich");
  });

  it("is total over every combination", () => {
    for (const backdrop of ["off", "reduced", "full"] as const) {
      for (const reducedMotion of [true, false]) {
        for (const saveData of [true, false]) {
          for (const cost of ["low", "medium", "high", undefined] as const) {
            const quality = resolveQuality({ backdrop, reducedMotion, saveData, cost });
            expect(["still", "reduced", "rich", "unmounted"]).toContain(quality);
          }
        }
      }
    }
  });
});

describe("T6 C2: the noise chunk appears once however often it is included", () => {
  it("dedupes a chunk included twice", () => {
    const shader = glsl`
      ${simplex3d}
      ${simplex3d}
      void main() { gl_FragColor = vec4(snoise(vec3(0.0)), 0.0, 0.0, 1.0); }
    `;
    expect(shader.match(/float snoise\(vec3 v\)/g) ?? []).toHaveLength(1);
  });

  it("dedupes a chunk reached directly and through a helper", () => {
    const lighting = `${simplex3d}\n${fresnel}`;
    const shader = glsl`
      ${simplex3d}
      ${lighting}
      ${lambert}
    `;
    expect(shader.match(/float snoise/g) ?? []).toHaveLength(1);
    expect(shader.match(/float zwFresnel/g) ?? []).toHaveLength(1);
    expect(shader.match(/float zwLambert/g) ?? []).toHaveLength(1);
  });

  it("keeps distinct functions", () => {
    const shader = dedupeChunks(`${fresnel}\n${lambert}`);
    expect(shader).toContain("zwFresnel");
    expect(shader).toContain("zwLambert");
  });

  it("is idempotent", () => {
    const once = dedupeChunks(simplex3d);
    expect(dedupeChunks(once)).toBe(once);
  });

  it("carries no color literal, since palette is injected", () => {
    for (const [name, chunk] of Object.entries({ simplex3d, fresnel, lambert })) {
      expect(chunk, name).not.toMatch(/vec3\(\s*0?\.\d+\s*,\s*0?\.\d+\s*,\s*0?\.\d+\s*\)/);
      expect(chunk, name).not.toMatch(/#[0-9a-fA-F]{6}/);
    }
  });
});
