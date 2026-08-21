import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "glitter",
    name: "Glitter",
    ramp: {
      hue: 260.19,
      chroma: 0.1679,
      lightest: 0.9846,
      darkest: 0.2101
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0564
          },
          hue: {
            delta: -12.35
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.9747,
          chroma: {
            delta: 0.0176
          },
          hue: {
            delta: 4.35
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4455,
          chroma: {
            delta: -0.0736
          },
          hue: {
            delta: 4.17
          }
        },
        panel: {
          kind: "tone",
          at: 0.3192,
          hue: {
            delta: -3.39
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
          at: 0.0969,
          chroma: {
            delta: 0.1338
          },
          hue: {
            delta: -3.34
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.0564
          },
          hue: {
            delta: -12.35
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.0253,
          chroma: {
            delta: 0.0176
          },
          hue: {
            delta: 4.35
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.5545,
          chroma: {
            delta: -0.0736
          },
          hue: {
            delta: 4.17
          }
        },
        panel: {
          kind: "tone",
          at: 0.6808,
          hue: {
            delta: -3.39
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
          at: 0.9031,
          chroma: {
            delta: 0.1338
          },
          hue: {
            delta: -3.34
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
                  at: 1,
                  chroma: {
                    delta: 0.0516
                  },
                  hue: {
                    delta: 4.47
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9031,
                  chroma: {
                    delta: 0.1338
                  },
                  hue: {
                    delta: -3.34
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
                  at: 0.9301,
                  chroma: {
                    delta: 0.1206
                  }
                },
                alpha: 0.55,
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.8695,
                  chroma: {
                    delta: 0.1043
                  },
                  hue: {
                    delta: -3.35
                  }
                },
                alpha: 0.55,
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
          id: "glitter"
        }
      ]
    },
    mark: {
      mode: "backdrop",
      stroke: {
        kind: "tone",
        at: 0.0253,
        chroma: {
          delta: 0.0176
        },
        hue: {
          delta: 4.35
        }
      }
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.913,
    maxDeltaEOk: 0.00007,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
