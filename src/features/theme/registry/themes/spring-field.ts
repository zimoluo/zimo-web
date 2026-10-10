import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "spring-field",
    name: "Spring Field",
    ramp: {
      hue: 96.39,
      chroma: 0.9945,
      lightest: 0.996,
      darkest: 0.5436,
      torsion: -12.97
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.0055
          },
          hue: {
            delta: 3.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.9136,
          chroma: {
            delta: 0.0055
          },
          hue: {
            delta: -2.1
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6991,
          chroma: {
            delta: -0.0167
          },
          hue: {
            delta: -3.29
          }
        },
        panel: {
          kind: "tone",
          at: 0.6152,
          chroma: {
            delta: 0.0055
          },
          hue: {
            delta: -3.56
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#746100") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.2871,
          chroma: {
            delta: -0.3605
          },
          hue: {
            delta: 68.61
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.0055
          },
          hue: {
            delta: 3.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.0864,
          chroma: {
            delta: 0.0055
          },
          hue: {
            delta: -2.1
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3009,
          chroma: {
            delta: -0.0167
          },
          hue: {
            delta: -3.29
          }
        },
        panel: {
          kind: "tone",
          at: 0.3848,
          chroma: {
            delta: 0.0055
          },
          hue: {
            delta: -3.56
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#746100") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.7129,
          chroma: {
            delta: -0.3605
          },
          hue: {
            delta: 68.61
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true
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
                color: { kind: "literal", value: literal("#f2bdc7") }
              },
              {
                at: 20,
                color: { kind: "literal", value: literal("#f2bdc7") }
              },
              {
                at: 20.01,
                color: {
                  kind: "tone",
                  at: 0.249,
                  chroma: {
                    delta: -0.2608
                  },
                  hue: {
                    delta: -1.19
                  }
                }
              },
              {
                at: 40,
                color: {
                  kind: "tone",
                  at: 0.249,
                  chroma: {
                    delta: -0.2608
                  },
                  hue: {
                    delta: -1.19
                  }
                }
              },
              {
                at: 40.01,
                color: { kind: "literal", value: literal("#5ba683") }
              },
              {
                at: 60,
                color: { kind: "literal", value: literal("#5ba683") }
              },
              {
                at: 60.01,
                color: { kind: "literal", value: literal("#b796d8") }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#b796d8") }
              },
              {
                at: 80.01,
                color: { kind: "literal", value: literal("#3c74a6") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#3c74a6") }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 60
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
                at: 15,
                color: { kind: "literal", value: literal("#72b495") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#72b495") }
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
                color: { kind: "literal", value: literal("#5ba683") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#5ba683") }
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
    scheme: "dark",
    purity: 0.831,
    maxDeltaEOk: 0.000085,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
