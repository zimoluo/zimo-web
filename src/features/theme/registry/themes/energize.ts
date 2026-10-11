import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "energize",
    name: "Energize",
    ramp: {
      hue: 311.43,
      chroma: 0.9291,
      lightest: 0.9456,
      darkest: 0.2867,
      torsion: -19.54
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0709
          },
          hue: {
            delta: -2.82
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.7422,
          chroma: {
            delta: -0.1226
          },
          hue: {
            delta: 4.52
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.3741,
          chroma: {
            delta: 0.0076
          },
          hue: {
            delta: 2.78
          }
        },
        panel: {
          kind: "tone",
          at: 0.2599,
          chroma: {
            delta: 0.044
          },
          hue: {
            delta: -2.78
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#450470") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.4836,
          chroma: {
            delta: 0.0361
          },
          hue: {
            delta: 8.21
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.0709
          },
          hue: {
            delta: -2.82
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2578,
          chroma: {
            delta: -0.1226
          },
          hue: {
            delta: 4.52
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6259,
          chroma: {
            delta: 0.0076
          },
          hue: {
            delta: 2.78
          }
        },
        panel: {
          kind: "tone",
          at: 0.7401,
          chroma: {
            delta: 0.044
          },
          hue: {
            delta: -2.78
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#450470") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.5164,
          chroma: {
            delta: 0.0361
          },
          hue: {
            delta: 8.21
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
                  at: 1,
                  chroma: {
                    delta: 0.0082
                  },
                  hue: {
                    delta: -21.78
                  }
                }
              },
              {
                at: 32,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: 0.0082
                  },
                  hue: {
                    delta: -21.78
                  }
                }
              },
              {
                at: 32.01,
                color: {
                  kind: "tone",
                  at: 0.8795,
                  chroma: {
                    delta: 0.0416
                  },
                  hue: {
                    delta: -10.5
                  }
                }
              },
              {
                at: 37,
                color: {
                  kind: "tone",
                  at: 0.8795,
                  chroma: {
                    delta: 0.0416
                  },
                  hue: {
                    delta: -10.5
                  }
                }
              },
              {
                at: 37.01,
                color: {
                  kind: "tone",
                  at: 0.7603,
                  chroma: {
                    delta: 0.0577
                  },
                  hue: {
                    delta: -2.96
                  }
                }
              },
              {
                at: 40,
                color: {
                  kind: "tone",
                  at: 0.7603,
                  chroma: {
                    delta: 0.0577
                  },
                  hue: {
                    delta: -2.96
                  }
                }
              },
              {
                at: 40.01,
                color: {
                  kind: "tone",
                  at: 0.6501,
                  chroma: {
                    delta: 0.0674
                  },
                  hue: {
                    delta: 0.99
                  }
                }
              },
              {
                at: 53,
                color: {
                  kind: "tone",
                  at: 0.6501,
                  chroma: {
                    delta: 0.0674
                  },
                  hue: {
                    delta: 0.99
                  }
                }
              },
              {
                at: 53.01,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 100,
              y: 8
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
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
                  at: 0.6501,
                  chroma: {
                    delta: 0.0674
                  },
                  hue: {
                    delta: 0.99
                  }
                },
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5987,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 4.68
                  }
                },
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
      },
      "page-reduced": {
        layers: [
          {
            id: "page-reduced-0",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.5477,
                  chroma: {
                    delta: 0.0709
                  },
                  hue: {
                    delta: 3.52
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
      }
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
                at: 0.7543,
                chroma: {
                  delta: 0.0377
                },
                hue: {
                  delta: -13.12
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.4548,
                chroma: {
                  delta: 0.0709
                },
                hue: {
                  delta: 6.92
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 32
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.92,
    maxDeltaEOk: 0.000031,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
