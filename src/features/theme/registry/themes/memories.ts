import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "memories",
    name: "Memories",
    ramp: {
      hue: 302.9,
      chroma: 0.7926,
      lightest: 0.9726,
      darkest: 0.2067
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.2076
          },
          hue: {
            delta: -4.33
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7027,
          chroma: {
            delta: 0.1022
          },
          hue: {
            delta: 4.08
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4955,
          chroma: {
            delta: -0.1702
          },
          hue: {
            delta: 0.84
          }
        },
        panel: {
          kind: "tone",
          at: 0.3551,
          chroma: {
            delta: -0.1398
          },
          hue: {
            delta: -4.09
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
          at: 0,
          chroma: {
            delta: -0.2806
          },
          hue: {
            delta: -20.81
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.2076
          },
          hue: {
            delta: -4.33
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2973,
          chroma: {
            delta: 0.1022
          },
          hue: {
            delta: 4.08
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.5045,
          chroma: {
            delta: -0.1702
          },
          hue: {
            delta: 0.84
          }
        },
        panel: {
          kind: "tone",
          at: 0.6449,
          chroma: {
            delta: -0.1398
          },
          hue: {
            delta: -4.09
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
          at: 1,
          chroma: {
            delta: -0.2806
          },
          hue: {
            delta: -20.81
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
                    delta: -0.2806
                  },
                  hue: {
                    delta: -20.81
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#0f172a") }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: -5
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
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
                  at: 0.8607,
                  chroma: {
                    delta: -0.2797
                  },
                  hue: {
                    delta: -16.08
                  }
                },
                alpha: 0.7
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.8354,
                  chroma: {
                    delta: -0.265
                  },
                  hue: {
                    delta: -14.28
                  }
                },
                alpha: 0.75
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 105
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
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
          id: "memories"
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
                at: 0.7164,
                chroma: {
                  delta: -0.0796
                },
                hue: {
                  delta: -21.13
                }
              }
            },
            {
              offset: 0.8,
              color: {
                kind: "tone",
                at: 0.4375,
                chroma: {
                  delta: 0.0982
                },
                hue: {
                  delta: 2.97
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.47,
                chroma: {
                  delta: 0.2074
                },
                hue: {
                  delta: 0.88
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
    purity: 0.782,
    maxDeltaEOk: 0.000049,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
