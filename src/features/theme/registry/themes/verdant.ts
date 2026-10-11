import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "verdant",
    name: "Verdant",
    ramp: {
      hue: 187.64,
      chroma: 0.5781,
      lightest: 0.9845,
      darkest: 0.5475,
      torsion: 92.21
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.4219
          },
          hue: {
            delta: -9.27
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6526,
          chroma: {
            delta: -0.272
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4393,
          chroma: {
            delta: -0.0986
          },
          hue: {
            delta: 4.06
          }
        },
        panel: {
          kind: "tone",
          at: 0.0382,
          chroma: {
            delta: -0.0513
          },
          hue: {
            delta: -10.69
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#28444c") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.0891
          },
          hue: {
            delta: -13.36
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.4219
          },
          hue: {
            delta: -9.27
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.3474,
          chroma: {
            delta: -0.272
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.5607,
          chroma: {
            delta: -0.0986
          },
          hue: {
            delta: 4.06
          }
        },
        panel: {
          kind: "tone",
          at: 0.9618,
          chroma: {
            delta: -0.0513
          },
          hue: {
            delta: -10.69
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#28444c") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0891
          },
          hue: {
            delta: -13.36
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true,
      lightReviewed: false
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
                  at: 1,
                  chroma: {
                    delta: 0.0891
                  },
                  hue: {
                    delta: -13.36
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.0891
                  },
                  hue: {
                    delta: -13.36
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
                  at: 0.8443,
                  chroma: {
                    delta: -0.1015
                  },
                  hue: {
                    delta: -12.96
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.8443,
                  chroma: {
                    delta: -0.1015
                  },
                  hue: {
                    delta: -12.96
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
          id: "verdant"
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
                at: 0.9676,
                hue: {
                  delta: -11.7
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3474,
                chroma: {
                  delta: -0.272
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
    purity: 0.772,
    maxDeltaEOk: 0.000332,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
