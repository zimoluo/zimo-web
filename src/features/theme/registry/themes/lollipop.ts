import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "lollipop",
    name: "Lollipop",
    ramp: {
      hue: 355.69,
      chroma: 0.6381,
      lightest: 0.9566,
      darkest: 0.3796,
      torsion: 10.93
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":1,"chroma":{"delta":0.30016256},"hue":{"delta":-1.11171329}},
        textMuted: {"kind":"tone","at":0.73113404,"chroma":{"delta":0.05851208},"hue":{"delta":-3.94705094}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.19834257,"chroma":{"delta":-0.19427868},"hue":{"delta":-4.36219201}},
        panel: {"kind":"tone","at":0.01675805,"chroma":{"delta":-0.16461534},"hue":{"delta":-0.31170929}},
        edge: { kind: "literal", value: literal("#f5eaef") },
        shade: { kind: "literal", value: literal("#532136") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.5216,
          chroma: {
            delta: -0.2075
          },
          hue: {
            delta: -4.74
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
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              },
              {
                at: 7,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              },
              {
                at: 7.01,
                color: {
                  kind: "tone",
                  at: 0.0998,
                  chroma: {
                    delta: -0.0324
                  },
                  hue: {
                    delta: -6.03
                  }
                }
              },
              {
                at: 14,
                color: {
                  kind: "tone",
                  at: 0.0998,
                  chroma: {
                    delta: -0.0324
                  },
                  hue: {
                    delta: -6.03
                  }
                }
              }
            ],
            repeating: true,
            kind: "conic",
            from: 60,
            at: {
              x: 60,
              y: 55
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
                  at: 0.0114,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -4.39
                  }
                },
                binding: "scaled"
              },
              {
                at: 5,
                color: {
                  kind: "tone",
                  at: 0.0553,
                  chroma: {
                    delta: 0.3183
                  },
                  hue: {
                    delta: -6.03
                  }
                },
                binding: "scaled"
              }
            ],
            repeating: true,
            kind: "conic",
            from: 30,
            at: {
              x: 100,
              y: 0
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.3619
                  },
                  hue: {
                    delta: -3.11
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
      }
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
                at: 0,
                chroma: {
                  delta: 0.3619
                },
                hue: {
                  delta: -3.11
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.0383,
                chroma: {
                  delta: 0.3619
                },
                hue: {
                  delta: -5.27
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 0
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.799,
    maxDeltaEOk: 0.000092,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
