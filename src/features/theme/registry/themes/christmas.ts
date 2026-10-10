import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "christmas",
    name: "Christmas",
    ramp: {
      hue: 25.7,
      chroma: 0.8345,
      lightest: 0.9934,
      darkest: 0.4128,
      torsion: 11.62
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0807
          },
          hue: {
            delta: -4.16
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7553,
          chroma: {
            delta: 0.0318
          },
          hue: {
            delta: -2.26
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1698,
          chroma: {
            delta: 0.0342
          },
          hue: {
            delta: -3.87
          }
        },
        panel: {
          kind: "tone",
          at: 0.0242,
          chroma: {
            delta: -0.1466
          },
          hue: {
            delta: -2.9
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
          at: 0.4735,
          chroma: {
            delta: 0.1655
          },
          hue: {
            delta: -4.96
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
                  at: 0.0001,
                  chroma: {
                    delta: 0.1655
                  },
                  hue: {
                    delta: -2.68
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0212,
                  chroma: {
                    delta: 0.1655
                  },
                  hue: {
                    delta: -2.83
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
                  at: 0.0422,
                  chroma: {
                    delta: 0.1655
                  },
                  hue: {
                    delta: -2.98
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0085,
                  chroma: {
                    delta: 0.1655
                  },
                  hue: {
                    delta: -2.74
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 50
            },
            extent: {
              kind: "ellipse",
              x: 90,
              y: 90
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.0085,
                  chroma: {
                    delta: 0.1655
                  },
                  hue: {
                    delta: -2.74
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.0001,
                  chroma: {
                    delta: 0.1655
                  },
                  hue: {
                    delta: -2.68
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
          id: "christmas"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.837,
        chroma: {
          delta: 0.0904
        },
        hue: {
          delta: -3.28
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
                at: 0.0836,
                chroma: {
                  delta: 0.1655
                },
                hue: {
                  delta: -3.26
                }
              }
            },
            {
              offset: 0.424,
              color: {
                kind: "tone",
                at: 0.1898,
                chroma: {
                  delta: 0.1655
                },
                hue: {
                  delta: -3.82
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.108,
                chroma: {
                  delta: 0.1655
                },
                hue: {
                  delta: -3.41
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 8
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.888,
    maxDeltaEOk: 0.000016,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
