import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "halloween",
    name: "Halloween",
    ramp: {
      hue: 56.23,
      chroma: 0.945,
      lightest: 0.992,
      darkest: 0.2214,
      torsion: -52.57
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.055
          },
          hue: {
            delta: -1.79
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2573,
          chroma: {
            delta: 0.055
          },
          hue: {
            delta: 3.64
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4787,
          chroma: {
            delta: -0.0053
          },
          hue: {
            delta: -2.85
          }
        },
        panel: {
          kind: "tone",
          at: 0.5046,
          chroma: {
            delta: -0.1048
          },
          hue: {
            delta: -16.14
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#622712") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.741,
          chroma: {
            delta: -0.0535
          },
          hue: {
            delta: -90.32
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
                at: 15,
                color: { kind: "literal", value: literal("#1f0f3c") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#6b188d") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 10
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
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.5046,
                  chroma: {
                    delta: -0.1048
                  },
                  hue: {
                    delta: -16.14
                  }
                },
                binding: "scaled"
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.3791,
                  chroma: {
                    delta: 0.0488
                  },
                  hue: {
                    delta: -3.03
                  }
                },
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
          id: "halloween"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.0988,
        chroma: {
          delta: 0.055
        },
        hue: {
          delta: -25.51
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
                at: 0.314,
                chroma: {
                  delta: 0.055
                },
                hue: {
                  delta: -7.42
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#7e1e81") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.818,
    maxDeltaEOk: 0.000021,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
