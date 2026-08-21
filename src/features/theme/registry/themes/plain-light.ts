import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "plain-light",
    name: "Plain Light",
    ramp: {
      hue: 0,
      chroma: 0,
      lightest: 1,
      darkest: 0.3092
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
          at: 0.76,
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
          at: 0.2035,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.0239,
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
        brand: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 37.274
          },
          hue: {
            delta: 89.88
          }
        }
      },
      mirrorDark: true,
      darkReviewed: false
    },
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#ffffff") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffffff") }
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
                color: { kind: "literal", value: literal("#fbfbfb") },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#fbfbfb") },
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
    scheme: "light",
    purity: 0,
    maxDeltaEOk: 0.000031,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
