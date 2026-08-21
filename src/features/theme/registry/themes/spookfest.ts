import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "spookfest",
    name: "Spookfest",
    ramp: {
      hue: 230.15,
      chroma: 0.7279,
      lightest: 0.9547,
      darkest: 0.3671
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: -0.1921
          },
          hue: {
            delta: 1.06
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7721,
          chroma: {
            delta: -0.1833
          },
          hue: {
            delta: 3.84
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.416,
          chroma: {
            delta: 0.1569
          },
          hue: {
            delta: 1.63
          }
        },
        panel: {
          kind: "tone",
          at: 0.2845,
          chroma: {
            delta: 0.2187
          },
          hue: {
            delta: -4.25
          }
        },
        edge: 1,
        shade: 0,
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.3402,
          chroma: {
            delta: 0.1621
          },
          hue: {
            delta: -8.9
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: -0.1921
          },
          hue: {
            delta: 1.06
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2279,
          chroma: {
            delta: -0.1833
          },
          hue: {
            delta: 3.84
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.584,
          chroma: {
            delta: 0.1569
          },
          hue: {
            delta: 1.63
          }
        },
        panel: {
          kind: "tone",
          at: 0.7155,
          chroma: {
            delta: 0.2187
          },
          hue: {
            delta: -4.25
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
          at: 0.6598,
          chroma: {
            delta: 0.1621
          },
          hue: {
            delta: -8.9
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true
    },
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
                  at: 1,
                  chroma: {
                    delta: 0.1491
                  },
                  hue: {
                    delta: -10.66
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.6107,
                  chroma: {
                    delta: 0.1645
                  },
                  hue: {
                    delta: -9.64
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 10
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
                  at: 0.7608,
                  chroma: {
                    delta: 0.1579
                  },
                  hue: {
                    delta: -9.32
                  }
                },
                alpha: 0.69,
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.9344,
                  chroma: {
                    delta: 0.1466
                  },
                  hue: {
                    delta: -10.14
                  }
                },
                alpha: 0.72,
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
          id: "halloween"
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
                at: 0.7608,
                chroma: {
                  delta: 0.1579
                },
                hue: {
                  delta: -9.32
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4776,
                chroma: {
                  delta: 0.1636
                },
                hue: {
                  delta: -9.6
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
    purity: 0.796,
    maxDeltaEOk: 0.000025,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
