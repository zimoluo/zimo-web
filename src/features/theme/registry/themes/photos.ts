import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "photos",
    name: "Photos",
    ramp: {
      hue: 45.84,
      chroma: 0.9527,
      lightest: 0.9851,
      darkest: 0.4084,
      torsion: -41.92
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.0782
          },
          hue: {
            delta: 13.29
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7327,
          chroma: {
            delta: 0.0154
          },
          hue: {
            delta: 2.32
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1584,
          chroma: {
            delta: 0.0155
          },
          hue: {
            delta: 10.54
          }
        },
        panel: {
          kind: "tone",
          at: 0.0106,
          chroma: {
            delta: 0.0473
          },
          hue: {
            delta: 7.33
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
          at: 0.0594,
          chroma: {
            delta: 0.0473
          },
          hue: {
            delta: 10.85
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
                  at: 0.0517,
                  chroma: {
                    delta: 0.0473
                  },
                  hue: {
                    delta: -19.03
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.0473
                  },
                  hue: {
                    delta: 32.05
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
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.0302,
                  chroma: {
                    delta: 0.0473
                  },
                  hue: {
                    delta: -15.1
                  }
                },
                binding: "scaled"
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.0106,
                  chroma: {
                    delta: 0.0473
                  },
                  hue: {
                    delta: 7.33
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
          id: "photos"
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
                at: 0.1444,
                chroma: {
                  delta: 0.0473
                },
                hue: {
                  delta: 37.04
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.5436,
                chroma: {
                  delta: 0.0473
                },
                hue: {
                  delta: -7.96
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
    purity: 0.91,
    maxDeltaEOk: 0.000028,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "dark-unreviewed"
    ]
  } as const;
