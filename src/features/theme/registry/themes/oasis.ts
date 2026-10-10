import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "oasis",
    name: "Oasis",
    ramp: {
      hue: 173.52,
      chroma: 0.9019,
      lightest: 0.9875,
      darkest: 0.4831,
      torsion: -8.7
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0754
          },
          hue: {
            delta: 1.48
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.5405,
          chroma: {
            delta: 0.0698
          },
          hue: {
            delta: -1.58
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1357,
          chroma: {
            delta: -0.2433
          },
          hue: {
            delta: 1.14
          }
        },
        panel: {
          kind: "tone",
          at: 0.0454,
          chroma: {
            delta: 0.0981
          },
          hue: {
            delta: 0.57
          }
        },
        edge: 0,
        shade: 1,
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1436,
          chroma: {
            delta: 0.0981
          },
          hue: {
            delta: -116.27
          }
        }
      },
      mirrorDark: true,
      darkReviewed: false
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
                color: { kind: "literal", value: literal("#fdd5bb") },
                alpha: 0.45
              },
              {
                at: 18,
                color: { kind: "literal", value: literal("#fceace") },
                alpha: 0.39
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#fff1e7") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffe8d6") }
              }
            ],
            repeating: true,
            kind: "radial",
            at: {
              x: 50,
              y: 120
            },
            extent: {
              kind: "ellipse",
              x: 40,
              y: 20
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
                at: 30,
                color: {
                  kind: "tone",
                  at: 0.0316,
                  chroma: {
                    delta: 0.0981
                  },
                  hue: {
                    delta: -6.01
                  }
                },
                alpha: 0.33,
                binding: "scaled"
              },
              {
                at: 70,
                color: { kind: "literal", value: literal("#d0f2e6") },
                alpha: 0.33,
                binding: "scaled"
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 165
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 30,
                color: {
                  kind: "tone",
                  at: 0.0324,
                  chroma: {
                    delta: -0.2379
                  },
                  hue: {
                    delta: -5.61
                  }
                },
                binding: "scaled"
              },
              {
                at: 70,
                color: {
                  kind: "tone",
                  at: 0,
                  chroma: {
                    delta: 0.0981
                  },
                  hue: {
                    delta: -3.79
                  }
                },
                binding: "scaled"
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 75
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
                at: 0,
                color: { kind: "literal", value: literal("#ffe8d6") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffe8d6") }
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
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0.8755,
        chroma: {
          delta: 0.0839
        }
      },
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#ffe7d6") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ffc79c") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.749,
    maxDeltaEOk: 0.000022,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
