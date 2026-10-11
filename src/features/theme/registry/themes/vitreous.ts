import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "vitreous",
    name: "Vitreous",
    ramp: {
      hue: 282.67,
      chroma: 0.9333,
      lightest: 0.9657,
      darkest: 0.4894
    },
    schemes: {
      kind: "dual",
      light: {
        text: {
          kind: "tone",
          at: 1,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: 6.94
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.6277,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: -1.93
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.2953,
          chroma: {
            delta: -0.0623
          },
          hue: {
            delta: -2.19
          }
        },
        panel: {
          kind: "tone",
          at: 0.0871,
          chroma: {
            delta: -0.0711
          },
          hue: {
            delta: 2.03
          }
        },
        edge: 1,
        shade: { kind: "literal", value: literal("#1e096b") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1574,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: -18.38
          }
        }
      },
      dark: {
        text: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: 6.94
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.3723,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: -1.93
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.7047,
          chroma: {
            delta: -0.0623
          },
          hue: {
            delta: -2.19
          }
        },
        panel: {
          kind: "tone",
          at: 0.9129,
          chroma: {
            delta: -0.0711
          },
          hue: {
            delta: 2.03
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#1e096b") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.8426,
          chroma: {
            delta: 0.0667
          },
          hue: {
            delta: -18.38
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
                at: 92,
                color: { kind: "literal", value: literal("#00ffff") },
                alpha: 0.1804
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9892,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -18.3
                  }
                },
                alpha: 0
              }
            ],
            repeating: true,
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 315
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 30,
                color: { kind: "literal", value: literal("#00ffff") },
                alpha: 0.0706
              },
              {
                at: 39,
                color: {
                  kind: "tone",
                  at: 0.9892,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -18.3
                  }
                },
                alpha: 0.0784
              }
            ],
            repeating: true,
            interpolation: {
              space: "srgb"
            },
            kind: "radial",
            at: {
              x: 238,
              y: 218
            },
            extent: {
              kind: "ellipse",
              x: 75,
              y: 75
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.4021,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -56.65
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9892,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -18.3
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 109,
              y: 2
            },
            extent: {
              kind: "ellipse",
              x: 99,
              y: 99
            }
          },
          {
            id: "page-3",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.9173,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: 9.63
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9892,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -18.3
                  }
                },
                alpha: 0
              }
            ],
            kind: "radial",
            at: {
              x: 21,
              y: 78
            },
            extent: {
              kind: "ellipse",
              x: 99,
              y: 99
            }
          },
          {
            id: "page-4",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0927
                  },
                  hue: {
                    delta: -3.95
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.8426,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -18.38
                  }
                }
              }
            ],
            kind: "radial",
            at: {
              x: 0,
              y: 100
            },
            extent: {
              kind: "ellipse",
              x: 160,
              y: 154
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
                at: 12.5,
                color: {
                  kind: "tone",
                  at: 0.8451,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: 4.64
                  }
                },
                alpha: 0.89,
                binding: "scaled"
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.8753,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -13.48
                  }
                },
                alpha: 0.97,
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
                  at: 1,
                  chroma: {
                    delta: -0.0927
                  },
                  hue: {
                    delta: -3.95
                  }
                }
              },
              {
                at: 85,
                color: {
                  kind: "tone",
                  at: 0.8426,
                  chroma: {
                    delta: 0.0667
                  },
                  hue: {
                    delta: -18.38
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
                at: 0.8116,
                chroma: {
                  delta: 0.0667
                },
                hue: {
                  delta: 11.23
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.8047,
                chroma: {
                  delta: 0.0667
                },
                hue: {
                  delta: -18.17
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
    purity: 0.898,
    maxDeltaEOk: 0.000032,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
