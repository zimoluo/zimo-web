import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "birthday19",
    name: "Birthday19",
    ramp: {
      hue: 257.17,
      chroma: 0.6143,
      lightest: 0.9452,
      darkest: 0.2786
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.0548
          },
          hue: {
            delta: 7.33
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2436,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: -0.74
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.7174,
          chroma: {
            delta: -0.0573
          },
          hue: {
            delta: 1.29
          }
        },
        panel: {
          kind: "tone",
          at: 0.89,
          chroma: {
            delta: 0.0453
          },
          hue: {
            delta: -2.36
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#19375c") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.9572,
          chroma: {
            delta: 0.0496
          },
          hue: {
            delta: -4.45
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
                color: { kind: "literal", value: literal("#0c5337") },
                alpha: 0.55
              },
              {
                at: 225,
                color: { kind: "literal", value: literal("#61d160") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 80,
              y: 105
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#5c2711") },
                alpha: 0.5
              },
              {
                at: 150,
                color: { kind: "literal", value: literal("#d18760") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 8,
              y: 24
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#750505") },
                alpha: 0.4
              },
              {
                at: 76,
                color: { kind: "literal", value: literal("#b21818") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 90,
              y: 40
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
            }
          },
          {
            id: "page-3",
            stops: [
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.9229,
                  chroma: {
                    delta: 0.1209
                  },
                  hue: {
                    delta: -3.83
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.9572,
                  chroma: {
                    delta: 0.0496
                  },
                  hue: {
                    delta: -4.45
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
                color: { kind: "literal", value: literal("#0b4f34") },
                alpha: 0.5,
                binding: "scaled"
              },
              {
                at: 150,
                color: { kind: "literal", value: literal("#61d160") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: -2,
              y: 20
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#750505") },
                alpha: 0.4,
                binding: "scaled"
              },
              {
                at: 125,
                color: { kind: "literal", value: literal("#b21818") },
                alpha: 0,
                binding: "scaled"
              }
            ],
            kind: "radial",
            at: {
              x: 105,
              y: 40
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
            }
          },
          {
            id: "widget-2",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#5c2711") },
                alpha: 0.5,
                binding: "scaled"
              },
              {
                at: 150,
                color: { kind: "literal", value: literal("#d18760") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 36,
              y: 102
            },
            extent: {
              kind: "circle",
              size: "closest-corner"
            }
          },
          {
            id: "widget-3",
            stops: [
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.9493,
                  chroma: {
                    delta: 0.1149
                  },
                  hue: {
                    delta: 1.18
                  }
                },
                alpha: 0.84,
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.1651
                  },
                  hue: {
                    delta: -0.5
                  }
                },
                alpha: 0.92,
                binding: "scaled"
              }
            ],
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
    backdrop: {
      scenes: [
        {
          id: "birthday19"
        }
      ]
    },
    mark: {
      mode: "backdrop",
      stroke: {
        kind: "tone",
        at: 0.104,
        chroma: {
          delta: -0.2621
        }
      }
    },
    reading: {
      blur: 32
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.927,
    maxDeltaEOk: 0.000032,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
