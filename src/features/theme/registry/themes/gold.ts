import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "gold",
    name: "Gold",
    ramp: {
      hue: 81.51,
      chroma: 0.8579,
      lightest: 0.9926,
      darkest: 0.439,
      torsion: -18.78
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0431
          },
          hue: {
            delta: -3.75
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6111,
          chroma: {
            delta: 0.1248
          },
          hue: {
            delta: 3.73
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.271,
          chroma: {
            delta: -0.1767
          },
          hue: {
            delta: 2.62
          }
        },
        panel: {
          kind: "tone",
          at: 0.0302,
          chroma: {
            delta: 0.009
          },
          hue: {
            delta: -4.39
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#724e02") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1922,
          chroma: {
            delta: -0.0308
          },
          hue: {
            delta: 1.78
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
                  at: 0.0193,
                  chroma: {
                    delta: 0.1421
                  },
                  hue: {
                    delta: -3.03
                  }
                }
              },
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.0193,
                  chroma: {
                    delta: 0.1421
                  },
                  hue: {
                    delta: -3.03
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.1421
                  },
                  hue: {
                    delta: 7.38
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.1421
                  },
                  hue: {
                    delta: 7.38
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
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
                  at: 0.0351,
                  chroma: {
                    delta: 0.1421
                  },
                  hue: {
                    delta: -4.58
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0154,
                  chroma: {
                    delta: 0.1421
                  },
                  hue: {
                    delta: 0.97
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
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
          id: "gold"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.6461,
        chroma: {
          delta: 0.1421
        },
        hue: {
          delta: 8.04
        }
      },
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.129,
                chroma: {
                  delta: 0.1421
                },
                hue: {
                  delta: 1.25
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3742,
                chroma: {
                  delta: 0.1273
                },
                hue: {
                  delta: -0.51
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
    purity: 0.905,
    maxDeltaEOk: 0.000052,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
