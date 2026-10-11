import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "storm",
    name: "Storm",
    ramp: {
      hue: 87.55,
      chroma: 0.2482,
      lightest: 0.9493,
      darkest: 0.4362
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: -0.1336
          },
          hue: {
            delta: 1.09
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.8577,
          chroma: {
            delta: -0.098
          },
          hue: {
            delta: 2.26
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.2576,
          chroma: {
            delta: 0.123
          },
          hue: {
            delta: -2.34
          }
        },
        panel: {
          kind: "tone",
          at: 0.0252,
          chroma: {
            delta: 0.1088
          },
          hue: {
            delta: 1.24
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#47402d") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.0998,
          chroma: {
            delta: -0.0338
          },
          hue: {
            delta: 1.91
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: -0.1336
          },
          hue: {
            delta: 1.09
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.1423,
          chroma: {
            delta: -0.098
          },
          hue: {
            delta: 2.26
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.7424,
          chroma: {
            delta: 0.123
          },
          hue: {
            delta: -2.34
          }
        },
        panel: {
          kind: "tone",
          at: 0.9748,
          chroma: {
            delta: 0.1088
          },
          hue: {
            delta: 1.24
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#47402d") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.9002,
          chroma: {
            delta: -0.0338
          },
          hue: {
            delta: 1.91
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
                color: {
                  kind: "tone",
                  at: 0.6856,
                  chroma: {
                    delta: -0.0691
                  },
                  hue: {
                    delta: 3.09
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9002,
                  chroma: {
                    delta: -0.0338
                  },
                  hue: {
                    delta: 1.91
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
              kind: "ellipse",
              x: 90,
              y: 100
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
                  at: 0.9748,
                  chroma: {
                    delta: 0.1088
                  },
                  hue: {
                    delta: 1.24
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9206,
                  chroma: {
                    delta: 0.0863
                  },
                  hue: {
                    delta: 1.25
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "ellipse",
              x: 90,
              y: 100
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
          id: "storm"
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
                at: 0.3828,
                chroma: {
                  delta: -0.0594
                },
                hue: {
                  delta: 1.23
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 1,
                chroma: {
                  delta: 0.0315
                },
                hue: {
                  delta: 1.26
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
    purity: 0.891,
    maxDeltaEOk: 0.000021,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
