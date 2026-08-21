import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "birthday",
    name: "Birthday",
    ramp: {
      hue: 359.83,
      chroma: 0.8698,
      lightest: 0.9907,
      darkest: 0.4078,
      torsion: 23.93
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0065
          },
          hue: {
            delta: -9.36
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7841,
          chroma: {
            delta: 0.0726
          },
          hue: {
            delta: -2.67
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1706,
          hue: {
            delta: -8.72
          }
        },
        panel: {
          kind: "tone",
          at: 0.0367,
          chroma: {
            delta: -0.082
          },
          hue: {
            delta: -5.55
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
          at: 0.303,
          chroma: {
            delta: 0.0152
          },
          hue: {
            delta: -9.1
          }
        }
      },
      mirrorDark: true,
      darkReviewed: false
    },
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#b6ffab") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#f9ffeb") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 115,
              y: 30
            },
            extent: {
              kind: "ellipse",
              x: 54,
              y: 54
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.1993,
                  chroma: {
                    delta: 0.1302
                  },
                  hue: {
                    delta: -5.38
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0643,
                  chroma: {
                    delta: 0.1302
                  },
                  hue: {
                    delta: 17.77
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 14,
              y: 64
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
                color: { kind: "literal", value: literal("#fff5e5") }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fcffe4") }
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
                color: { kind: "literal", value: literal("#b6ffab") },
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#f9ffeb") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 120,
              y: 85
            },
            extent: {
              kind: "ellipse",
              x: 70,
              y: 120
            }
          },
          {
            id: "widget-1",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.1993,
                  chroma: {
                    delta: 0.1302
                  },
                  hue: {
                    delta: -5.38
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.0643,
                  chroma: {
                    delta: 0.1302
                  },
                  hue: {
                    delta: 17.77
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 14,
              y: 20
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
                color: { kind: "literal", value: literal("#fff5e5") },
                binding: "scaled"
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fcffe4") },
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
    backdrop: {
      scenes: [
        {
          id: "birthday"
        }
      ]
    },
    mark: {
      mode: "unified",
      stroke: {
        kind: "tone",
        at: 0.7841,
        chroma: {
          delta: 0.0726
        },
        hue: {
          delta: -2.67
        }
      },
      gradients: [
        {
          angle: 45,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.4568,
                chroma: {
                  delta: 0.0768
                },
                hue: {
                  delta: 1.3
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#fbc480") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.925,
    maxDeltaEOk: 0.000177,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
