import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "mori",
    name: "Mori",
    ramp: {
      hue: 120.59,
      chroma: 0.6439,
      lightest: 0.9455,
      darkest: 0.4456,
      torsion: 10.69
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.1665
          },
          hue: {
            delta: -2.16
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6606,
          chroma: {
            delta: 0.1979
          },
          hue: {
            delta: 1.69
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.1301,
          chroma: {
            delta: -0.0386
          },
          hue: {
            delta: 3.14
          }
        },
        panel: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.3258
          },
          hue: {
            delta: -3.94
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
          at: 0.0229,
          chroma: {
            delta: 0.3561
          },
          hue: {
            delta: -35.42
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
                color: {
                  kind: "tone",
                  at: 0.0768,
                  chroma: {
                    delta: -0.348
                  },
                  hue: {
                    delta: 2.3
                  }
                }
              },
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.0768,
                  chroma: {
                    delta: -0.348
                  },
                  hue: {
                    delta: 2.3
                  }
                }
              },
              {
                at: 20.01,
                color: {
                  kind: "tone",
                  at: 0.1587,
                  chroma: {
                    delta: -0.2016
                  },
                  hue: {
                    delta: -36.9
                  }
                }
              },
              {
                at: 40,
                color: {
                  kind: "tone",
                  at: 0.1587,
                  chroma: {
                    delta: -0.2016
                  },
                  hue: {
                    delta: -36.9
                  }
                }
              },
              {
                at: 40.01,
                color: { kind: "literal", value: literal("#d7b29d") }
              },
              {
                at: 60,
                color: { kind: "literal", value: literal("#d7b29d") }
              },
              {
                at: 60.01,
                color: { kind: "literal", value: literal("#c9908b") }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#c9908b") }
              },
              {
                at: 80.01,
                color: { kind: "literal", value: literal("#b59395") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#b59395") }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 90
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
                color: {
                  kind: "tone",
                  at: 0.0229,
                  chroma: {
                    delta: 0.3561
                  },
                  hue: {
                    delta: -35.42
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.0229,
                  chroma: {
                    delta: 0.3561
                  },
                  hue: {
                    delta: -35.42
                  }
                }
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
                color: {
                  kind: "tone",
                  at: 0.1587,
                  chroma: {
                    delta: -0.2016
                  },
                  hue: {
                    delta: -36.9
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.1587,
                  chroma: {
                    delta: -0.2016
                  },
                  hue: {
                    delta: -36.9
                  }
                }
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
    scheme: "light",
    purity: 0.732,
    maxDeltaEOk: 0.000038,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
