import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "bewitched",
    name: "Bewitched",
    ramp: {
      hue: 279.96,
      chroma: 0.9454,
      lightest: 0.9276,
      darkest: 0.2647,
      torsion: -21.88
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0299
          },
          hue: {
            delta: 7.27
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.8028,
          chroma: {
            delta: 0.0365
          },
          hue: {
            delta: 0.94
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.2211,
          chroma: {
            delta: -0.0366
          },
          hue: {
            delta: 7.56
          }
        },
        panel: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: -0.0297
          },
          hue: {
            delta: 3.62
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#1a056f") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1894,
          chroma: {
            delta: -0.0964
          },
          hue: {
            delta: 21.81
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
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.0913,
                  chroma: {
                    delta: -0.0919
                  },
                  hue: {
                    delta: 20.43
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.1408,
                  chroma: {
                    delta: -0.0845
                  },
                  hue: {
                    delta: 20.92
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
                  at: 0.0374,
                  chroma: {
                    delta: -0.1075
                  },
                  hue: {
                    delta: 19.54
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0913,
                  chroma: {
                    delta: -0.0919
                  },
                  hue: {
                    delta: 20.43
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 30
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
          id: "bewitched"
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
                at: 0.4406,
                chroma: {
                  delta: -0.0808
                },
                hue: {
                  delta: 24.41
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.1894,
                chroma: {
                  delta: -0.0964
                },
                hue: {
                  delta: 21.81
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
    purity: 0.908,
    maxDeltaEOk: 0.000059,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
