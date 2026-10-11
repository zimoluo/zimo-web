import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "scintillating",
    name: "Scintillating",
    ramp: {
      hue: 2.31,
      chroma: 1,
      lightest: 0.9526,
      darkest: 0.3675,
      torsion: 10.1
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":1,"chroma":{"delta":0.00000947},"hue":{"delta":-0.67815753}},
        textMuted: {"kind":"tone","at":0.71558109,"chroma":{"delta":0.00002493},"hue":{"delta":-1.29077934}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.15056818,"chroma":{"delta":0.00005619},"hue":{"delta":-6.47246318}},
        panel: {"kind":"tone","at":0.00687153,"chroma":{"delta":0.00008233},"hue":{"delta":3.33639174}},
        edge: { kind: "literal", value: literal("#fee1e9") },
        shade: { kind: "literal", value: literal("#74001d") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.2974,
          hue: {
            delta: -5.13
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
                at: 92,
                color: {
                  kind: "tone",
                  at: 0.2104,
                  hue: {
                    delta: -3.34
                  }
                },
                alpha: 0.18
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.213,
                  hue: {
                    delta: 5.77
                  }
                },
                alpha: 0
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 315
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 30,
                color: {
                  kind: "tone",
                  at: 0.0827,
                  hue: {
                    delta: -11.94
                  }
                },
                alpha: 0.0706
              },
              {
                at: 39,
                color: {
                  kind: "tone",
                  at: 0.3883,
                  hue: {
                    delta: 8.57
                  }
                },
                alpha: 0.0784
              }
            ],
            repeating: true,
            kind: "radial",
            at: {
              x: 238,
              y: 218
            },
            extent: {
              kind: "ellipse",
              x: 75,
              y: 75
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.0454,
                  hue: {
                    delta: -12.11
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.2222,
                  hue: {
                    delta: -5.06
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 109,
              y: 2
            },
            extent: {
              kind: "ellipse",
              x: 99,
              y: 99
            }
          },
          {
            id: "page-3",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.0351,
                  hue: {
                    delta: 4.87
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0266,
                  hue: {
                    delta: -11.35
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 21,
              y: 78
            },
            extent: {
              kind: "ellipse",
              x: 99,
              y: 99
            }
          },
          {
            id: "page-4",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.0446,
                  hue: {
                    delta: -3.09
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0233,
                  hue: {
                    delta: 5.64
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 0,
              y: 100
            },
            extent: {
              kind: "ellipse",
              x: 160,
              y: 154
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
                  at: 0.1123,
                  hue: {
                    delta: 4.25
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0,
                  hue: {
                    delta: -10.18
                  }
                },
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
      },
      "page-reduced": {
        layers: [
          {
            id: "page-reduced-0",
            stops: [
              {
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.1158,
                  hue: {
                    delta: -11.34
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.1013,
                  hue: {
                    delta: -3.92
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
      }
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 135,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.0072,
                hue: {
                  delta: -12.38
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.2949,
                hue: {
                  delta: -1.74
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
    purity: 0.981,
    maxDeltaEOk: 0.000024,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
