import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "penumbra",
    name: "Penumbra",
    ramp: {
      hue: 277.62,
      chroma: 0.0981,
      lightest: 1,
      darkest: 0.31
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {
          kind: "tone",
          at: 0.0763,
          chroma: {
            delta: -0.0418
          },
          hue: {
            delta: 8.75
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.2791,
          chroma: {
            delta: -0.0068
          },
          hue: {
            delta: 0.99
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.6688,
          chroma: {
            delta: 0.0329
          },
          hue: {
            delta: -0.58
          }
        },
        panel: {
          kind: "tone",
          at: 0.814,
          chroma: {
            delta: 0.0157
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#313443") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.9053,
          chroma: {
            delta: -0.016
          },
          hue: {
            delta: -4.25
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
                color: {
                  kind: "tone",
                  at: 0.8049,
                  chroma: {
                    delta: -0.0055
                  },
                  hue: {
                    delta: -1.23
                  }
                }
              },
              {
                at: 39.99,
                color: {
                  kind: "tone",
                  at: 0.8049,
                  chroma: {
                    delta: -0.0055
                  },
                  hue: {
                    delta: -1.23
                  }
                }
              },
              {
                at: 40,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-1",
            stops: [
              {
                at: 24,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                }
              },
              {
                at: 41.8,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                },
                alpha: 0
              },
              {
                at: 42,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-2",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.834,
                  chroma: {
                    delta: -0.0137
                  },
                  hue: {
                    delta: -2.48
                  }
                }
              },
              {
                at: 59.99,
                color: {
                  kind: "tone",
                  at: 0.834,
                  chroma: {
                    delta: -0.0137
                  },
                  hue: {
                    delta: -2.48
                  }
                }
              },
              {
                at: 60,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-3",
            stops: [
              {
                at: 36,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                }
              },
              {
                at: 61.8,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                },
                alpha: 0
              },
              {
                at: 62,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-4",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.8691,
                  chroma: {
                    delta: -0.0148
                  },
                  hue: {
                    delta: -3.29
                  }
                }
              },
              {
                at: 79.99,
                color: {
                  kind: "tone",
                  at: 0.8691,
                  chroma: {
                    delta: -0.0148
                  },
                  hue: {
                    delta: -3.29
                  }
                }
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-5",
            stops: [
              {
                at: 64,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                }
              },
              {
                at: 81.8,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                },
                alpha: 0
              },
              {
                at: 82,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-6",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.9053,
                  chroma: {
                    delta: -0.016
                  },
                  hue: {
                    delta: -4.25
                  }
                }
              },
              {
                at: 99.99,
                color: {
                  kind: "tone",
                  at: 0.9053,
                  chroma: {
                    delta: -0.016
                  },
                  hue: {
                    delta: -4.25
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-7",
            stops: [
              {
                at: 64,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                }
              },
              {
                at: 101.8,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                },
                alpha: 0
              },
              {
                at: 102,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-8",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.9419,
                  chroma: {
                    delta: -0.0247
                  },
                  hue: {
                    delta: -2
                  }
                }
              },
              {
                at: 119.99,
                color: {
                  kind: "tone",
                  at: 0.9419,
                  chroma: {
                    delta: -0.0247
                  },
                  hue: {
                    delta: -2
                  }
                }
              },
              {
                at: 120,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-9",
            stops: [
              {
                at: 64,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                }
              },
              {
                at: 121.8,
                color: {
                  kind: "tone",
                  at: 1,
                  chroma: {
                    delta: -0.0333
                  },
                  hue: {
                    delta: -4.65
                  }
                },
                alpha: 0
              },
              {
                at: 122,
                color: { kind: "literal", value: literal("#ffffff") },
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
              size: "farthest-side"
            }
          },
          {
            id: "page-10",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.9745,
                  chroma: {
                    delta: -0.0372
                  },
                  hue: {
                    delta: -4.62
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9745,
                  chroma: {
                    delta: -0.0372
                  },
                  hue: {
                    delta: -4.62
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
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.765,
                  chroma: {
                    delta: -0.031
                  },
                  hue: {
                    delta: -6.67
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.8069,
                  hue: {
                    delta: -6.05
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
                  at: 0.9053,
                  chroma: {
                    delta: -0.016
                  },
                  hue: {
                    delta: -4.25
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.9053,
                  chroma: {
                    delta: -0.016
                  },
                  hue: {
                    delta: -4.25
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
      blur: 8
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.961,
    maxDeltaEOk: 0.000032,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
