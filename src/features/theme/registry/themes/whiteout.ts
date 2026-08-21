import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "whiteout",
    name: "Whiteout",
    ramp: {
      hue: 266.84,
      chroma: 0.4143,
      lightest: 0.9816,
      darkest: 0.3816,
      torsion: -5.03
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.1852
          },
          hue: {
            delta: 0.69
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6632,
          chroma: {
            delta: -0.1935
          },
          hue: {
            delta: -1.39
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3807,
          chroma: {
            delta: -0.0396
          },
          hue: {
            delta: 3.75
          }
        },
        panel: {
          kind: "tone",
          at: 0.0325,
          chroma: {
            delta: 0.4184
          },
          hue: {
            delta: -0.7
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
          at: 0.0677,
          chroma: {
            delta: 0.3113
          },
          hue: {
            delta: 7.33
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
                at: 40,
                color: { kind: "literal", value: literal("#f6f9ff") }
              },
              {
                at: 98,
                color: {
                  kind: "tone",
                  at: 0.0677,
                  chroma: {
                    delta: 0.3113
                  },
                  hue: {
                    delta: 7.33
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "circle",
              size: "farthest-side"
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
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.0884,
                  chroma: {
                    delta: 0.2207
                  },
                  hue: {
                    delta: -1.63
                  }
                },
                binding: "scaled"
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.0486,
                  chroma: {
                    delta: 0.3161
                  },
                  hue: {
                    delta: 0.87
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
          id: "whiteout"
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.376,
                chroma: {
                  delta: -0.0339
                },
                hue: {
                  delta: -1.96
                }
              }
            },
            {
              offset: 0.66667,
              color: {
                kind: "tone",
                at: 0.0912,
                chroma: {
                  delta: 0.1843
                },
                hue: {
                  delta: 4.33
                }
              }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.755,
    maxDeltaEOk: 0.00003,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
