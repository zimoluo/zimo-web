import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "memories",
    name: "Memories",
    ramp: {
      hue: 302.9,
      chroma: 0.7925,
      lightest: 0.9726,
      darkest: 0.2067
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0,"chroma":{"delta":0.20719185},"hue":{"delta":-4.33073588}},
        textMuted: {"kind":"tone","at":0.29734408,"chroma":{"delta":0.1023152},"hue":{"delta":4.08018843}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.50454138,"chroma":{"delta":-0.17012849},"hue":{"delta":0.84246058}},
        panel: {"kind":"tone","at":0.64488364,"chroma":{"delta":-0.13968785},"hue":{"delta":-4.0924005}},
        edge: { kind: "literal", value: literal("#efe9f6") },
        shade: { kind: "literal", value: literal("#351d57") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.2805
          },
          hue: {
            delta: -20.81
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.2805
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
                    delta: -0.2796
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
                    delta: -0.2649
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
          id: "memories",
          palette: { highlight: { kind: "literal", value: literal("#8b5cf6") } }
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 180,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.7164,
                chroma: {
                  delta: -0.0795
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
                  delta: 0.0983
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
                  delta: 0.2075
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
