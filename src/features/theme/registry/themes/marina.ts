import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "marina",
    name: "Marina",
    ramp: {
      hue: 148.81,
      chroma: 0.7574,
      lightest: 0.9933,
      darkest: 0.289
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.2426
          },
          hue: {
            delta: -11.03
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.0858,
          chroma: {
            delta: 0.2426
          },
          hue: {
            delta: -1.15
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4495,
          chroma: {
            delta: -0.1424
          },
          hue: {
            delta: 7.87
          }
        },
        panel: {
          kind: "tone",
          at: 0.4555,
          chroma: {
            delta: -0.3427
          },
          hue: {
            delta: -5.69
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#2c4a2b") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.199
          },
          hue: {
            delta: 115.88
          }
        }
      }
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
                color: { kind: "literal", value: literal("#020887") }
              },
              {
                at: 20,
                color: { kind: "literal", value: literal("#020887") }
              },
              {
                at: 20.01,
                color: { kind: "literal", value: literal("#334195") }
              },
              {
                at: 40,
                color: { kind: "literal", value: literal("#334195") }
              },
              {
                at: 40.01,
                color: { kind: "literal", value: literal("#647aa3") }
              },
              {
                at: 60,
                color: { kind: "literal", value: literal("#647aa3") }
              },
              {
                at: 60.01,
                color: { kind: "literal", value: literal("#95b2b0") }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#95b2b0") }
              },
              {
                at: 80.01,
                color: {
                  kind: "tone",
                  at: 0.1423,
                  chroma: {
                    delta: -0.4133
                  },
                  hue: {
                    delta: -8.72
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.1423,
                  chroma: {
                    delta: -0.4133
                  },
                  hue: {
                    delta: -8.72
                  }
                }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 180
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
                color: { kind: "literal", value: literal("#5366d4") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#5366d4") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 90
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
                at: 15,
                color: { kind: "literal", value: literal("#334195") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#334195") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 90
            }
          }
        ]
      }
    },
    mark: {
      mode: "backdrop"
    },
    reading: {
      blur: 0
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.609,
    maxDeltaEOk: 0.000065,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
