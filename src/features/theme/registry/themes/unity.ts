import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "unity",
    name: "Unity",
    ramp: {
      hue: 241.88,
      chroma: 0.782,
      lightest: 0.9937,
      darkest: 0.3635,
      torsion: 33.5
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.1006
          },
          hue: {
            delta: -4.55
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6802,
          chroma: {
            delta: 0.1471
          },
          hue: {
            delta: -3.24
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3332,
          chroma: {
            delta: -0.0687
          },
          hue: {
            delta: -8.86
          }
        },
        panel: {
          kind: "tone",
          at: 0.0421,
          chroma: {
            delta: -0.179
          },
          hue: {
            delta: -3.02
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
          at: 0.1117,
          chroma: {
            delta: 0.2181
          },
          hue: {
            delta: -142.62
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
                  at: 0.0115,
                  chroma: {
                    delta: 0.2183
                  },
                  hue: {
                    delta: -14.48
                  }
                }
              },
              {
                at: 25,
                color: { kind: "literal", value: literal("#fffeee") }
              },
              {
                at: 50,
                color: {
                  kind: "tone",
                  at: 0.0115,
                  chroma: {
                    delta: 0.2183
                  },
                  hue: {
                    delta: -14.48
                  }
                }
              },
              {
                at: 75,
                color: { kind: "literal", value: literal("#fffeee") }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0115,
                  chroma: {
                    delta: 0.2183
                  },
                  hue: {
                    delta: -14.48
                  }
                }
              }
            ],
            kind: "conic",
            from: 45,
            at: {
              x: 50,
              y: 50
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
                color: { kind: "literal", value: literal("#fffbf1") },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#fffdf6") },
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
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.9293,
        chroma: {
          delta: 0.1426
        }
      },
      gradients: [
        {
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.2599,
                chroma: {
                  delta: 0.218
                },
                hue: {
                  delta: 19.95
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.0622,
                chroma: {
                  delta: 0.218
                },
                hue: {
                  delta: -4.94
                }
              }
            }
          ]
        },
        {
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ffcf94") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#fff8ed") }
            }
          ]
        },
        {
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ffcf94") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#fff8ed") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.677,
    maxDeltaEOk: 0.000032,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
