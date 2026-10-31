import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "whiteout",
  "name": "Whiteout",
  "ramp": {
    "hue": 266.84,
    "chroma": 0.4143,
    "lightest": 0.9816,
    "darkest": 0.3816,
    "torsion": -5.03
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
              "at": 40,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 98,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            }
          ],
          "kind": "radial",
          "at": {
            "x": 50,
            "y": 100
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-side"
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
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "binding": "scaled"
            },
            {
              "at": 85,
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
            "deg": 0
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
        "id": "whiteout",
        "palette": {
          "base": {
            "kind": "channel",
            "channel": "backdrop-1-base"
          },
          "highlight": {
            "kind": "channel",
            "channel": "backdrop-1-highlight"
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
            "offset": 0.66667,
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
        "at": 0.99999156,
        "chroma": {
          "delta": -0.18520415
        },
        "hue": {
          "delta": 0.69221391
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#edf0fa")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.66315332,
        "chroma": {
          "delta": -0.19350618
        },
        "hue": {
          "delta": -1.38613301
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#acb7d4")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.38070513,
        "chroma": {
          "delta": -0.03960641
        },
        "hue": {
          "delta": 3.74729606
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#323e58")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.03254533,
        "chroma": {
          "delta": 0.41843484
        },
        "hue": {
          "delta": -0.69784082
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#171e30")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e5ebfb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#acb7d4")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#0b2569")
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
        "at": 0.0677,
        "chroma": {
          "delta": 0.3113
        },
        "hue": {
          "delta": 7.33
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#222d46")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f6f9ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25168 0.17359 264.52)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0677,
        "chroma": {
          "delta": 0.3113
        },
        "hue": {
          "delta": 7.33
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28832 0.13009 276.34)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0884,
        "chroma": {
          "delta": 0.2207
        },
        "hue": {
          "delta": -1.63
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19594 0.02001 267.28)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0486,
        "chroma": {
          "delta": 0.3161
        },
        "hue": {
          "delta": 0.87
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19073 0.01537 269.98)")
        }
      }
    },
    "backdrop-1-base": {
      "name": "Motion 1 · Base",
      "source": {
        "kind": "literal",
        "value": literal("oklch(0.9713 0.01104 276.27)")
      }
    },
    "backdrop-1-highlight": {
      "name": "Motion 1 · Highlight",
      "source": {
        "kind": "literal",
        "value": literal("oklch(0.8543 0.02957 277.61)")
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.376,
        "chroma": {
          "delta": -0.0339
        },
        "hue": {
          "delta": -1.96
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.7783362605526982,
          "hue": {
            "delta": -3.9827375215363645
          },
          "chroma": {
            "delta": -0.12709796710447996
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0912,
        "chroma": {
          "delta": 0.1843
        },
        "hue": {
          "delta": 4.33
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.27577179361088044,
          "hue": {
            "delta": -2.4182941402577853
          },
          "chroma": {
            "delta": 0.10540107093775991
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
            "id": "whiteout",
            "palette": {
              "base": {
                "kind": "role",
                "role": "panel"
              },
              "highlight": {
                "kind": "role",
                "role": "fill"
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
                "offset": 0.66667,
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
    purity: 0.755,
    maxDeltaEOk: 0.00003,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
