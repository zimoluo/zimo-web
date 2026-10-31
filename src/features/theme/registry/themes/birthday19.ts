import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "birthday19",
  "name": "Birthday 19",
  "ramp": {
    "hue": 257.17,
    "chroma": 0.6143,
    "lightest": 0.9452,
    "darkest": 0.2786
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
              },
              "alpha": 0.55
            },
            {
              "at": 225,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 80,
            "y": 105
          },
          "extent": {
            "kind": "circle",
            "size": "closest-corner"
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0.5
            },
            {
              "at": 150,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 8,
            "y": 24
          },
          "extent": {
            "kind": "circle",
            "size": "closest-corner"
          }
        },
        {
          "id": "page-2",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              },
              "alpha": 0.4
            },
            {
              "at": 76,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 90,
            "y": 40
          },
          "extent": {
            "kind": "circle",
            "size": "closest-corner"
          }
        },
        {
          "id": "page-3",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-4-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-4-2"
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
              "alpha": 0.5,
              "binding": "scaled"
            },
            {
              "at": 150,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": -2,
            "y": 20
          },
          "extent": {
            "kind": "circle",
            "size": "closest-corner"
          }
        },
        {
          "id": "widget-1",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-1"
              },
              "alpha": 0.4,
              "binding": "scaled"
            },
            {
              "at": 125,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-2"
              },
              "alpha": 0,
              "binding": "scaled"
            }
          ],
          "kind": "radial",
          "at": {
            "x": 105,
            "y": 40
          },
          "extent": {
            "kind": "circle",
            "size": "closest-corner"
          }
        },
        {
          "id": "widget-2",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-1"
              },
              "alpha": 0.5,
              "binding": "scaled"
            },
            {
              "at": 150,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 36,
            "y": 102
          },
          "extent": {
            "kind": "circle",
            "size": "closest-corner"
          }
        },
        {
          "id": "widget-3",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-4-1"
              },
              "alpha": 0.84,
              "binding": "scaled"
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-4-2"
              },
              "alpha": 0.92,
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
    }
  },
  "backdrop": {
    "scenes": [
      {
        "id": "birthday19"
      }
    ]
  },
  "mark": {
    "mode": "backdrop",
    "stroke": {
      "kind": "channel",
      "channel": "mark-stroke"
    }
  },
  "reading": {
    "blur": 32
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": -0.05499326
        },
        "hue": {
          "delta": 7.32752131
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 257.17)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.24362201,
        "chroma": {
          "delta": 0.06674133
        },
        "hue": {
          "delta": -0.7393356
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 257.17)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.71738359,
        "chroma": {
          "delta": -0.05725489
        },
        "hue": {
          "delta": 1.29420663
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 257.17)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.88996768,
        "chroma": {
          "delta": 0.04528147
        },
        "hue": {
          "delta": -2.36349159
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 257.17)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e8eff7")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.00235 257.17)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#19375c")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.9572,
        "chroma": {
          "delta": 0.0496
        },
        "hue": {
          "delta": -4.45
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 257.17)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#0c5337")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.83064 0.17338 160.92)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#61d160")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.18643 143.38)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#5c2711")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.87991 0.05426 41.69)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#d18760")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.07889 48.19)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#750505")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.8674 0.06922 28.57)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#b21818")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.12009 27.74)")
        }
      }
    },
    "surfaces-page-4-1": {
      "name": "Page · Layer 4 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9229,
        "chroma": {
          "delta": 0.1209
        },
        "hue": {
          "delta": -3.83
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89862 0.03701 253.34)")
        }
      }
    },
    "surfaces-page-4-2": {
      "name": "Page · Layer 4 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.9572,
        "chroma": {
          "delta": 0.0496
        },
        "hue": {
          "delta": -4.45
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.91936 0.02645 252.72)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#0b4f34")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.952 0.035 160.78)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#61d160")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.913 0.035 143.38)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#750505")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95437 0.0227 28.57)")
        }
      }
    },
    "surfaces-widget-2-2": {
      "name": "Widget · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#b21818")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.94105 0.02961 27.74)")
        }
      }
    },
    "surfaces-widget-3-1": {
      "name": "Widget · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#5c2711")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95562 0.02321 41.69)")
        }
      }
    },
    "surfaces-widget-3-2": {
      "name": "Widget · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#d18760")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.92089 0.035 48.19)")
        }
      }
    },
    "surfaces-widget-4-1": {
      "name": "Widget · Layer 4 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9493,
        "chroma": {
          "delta": 0.1149
        },
        "hue": {
          "delta": 1.18
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95909 0.01948 258.35)")
        }
      }
    },
    "surfaces-widget-4-2": {
      "name": "Widget · Layer 4 · Color 2",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.1651
        },
        "hue": {
          "delta": -0.5
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.96214 0.0181 256.67)")
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.104,
        "chroma": {
          "delta": -0.2621
        }
      }
    }
  },
  "appearance": {
    "light": {
      "backdrop": {
        "scenes": [
          {
            "id": "birthday19",
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
                "role": "fill"
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
    scheme: "dark",
    purity: 0.927,
    maxDeltaEOk: 0.000032,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
