import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "cherry",
    name: "Cherry",
    ramp: {
      hue: 355.78,
      chroma: 0.9708,
      lightest: 0.96,
      darkest: 0.387
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":0.9999188,"chroma":{"delta":-0.00817201},"hue":{"delta":15.21590974}},
        textMuted: {"kind":"tone","at":0.69925369,"chroma":{"delta":-0.02822316},"hue":{"delta":-7.07118755}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.20935963,"chroma":{"delta":0.00701001},"hue":{"delta":-9.57022545}},
        panel: {"kind":"tone","at":0.00611283,"chroma":{"delta":0.02946184},"hue":{"delta":11.39314064}},
        edge: { kind: "literal", value: literal("#fee1e6") },
        shade: { kind: "literal", value: literal("#740011") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.2262,
          chroma: {
            delta: -0.2981
          },
          hue: {
            delta: 0.98
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
                color: { kind: "literal", value: literal("#cfd4c5") }
              },
              {
                at: 20,
                color: { kind: "literal", value: literal("#cfd4c5") }
              },
              {
                at: 20.01,
                color: {
                  kind: "tone",
                  at: 0.1492,
                  chroma: {
                    delta: -0.4262
                  },
                  hue: {
                    delta: 11.05
                  }
                }
              },
              {
                at: 40,
                color: {
                  kind: "tone",
                  at: 0.1492,
                  chroma: {
                    delta: -0.4262
                  },
                  hue: {
                    delta: 11.05
                  }
                }
              },
              {
                at: 40.01,
                color: {
                  kind: "tone",
                  at: 0.2262,
                  chroma: {
                    delta: -0.2981
                  },
                  hue: {
                    delta: 0.98
                  }
                }
              },
              {
                at: 60,
                color: {
                  kind: "tone",
                  at: 0.2262,
                  chroma: {
                    delta: -0.2981
                  },
                  hue: {
                    delta: 0.98
                  }
                }
              },
              {
                at: 60.01,
                color: {
                  kind: "tone",
                  at: 0.2596,
                  chroma: {
                    delta: -0.303
                  },
                  hue: {
                    delta: -32.5
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.2596,
                  chroma: {
                    delta: -0.303
                  },
                  hue: {
                    delta: -32.5
                  }
                }
              },
              {
                at: 80.01,
                color: {
                  kind: "tone",
                  at: 0.4285,
                  chroma: {
                    delta: -0.2332
                  },
                  hue: {
                    delta: -44.68
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.4285,
                  chroma: {
                    delta: -0.2332
                  },
                  hue: {
                    delta: -44.68
                  }
                }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "corner",
              x: "right",
              y: "top"
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
                at: 10,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.0292
                  },
                  hue: {
                    delta: -19.37
                  }
                },
                binding: "scaled"
              },
              {
                at: 60,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.0292
                  },
                  hue: {
                    delta: -19.37
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
                  at: 0.1492,
                  chroma: {
                    delta: -0.4262
                  },
                  hue: {
                    delta: 11.05
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.1492,
                  chroma: {
                    delta: -0.4262
                  },
                  hue: {
                    delta: 11.05
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
      mode: "backdrop"
    },
    reading: {
      blur: 0
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.877,
    maxDeltaEOk: 0.000029,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
