import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "vibrant",
    name: "Vibrant",
    ramp: {
      hue: 1.5,
      chroma: 0.6723,
      lightest: 1,
      darkest: 0.4994
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {
          kind: "tone",
          at: 0.0808,
          chroma: {
            delta: -0.3367
          },
          hue: {
            delta: 148.6
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.3095,
          chroma: {
            delta: -0.1105
          },
          hue: {
            delta: -142.99
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.7551,
          chroma: {
            delta: 0.2016
          },
          hue: {
            delta: 17.43
          }
        },
        panel: {
          kind: "tone",
          at: 0.9578,
          chroma: {
            delta: 0.2457
          },
          hue: {
            delta: -10.93
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#660e43") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.4321,
          chroma: {
            delta: -0.1465
          },
          hue: {
            delta: 136.5
          }
        }
      }
    },
    surfaceScheme: "dark",
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 19.99,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              },
              {
                at: 20,
                color: { kind: "literal", value: literal("#6aba45") }
              },
              {
                at: 27,
                color: { kind: "literal", value: literal("#6aba45") }
              },
              {
                at: 27.01,
                color: { kind: "literal", value: literal("#ffb829") }
              },
              {
                at: 33.99,
                color: { kind: "literal", value: literal("#ffb829") }
              },
              {
                at: 34,
                color: {
                  kind: "tone",
                  at: 0.531,
                  chroma: {
                    delta: 0.3277
                  },
                  hue: {
                    delta: 49.58
                  }
                }
              },
              {
                at: 40.99,
                color: {
                  kind: "tone",
                  at: 0.531,
                  chroma: {
                    delta: 0.3277
                  },
                  hue: {
                    delta: 49.58
                  }
                }
              },
              {
                at: 41,
                color: {
                  kind: "tone",
                  at: 0.6848,
                  chroma: {
                    delta: 0.3062
                  },
                  hue: {
                    delta: 23.96
                  }
                }
              },
              {
                at: 47.99,
                color: {
                  kind: "tone",
                  at: 0.6848,
                  chroma: {
                    delta: 0.3062
                  },
                  hue: {
                    delta: 23.96
                  }
                }
              },
              {
                at: 48,
                color: {
                  kind: "tone",
                  at: 0.9081,
                  chroma: {
                    delta: 0.0702
                  },
                  hue: {
                    delta: -25.86
                  }
                }
              },
              {
                at: 54.99,
                color: {
                  kind: "tone",
                  at: 0.9081,
                  chroma: {
                    delta: 0.0702
                  },
                  hue: {
                    delta: -25.86
                  }
                }
              },
              {
                at: 55,
                color: { kind: "literal", value: literal("#009ddb") }
              },
              {
                at: 61.99,
                color: { kind: "literal", value: literal("#009ddb") }
              },
              {
                at: 62,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 155
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 15,
                color: { kind: "literal", value: literal("#90cd7b") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#90cd7b") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
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
                at: 10,
                color: { kind: "literal", value: literal("#0c759f") },
                alpha: 0.75,
                binding: "scaled"
              },
              {
                at: 90,
                color: { kind: "literal", value: literal("#0465af") },
                alpha: 0.8,
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 70
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
                at: 15,
                color: { kind: "literal", value: literal("#90cd7b") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#90cd7b") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
            }
          }
        ]
      }
    },
    mark: {
      mode: "unified",
      gradients: [
        {
          angle: 120,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#6aba45") }
            },
            {
              offset: 0.166,
              color: { kind: "literal", value: literal("#6aba45") }
            },
            {
              offset: 0.167,
              color: { kind: "literal", value: literal("#ffb829") }
            },
            {
              offset: 0.333,
              color: { kind: "literal", value: literal("#ffb829") }
            },
            {
              offset: 0.334,
              color: {
                kind: "tone",
                at: 0.531,
                chroma: {
                  delta: 0.3277
                },
                hue: {
                  delta: 49.58
                }
              }
            },
            {
              offset: 0.5,
              color: {
                kind: "tone",
                at: 0.531,
                chroma: {
                  delta: 0.3277
                },
                hue: {
                  delta: 49.58
                }
              }
            },
            {
              offset: 0.501,
              color: {
                kind: "tone",
                at: 0.6848,
                chroma: {
                  delta: 0.3062
                },
                hue: {
                  delta: 23.96
                }
              }
            },
            {
              offset: 0.666,
              color: {
                kind: "tone",
                at: 0.6848,
                chroma: {
                  delta: 0.3062
                },
                hue: {
                  delta: 23.96
                }
              }
            },
            {
              offset: 0.667,
              color: {
                kind: "tone",
                at: 0.9081,
                chroma: {
                  delta: 0.0702
                },
                hue: {
                  delta: -25.86
                }
              }
            },
            {
              offset: 0.833,
              color: {
                kind: "tone",
                at: 0.9081,
                chroma: {
                  delta: 0.0702
                },
                hue: {
                  delta: -25.86
                }
              }
            },
            {
              offset: 0.834,
              color: { kind: "literal", value: literal("#009ddb") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#009ddb") }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 48
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.285,
    maxDeltaEOk: 0.000021,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
