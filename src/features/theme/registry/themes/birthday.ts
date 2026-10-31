import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "birthday",
  "name": "Birthday",
  "ramp": {
    "hue": 359.83,
    "chroma": 0.8698,
    "lightest": 0.9907,
    "darkest": 0.4078,
    "torsion": 23.93
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
            "x": 115,
            "y": 30
          },
          "extent": {
            "kind": "ellipse",
            "x": 54,
            "y": 54
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
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 14,
            "y": 64
          },
          "extent": {
            "kind": "ellipse",
            "x": 60,
            "y": 60
          }
        },
        {
          "id": "page-2",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
              }
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
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
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 120,
            "y": 85
          },
          "extent": {
            "kind": "ellipse",
            "x": 70,
            "y": 120
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
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 14,
            "y": 20
          },
          "extent": {
            "kind": "ellipse",
            "x": 60,
            "y": 90
          }
        },
        {
          "id": "widget-2",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-1"
              },
              "binding": "scaled"
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-2"
              },
              "binding": "scaled"
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
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
        "id": "birthday"
      }
    ]
  },
  "mark": {
    "mode": "unified",
    "stroke": {
      "kind": "channel",
      "channel": "mark-stroke"
    },
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
        "at": 0.99995783,
        "chroma": {
          "delta": 0.00649948
        },
        "hue": {
          "delta": -9.36201949
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 359.83)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.78407945,
        "chroma": {
          "delta": 0.07262967
        },
        "hue": {
          "delta": -2.66980598
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 359.83)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.17059483,
        "chroma": {
          "delta": 0.00272799
        },
        "hue": {
          "delta": -8.71618688
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 359.83)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.03672905,
        "chroma": {
          "delta": -0.08197094
        },
        "hue": {
          "delta": -5.54574988
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 359.83)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fae5f1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 359.83)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#670e3e")
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
        "at": 0.303,
        "chroma": {
          "delta": 0.0152
        },
        "hue": {
          "delta": -9.1
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 359.83)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#b6ffab")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27529 0.0911 141.27)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#f9ffeb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21685 0.05175 120.5)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1993,
        "chroma": {
          "delta": 0.1302
        },
        "hue": {
          "delta": -5.38
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.32367 0.13641 347.25)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0643,
        "chroma": {
          "delta": 0.1302
        },
        "hue": {
          "delta": 17.77
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25014 0.10025 7.17)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fff5e5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.23334 0.04836 79.75)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fcffe4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21633 0.04795 112.19)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#b6ffab")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19639 0.055 141.27)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#f9ffeb")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18236 0.0269 120.5)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1993,
        "chroma": {
          "delta": 0.1302
        },
        "hue": {
          "delta": -5.38
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.208 0.055 347.25)")
        }
      }
    },
    "surfaces-widget-2-2": {
      "name": "Widget · Layer 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0643,
        "chroma": {
          "delta": 0.1302
        },
        "hue": {
          "delta": 17.77
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19035 0.02206 7.17)")
        }
      }
    },
    "surfaces-widget-3-1": {
      "name": "Widget · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fff5e5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18632 0.02366 79.75)")
        }
      }
    },
    "surfaces-widget-3-2": {
      "name": "Widget · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fcffe4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18224 0.03531 112.19)")
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.7841,
        "chroma": {
          "delta": 0.0726
        },
        "hue": {
          "delta": -2.67
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.4568,
        "chroma": {
          "delta": 0.0768
        },
        "hue": {
          "delta": 1.3
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.621361236069659,
          "hue": {
            "delta": -4.501704163759086
          },
          "chroma": {
            "delta": -0.31242473535113024
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fbc480")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.475498220227093,
          "hue": {
            "delta": 64.48733229316491
          },
          "chroma": {
            "delta": -0.2083996945373907
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
            "id": "birthday",
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
        "mode": "unified",
        "stroke": {
          "kind": "role",
          "role": "text"
        },
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
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.925,
    maxDeltaEOk: 0.000177,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
