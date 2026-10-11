import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "about",
    name: "About",
    ramp: {
      hue: 239.47,
      chroma: 0.9646,
      lightest: 0.9851,
      darkest: 0.371,
      torsion: 9.16
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {
          kind: "tone",
          at: 0.9634,
          chroma: {
            delta: -0.0355
          },
          hue: {
            delta: -2.84
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7742,
          chroma: {
            delta: 0.0268
          },
          hue: {
            delta: 0.77
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1492,
          chroma: {
            delta: -0.0268
          },
          hue: {
            delta: -5.35
          }
        },
        panel: {
          kind: "tone",
          at: 0.0145,
          chroma: {
            delta: 0.0354
          },
          hue: {
            delta: 1.6
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#004674") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.0608,
          chroma: {
            delta: -0.0266
          },
          hue: {
            delta: 1.38
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
                  at: 0.1377,
                  chroma: {
                    delta: 0.0354
                  },
                  hue: {
                    delta: -19.62
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ebffee") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 80,
              y: 100
            },
            extent: {
              kind: "ellipse",
              x: 50,
              y: 50
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f1c5ff") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffebf1") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 6,
              y: 74
            },
            extent: {
              kind: "ellipse",
              x: 60,
              y: 60
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 20,
                color: { kind: "literal", value: literal("#ffede5") }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fffbe4") }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
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
                  at: 0.1377,
                  chroma: {
                    delta: 0.0354
                  },
                  hue: {
                    delta: -19.62
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ebffee") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 110,
              y: 60
            },
            extent: {
              kind: "ellipse",
              x: 50,
              y: 80
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f1c5ff") },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffebf1") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 12,
              y: 40
            },
            extent: {
              kind: "ellipse",
              x: 60,
              y: 90
            }
          },
          {
            id: "widget-2",
            stops: [
              {
                at: 20,
                color: { kind: "literal", value: literal("#ffede5") },
                binding: "scaled"
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fffbe4") },
                binding: "scaled"
              }
            ],
            interpolation: {
              space: "srgb"
            },
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
      }
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 1,
        chroma: {
          delta: -0.0169
        },
        hue: {
          delta: 7.26
        }
      },
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ffe147") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ff4e13") }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.274,
                chroma: {
                  delta: 0.0354
                },
                hue: {
                  delta: -22.99
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#6eff86") }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ed9dff") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ff69cb") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.957,
    maxDeltaEOk: 0.000027,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
