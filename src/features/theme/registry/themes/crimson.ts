import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "crimson",
    name: "Crimson",
    ramp: {
      hue: 23.44,
      chroma: 0.5034,
      lightest: 0.9867,
      darkest: 0.3451,
      torsion: 8.56
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":1,"chroma":{"delta":0.34927912},"hue":{"delta":-1.55907608}},
        textMuted: {"kind":"tone","at":0.8001495,"chroma":{"delta":0.06871839},"hue":{"delta":-3.88742257}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.25766573,"chroma":{"delta":-0.24948584},"hue":{"delta":-3.72516096}},
        panel: {"kind":"tone","at":0.05553795,"chroma":{"delta":-0.16861133},"hue":{"delta":-2.34630527}},
        edge: { kind: "literal", value: literal("#f3eded") },
        shade: { kind: "literal", value: literal("#4b2929") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.8835,
          chroma: {
            delta: 0.2654
          },
          hue: {
            delta: -1.96
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
                at: 20,
                color: { kind: "literal", value: literal("#fff9f9") }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fff3f3") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 60
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
                at: 20,
                color: { kind: "literal", value: literal("#fff9f9") },
                binding: "scaled"
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fff3f3") },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 60
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
          id: "crimson"
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.4294,
                chroma: {
                  delta: -0.2417
                },
                hue: {
                  delta: -4.53
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ffeaea") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.765,
    maxDeltaEOk: 0.000041,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
