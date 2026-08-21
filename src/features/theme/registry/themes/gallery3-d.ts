import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "gallery3-d",
    name: "Gallery3 D",
    ramp: {
      hue: 330,
      chroma: 0.1712,
      lightest: 1,
      darkest: 0.3177
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.1352
          },
          hue: {
            delta: -55.25
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7288,
          chroma: {
            delta: -0.0754
          },
          hue: {
            delta: -9.4
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.4058,
          chroma: {
            delta: -0.0813
          },
          hue: {
            delta: 84.84
          }
        },
        panel: {
          kind: "tone",
          at: 0.0727,
          chroma: {
            delta: 0.2919
          },
          hue: {
            delta: -38.05
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
          at: 0.0048,
          chroma: {
            delta: -0.1712
          },
          hue: {
            delta: 119.88
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
                color: { kind: "literal", value: literal("#f2b6f4") },
                alpha: 0.08
              },
              {
                at: 44,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 19.3,
              y: 100.6
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
                color: { kind: "literal", value: literal("#d5a9f5") },
                alpha: 0.05
              },
              {
                at: 39.8,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 22.3,
              y: 8.6
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
                at: 0,
                color: { kind: "literal", value: literal("#f7e1d1") },
                alpha: 0.12
              },
              {
                at: 41.5,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 53.5,
              y: 53.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-3",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#c3f3a6") },
                alpha: 0.07
              },
              {
                at: 29.6,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 100.1,
              y: 16.9
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-4",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#a9c7f2") },
                alpha: 0.03
              },
              {
                at: 38,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 77.1,
              y: 82.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-5",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f6a9d0") },
                alpha: 0.07
              },
              {
                at: 47.8,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 22.3,
              y: 8.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-6",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#c6f5a5") },
                alpha: 0.1
              },
              {
                at: 46.5,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 13.3,
              y: 97.3
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-7",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f9badc") },
                alpha: 0.11
              },
              {
                at: 40.1,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 11.3,
              y: 45.1
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-8",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#a8f7b6") },
                alpha: 0.09
              },
              {
                at: 43.4,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 41.4,
              y: 62.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-9",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#def0aa") },
                alpha: 0.11
              },
              {
                at: 41.2,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 70.1,
              y: 10.1
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-10",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f5b5c7") },
                alpha: 0.04
              },
              {
                at: 30.5,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 103.2,
              y: 76.2
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "page-11",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#fefefe") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#f2f2f2") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 180
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
                color: { kind: "literal", value: literal("#f7e1d1") },
                alpha: 0.24,
                binding: "scaled"
              },
              {
                at: 32.5,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 53.5,
              y: 53.6
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
                at: 0,
                color: { kind: "literal", value: literal("#f7c5ec") },
                alpha: 0.09,
                binding: "scaled"
              },
              {
                at: 37.3,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 50.7,
              y: 98.5
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-2",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f6a9d0") },
                alpha: 0.15,
                binding: "scaled"
              },
              {
                at: 39.8,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 22.3,
              y: 8.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-3",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f3c5f6") },
                alpha: 0.06,
                binding: "scaled"
              },
              {
                at: 24.1,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 54.8,
              y: 77
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-4",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#c3f3a6") },
                alpha: 0.15,
                binding: "scaled"
              },
              {
                at: 21.6,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 100.1,
              y: 16.9
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-5",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#a3eef6") },
                alpha: 0.21,
                binding: "scaled"
              },
              {
                at: 31.4,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 47.5,
              y: 82.9
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-6",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#a9c7f2") },
                alpha: 0.07,
                binding: "scaled"
              },
              {
                at: 27,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 77.1,
              y: 82.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-7",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#b2f5f1") },
                alpha: 0.21,
                binding: "scaled"
              },
              {
                at: 21.8,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 75.7,
              y: 53.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-8",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#c6f5a5") },
                alpha: 0.2,
                binding: "scaled"
              },
              {
                at: 39.5,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 13.3,
              y: 97.3
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-9",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f9b6b0") },
                alpha: 0.23,
                binding: "scaled"
              },
              {
                at: 27.7,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 73.1,
              y: 47.7
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-10",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f2b6f4") },
                alpha: 0.17,
                binding: "scaled"
              },
              {
                at: 35,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 19.3,
              y: 100.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-11",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#c8f7ef") },
                alpha: 0.21,
                binding: "scaled"
              },
              {
                at: 20.1,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 18,
              y: 36.7
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-12",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f9badc") },
                alpha: 0.23,
                binding: "scaled"
              },
              {
                at: 31.1,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 11.3,
              y: 45.1
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-13",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#fac7c1") },
                alpha: 0.1,
                binding: "scaled"
              },
              {
                at: 21.9,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 8.6,
              y: 16.2
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-14",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#a8f7b6") },
                alpha: 0.18,
                binding: "scaled"
              },
              {
                at: 36.4,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 41.4,
              y: 62.6
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-15",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f8b8cf") },
                alpha: 0.1,
                binding: "scaled"
              },
              {
                at: 36,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 91.2,
              y: 68.9
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-16",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#def0aa") },
                alpha: 0.22,
                binding: "scaled"
              },
              {
                at: 32.2,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 70.1,
              y: 10.1
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-17",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#e6face") },
                alpha: 0.24,
                binding: "scaled"
              },
              {
                at: 31.2,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 83.9,
              y: 27.2
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-18",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#f5b5c7") },
                alpha: 0.09,
                binding: "scaled"
              },
              {
                at: 23.5,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 103.2,
              y: 76.2
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-19",
            stops: [
              {
                at: 0,
                color: { kind: "literal", value: literal("#b2f2bf") },
                alpha: 0.23,
                binding: "scaled"
              },
              {
                at: 35.3,
                color: { kind: "literal", value: literal("#ffffff") },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 84,
              y: 58.5
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          },
          {
            id: "widget-20",
            stops: [
              {
                at: 20,
                color: { kind: "literal", value: literal("#f6f6f6") },
                binding: "scaled"
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fefefe") },
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
          id: "gallery3D"
        }
      ]
    },
    mark: {
      mode: "scene",
      sceneId: "gallery3D"
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.507,
    maxDeltaEOk: 0.000035,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
