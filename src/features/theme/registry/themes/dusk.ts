import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "dusk",
    name: "Dusk",
    ramp: {
      hue: 4.86,
      chroma: 0.7331,
      lightest: 0.972,
      darkest: 0.5692
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 0.9999,
          chroma: {
            delta: 0.2669
          },
          hue: {
            delta: -29.2
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6874,
          chroma: {
            delta: 0.0897
          },
          hue: {
            delta: 26.33
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3404,
          chroma: {
            delta: -0.1991
          },
          hue: {
            delta: -1.84
          }
        },
        panel: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.1574
          },
          hue: {
            delta: -7.03
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#532134") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.3872,
          chroma: {
            delta: -0.4331
          },
          hue: {
            delta: -28.65
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0.0001,
          chroma: {
            delta: 0.2669
          },
          hue: {
            delta: -29.2
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.3126,
          chroma: {
            delta: 0.0897
          },
          hue: {
            delta: 26.33
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6596,
          chroma: {
            delta: -0.1991
          },
          hue: {
            delta: -1.84
          }
        },
        panel: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.1574
          },
          hue: {
            delta: -7.03
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#532134") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.6128,
          chroma: {
            delta: -0.4331
          },
          hue: {
            delta: -28.65
          }
        }
      },
      mirrorDark: false,
      darkReviewed: true,
      lightReviewed: false
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
                color: {
                  kind: "tone",
                  at: 0.3977,
                  chroma: {
                    delta: -0.0196
                  },
                  hue: {
                    delta: 39.61
                  }
                }
              },
              {
                at: 33,
                color: {
                  kind: "tone",
                  at: 0.4258,
                  chroma: {
                    delta: 0.1626
                  },
                  hue: {
                    delta: 17.67
                  }
                }
              },
              {
                at: 67,
                color: {
                  kind: "tone",
                  at: 0.5109,
                  chroma: {
                    delta: 0.0298
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5284,
                  chroma: {
                    delta: -0.0889
                  },
                  hue: {
                    delta: -20.09
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
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
                at: 8,
                color: {
                  kind: "tone",
                  at: 0.593,
                  chroma: {
                    delta: -0.0458
                  },
                  hue: {
                    delta: -15.66
                  }
                },
                alpha: 0.95,
                binding: "scaled"
              },
              {
                at: 40,
                color: {
                  kind: "tone",
                  at: 0.5796,
                  chroma: {
                    delta: -0.0121
                  },
                  hue: {
                    delta: 0.76
                  }
                },
                alpha: 0.97,
                binding: "scaled"
              },
              {
                at: 75,
                color: {
                  kind: "tone",
                  at: 0.5507,
                  chroma: {
                    delta: 0.0723
                  },
                  hue: {
                    delta: 18.59
                  }
                },
                alpha: 0.94,
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.4598,
                  chroma: {
                    delta: -0.017
                  },
                  hue: {
                    delta: 46.08
                  }
                },
                alpha: 0.98,
                binding: "scaled"
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 22.5
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
          id: "dusk"
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 1,
                chroma: {
                  delta: -0.1574
                },
                hue: {
                  delta: -7.03
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.3126,
                chroma: {
                  delta: 0.0897
                },
                hue: {
                  delta: 26.33
                }
              }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.667,
    maxDeltaEOk: 0.00002,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "light-unreviewed"
    ]
  } as const;
