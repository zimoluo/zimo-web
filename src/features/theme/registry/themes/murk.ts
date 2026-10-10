import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "murk",
    name: "Murk",
    ramp: {
      hue: 204.61,
      chroma: 0.5943,
      lightest: 0.963,
      darkest: 0.3906,
      torsion: 4.6
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.2425
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.8108,
          chroma: {
            delta: -0.228
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4679,
          chroma: {
            delta: 0.2074
          }
        },
        panel: {
          kind: "tone",
          at: 0.2511,
          chroma: {
            delta: 0.2629
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#19555c") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1339,
          chroma: {
            delta: 0.1634
          },
          hue: {
            delta: 7.6
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.2425
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.1892,
          chroma: {
            delta: -0.228
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.5321,
          chroma: {
            delta: 0.2074
          }
        },
        panel: {
          kind: "tone",
          at: 0.7489,
          chroma: {
            delta: 0.2629
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#19555c") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.8661,
          chroma: {
            delta: 0.1634
          },
          hue: {
            delta: 7.6
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true
    },
    surfaceScheme: "dark",
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
                  at: 0.6802,
                  chroma: {
                    delta: 0.2529
                  },
                  hue: {
                    delta: -19.83
                  }
                }
              },
              {
                at: 50,
                color: {
                  kind: "tone",
                  at: 0.6393,
                  chroma: {
                    delta: 0.2762
                  },
                  hue: {
                    delta: -15.15
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.7206,
                  chroma: {
                    delta: 0.2873
                  },
                  hue: {
                    delta: -3.97
                  }
                }
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.7985,
                  chroma: {
                    delta: 0.2546
                  },
                  hue: {
                    delta: -19.56
                  }
                },
                alpha: 0.92,
                binding: "scaled"
              },
              {
                at: 50,
                color: {
                  kind: "tone",
                  at: 0.7418,
                  chroma: {
                    delta: 0.2676
                  },
                  hue: {
                    delta: -15.24
                  }
                },
                alpha: 0.9,
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.8361,
                  chroma: {
                    delta: 0.2487
                  },
                  hue: {
                    delta: -4.27
                  }
                },
                alpha: 0.88,
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
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
          id: "murk"
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 10,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.8115,
                chroma: {
                  delta: 0.0366
                },
                hue: {
                  delta: 14.68
                }
              }
            },
            {
              offset: 0.3,
              color: {
                kind: "tone",
                at: 1,
                chroma: {
                  delta: 0.0741
                },
                hue: {
                  delta: 15.67
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3194,
                chroma: {
                  delta: 0.1665
                },
                hue: {
                  delta: -17.79
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
    purity: 0.77,
    maxDeltaEOk: 0.000355,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
