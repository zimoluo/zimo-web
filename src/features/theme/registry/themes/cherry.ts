import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "cherry",
  "name": "Cherry",
  "ramp": {
    "hue": 355.78,
    "chroma": 0.9708,
    "lightest": 0.96,
    "darkest": 0.387
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
            "kind": "corner",
            "x": "right",
            "y": "top"
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
              "at": 10,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "binding": "scaled"
            },
            {
              "at": 60,
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
        "at": 0.9999188,
        "chroma": {
          "delta": -0.00817201
        },
        "hue": {
          "delta": 15.21590974
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 355.78)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.69925369,
        "chroma": {
          "delta": -0.02822316
        },
        "hue": {
          "delta": -7.07118755
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 355.78)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.20935963,
        "chroma": {
          "delta": 0.00701001
        },
        "hue": {
          "delta": -9.57022545
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 355.78)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.00611283,
        "chroma": {
          "delta": 0.02946184
        },
        "hue": {
          "delta": 11.39314064
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 355.78)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fee1e6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 355.78)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#740011")
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
        "at": 0.2262,
        "chroma": {
          "delta": -0.2981
        },
        "hue": {
          "delta": 0.98
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 355.78)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#cfd4c5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20825 0.00508 121.89)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.1492,
        "chroma": {
          "delta": -0.4262
        },
        "hue": {
          "delta": 11.05
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18829 0.04111 6.83)")
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "tone",
        "at": 0.2262,
        "chroma": {
          "delta": -0.2981
        },
        "hue": {
          "delta": 0.98
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.23074 0.06342 356.76)")
        }
      }
    },
    "surfaces-page-1-7": {
      "name": "Page · Layer 1 · Color 7",
      "source": {
        "kind": "tone",
        "at": 0.2596,
        "chroma": {
          "delta": -0.303
        },
        "hue": {
          "delta": -32.5
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24979 0.0787 323.28)")
        }
      }
    },
    "surfaces-page-1-9": {
      "name": "Page · Layer 1 · Color 9",
      "source": {
        "kind": "tone",
        "at": 0.4285,
        "chroma": {
          "delta": -0.2332
        },
        "hue": {
          "delta": -44.68
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.35171 0.13044 311.1)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": 0.0292
        },
        "hue": {
          "delta": -19.37
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.1896 0.02827 336.41)")
        }
      }
    }
  },
  "appearance": {
    "dark": {
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
    purity: 0.877,
    maxDeltaEOk: 0.000029,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
