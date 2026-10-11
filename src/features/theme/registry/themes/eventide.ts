import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "eventide",
    name: "Eventide",
    ramp: {
      hue: 268.97,
      chroma: 0.587,
      lightest: 0.9592,
      darkest: 0.2104,
      torsion: -6.6
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0,"chroma":{"delta":0.41321381},"hue":{"delta":0.96774488}},
        textMuted: {"kind":"tone","at":0.29631338,"chroma":{"delta":-0.03937073},"hue":{"delta":-0.29082702}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.55610764,"chroma":{"delta":-0.17146293},"hue":{"delta":-1.14304897}},
        panel: {"kind":"tone","at":0.76817491,"chroma":{"delta":-0.20215192},"hue":{"delta":1.82473506}},
        edge: { kind: "literal", value: literal("#eaedf6") },
        shade: { kind: "literal", value: literal("#1e2b56") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.3147
          },
          hue: {
            delta: 20.18
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
                  at: 0.8828,
                  chroma: {
                    delta: -0.27
                  },
                  hue: {
                    delta: 11.62
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.3147
                  },
                  hue: {
                    delta: 20.18
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
                  at: 0.8211,
                  chroma: {
                    delta: -0.2192
                  },
                  hue: {
                    delta: 6.83
                  }
                },
                alpha: 0.8,
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.923,
                  chroma: {
                    delta: -0.277
                  },
                  hue: {
                    delta: 9.76
                  }
                },
                alpha: 0.85,
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
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
          id: "eventide"
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
                at: 0.7682,
                chroma: {
                  delta: -0.2022
                },
                hue: {
                  delta: 1.82
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4125,
                chroma: {
                  delta: -0.0262
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 8
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.745,
    maxDeltaEOk: 0.000358,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
