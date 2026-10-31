import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "underwater",
  "name": "Underwater",
  "ramp": {
    "hue": 211.33,
    "chroma": 0.7972,
    "lightest": 0.9694,
    "darkest": 0.2993,
    "torsion": 23.52
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
              "at": 13,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 55,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            }
          ],
          "kind": "radial",
          "at": {
            "x": -4,
            "y": 80
          },
          "extent": {
            "kind": "ellipse",
            "x": 130,
            "y": 100
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
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "binding": "scaled"
            },
            {
              "at": 80,
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
            "deg": 30
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
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-reduced-1-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-reduced-1-2"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 30
          }
        }
      ]
    }
  },
  "backdrop": {
    "scenes": [
      {
        "id": "underwater"
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
        "at": 0.00007842,
        "chroma": {
          "delta": -0.18800704
        },
        "hue": {
          "delta": 0.5178062
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 211.33)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.12859303,
        "chroma": {
          "delta": -0.16071345
        },
        "hue": {
          "delta": 0.25711918
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 211.33)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.39987383,
        "chroma": {
          "delta": 0.17827563
        },
        "hue": {
          "delta": 2.87817636
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 211.33)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.60278278,
        "chroma": {
          "delta": 0.17029181
        },
        "hue": {
          "delta": 6.3231084
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 211.33)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e4f7fb")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.0042 211.33)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#09586b")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.3964,
        "chroma": {
          "delta": -0.0776
        },
        "hue": {
          "delta": 17.83
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 211.33)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.0457
        },
        "hue": {
          "delta": 27.84
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.97 0.01102 250.93)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5587,
        "chroma": {
          "delta": -0.067
        },
        "hue": {
          "delta": 17.34
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.85448 0.06559 230.05)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.2988,
        "chroma": {
          "delta": -0.2229
        },
        "hue": {
          "delta": 11.97
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.08078 218.57)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.6371,
        "chroma": {
          "delta": 0.1763
        },
        "hue": {
          "delta": 6.66
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93656 0.035 221.21)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.7201,
        "chroma": {
          "delta": 0.1713
        },
        "hue": {
          "delta": 15.32
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.94236 0.03366 231.83)")
        }
      }
    },
    "surfaces-page-reduced-1-1": {
      "name": "Page reduced · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.6449,
        "chroma": {
          "delta": 0.1694
        },
        "hue": {
          "delta": 17.22
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.87915 0.0697 231.96)")
        }
      }
    },
    "surfaces-page-reduced-1-2": {
      "name": "Page reduced · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5679,
        "chroma": {
          "delta": 0.1844
        },
        "hue": {
          "delta": 8.7
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.85714 0.09863 221.63)")
        }
      }
    }
  },
  "appearance": {
    "light": {
      "backdrop": {
        "scenes": [
          {
            "id": "underwater",
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
    purity: 0.814,
    maxDeltaEOk: 0.000842,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
