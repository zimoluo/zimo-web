import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "marina",
  "name": "Marina",
  "ramp": {
    "hue": 148.81,
    "chroma": 0.7574,
    "lightest": 0.9933,
    "darkest": 0.289
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
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 20.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 40,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 40.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 60,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 60.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 80.01,
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
          "interpolation": {
            "space": "srgb"
          },
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 180
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
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 90
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
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 90
          }
        }
      ]
    }
  },
  "mark": {
    "mode": "backdrop"
  },
  "reading": {
    "blur": 0
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": 0.24207239
        },
        "hue": {
          "delta": -11.02626026
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 148.81)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.08575465,
        "chroma": {
          "delta": 0.24263312
        },
        "hue": {
          "delta": -1.14672356
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 148.81)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.44951168,
        "chroma": {
          "delta": -0.142413
        },
        "hue": {
          "delta": 7.87410757
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 148.81)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.45547347,
        "chroma": {
          "delta": -0.34265177
        },
        "hue": {
          "delta": -5.68610581
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 148.81)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#edf2ed")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.005 148.81)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#2c4a2b")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.199
        },
        "hue": {
          "delta": 115.88
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 148.81)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#020887")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.97 0.01344 264.69)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#334195")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93127 0.01692 271.85)")
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "literal",
        "value": literal("#647aa3")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.88028 0.01733 262.55)")
        }
      }
    },
    "surfaces-page-1-7": {
      "name": "Page · Layer 1 · Color 7",
      "source": {
        "kind": "literal",
        "value": literal("#95b2b0")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.82979 0.03569 191.36)")
        }
      }
    },
    "surfaces-page-1-9": {
      "name": "Page · Layer 1 · Color 9",
      "source": {
        "kind": "tone",
        "at": 0.1423,
        "chroma": {
          "delta": -0.4133
        },
        "hue": {
          "delta": -8.72
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.08657 140.09)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#5366d4")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9346 0.03112 272.33)")
        }
      }
    }
  },
  "appearance": {
    "light": {
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
    scheme: "dark",
    purity: 0.609,
    maxDeltaEOk: 0.000065,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
