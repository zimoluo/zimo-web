import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "cubistic",
  "name": "Cubistic",
  "ramp": {
    "hue": 0,
    "chroma": 0,
    "lightest": 0.9731,
    "darkest": 0.5382
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
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 50,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            }
          ],
          "repeating": true,
          "kind": "conic",
          "from": 45,
          "at": {
            "x": 43,
            "y": 62
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
              "at": 25,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.1,
              "binding": "scaled"
            },
            {
              "at": 55,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.15,
              "binding": "scaled"
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 210
          }
        },
        {
          "id": "widget-1",
          "stops": [
            {
              "at": 25,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.2,
              "binding": "scaled"
            },
            {
              "at": 55,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.2,
              "binding": "scaled"
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 150
          }
        },
        {
          "id": "widget-2",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.69,
              "binding": "scaled"
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-2"
              },
              "alpha": 0.65,
              "binding": "scaled"
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 150
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
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-reduced-1-1"
              }
            },
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-reduced-1-2"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 45
          }
        }
      ]
    }
  },
  "mark": {
    "mode": "backdrop"
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": 0.00000107
        },
        "hue": {
          "delta": 89.87556329
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0 0)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.25310827,
        "chroma": {
          "delta": 1.9e-7
        },
        "hue": {
          "delta": 89.87556373
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0 0)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.7421878,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.87556291
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0 0)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.84503396,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.87556292
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0 0)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f0f0f0")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0 0)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#3a3a3a")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.7122,
        "hue": {
          "delta": 89.88
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0 0)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#7e7e7e")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.91993 0 89.88)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#999999")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.83007 0 89.88)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#8f8f8f")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.925 0 89.88)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#6e6e6e")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93618 0 89.88)")
        }
      }
    },
    "surfaces-widget-3-2": {
      "name": "Widget · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#747474")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9341 0 89.88)")
        }
      }
    },
    "surfaces-page-reduced-1-1": {
      "name": "Page reduced · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#898989")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.88293 0 89.88)")
        }
      }
    },
    "surfaces-page-reduced-1-2": {
      "name": "Page reduced · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#909090")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.85968 0 89.88)")
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
    purity: 0.501,
    maxDeltaEOk: 0.000046,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
