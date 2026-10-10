import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "velvet",
    name: "Velvet",
    ramp: {
      hue: 316.32,
      chroma: 0.4625,
      lightest: 0.9115,
      darkest: 0.309,
      torsion: -4.17
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.114
          },
          hue: {
            delta: 1.05
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7189,
          chroma: {
            delta: -0.0465
          },
          hue: {
            delta: -0.81
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4002,
          chroma: {
            delta: 0.056
          }
        },
        panel: {
          kind: "tone",
          at: 0.1061,
          chroma: {
            delta: 0.1047
          },
          hue: {
            delta: 0.76
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#452153") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.0149
          },
          hue: {
            delta: -13.44
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.114
          },
          hue: {
            delta: 1.05
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2811,
          chroma: {
            delta: -0.0465
          },
          hue: {
            delta: -0.81
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.5998,
          chroma: {
            delta: 0.056
          }
        },
        panel: {
          kind: "tone",
          at: 0.8939,
          chroma: {
            delta: 0.1047
          },
          hue: {
            delta: 0.76
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#452153") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0149
          },
          hue: {
            delta: -13.44
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
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.8155,
                  chroma: {
                    delta: 0.0356
                  },
                  hue: {
                    delta: -14.42
                  }
                }
              },
              {
                at: 90,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.0149
                  },
                  hue: {
                    delta: -13.44
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
                at: 25,
                color: {
                  kind: "tone",
                  at: 0.9071,
                  chroma: {
                    delta: 0.064
                  },
                  hue: {
                    delta: -10.01
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9737,
                  chroma: {
                    delta: 0.0385
                  },
                  hue: {
                    delta: -5.16
                  }
                },
                alpha: 0.8,
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
          id: "velvet"
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
                at: 0.8444,
                chroma: {
                  delta: 0.1143
                },
                hue: {
                  delta: -6.41
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.5287,
                chroma: {
                  delta: 0.0606
                },
                hue: {
                  delta: -14.1
                }
              }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.914,
    maxDeltaEOk: 0.001177,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
