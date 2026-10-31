import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "energize",
  "name": "Energize",
  "ramp": {
    "hue": 311.43,
    "chroma": 0.9291,
    "lightest": 0.9456,
    "darkest": 0.2867,
    "torsion": -19.54
  },
  "schemes": {
    "kind": "dual",
    "light": {
      "text": {
        "kind": "channel",
        "channel": "text"
      },
      "textMuted": {
        "kind": "channel",
        "channel": "text-muted"
      },
      "line": {
        "kind": "alias",
        "of": "textMuted"
      },
      "fill": {
        "kind": "channel",
        "channel": "fill"
      },
      "panel": {
        "kind": "channel",
        "channel": "panel"
      },
      "edge": {
        "kind": "channel",
        "channel": "edge"
      },
      "shade": {
        "kind": "channel",
        "channel": "shade"
      },
      "accent": {
        "kind": "alias",
        "of": "textMuted"
      },
      "brand": {
        "kind": "channel",
        "channel": "brand"
      }
    },
    "dark": {
      "text": {
        "kind": "channel",
        "channel": "text"
      },
      "textMuted": {
        "kind": "channel",
        "channel": "text-muted"
      },
      "line": {
        "kind": "alias",
        "of": "textMuted"
      },
      "fill": {
        "kind": "channel",
        "channel": "fill"
      },
      "panel": {
        "kind": "channel",
        "channel": "panel"
      },
      "edge": {
        "kind": "channel",
        "channel": "edge"
      },
      "shade": {
        "kind": "channel",
        "channel": "shade"
      },
      "accent": {
        "kind": "alias",
        "of": "textMuted"
      },
      "brand": {
        "kind": "channel",
        "channel": "brand"
      }
    },
    "mirrorDark": false,
    "darkReviewed": true,
    "lightReviewed": true
  },
  "surfaceScheme": "dark",
  "surfaces": {
    "page": {
      "layers": [
        {
          "id": "page-0",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 32,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 32.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 37,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 37.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 40,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 40.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 53,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 53.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-9"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-9"
              }
            }
          ],
          "kind": "radial",
          "at": {
            "x": 100,
            "y": 8
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        }
      ]
    },
    "widget": {
      "layers": [
        {
          "id": "widget-0",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "binding": "scaled"
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 45
          }
        }
      ],
      "alpha": 0.68,
      "lens": {
        "blur": 12,
        "saturate": 1.15
      },
      "variation": {
        "rotate": 24,
        "shift": 12,
        "count": 8
      }
    },
    "page-reduced": {
      "layers": [
        {
          "id": "page-reduced-0",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-9"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-9"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 0
          }
        }
      ]
    }
  },
  "mark": {
    "mode": "split",
    "gradients": [
      {
        "angle": 90,
        "stops": [
          {
            "offset": 0,
            "color": {
              "kind": "channel",
              "channel": "mark-1-1"
            }
          },
          {
            "offset": 1,
            "color": {
              "kind": "channel",
              "channel": "mark-1-2"
            }
          }
        ]
      }
    ]
  },
  "reading": {
    "blur": 32
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.0000425,
        "chroma": {
          "delta": 0.07097056
        },
        "hue": {
          "delta": -2.82066552
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 311.43)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.25779695,
        "chroma": {
          "delta": -0.12261374
        },
        "hue": {
          "delta": 4.51583864
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 311.43)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.62589968,
        "chroma": {
          "delta": 0.00763689
        },
        "hue": {
          "delta": 2.78482132
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 311.43)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.74009147,
        "chroma": {
          "delta": 0.043953
        },
        "hue": {
          "delta": -2.78443908
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 311.43)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f2e3fc")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.0032 311.43)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#450470")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.5164,
        "chroma": {
          "delta": 0.0361
        },
        "hue": {
          "delta": 8.21
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 311.43)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.0082
        },
        "hue": {
          "delta": -21.78
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.97 0.01345 279.88)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.8795,
        "chroma": {
          "delta": 0.0416
        },
        "hue": {
          "delta": -10.5
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.92349 0.0393 293.51)")
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "tone",
        "at": 0.7603,
        "chroma": {
          "delta": 0.0577
        },
        "hue": {
          "delta": -2.96
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.87499 0.07386 303.38)")
        }
      }
    },
    "surfaces-page-1-7": {
      "name": "Page · Layer 1 · Color 7",
      "source": {
        "kind": "tone",
        "at": 0.6501,
        "chroma": {
          "delta": 0.0674
        },
        "hue": {
          "delta": 0.99
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.82694 0.11492 309.49)")
        }
      }
    },
    "surfaces-page-1-9": {
      "name": "Page · Layer 1 · Color 9",
      "source": {
        "kind": "tone",
        "at": 0.5477,
        "chroma": {
          "delta": 0.0709
        },
        "hue": {
          "delta": 3.52
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.16171 314.02)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.6501,
        "chroma": {
          "delta": 0.0674
        },
        "hue": {
          "delta": 0.99
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93912 0.035 309.49)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5987,
        "chroma": {
          "delta": 0.0709
        },
        "hue": {
          "delta": 4.68
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9355 0.035 314.18)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.7543,
        "chroma": {
          "delta": 0.0377
        },
        "hue": {
          "delta": -13.12
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.4548,
        "chroma": {
          "delta": 0.0709
        },
        "hue": {
          "delta": 6.92
        }
      }
    }
  },
  "appearance": {
    "light": {
      "mark": {
        "mode": "split",
        "gradients": [
          {
            "angle": 90,
            "stops": [
              {
                "offset": 0,
                "color": {
                  "kind": "channel",
                  "channel": "mark-1-1"
                }
              },
              {
                "offset": 1,
                "color": {
                  "kind": "channel",
                  "channel": "mark-1-2"
                }
              }
            ]
          }
        ],
        "stroke": {
          "kind": "role",
          "role": "text"
        }
      }
    }
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
