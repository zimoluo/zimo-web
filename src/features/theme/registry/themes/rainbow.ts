import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "rainbow",
  "name": "Rainbow",
  "ramp": {
    "hue": 256.47,
    "chroma": 0.3447,
    "lightest": 0.9842,
    "darkest": 0.3717,
    "torsion": 11.45
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
  "surfaceScheme": "light",
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
              "at": 16.67,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 33.33,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 50,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              }
            },
            {
              "at": 66.67,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 83.33,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-6"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 135
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
              "at": 16.67,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "binding": "scaled"
            },
            {
              "at": 33.33,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-3"
              },
              "binding": "scaled"
            },
            {
              "at": 50,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-4"
              },
              "binding": "scaled"
            },
            {
              "at": 66.67,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-5"
              },
              "binding": "scaled"
            },
            {
              "at": 83.33,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-6"
              },
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-7"
              },
              "binding": "scaled"
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 135
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
    }
  },
  "backdrop": {
    "scenes": [
      {
        "id": "rainbow"
      }
    ]
  },
  "mark": {
    "mode": "backdrop"
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.05137468
        },
        "hue": {
          "delta": -4.90804937
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 256.47)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.77622067,
        "chroma": {
          "delta": -0.12795314
        },
        "hue": {
          "delta": -1.76866916
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 256.47)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.02889786,
        "chroma": {
          "delta": 0.08905802
        },
        "hue": {
          "delta": -3.18031319
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 256.47)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.00008732,
        "chroma": {
          "delta": 0.09042145
        },
        "hue": {
          "delta": -2.88845583
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 256.47)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#eaf0f5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 256.47)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#213a53")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#080a10")
        }
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.2033,
        "chroma": {
          "delta": -0.0437
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 256.47)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ff9999")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27234 0.1094 20.19)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffb380")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24015 0.05987 54.44)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#ffff80")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.12 0.02603 108.88)")
        }
      }
    },
    "surfaces-page-1-4": {
      "name": "Page · Layer 1 · Color 4",
      "source": {
        "kind": "literal",
        "value": literal("#80ff80")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18218 0.05969 143.66)")
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "literal",
        "value": literal("#80b3ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.29425 0.10966 258.15)")
        }
      }
    },
    "surfaces-page-1-6": {
      "name": "Page · Layer 1 · Color 6",
      "source": {
        "kind": "tone",
        "at": 0.6051,
        "chroma": {
          "delta": 0.2331
        },
        "hue": {
          "delta": 47.65
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.42 0.12583 305.32)")
        }
      }
    },
    "surfaces-page-1-7": {
      "name": "Page · Layer 1 · Color 7",
      "source": {
        "kind": "literal",
        "value": literal("#cc99ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28808 0.14867 306.19)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ff9999")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.23077 0.055 20.19)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffb380")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22131 0.055 54.44)")
        }
      }
    },
    "surfaces-widget-1-3": {
      "name": "Widget · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#ffff80")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18599 0.04032 108.88)")
        }
      }
    },
    "surfaces-widget-1-4": {
      "name": "Widget · Layer 1 · Color 4",
      "source": {
        "kind": "literal",
        "value": literal("#80ff80")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20427 0.055 143.66)")
        }
      }
    },
    "surfaces-widget-1-5": {
      "name": "Widget · Layer 1 · Color 5",
      "source": {
        "kind": "literal",
        "value": literal("#80b3ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.23721 0.055 258.15)")
        }
      }
    },
    "surfaces-widget-1-6": {
      "name": "Widget · Layer 1 · Color 6",
      "source": {
        "kind": "tone",
        "at": 0.6051,
        "chroma": {
          "delta": 0.2331
        },
        "hue": {
          "delta": 47.65
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27418 0.055 305.32)")
        }
      }
    },
    "surfaces-widget-1-7": {
      "name": "Widget · Layer 1 · Color 7",
      "source": {
        "kind": "literal",
        "value": literal("#cc99ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2354 0.055 306.19)")
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "backdrop": {
        "scenes": [
          {
            "id": "rainbow",
            "palette": {
              "base": {
                "kind": "role",
                "role": "brand"
              },
              "mid": {
                "kind": "role",
                "role": "fill"
              },
              "highlight": {
                "kind": "role",
                "role": "panel"
              },
              "accent": {
                "kind": "role",
                "role": "accent"
              },
              "veil": {
                "kind": "role",
                "role": "panel"
              }
            }
          }
        ]
      },
      "mark": {
        "mode": "backdrop",
        "stroke": {
          "kind": "role",
          "role": "text"
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.905,
    maxDeltaEOk: 0.000071,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
