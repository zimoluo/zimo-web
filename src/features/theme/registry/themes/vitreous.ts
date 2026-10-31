import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "vitreous",
  "name": "Vitreous",
  "ramp": {
    "hue": 282.67,
    "chroma": 0.9333,
    "lightest": 0.9657,
    "darkest": 0.4894
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
              "at": 92,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "alpha": 0.1804
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 315
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 30,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "alpha": 0.0706
            },
            {
              "at": 39,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0.0784
            }
          ],
          "repeating": true,
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 238,
            "y": 218
          },
          "extent": {
            "kind": "ellipse",
            "x": 75,
            "y": 75
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
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 109,
            "y": 2
          },
          "extent": {
            "kind": "ellipse",
            "x": 99,
            "y": 99
          }
        },
        {
          "id": "page-3",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-4-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 21,
            "y": 78
          },
          "extent": {
            "kind": "ellipse",
            "x": 99,
            "y": 99
          }
        },
        {
          "id": "page-4",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-5-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-5-2"
              }
            }
          ],
          "kind": "radial",
          "at": {
            "x": 0,
            "y": 100
          },
          "extent": {
            "kind": "ellipse",
            "x": 160,
            "y": 154
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
              "at": 12.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.89,
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.97,
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
                "channel": "surfaces-page-5-1"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-5-2"
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
        "at": 0.00004933,
        "chroma": {
          "delta": 0.06696161
        },
        "hue": {
          "delta": 6.94214164
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 282.67)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.37232329,
        "chroma": {
          "delta": 0.06674111
        },
        "hue": {
          "delta": -1.93432797
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 282.67)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.70470118,
        "chroma": {
          "delta": -0.06231437
        },
        "hue": {
          "delta": -2.19346771
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 282.67)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.91292696,
        "chroma": {
          "delta": -0.07108408
        },
        "hue": {
          "delta": 2.03174312
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 282.67)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e9e4fb")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.0024 282.67)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#1e096b")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.8426,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": -18.38
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 282.67)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#00ffff")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0.13314 194.77)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.9892,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": -18.3
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.96789 0.01506 264.37)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.4021,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": -56.65
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.83793 0.10666 226.02)")
        }
      }
    },
    "surfaces-page-4-1": {
      "name": "Page · Layer 4 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9173,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": 9.63
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95373 0.02394 292.3)")
        }
      }
    },
    "surfaces-page-5-1": {
      "name": "Page · Layer 5 · Color 1",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.0927
        },
        "hue": {
          "delta": -3.95
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.97 0.01201 278.72)")
        }
      }
    },
    "surfaces-page-5-2": {
      "name": "Page · Layer 5 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.8426,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": -18.38
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93865 0.02911 264.29)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8451,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": 4.64
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93431 0.03307 287.31)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.8753,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": -13.48
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93566 0.03052 269.19)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8116,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": 11.23
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.8047,
        "chroma": {
          "delta": 0.0667
        },
        "hue": {
          "delta": -18.17
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
    purity: 0.898,
    maxDeltaEOk: 0.000032,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
