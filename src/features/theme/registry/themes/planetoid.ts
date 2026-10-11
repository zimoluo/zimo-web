import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "planetoid",
    name: "Planetoid",
    ramp: {
      hue: 137.37,
      chroma: 0.6207,
      lightest: 0.9705,
      darkest: 0.2303,
      torsion: 10.16
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: -0.1433
          },
          hue: {
            delta: -0.75
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7445,
          chroma: {
            delta: -0.0508
          },
          hue: {
            delta: 0.89
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3796,
          chroma: {
            delta: 0.103
          }
        },
        panel: {
          kind: "tone",
          at: 0.1082,
          chroma: {
            delta: 0.0912
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#24591b") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.2194
          },
          hue: {
            delta: -5.17
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: -0.1433
          },
          hue: {
            delta: -0.75
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2555,
          chroma: {
            delta: -0.0508
          },
          hue: {
            delta: 0.89
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6204,
          chroma: {
            delta: 0.103
          }
        },
        panel: {
          kind: "tone",
          at: 0.8918,
          chroma: {
            delta: 0.0912
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#24591b") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.2194
          },
          hue: {
            delta: -5.17
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
                at: 34,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                }
              },
              {
                at: 34.308,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.999
              },
              {
                at: 34.615,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.996
              },
              {
                at: 34.923,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.987
              },
              {
                at: 35.231,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.972
              },
              {
                at: 35.538,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.948
              },
              {
                at: 35.846,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.916
              },
              {
                at: 36.154,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.875
              },
              {
                at: 36.462,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.827
              },
              {
                at: 36.769,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.771
              },
              {
                at: 37.077,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.709
              },
              {
                at: 37.385,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.642
              },
              {
                at: 37.692,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.572
              },
              {
                at: 38,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.5
              },
              {
                at: 38.308,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.428
              },
              {
                at: 38.615,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.358
              },
              {
                at: 38.923,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.291
              },
              {
                at: 39.231,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.229
              },
              {
                at: 39.538,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.173
              },
              {
                at: 39.846,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.125
              },
              {
                at: 40.154,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.084
              },
              {
                at: 40.462,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.052
              },
              {
                at: 40.769,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.028
              },
              {
                at: 41.077,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.013
              },
              {
                at: 41.385,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.004
              },
              {
                at: 41.692,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0.001
              },
              {
                at: 42,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 50
            },
            extent: {
              kind: "circle",
              size: "closest-side"
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.25
              },
              {
                at: 1.27,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2499
              },
              {
                at: 2.53,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2495
              },
              {
                at: 3.8,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2488
              },
              {
                at: 5.07,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2479
              },
              {
                at: 6.33,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2468
              },
              {
                at: 7.6,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2455
              },
              {
                at: 8.87,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2439
              },
              {
                at: 10.13,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2421
              },
              {
                at: 11.4,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2401
              },
              {
                at: 12.67,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2379
              },
              {
                at: 13.93,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2354
              },
              {
                at: 15.2,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2328
              },
              {
                at: 16.47,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2301
              },
              {
                at: 17.73,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2271
              },
              {
                at: 19,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.224
              },
              {
                at: 20.27,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2207
              },
              {
                at: 21.53,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2173
              },
              {
                at: 22.8,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2137
              },
              {
                at: 24.07,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.21
              },
              {
                at: 25.33,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2061
              },
              {
                at: 26.6,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.2022
              },
              {
                at: 27.87,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1981
              },
              {
                at: 29.13,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1939
              },
              {
                at: 30.4,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1896
              },
              {
                at: 31.67,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1852
              },
              {
                at: 32.93,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1807
              },
              {
                at: 34.2,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1761
              },
              {
                at: 35.47,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1715
              },
              {
                at: 36.73,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1668
              },
              {
                at: 38,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.162
              },
              {
                at: 39.27,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1572
              },
              {
                at: 40.53,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1523
              },
              {
                at: 41.8,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1474
              },
              {
                at: 43.07,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1424
              },
              {
                at: 44.33,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1375
              },
              {
                at: 45.6,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1325
              },
              {
                at: 46.87,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1275
              },
              {
                at: 48.13,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1225
              },
              {
                at: 49.4,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1175
              },
              {
                at: 50.67,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1125
              },
              {
                at: 51.93,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1076
              },
              {
                at: 53.2,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.1026
              },
              {
                at: 54.47,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0977
              },
              {
                at: 55.73,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0928
              },
              {
                at: 57,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.088
              },
              {
                at: 58.27,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0832
              },
              {
                at: 59.53,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0785
              },
              {
                at: 60.8,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0739
              },
              {
                at: 62.07,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0693
              },
              {
                at: 63.33,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0648
              },
              {
                at: 64.6,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0604
              },
              {
                at: 65.87,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0561
              },
              {
                at: 67.13,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0519
              },
              {
                at: 68.4,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0478
              },
              {
                at: 69.67,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0439
              },
              {
                at: 70.93,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.04
              },
              {
                at: 72.2,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0363
              },
              {
                at: 73.47,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0327
              },
              {
                at: 74.73,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0293
              },
              {
                at: 76,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.026
              },
              {
                at: 77.27,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0229
              },
              {
                at: 78.53,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0199
              },
              {
                at: 79.8,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0172
              },
              {
                at: 81.07,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0146
              },
              {
                at: 82.33,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0121
              },
              {
                at: 83.6,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0099
              },
              {
                at: 84.87,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0079
              },
              {
                at: 86.13,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0061
              },
              {
                at: 87.4,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0045
              },
              {
                at: 88.67,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0032
              },
              {
                at: 89.93,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0021
              },
              {
                at: 91.2,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0012
              },
              {
                at: 92.47,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0005
              },
              {
                at: 93.73,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0.0001
              },
              {
                at: 95,
                color: {
                  kind: "tone",
                  at: 0.1269,
                  chroma: {
                    delta: 0.3793
                  },
                  hue: {
                    delta: 4.2
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 50
            },
            extent: {
              kind: "circle",
              size: "closest-side"
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.2194
                  },
                  hue: {
                    delta: -5.17
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
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.8862,
                  chroma: {
                    delta: 0.1536
                  },
                  hue: {
                    delta: -2.6
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9322,
                  chroma: {
                    delta: 0.1385
                  },
                  hue: {
                    delta: -3.46
                  }
                },
                alpha: 0.8,
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
    backdrop: {
      scenes: [
        {
          id: "planetoid"
        }
      ]
    },
    mark: {
      mode: "backdrop"
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.87,
    maxDeltaEOk: 0.000758,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
