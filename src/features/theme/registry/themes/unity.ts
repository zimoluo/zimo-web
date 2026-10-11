import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "unity",
    name: "Unity",
    ramp: {
      hue: 241.88,
      chroma: 0.782,
      lightest: 0.9937,
      darkest: 0.3635,
      torsion: 33.5
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":0.99999775,"chroma":{"delta":0.1006318},"hue":{"delta":-4.55049554}},
        textMuted: {"kind":"tone","at":0.68021819,"chroma":{"delta":0.14708725},"hue":{"delta":-3.23907829}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.33315434,"chroma":{"delta":-0.06868666},"hue":{"delta":-8.86170787}},
        panel: {"kind":"tone","at":0.04206791,"chroma":{"delta":-0.17901865},"hue":{"delta":-3.01706116}},
        edge: { kind: "literal", value: literal("#e7f4f9") },
        shade: { kind: "literal", value: literal("#134b61") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1117,
          chroma: {
            delta: 0.218
          },
          hue: {
            delta: -142.62
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
                  at: 0.0115,
                  chroma: {
                    delta: 0.218
                  },
                  hue: {
                    delta: -14.48
                  }
                }
              },
              {
                at: 25,
                color: { kind: "literal", value: literal("#fffeee") }
              },
              {
                at: 50,
                color: {
                  kind: "tone",
                  at: 0.0115,
                  chroma: {
                    delta: 0.218
                  },
                  hue: {
                    delta: -14.48
                  }
                }
              },
              {
                at: 75,
                color: { kind: "literal", value: literal("#fffeee") }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0115,
                  chroma: {
                    delta: 0.218
                  },
                  hue: {
                    delta: -14.48
                  }
                }
              }
            ],
            kind: "conic",
            from: 45,
            at: {
              x: 50,
              y: 50
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
                color: { kind: "literal", value: literal("#fffbf1") },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#fffdf6") },
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
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.9293,
        chroma: {
          delta: 0.1426
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
                at: 0.2599,
                chroma: {
                  delta: 0.218
                },
                hue: {
                  delta: 19.95
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.0622,
                chroma: {
                  delta: 0.218
                },
                hue: {
                  delta: -4.94
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
              color: { kind: "literal", value: literal("#ffcf94") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#fff8ed") }
            }
          ]
        },
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ffcf94") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#fff8ed") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.677,
    maxDeltaEOk: 0.000032,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
