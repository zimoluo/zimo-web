import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "sky",
    name: "Sky",
    ramp: {
      hue: 223.94,
      chroma: 0.8583,
      lightest: 0.9769,
      darkest: 0.403,
      torsion: 6.97
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":0.99994819,"chroma":{"delta":0.07381354},"hue":{"delta":-1.41683616}},
        textMuted: {"kind":"tone","at":0.74134957,"chroma":{"delta":0.04711072},"hue":{"delta":0.4524766}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.37104416,"chroma":{"delta":-0.26257726},"hue":{"delta":-1.31434983}},
        panel: {"kind":"tone","at":0.06697394,"chroma":{"delta":0.14179663},"hue":{"delta":-0.98667848}},
        edge: { kind: "literal", value: literal("#e1f7fe") },
        shade: { kind: "literal", value: literal("#005774") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.233,
          chroma: {
            delta: 0.1417
          },
          hue: {
            delta: 6.04
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
                  at: 0.0332,
                  chroma: {
                    delta: 0.1417
                  },
                  hue: {
                    delta: 3.54
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.1792,
                  chroma: {
                    delta: 0.1417
                  },
                  hue: {
                    delta: 5.26
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
                  at: 0,
                  chroma: {
                    delta: 0.1417
                  },
                  hue: {
                    delta: 2.22
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0294,
                  chroma: {
                    delta: 0.1417
                  }
                },
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
          id: "sky"
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
                at: 0.0332,
                chroma: {
                  delta: 0.1417
                },
                hue: {
                  delta: 3.54
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.1792,
                chroma: {
                  delta: 0.1417
                },
                hue: {
                  delta: 5.26
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
    purity: 0.855,
    maxDeltaEOk: 0.00084,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
