import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "projects",
    name: "Projects",
    ramp: {
      hue: 184.35,
      chroma: 0.7873,
      lightest: 0.9906,
      darkest: 0.3861,
      torsion: 8.35
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0931
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7778,
          chroma: {
            delta: 0.1747
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.146,
          chroma: {
            delta: -0.1131
          },
          hue: {
            delta: -0.97
          }
        },
        panel: {
          kind: "tone",
          at: 0.0129,
          chroma: {
            delta: -0.1548
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#0c6853") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.0695,
          chroma: {
            delta: -0.0513
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
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.0291,
                  chroma: {
                    delta: 0.2127
                  },
                  hue: {
                    delta: 37.96
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0181,
                  chroma: {
                    delta: 0.2127
                  },
                  hue: {
                    delta: -30.49
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
                  at: 0,
                  chroma: {
                    delta: 0.2127
                  },
                  hue: {
                    delta: 24.74
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0129,
                  chroma: {
                    delta: -0.1548
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
          id: "projects"
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
                at: 0.2869,
                chroma: {
                  delta: 0.2127
                },
                hue: {
                  delta: 31.84
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.1752,
                chroma: {
                  delta: 0.2127
                },
                hue: {
                  delta: -34.78
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
    purity: 0.881,
    maxDeltaEOk: 0.000432,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "dark-unreviewed"
    ]
  } as const;
