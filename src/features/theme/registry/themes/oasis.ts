import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "oasis",
  "name": "Oasis",
  "ramp": {
    "hue": 173.52,
    "chroma": 0.9019,
    "lightest": 0.9875,
    "darkest": 0.4831,
    "torsion": -8.7
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
              },
              "alpha": 0.45
            },
            {
              "at": 18,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0.39
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 45
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
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-2"
              }
            }
          ],
          "repeating": true,
          "kind": "radial",
          "at": {
            "x": 50,
            "y": 120
          },
          "extent": {
            "kind": "ellipse",
            "x": 40,
            "y": 20
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
              "at": 30,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.33,
              "binding": "scaled"
            },
            {
              "at": 70,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.33,
              "binding": "scaled"
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 165
          }
        },
        {
          "id": "widget-1",
          "stops": [
            {
              "at": 30,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-1"
              },
              "binding": "scaled"
            },
            {
              "at": 70,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-2"
              },
              "binding": "scaled"
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 75
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
                "channel": "surfaces-page-2-2"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-2"
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
    "mode": "split",
    "stroke": {
      "kind": "channel",
      "channel": "mark-stroke"
    },
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
        "at": 0.99999684,
        "chroma": {
          "delta": 0.07538896
        },
        "hue": {
          "delta": 1.48219778
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 173.52)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.54046107,
        "chroma": {
          "delta": 0.06981448
        },
        "hue": {
          "delta": -1.5781157
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 173.52)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.13571592,
        "chroma": {
          "delta": -0.24327673
        },
        "hue": {
          "delta": 1.14199236
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 173.52)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.04537301,
        "chroma": {
          "delta": 0.09824901
        },
        "hue": {
          "delta": 0.56620019
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 173.52)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e1fef7")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 173.52)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#007457")
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
        "at": 0.1436,
        "chroma": {
          "delta": 0.0981
        },
        "hue": {
          "delta": -116.27
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 173.52)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fdd5bb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.30303 0.07037 54.86)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fceace")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2592 0.04504 78.97)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fff1e7")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.23697 0.05668 58.07)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffe8d6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25861 0.06039 60.43)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0316,
        "chroma": {
          "delta": 0.0981
        },
        "hue": {
          "delta": -6.01
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18645 0.0363 171.59)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#d0f2e6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19598 0.03795 172.13)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0324,
        "chroma": {
          "delta": -0.2379
        },
        "hue": {
          "delta": -5.61
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18653 0.02529 171.98)")
        }
      }
    },
    "surfaces-widget-2-2": {
      "name": "Widget · Layer 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": 0.0981
        },
        "hue": {
          "delta": -3.79
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.183 0.01707 174.08)")
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.8755,
        "chroma": {
          "delta": 0.0839
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffe7d6")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.6549344681337637,
          "hue": {
            "delta": -118.91411524758371
          },
          "chroma": {
            "delta": -0.419465045021071
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffc79c")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.4690342877040551,
          "hue": {
            "delta": -115.03881857305248
          },
          "chroma": {
            "delta": -0.3700373279310689
          }
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "mark": {
        "mode": "split",
        "stroke": {
          "kind": "role",
          "role": "text"
        },
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
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.749,
    maxDeltaEOk: 0.000022,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
