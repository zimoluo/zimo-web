import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "plain-dark",
    name: "Plain Dark",
    ramp: {
      hue: 0,
      chroma: 0,
      lightest: 0.9881,
      darkest: 0.36
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
          at: 0.7666,
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
          at: 0.2718,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.0734,
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
          at: 0.0068,
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
          at: 0.2334,
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
          at: 0.7282,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.9266,
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
          at: 0.9932,
          hue: {
            delta: 89.88
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true,
      lightReviewed: false
    },
    surfaceScheme: "dark",
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#3d3d3d") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#3e3e3e") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
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
                color: { kind: "literal", value: literal("#494949") },
                alpha: 0.5,
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#494949") },
                alpha: 0.5,
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
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
    mark: {
      mode: "outline"
    },
    reading: {
      blur: 0
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.501,
    maxDeltaEOk: 0.000024,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
