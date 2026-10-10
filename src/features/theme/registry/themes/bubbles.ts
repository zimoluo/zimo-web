import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "bubbles",
    name: "Bubbles",
    ramp: {
      hue: 254.63,
      chroma: 0.9259,
      lightest: 0.9845,
      darkest: 0.3827,
      torsion: 13.3
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.1021
          },
          hue: {
            delta: -4.75
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.811,
          chroma: {
            delta: 0.0099
          },
          hue: {
            delta: -0.92
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1706,
          chroma: {
            delta: 0.0181
          },
          hue: {
            delta: -7.63
          }
        },
        panel: {
          kind: "tone",
          at: 0.0223,
          chroma: {
            delta: 0.0741
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
          at: 0.0794,
          chroma: {
            delta: 0.0225
          },
          hue: {
            delta: -2.56
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
                  at: 0.0426,
                  chroma: {
                    delta: 0.0741
                  },
                  hue: {
                    delta: -2.91
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0203,
                  chroma: {
                    delta: 0.0741
                  },
                  hue: {
                    delta: -23.06
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
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.0109,
                  chroma: {
                    delta: 0.0741
                  },
                  hue: {
                    delta: -4.48
                  }
                },
                binding: "scaled"
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.0001,
                  chroma: {
                    delta: 0.0741
                  },
                  hue: {
                    delta: -30.44
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
          id: "bubbles"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.7897,
        chroma: {
          delta: 0.0655
        },
        hue: {
          delta: -15.73
        }
      },
      gradients: [
        {
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.4363,
                chroma: {
                  delta: 0.0741
                },
                hue: {
                  delta: -10.28
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.1584,
                chroma: {
                  delta: 0.0144
                },
                hue: {
                  delta: -15.73
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
    purity: 0.937,
    maxDeltaEOk: 0.000081,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
