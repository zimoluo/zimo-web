import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "energize",
    name: "Energize",
    ramp: {
      hue: 311.43,
      chroma: 0.9291,
      lightest: 0.9456,
      darkest: 0.2867,
      torsion: -19.54
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0.0000425,"chroma":{"delta":0.07097056},"hue":{"delta":-2.82066552}},
        textMuted: {"kind":"tone","at":0.25779695,"chroma":{"delta":-0.12261374},"hue":{"delta":4.51583864}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.62589968,"chroma":{"delta":0.00763689},"hue":{"delta":2.78482132}},
        panel: {"kind":"tone","at":0.74009147,"chroma":{"delta":0.043953},"hue":{"delta":-2.78443908}},
        edge: { kind: "literal", value: literal("#f2e3fc") },
        shade: { kind: "literal", value: literal("#450470") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.5164,
          chroma: {
            delta: 0.0361
          },
          hue: {
            delta: 8.21
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
                    delta: 0.0082
                  },
                  hue: {
                    delta: -21.78
                  }
                }
              },
              {
                at: 32,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.0082
                  },
                  hue: {
                    delta: -21.78
                  }
                }
              },
              {
                at: 32.01,
                color: {
                  kind: "tone",
                  at: 0.8795,
                  chroma: {
                    delta: 0.0416
                  },
                  hue: {
                    delta: -10.5
                  }
                }
              },
              {
                at: 37,
                color: {
                  kind: "tone",
                  at: 0.8795,
                  chroma: {
                    delta: 0.0416
                  },
                  hue: {
                    delta: -10.5
                  }
                }
              },
              {
                at: 37.01,
                color: {
                  kind: "tone",
                  at: 0.7603,
                  chroma: {
                    delta: 0.0577
                  },
                  hue: {
                    delta: -2.96
                  }
                }
              },
              {
                at: 40,
                color: {
                  kind: "tone",
                  at: 0.7603,
                  chroma: {
                    delta: 0.0577
                  },
                  hue: {
                    delta: -2.96
                  }
                }
              },
              {
                at: 40.01,
                color: {
                  kind: "tone",
                  at: 0.6501,
                  chroma: {
                    delta: 0.0674
                  },
                  hue: {
                    delta: 0.99
                  }
                }
              },
              {
                at: 53,
                color: {
                  kind: "tone",
                  at: 0.6501,
                  chroma: {
                    delta: 0.0674
                  },
                  hue: {
                    delta: 0.99
                  }
                }
              },
              {
                at: 53.01,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 100,
              y: 8
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
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
                  at: 0.6501,
                  chroma: {
                    delta: 0.0674
                  },
                  hue: {
                    delta: 0.99
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5987,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 4.68
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
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
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
                at: 0.7543,
                chroma: {
                  delta: 0.0377
                },
                hue: {
                  delta: -13.12
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4548,
                chroma: {
                  delta: 0.0709
                },
                hue: {
                  delta: 6.92
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 32
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.92,
    maxDeltaEOk: 0.000031,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
