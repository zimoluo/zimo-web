import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "autumnal",
    name: "Autumnal",
    ramp: {
      hue: 74.32,
      chroma: 0.6395,
      lightest: 0.9642,
      darkest: 0.2385
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.3605
          },
          hue: {
            delta: 1.37
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.9086,
          chroma: {
            delta: -0.4896
          },
          hue: {
            delta: 127.06
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.523,
          chroma: {
            delta: 0.0579
          },
          hue: {
            delta: -7.83
          }
        },
        panel: {
          kind: "tone",
          at: 0.7148,
          chroma: {
            delta: 0.0712
          },
          hue: {
            delta: -0.65
          }
        },
        edge: 1,
        shade: 0,
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.3048,
          chroma: {
            delta: 0.2626
          },
          hue: {
            delta: 171.22
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.3605
          },
          hue: {
            delta: 1.37
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.0914,
          chroma: {
            delta: -0.4896
          },
          hue: {
            delta: 127.06
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.477,
          chroma: {
            delta: 0.0579
          },
          hue: {
            delta: -7.83
          }
        },
        panel: {
          kind: "tone",
          at: 0.2852,
          chroma: {
            delta: 0.0712
          },
          hue: {
            delta: -0.65
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
          at: 0.6952,
          chroma: {
            delta: 0.2626
          },
          hue: {
            delta: 171.22
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true
    },
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#031d44") }
              },
              {
                at: 20,
                color: { kind: "literal", value: literal("#031d44") }
              },
              {
                at: 20.01,
                color: { kind: "literal", value: literal("#04395e") }
              },
              {
                at: 40,
                color: { kind: "literal", value: literal("#04395e") }
              },
              {
                at: 40.01,
                color: { kind: "literal", value: literal("#70a288") }
              },
              {
                at: 60,
                color: { kind: "literal", value: literal("#70a288") }
              },
              {
                at: 60.01,
                color: {
                  kind: "tone",
                  at: 0.2444,
                  chroma: {
                    delta: -0.1796
                  },
                  hue: {
                    delta: 1.82
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.2444,
                  chroma: {
                    delta: -0.1796
                  },
                  hue: {
                    delta: 1.82
                  }
                }
              },
              {
                at: 80.01,
                color: {
                  kind: "tone",
                  at: 0.3725,
                  chroma: {
                    delta: -0.1219
                  },
                  hue: {
                    delta: -34.68
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.3725,
                  chroma: {
                    delta: -0.1219
                  },
                  hue: {
                    delta: -34.68
                  }
                }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "corner",
              x: "right",
              y: "bottom"
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
                color: { kind: "literal", value: literal("#15598a") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#15598a") }
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
                color: { kind: "literal", value: literal("#04395e") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#04395e") }
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
    purity: 0.409,
    maxDeltaEOk: 0.00003,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
