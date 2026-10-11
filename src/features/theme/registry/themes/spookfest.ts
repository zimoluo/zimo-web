import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "spookfest",
    name: "Spookfest",
    ramp: {
      hue: 230.15,
      chroma: 0.7279,
      lightest: 0.9547,
      darkest: 0.3671
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0.00008949,"chroma":{"delta":-0.19211023},"hue":{"delta":1.05705602}},
        textMuted: {"kind":"tone","at":0.22793202,"chroma":{"delta":-0.18327122},"hue":{"delta":3.84293314}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.58399623,"chroma":{"delta":0.15685722},"hue":{"delta":1.62652683}},
        panel: {"kind":"tone","at":0.71553917,"chroma":{"delta":0.21868056},"hue":{"delta":-4.24886231}},
        edge: { kind: "literal", value: literal("#e5f5fa") },
        shade: { kind: "literal", value: literal("#0c5168") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.6598,
          chroma: {
            delta: 0.1621
          },
          hue: {
            delta: -8.9
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
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.1491
                  },
                  hue: {
                    delta: -10.66
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.6107,
                  chroma: {
                    delta: 0.1645
                  },
                  hue: {
                    delta: -9.64
                  }
                }
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
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.7608,
                  chroma: {
                    delta: 0.1579
                  },
                  hue: {
                    delta: -9.32
                  }
                },
                alpha: 0.69,
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.9344,
                  chroma: {
                    delta: 0.1466
                  },
                  hue: {
                    delta: -10.14
                  }
                },
                alpha: 0.72,
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
          id: "halloween"
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
                at: 0.7608,
                chroma: {
                  delta: 0.1579
                },
                hue: {
                  delta: -9.32
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4776,
                chroma: {
                  delta: 0.1636
                },
                hue: {
                  delta: -9.6
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
    purity: 0.796,
    maxDeltaEOk: 0.000025,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
