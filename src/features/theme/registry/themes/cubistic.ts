import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "cubistic",
    name: "Cubistic",
    ramp: {
      hue: 0,
      chroma: 0,
      lightest: 0.9731,
      darkest: 0.5382
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          hue: {
            delta: 89.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7469,
          hue: {
            delta: 89.88
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.2578,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.155,
          hue: {
            delta: 89.88
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#3a3a3a") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.2878,
          hue: {
            delta: 89.88
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          hue: {
            delta: 89.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2531,
          hue: {
            delta: 89.88
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.7422,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.845,
          hue: {
            delta: 89.88
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#3a3a3a") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.7122,
          hue: {
            delta: 89.88
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true
    },
    surfaceScheme: "dark",
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 20,
                color: { kind: "literal", value: literal("#7e7e7e") }
              },
              {
                at: 50,
                color: { kind: "literal", value: literal("#999999") }
              }
            ],
            repeating: true,
            kind: "conic",
            from: 45,
            at: {
              x: 43,
              y: 62
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
                at: 25,
                color: { kind: "literal", value: literal("#8f8f8f") },
                alpha: 0.1,
                binding: "scaled"
              },
              {
                at: 55,
                color: { kind: "literal", value: literal("#6e6e6e") },
                alpha: 0.15,
                binding: "scaled"
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 210
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 25,
                color: { kind: "literal", value: literal("#8f8f8f") },
                alpha: 0.2,
                binding: "scaled"
              },
              {
                at: 55,
                color: { kind: "literal", value: literal("#6e6e6e") },
                alpha: 0.2,
                binding: "scaled"
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 150
            }
          },
          {
            id: "widget-2",
            stops: [
              {
                at: 20,
                color: { kind: "literal", value: literal("#8f8f8f") },
                alpha: 0.69,
                binding: "scaled"
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#747474") },
                alpha: 0.65,
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 150
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
      },
      "page-reduced": {
        layers: [
          {
            id: "page-reduced-0",
            stops: [
              {
                at: 100,
                color: { kind: "literal", value: literal("#898989") }
              },
              {
                at: 0,
                color: { kind: "literal", value: literal("#909090") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
            }
          }
        ]
      }
    },
    mark: {
      mode: "backdrop"
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.501,
    maxDeltaEOk: 0.000046,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
