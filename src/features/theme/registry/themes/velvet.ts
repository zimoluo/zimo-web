import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "velvet",
    name: "Velvet",
    ramp: {
      hue: 316.32,
      chroma: 0.4625,
      lightest: 0.9115,
      darkest: 0.309,
      torsion: -4.17
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0.00004945,"chroma":{"delta":-0.11399769},"hue":{"delta":1.04684477}},
        textMuted: {"kind":"tone","at":0.28105291,"chroma":{"delta":-0.04652897},"hue":{"delta":-0.81207625}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.59978774,"chroma":{"delta":0.05596716},"hue":{"delta":0.4664123}},
        panel: {"kind":"tone","at":0.8939405,"chroma":{"delta":0.10466239},"hue":{"delta":0.76306341}},
        edge: { kind: "literal", value: literal("#f2ebf5") },
        shade: { kind: "literal", value: literal("#452153") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0149
          },
          hue: {
            delta: -13.44
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
                  at: 0.8155,
                  chroma: {
                    delta: 0.0356
                  },
                  hue: {
                    delta: -14.42
                  }
                }
              },
              {
                at: 90,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.0149
                  },
                  hue: {
                    delta: -13.44
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "circle",
              size: "farthest-side"
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
                at: 25,
                color: {
                  kind: "tone",
                  at: 0.9071,
                  chroma: {
                    delta: 0.064
                  },
                  hue: {
                    delta: -10.01
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9737,
                  chroma: {
                    delta: 0.0385
                  },
                  hue: {
                    delta: -5.16
                  }
                },
                alpha: 0.8,
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
    backdrop: {
      scenes: [
        {
          id: "velvet"
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
                at: 0.8444,
                chroma: {
                  delta: 0.1143
                },
                hue: {
                  delta: -6.41
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.5287,
                chroma: {
                  delta: 0.0606
                },
                hue: {
                  delta: -14.1
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
    purity: 0.914,
    maxDeltaEOk: 0.001177,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
