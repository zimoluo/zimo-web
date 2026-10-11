import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "stars",
    name: "Stars",
    ramp: {
      hue: 226.81,
      chroma: 0.7962,
      lightest: 0.9872,
      darkest: 0.2318,
      torsion: 41.36
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0.00004309,"chroma":{"delta":0.20409719},"hue":{"delta":4.90572343}},
        textMuted: {"kind":"tone","at":0.06900413,"chroma":{"delta":-0.04846563},"hue":{"delta":-1.68773935}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.54620763,"chroma":{"delta":-0.01112236},"hue":{"delta":-3.07443996}},
        panel: {"kind":"tone","at":0.90450682,"chroma":{"delta":-0.14423877},"hue":{"delta":4.62117961}},
        edge: { kind: "literal", value: literal("#e9f0f7") },
        shade: { kind: "literal", value: literal("#1a3b5a") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.9554,
          chroma: {
            delta: -0.1177
          },
          hue: {
            delta: 9.14
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
                  at: 0.9554,
                  chroma: {
                    delta: -0.1177
                  },
                  hue: {
                    delta: 9.14
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#1a1c2b") }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "ellipse",
              x: 90,
              y: 100
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
                  at: 0.9032,
                  chroma: {
                    delta: -0.205
                  },
                  hue: {
                    delta: 11.72
                  }
                },
                alpha: 0.5,
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9323,
                  chroma: {
                    delta: -0.4053
                  },
                  hue: {
                    delta: 11.96
                  }
                },
                alpha: 0.5,
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "ellipse",
              x: 90,
              y: 100
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
          id: "stars"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.0145,
        chroma: {
          delta: 0.2038
        },
        hue: {
          delta: 0.86
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
                at: 0.9045,
                chroma: {
                  delta: -0.1442
                },
                hue: {
                  delta: 4.62
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.8325,
                chroma: {
                  delta: -0.1998
                },
                hue: {
                  delta: 13.82
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 12
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.869,
    maxDeltaEOk: 0.000039,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
