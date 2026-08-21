import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "lollipop",
    name: "Lollipop",
    ramp: {
      hue: 355.69,
      chroma: 0.6381,
      lightest: 0.9566,
      darkest: 0.3796,
      torsion: 10.93
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.3002
          },
          hue: {
            delta: -1.11
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7311,
          chroma: {
            delta: 0.0585
          },
          hue: {
            delta: -3.95
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1983,
          chroma: {
            delta: -0.1943
          },
          hue: {
            delta: -4.36
          }
        },
        panel: {
          kind: "tone",
          at: 0.0168,
          chroma: {
            delta: -0.1646
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
          at: 0.5216,
          chroma: {
            delta: -0.2075
          },
          hue: {
            delta: -4.74
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              },
              {
                at: 7,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              },
              {
                at: 7.01,
                color: {
                  kind: "tone",
                  at: 0.0998,
                  chroma: {
                    delta: -0.0324
                  },
                  hue: {
                    delta: -6.03
                  }
                }
              },
              {
                at: 14,
                color: {
                  kind: "tone",
                  at: 0.0998,
                  chroma: {
                    delta: -0.0324
                  },
                  hue: {
                    delta: -6.03
                  }
                }
              }
            ],
            repeating: true,
            kind: "conic",
            from: 60,
            at: {
              x: 60,
              y: 55
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
                  at: 0.0114,
                  chroma: {
                    delta: 0.3621
                  },
                  hue: {
                    delta: -4.39
                  }
                },
                binding: "scaled"
              },
              {
                at: 5,
                color: {
                  kind: "tone",
                  at: 0.0553,
                  chroma: {
                    delta: 0.3183
                  },
                  hue: {
                    delta: -6.03
                  }
                },
                binding: "scaled"
              }
            ],
            repeating: true,
            kind: "conic",
            from: 30,
            at: {
              x: 100,
              y: 0
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 90
            }
          }
        ]
      }
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
                at: 0,
                chroma: {
                  delta: 0.3619
                },
                hue: {
                  delta: -3.11
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.0383,
                chroma: {
                  delta: 0.362
                },
                hue: {
                  delta: -5.27
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 0
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.799,
    maxDeltaEOk: 0.000092,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
