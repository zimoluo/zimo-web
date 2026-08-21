import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "pixelland",
    name: "Pixelland",
    ramp: {
      hue: 245.24,
      chroma: 0.949,
      lightest: 0.9901,
      darkest: 0.5901,
      torsion: 29.36
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0511
          },
          hue: {
            delta: -11
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7163,
          chroma: {
            delta: 0.051
          },
          hue: {
            delta: -2.61
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3375,
          chroma: {
            delta: -0.1084
          },
          hue: {
            delta: -3.12
          }
        },
        panel: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.0063
          },
          hue: {
            delta: -11.11
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
          at: 0.219,
          chroma: {
            delta: 0.051
          },
          hue: {
            delta: 5.82
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.0511
          },
          hue: {
            delta: -11
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2837,
          chroma: {
            delta: 0.051
          },
          hue: {
            delta: -2.61
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6625,
          chroma: {
            delta: -0.1084
          },
          hue: {
            delta: -3.12
          }
        },
        panel: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.0063
          },
          hue: {
            delta: -11.11
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
          at: 0.781,
          chroma: {
            delta: 0.051
          },
          hue: {
            delta: 5.82
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.8365,
                  chroma: {
                    delta: 0.051
                  },
                  hue: {
                    delta: 4.28
                  }
                },
                alpha: 0.53
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.6389,
                  chroma: {
                    delta: 0.051
                  },
                  hue: {
                    delta: 3.65
                  }
                },
                alpha: 0.87
              }
            ],
            kind: "radial",
            at: {
              x: 5,
              y: 10
            },
            extent: {
              kind: "ellipse",
              x: 80,
              y: 70
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.1831,
                  chroma: {
                    delta: 0.051
                  },
                  hue: {
                    delta: -5.72
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.4847,
                  chroma: {
                    delta: 0.051
                  },
                  hue: {
                    delta: -3.92
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
              x: 80,
              y: 120
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
                  at: 0.4124,
                  chroma: {
                    delta: 0.0511
                  },
                  hue: {
                    delta: -3.78
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.6433,
                  chroma: {
                    delta: 0.051
                  },
                  hue: {
                    delta: -3.02
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
              x: 80,
              y: 90
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
          id: "pixelland"
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
                at: 0.9999,
                chroma: {
                  delta: 0.0063
                },
                hue: {
                  delta: -11.11
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.2837,
                chroma: {
                  delta: 0.051
                },
                hue: {
                  delta: -2.61
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
    scheme: "dark",
    purity: 0.909,
    maxDeltaEOk: 0.000024,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
