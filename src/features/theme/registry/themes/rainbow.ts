import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "rainbow",
    name: "Rainbow",
    ramp: {
      hue: 256.47,
      chroma: 0.3447,
      lightest: 0.9842,
      darkest: 0.3717,
      torsion: 11.45
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":1,"chroma":{"delta":-0.05137468},"hue":{"delta":-4.90804937}},
        textMuted: {"kind":"tone","at":0.77622067,"chroma":{"delta":-0.12795314},"hue":{"delta":-1.76866916}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.02889786,"chroma":{"delta":0.08905802},"hue":{"delta":-3.18031319}},
        panel: {"kind":"tone","at":0.00008732,"chroma":{"delta":0.09042145},"hue":{"delta":-2.88845583}},
        edge: { kind: "literal", value: literal("#eaf0f5") },
        shade: { kind: "literal", value: literal("#213a53") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.2033,
          chroma: {
            delta: -0.0437
          }
        }
      }
    },
    surfaceScheme: "light",
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#ff9999") }
              },
              {
                at: 16.67,
                color: { kind: "literal", value: literal("#ffb380") }
              },
              {
                at: 33.33,
                color: { kind: "literal", value: literal("#ffff80") }
              },
              {
                at: 50,
                color: { kind: "literal", value: literal("#80ff80") }
              },
              {
                at: 66.67,
                color: { kind: "literal", value: literal("#80b3ff") }
              },
              {
                at: 83.33,
                color: {
                  kind: "tone",
                  at: 0.6051,
                  chroma: {
                    delta: 0.2331
                  },
                  hue: {
                    delta: 47.65
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#cc99ff") }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 135
            }
          }
        ]
      },
      widget: {
        layers: [
          {
            id: "widget-0",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#ff9999") },
                binding: "scaled"
              },
              {
                at: 16.67,
                color: { kind: "literal", value: literal("#ffb380") },
                binding: "scaled"
              },
              {
                at: 33.33,
                color: { kind: "literal", value: literal("#ffff80") },
                binding: "scaled"
              },
              {
                at: 50,
                color: { kind: "literal", value: literal("#80ff80") },
                binding: "scaled"
              },
              {
                at: 66.67,
                color: { kind: "literal", value: literal("#80b3ff") },
                binding: "scaled"
              },
              {
                at: 83.33,
                color: {
                  kind: "tone",
                  at: 0.6051,
                  chroma: {
                    delta: 0.2331
                  },
                  hue: {
                    delta: 47.65
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#cc99ff") },
                binding: "scaled"
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 135
            }
          }
        ],
        alpha: 0.68,
        lens: {
          blur: 12,
          saturate: 1.15
        },
        variation: {
          rotate: 24,
          shift: 12,
          count: 8
        }
      }
    },
    backdrop: {
      scenes: [
        {
          id: "rainbow"
        }
      ]
    },
    mark: {
      mode: "backdrop"
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.905,
    maxDeltaEOk: 0.000071,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
