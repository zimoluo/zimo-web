import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "aquarium",
  "name": "Aquarium",
  "ramp": {
    "hue": 233.12,
    "chroma": 0.3651,
    "lightest": 1,
    "darkest": 0.4414,
    "torsion": 6.74
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
              "alpha": 0.2
            },
            {
              "at": 8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0.155
            },
            {
              "at": 16,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              },
              "alpha": 0.111
            },
            {
              "at": 24,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              },
              "alpha": 0.067
            },
            {
              "at": 36,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              },
              "alpha": 0
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              },
              "alpha": 0
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 15,
            "y": 60
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "alpha": 0.25
            },
            {
              "at": 6.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0.197
            },
            {
              "at": 13,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              },
              "alpha": 0.145
            },
            {
              "at": 19.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              },
              "alpha": 0.093
            },
            {
              "at": 31,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              },
              "alpha": 0
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              },
              "alpha": 0
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 64,
            "y": 20
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "page-2",
          "stops": [
            {
              "at": 10,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 90,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
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
              "alpha": 0.225,
              "binding": "scaled"
            },
            {
              "at": 7,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.18,
              "binding": "scaled"
            },
            {
              "at": 14,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-3"
              },
              "alpha": 0.135,
              "binding": "scaled"
            },
            {
              "at": 21,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-4"
              },
              "alpha": 0.09,
              "binding": "scaled"
            },
            {
              "at": 35,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-5"
              },
              "alpha": 0
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 40,
            "y": 24
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-1",
          "stops": [
            {
              "at": 10,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-1"
              },
              "binding": "scaled"
            },
            {
              "at": 90,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-2"
              },
              "binding": "scaled"
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "corner",
            "x": "right",
            "y": "top"
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
              "at": 10,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 90,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
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
  "backdrop": {
    "scenes": [
      {
        "id": "underwater"
      }
    ]
  },
  "mark": {
    "mode": "split",
    "gradients": [
      {
        "angle": 135,
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
          "delta": -0.01012839
        },
        "hue": {
          "delta": 1.27200999
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 233.12)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.77431771,
        "chroma": {
          "delta": 0.10985461
        },
        "hue": {
          "delta": -2.40465196
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 233.12)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.51112705,
        "chroma": {
          "delta": -0.0147327
        },
        "hue": {
          "delta": -1.91116139
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 233.12)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.19589498,
        "chroma": {
          "delta": -0.08517252
        },
        "hue": {
          "delta": -0.14392277
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 233.12)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#ecf1f3")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 233.12)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#27404d")
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
        "at": 0.5481,
        "chroma": {
          "delta": -0.0109
        },
        "hue": {
          "delta": -4.21
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 233.12)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffeeea")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25509 0.09324 33.36)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fff2eb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24714 0.06493 50.44)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#fff8eb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.23553 0.04842 83.06)")
        }
      }
    },
    "surfaces-page-1-4": {
      "name": "Page · Layer 1 · Color 4",
      "source": {
        "kind": "literal",
        "value": literal("#fffeeb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22383 0.04736 104.39)")
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21658 0 89.88)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1932,
        "chroma": {
          "delta": -0.2445
        },
        "hue": {
          "delta": -18.53
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.31617 0.00666 212.52)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.1209,
        "chroma": {
          "delta": 0.0466
        },
        "hue": {
          "delta": -19.52
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27799 0.01987 211.04)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffeeea")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18924 0.01928 33.36)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fff2eb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18734 0.0169 50.44)")
        }
      }
    },
    "surfaces-widget-1-3": {
      "name": "Widget · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#fff8eb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18455 0.01869 83.06)")
        }
      }
    },
    "surfaces-widget-1-4": {
      "name": "Widget · Layer 1 · Color 4",
      "source": {
        "kind": "literal",
        "value": literal("#fffeeb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18174 0.02484 104.39)")
        }
      }
    },
    "surfaces-widget-1-5": {
      "name": "Widget · Layer 1 · Color 5",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18 0 89.88)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.2705,
        "chroma": {
          "delta": -0.1366
        },
        "hue": {
          "delta": -16.41
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21415 0.02606 215.16)")
        }
      }
    },
    "surfaces-widget-2-2": {
      "name": "Widget · Layer 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.1337,
        "chroma": {
          "delta": -0.1168
        },
        "hue": {
          "delta": -16.29
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19634 0.01345 214.36)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f0f9ff")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.24210619614678325,
          "hue": {
            "delta": -4.811371194105618
          },
          "chroma": {
            "delta": 0.17414569715690242
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.8108,
        "chroma": {
          "delta": 0.1184
        },
        "hue": {
          "delta": -1.9
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.9081311650645612,
          "hue": {
            "delta": -2.91870233111581
          },
          "chroma": {
            "delta": 0.13639567845255818
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
            "angle": 135,
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
    purity: 0.943,
    maxDeltaEOk: 0.000054,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
