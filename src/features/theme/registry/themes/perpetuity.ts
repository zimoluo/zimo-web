import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "perpetuity",
    name: "Perpetuity",
    ramp: {
      hue: 236.09,
      chroma: 0.8744,
      lightest: 0.9814,
      darkest: 0.6282,
      torsion: 2.9
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9973,
          chroma: {
            delta: 0.1256
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7271,
          chroma: {
            delta: -0.1266
          },
          hue: {
            delta: -1.79
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1745,
          chroma: {
            delta: -0.0313
          },
          hue: {
            delta: -2.19
          }
        },
        panel: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.0324
          },
          hue: {
            delta: 0.78
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#104764") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.002,
          chroma: {
            delta: 0.1256
          },
          hue: {
            delta: -5.84
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0027,
          chroma: {
            delta: 0.1256
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2729,
          chroma: {
            delta: -0.1266
          },
          hue: {
            delta: -1.79
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.8255,
          chroma: {
            delta: -0.0313
          },
          hue: {
            delta: -2.19
          }
        },
        panel: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.0324
          },
          hue: {
            delta: 0.78
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#104764") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.998,
          chroma: {
            delta: 0.1256
          },
          hue: {
            delta: -5.84
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
                at: 0,
                color: { kind: "literal", value: literal("#ffbd59") }
              },
              {
                at: 18,
                color: { kind: "literal", value: literal("#ffa25c") },
                alpha: 0.7
              },
              {
                at: 51,
                color: { kind: "literal", value: literal("#ff6b11") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 55,
              y: 0
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#ee3cff") }
              },
              {
                at: 70,
                color: { kind: "literal", value: literal("#ff1148") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: -10,
              y: 66
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#2aff75") }
              },
              {
                at: 29,
                color: {
                  kind: "tone",
                  at: 0.5134,
                  chroma: {
                    delta: 0.1256
                  },
                  hue: {
                    delta: -15.42
                  }
                }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 100,
              y: 80
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
                at: 0,
                color: { kind: "literal", value: literal("#ffbd59") },
                alpha: 0.9,
                binding: "scaled"
              },
              {
                at: 18,
                color: { kind: "literal", value: literal("#ffa25c") },
                alpha: 0.7,
                binding: "scaled"
              },
              {
                at: 51,
                color: { kind: "literal", value: literal("#ff6b11") },
                alpha: 0,
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: 55,
              y: -14
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#ee3cff") },
                alpha: 0.9,
                binding: "scaled"
              },
              {
                at: 70,
                color: { kind: "literal", value: literal("#ff1148") },
                alpha: 0,
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: -10,
              y: 66
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-2",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#2aff75") },
                alpha: 0.9,
                binding: "scaled"
              },
              {
                at: 34,
                color: {
                  kind: "tone",
                  at: 0.5134,
                  chroma: {
                    delta: 0.1256
                  },
                  hue: {
                    delta: -15.42
                  }
                },
                alpha: 0.9,
                binding: "scaled"
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 105,
              y: 80
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
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
          id: "perpetuity"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.0001,
        chroma: {
          delta: 0.1256
        },
        hue: {
          delta: -43.73
        }
      },
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ffe147") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ff4e13") }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.444,
                chroma: {
                  delta: 0.1256
                },
                hue: {
                  delta: -21.52
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#6eff86") }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ed9dff") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ff69cb") }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 48
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.9,
    maxDeltaEOk: 0.000034,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
