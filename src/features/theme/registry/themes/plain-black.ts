import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "plain-black",
    name: "Plain Black",
    ramp: {
      hue: 0,
      chroma: 0,
      lightest: 0.9672,
      darkest: 0
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          hue: {
            delta: 89.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7804,
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
          at: 0.4508,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.25,
          hue: {
            delta: 89.88
          }
        },
        edge: 1,
        shade: 0,
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: 0
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          hue: {
            delta: 89.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2196,
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
          at: 0.5492,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.75,
          hue: {
            delta: 89.88
          }
        },
        edge: 0,
        shade: 1,
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: 1
      },
      mirrorDark: false,
      darkReviewed: true
    },
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 1
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 1
                }
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
                color: { kind: "literal", value: literal("#242424") },
                alpha: 0.75,
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#242424") },
                alpha: 0.75,
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
    purity: 0.601,
    maxDeltaEOk: 0.000049,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
