import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "underwater",
    name: "Underwater",
    ramp: {
      hue: 211.33,
      chroma: 0.7972,
      lightest: 0.9694,
      darkest: 0.2993,
      torsion: 23.52
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: -0.188
          },
          hue: {
            delta: 0.52
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.8714,
          chroma: {
            delta: -0.1607
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6001,
          chroma: {
            delta: 0.1783
          },
          hue: {
            delta: 2.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.3972,
          chroma: {
            delta: 0.1703
          },
          hue: {
            delta: 6.32
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
          at: 0.6036,
          chroma: {
            delta: -0.0776
          },
          hue: {
            delta: 17.83
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: -0.188
          },
          hue: {
            delta: 0.52
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.1286,
          chroma: {
            delta: -0.1607
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3999,
          chroma: {
            delta: 0.1783
          },
          hue: {
            delta: 2.88
          }
        },
        panel: {
          kind: "tone",
          at: 0.6028,
          chroma: {
            delta: 0.1703
          },
          hue: {
            delta: 6.32
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
          at: 0.3964,
          chroma: {
            delta: -0.0776
          },
          hue: {
            delta: 17.83
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
                at: 13,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0457
                  },
                  hue: {
                    delta: 27.84
                  }
                }
              },
              {
                at: 55,
                color: {
                  kind: "tone",
                  at: 0.5587,
                  chroma: {
                    delta: -0.067
                  },
                  hue: {
                    delta: 17.34
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.2988,
                  chroma: {
                    delta: -0.2229
                  },
                  hue: {
                    delta: 11.97
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: -4,
              y: 80
            },
            extent: {
              kind: "ellipse",
              x: 130,
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
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.6371,
                  chroma: {
                    delta: 0.1763
                  },
                  hue: {
                    delta: 6.66
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.7201,
                  chroma: {
                    delta: 0.1713
                  },
                  hue: {
                    delta: 15.32
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
      },
      "page-reduced": {
        layers: [
          {
            id: "page-reduced-0",
            stops: [
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.6449,
                  chroma: {
                    delta: 0.1694
                  },
                  hue: {
                    delta: 17.22
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.5679,
                  chroma: {
                    delta: 0.1844
                  },
                  hue: {
                    delta: 8.7
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 30
            }
          }
        ]
      }
    },
    backdrop: {
      scenes: [
        {
          id: "underwater"
        }
      ]
    },
    mark: {
      mode: "backdrop"
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.814,
    maxDeltaEOk: 0.000842,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
