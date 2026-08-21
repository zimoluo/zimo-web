import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "blog",
    name: "Blog",
    ramp: {
      hue: 323.7,
      chroma: 0.9382,
      lightest: 0.9773,
      darkest: 0.4007,
      torsion: 6.09
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.0809
          },
          hue: {
            delta: -1.13
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7809,
          chroma: {
            delta: -0.011
          },
          hue: {
            delta: -1.46
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1412,
          chroma: {
            delta: 0.03
          },
          hue: {
            delta: -1.9
          }
        },
        panel: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.0619
          },
          hue: {
            delta: -0.6
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
          at: 0.1412,
          chroma: {
            delta: 0.03
          },
          hue: {
            delta: -1.9
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
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.0501,
                  chroma: {
                    delta: 0.062
                  },
                  hue: {
                    delta: -3.65
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0378,
                  chroma: {
                    delta: 0.0619
                  },
                  hue: {
                    delta: 36.46
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
                  at: 0.0001,
                  chroma: {
                    delta: 0.0619
                  },
                  hue: {
                    delta: -0.6
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0023,
                  chroma: {
                    delta: -0.1907
                  },
                  hue: {
                    delta: 12.37
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
          id: "blog"
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
                at: 0.3075,
                chroma: {
                  delta: 0.0618
                },
                hue: {
                  delta: -2.45
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4245,
                chroma: {
                  delta: 0.0618
                },
                hue: {
                  delta: 20.19
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
    purity: 0.95,
    maxDeltaEOk: 0.000035,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "dark-unreviewed"
    ]
  } as const;
