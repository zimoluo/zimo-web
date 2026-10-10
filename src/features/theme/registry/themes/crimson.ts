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
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.3494
          },
          hue: {
            delta: -1.56
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.8001,
          chroma: {
            delta: 0.0687
          },
          hue: {
            delta: -3.89
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.2577,
          chroma: {
            delta: -0.2495
          },
          hue: {
            delta: -3.73
          }
        },
        panel: {
          kind: "tone",
          at: 0.0555,
          chroma: {
            delta: -0.1686
          },
          hue: {
            delta: -2.35
          }
        },
        edge: 0,
        shade: 1,
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
      },
      mirrorDark: true,
      darkReviewed: false
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
