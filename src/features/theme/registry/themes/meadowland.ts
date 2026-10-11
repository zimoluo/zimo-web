import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "meadowland",
    name: "Meadowland",
    ramp: {
      hue: 237.98,
      chroma: 0.7418,
      lightest: 0.9523,
      darkest: 0.3692,
      torsion: 9.44
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.1314
          },
          hue: {
            delta: -3.1
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6921,
          chroma: {
            delta: 0.1587
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.18,
          chroma: {
            delta: -0.2322
          },
          hue: {
            delta: -0.9
          }
        },
        panel: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.0579
          },
          hue: {
            delta: -2.56
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#0f4765") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.2074,
          chroma: {
            delta: -0.3957
          },
          hue: {
            delta: -8.57
          }
        }
      }
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
                  at: 0.2074,
                  chroma: {
                    delta: -0.3957
                  },
                  hue: {
                    delta: -8.57
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.2074,
                  chroma: {
                    delta: -0.3957
                  },
                  hue: {
                    delta: -8.57
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.0678,
                  chroma: {
                    delta: -0.0336
                  },
                  hue: {
                    delta: -6.3
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0714,
                  chroma: {
                    delta: -0.169
                  },
                  hue: {
                    delta: -3.63
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 12
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
          id: "meadowland"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.8314,
        chroma: {
          delta: -0.0422
        },
        hue: {
          delta: -0.89
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
                at: 0,
                chroma: {
                  delta: -0.0579
                },
                hue: {
                  delta: -2.56
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.6921,
                chroma: {
                  delta: 0.1587
                }
              }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.788,
    maxDeltaEOk: 0.000277,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
