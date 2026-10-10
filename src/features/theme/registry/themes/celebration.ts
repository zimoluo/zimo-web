import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "celebration",
    name: "Celebration",
    ramp: {
      hue: 247.19,
      chroma: 0.4761,
      lightest: 0.9481,
      darkest: 0.2097
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          hue: {
            delta: -2.93
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.8752,
          chroma: {
            delta: 0.1156
          },
          hue: {
            delta: 3.41
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3703,
          chroma: {
            delta: -0.075
          }
        },
        panel: {
          kind: "tone",
          at: 0.2373,
          chroma: {
            delta: -0.0421
          },
          hue: {
            delta: -2.13
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#263b4e") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1031,
          chroma: {
            delta: -0.2427
          },
          hue: {
            delta: 26.45
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          hue: {
            delta: -2.93
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.1248,
          chroma: {
            delta: 0.1156
          },
          hue: {
            delta: 3.41
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6297,
          chroma: {
            delta: -0.075
          }
        },
        panel: {
          kind: "tone",
          at: 0.7627,
          chroma: {
            delta: -0.0421
          },
          hue: {
            delta: -2.13
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#263b4e") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.8969,
          chroma: {
            delta: -0.2427
          },
          hue: {
            delta: 26.45
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
                color: {
                  kind: "tone",
                  at: 0.8308,
                  chroma: {
                    delta: 0.0605
                  },
                  hue: {
                    delta: 7.1
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.2603
                  },
                  hue: {
                    delta: 30.26
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 102
            },
            extent: {
              kind: "ellipse",
              x: 95,
              y: 116
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
                color: {
                  kind: "tone",
                  at: 0.8369,
                  hue: {
                    delta: 6.64
                  }
                },
                alpha: 0.5,
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9402,
                  chroma: {
                    delta: 0.1266
                  },
                  hue: {
                    delta: 8.13
                  }
                },
                alpha: 0.5,
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 102
            },
            extent: {
              kind: "ellipse",
              x: 90,
              y: 120
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
          id: "celebration"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.0396,
        chroma: {
          delta: 0.0587
        },
        hue: {
          delta: -1.33
        }
      },
      gradients: [
        {
          angle: 225,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.5406,
                chroma: {
                  delta: -0.2118
                },
                hue: {
                  delta: -1.48
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.794,
                chroma: {
                  delta: -0.0915
                },
                hue: {
                  delta: 5.78
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 16
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.865,
    maxDeltaEOk: 0.000428,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
