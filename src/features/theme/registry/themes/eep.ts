import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "eep",
    name: "Eep",
    ramp: {
      hue: 161.18,
      chroma: 0.7264,
      lightest: 0.997,
      darkest: 0.4462,
      torsion: -9.92
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":0.99990057,"chroma":{"delta":0.22148308},"hue":{"delta":3.51188141}},
        textMuted: {"kind":"tone","at":0.60460214,"chroma":{"delta":0.23313354},"hue":{"delta":-1.69825597}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.1728445,"chroma":{"delta":-0.25337027},"hue":{"delta":2.72978244}},
        panel: {"kind":"tone","at":0.05848143,"chroma":{"delta":-0.20134456},"hue":{"delta":1.5489814}},
        edge: { kind: "literal", value: literal("#e6f9f1") },
        shade: { kind: "literal", value: literal("#11633e") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.7264
          },
          hue: {
            delta: -76.26
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
                color: { kind: "literal", value: literal("#ffbaba") }
              },
              {
                at: 5,
                color: { kind: "literal", value: literal("#ffd8ad") }
              },
              {
                at: 10,
                color: {
                  kind: "tone",
                  at: 0.0433,
                  chroma: {
                    delta: 0.2736
                  },
                  hue: {
                    delta: -59.46
                  }
                }
              },
              {
                at: 15,
                color: {
                  kind: "tone",
                  at: 0.1527,
                  chroma: {
                    delta: 0.2736
                  },
                  hue: {
                    delta: -20.4
                  }
                }
              },
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.1204,
                  chroma: {
                    delta: 0.2736
                  },
                  hue: {
                    delta: 13.9
                  }
                }
              },
              {
                at: 25,
                color: { kind: "literal", value: literal("#a3dcff") }
              },
              {
                at: 30,
                color: { kind: "literal", value: literal("#cea3ff") }
              },
              {
                at: 35,
                color: { kind: "literal", value: literal("#ffbaba") }
              }
            ],
            repeating: true,
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 50,
              y: 50
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
                color: { kind: "literal", value: literal("#e0d6ff") },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffe0e0") },
                binding: "scaled"
              }
            ],
            interpolation: {
              space: "hsl",
              hue: "longer"
            },
            kind: "radial",
            at: {
              x: 50,
              y: 50
            },
            extent: {
              kind: "circle",
              size: "farthest-side"
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
          id: "eep"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.8568,
        chroma: {
          delta: 0.231
        },
        hue: {
          delta: -0.6
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
                at: 0.8568,
                chroma: {
                  delta: 0.231
                },
                hue: {
                  delta: -0.6
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3686,
                chroma: {
                  delta: 0.1748
                },
                hue: {
                  delta: -1.69
                }
              }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#115d7d") }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4601,
                chroma: {
                  delta: 0.1478
                },
                hue: {
                  delta: 56.7
                }
              }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0.001,
              color: {
                kind: "tone",
                at: 0.8246,
                chroma: {
                  delta: 0.2245
                },
                hue: {
                  delta: -26.06
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3157,
                chroma: {
                  delta: 0.1628
                },
                hue: {
                  delta: -35.06
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
    purity: 0.578,
    maxDeltaEOk: 0.000035,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
