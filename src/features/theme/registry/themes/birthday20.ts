import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "birthday20",
    name: "Birthday20",
    ramp: {
      hue: 146.8,
      chroma: 0.5438,
      lightest: 0.9878,
      darkest: 0.3807
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.1056
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6229,
          chroma: {
            delta: 0.0557
          },
          hue: {
            delta: 1.87
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.263,
          chroma: {
            delta: -0.3322
          },
          hue: {
            delta: -1.74
          }
        },
        panel: {
          kind: "tone",
          at: 0.0168,
          chroma: {
            delta: 0.1711
          },
          hue: {
            delta: -3.19
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
            delta: 0.4562
          },
          hue: {
            delta: -1.38
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.0292,
                  chroma: {
                    delta: -0.0855
                  },
                  hue: {
                    delta: -8.99
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#f3fff3") }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
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
                color: {
                  kind: "tone",
                  at: 0.0943,
                  chroma: {
                    delta: -0.2233
                  },
                  hue: {
                    delta: -6.13
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.041,
                  chroma: {
                    delta: -0.1604
                  },
                  hue: {
                    delta: -5.28
                  }
                },
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
    backdrop: {
      scenes: [
        {
          id: "birthday20"
        }
      ]
    },
    mark: {
      mode: "unified",
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.2393,
                chroma: {
                  delta: -0.1607
                },
                hue: {
                  delta: -6.44
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#e3ffeb") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.767,
    maxDeltaEOk: 0.000366,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
