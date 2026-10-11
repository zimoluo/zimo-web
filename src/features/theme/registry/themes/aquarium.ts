import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "aquarium",
    name: "Aquarium",
    ramp: {
      hue: 233.12,
      chroma: 0.3651,
      lightest: 1,
      darkest: 0.4414,
      torsion: 6.74
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.0101
          },
          hue: {
            delta: 1.27
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7743,
          chroma: {
            delta: 0.1099
          },
          hue: {
            delta: -2.4
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.5111,
          chroma: {
            delta: -0.0147
          },
          hue: {
            delta: -1.91
          }
        },
        panel: {
          kind: "tone",
          at: 0.1959,
          chroma: {
            delta: -0.0852
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#27404d") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.5481,
          chroma: {
            delta: -0.0109
          },
          hue: {
            delta: -4.21
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
                color: { kind: "literal", value: literal("#ffeeea") },
                alpha: 0.2
              },
              {
                at: 8,
                color: { kind: "literal", value: literal("#fff2eb") },
                alpha: 0.155
              },
              {
                at: 16,
                color: { kind: "literal", value: literal("#fff8eb") },
                alpha: 0.111
              },
              {
                at: 24,
                color: { kind: "literal", value: literal("#fffeeb") },
                alpha: 0.067
              },
              {
                at: 36,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 15,
              y: 60
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#ffeeea") },
                alpha: 0.25
              },
              {
                at: 6.5,
                color: { kind: "literal", value: literal("#fff2eb") },
                alpha: 0.197
              },
              {
                at: 13,
                color: { kind: "literal", value: literal("#fff8eb") },
                alpha: 0.145
              },
              {
                at: 19.5,
                color: { kind: "literal", value: literal("#fffeeb") },
                alpha: 0.093
              },
              {
                at: 31,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 64,
              y: 20
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 10,
                color: {
                  kind: "tone",
                  at: 0.1932,
                  chroma: {
                    delta: -0.2445
                  },
                  hue: {
                    delta: -18.53
                  }
                }
              },
              {
                at: 90,
                color: {
                  kind: "tone",
                  at: 0.1209,
                  chroma: {
                    delta: 0.0466
                  },
                  hue: {
                    delta: -19.52
                  }
                }
              }
            ],
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
                color: { kind: "literal", value: literal("#ffeeea") },
                alpha: 0.225,
                binding: "scaled"
              },
              {
                at: 7,
                color: { kind: "literal", value: literal("#fff2eb") },
                alpha: 0.18,
                binding: "scaled"
              },
              {
                at: 14,
                color: { kind: "literal", value: literal("#fff8eb") },
                alpha: 0.135,
                binding: "scaled"
              },
              {
                at: 21,
                color: { kind: "literal", value: literal("#fffeeb") },
                alpha: 0.09,
                binding: "scaled"
              },
              {
                at: 35,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 40,
              y: 24
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 10,
                color: {
                  kind: "tone",
                  at: 0.2705,
                  chroma: {
                    delta: -0.1366
                  },
                  hue: {
                    delta: -16.41
                  }
                },
                binding: "scaled"
              },
              {
                at: 90,
                color: {
                  kind: "tone",
                  at: 0.1337,
                  chroma: {
                    delta: -0.1168
                  },
                  hue: {
                    delta: -16.29
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "corner",
              x: "right",
              y: "top"
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
                at: 10,
                color: {
                  kind: "tone",
                  at: 0.1932,
                  chroma: {
                    delta: -0.2445
                  },
                  hue: {
                    delta: -18.53
                  }
                }
              },
              {
                at: 90,
                color: {
                  kind: "tone",
                  at: 0.1209,
                  chroma: {
                    delta: 0.0466
                  },
                  hue: {
                    delta: -19.52
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
            }
          }
        ]
      }
    },
    backdrop: {
      scenes: [
        {
          id: "underwater"
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 135,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#f0f9ff") }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.8108,
                chroma: {
                  delta: 0.1184
                },
                hue: {
                  delta: -1.9
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
    purity: 0.943,
    maxDeltaEOk: 0.000054,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
