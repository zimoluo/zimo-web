import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "default-editor",
    name: "Default Editor",
    ramp: {
      hue: 239.47,
      chroma: 0.9646,
      lightest: 0.9851,
      darkest: 0.3912,
      torsion: 8.68
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":0.99994404,"chroma":{"delta":-0.03553758},"hue":{"delta":-2.93359749}},
        textMuted: {"kind":"tone","at":0.80175238,"chroma":{"delta":0.0268115},"hue":{"delta":0.65980892}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.15407842,"chroma":{"delta":-0.02679499},"hue":{"delta":-5.56498543}},
        panel: {"kind":"tone","at":0.01494953,"chroma":{"delta":0.03574107},"hue":{"delta":1.35998306}},
        edge: { kind: "literal", value: literal("#e1f3fe") },
        shade: { kind: "literal", value: literal("#004674") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.0577,
          chroma: {
            delta: 0.0354
          },
          hue: {
            delta: -160.47
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
                  at: 0.1422,
                  chroma: {
                    delta: 0.0354
                  },
                  hue: {
                    delta: -19.83
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
      },
      "page-reduced": {
        layers: [
          {
            id: "page-reduced-0",
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
              color: { kind: "literal", value: literal("#ffede6") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ffc5b7") }
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
                at: 0.0233,
                chroma: {
                  delta: 0.0354
                },
                hue: {
                  delta: -20.08
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3067,
                chroma: {
                  delta: 0.0354
                },
                hue: {
                  delta: -8.69
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
              color: { kind: "literal", value: literal("#fcf1ff") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#e58fff") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.778,
    maxDeltaEOk: 0.000033,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
