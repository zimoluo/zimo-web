import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "crimson",
  "name": "Crimson",
  "ramp": {
    "hue": 23.44,
    "chroma": 0.5034,
    "lightest": 0.9867,
    "darkest": 0.3451,
    "torsion": 8.56
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
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 60
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
            "deg": 60
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
        "id": "crimson"
      }
    ]
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
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.34927912
        },
        "hue": {
          "delta": -1.55907608
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 23.44)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.8001495,
        "chroma": {
          "delta": 0.06871839
        },
        "hue": {
          "delta": -3.88742257
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 23.44)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.25766573,
        "chroma": {
          "delta": -0.24948584
        },
        "hue": {
          "delta": -3.72516096
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 23.44)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.05553795,
        "chroma": {
          "delta": -0.16861133
        },
        "hue": {
          "delta": -2.34630527
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 23.44)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f3eded")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 23.44)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#4b2929")
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
        "at": 0.8835,
        "chroma": {
          "delta": 0.2654
        },
        "hue": {
          "delta": -1.96
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 23.44)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fff9f9")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2634 0.10545 17.27)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fff3f3")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2766 0.11076 17.38)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fff9f9")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18318 0.00641 17.27)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fff3f3")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18635 0.01293 17.38)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.4294,
        "chroma": {
          "delta": -0.2417
        },
        "hue": {
          "delta": -4.53
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.7818627805521279,
          "hue": {
            "delta": -18.088311745819965
          },
          "chroma": {
            "delta": -0.04675880317124892
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffeaea")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.3235523154941987,
          "hue": {
            "delta": -15.193211017165368
          },
          "chroma": {
            "delta": -0.07598593247497665
          }
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "backdrop": {
        "scenes": [
          {
            "id": "crimson",
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
    scheme: "light",
    purity: 0.765,
    maxDeltaEOk: 0.000041,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
