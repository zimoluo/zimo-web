import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "about",
  "name": "About",
  "ramp": {
    "hue": 239.47,
    "chroma": 0.9646,
    "lightest": 0.9851,
    "darkest": 0.371,
    "torsion": 9.16
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
            "x": 80,
            "y": 100
          },
          "extent": {
            "kind": "ellipse",
            "x": 50,
            "y": 50
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
            "x": 6,
            "y": 74
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
            "x": 110,
            "y": 60
          },
          "extent": {
            "kind": "ellipse",
            "x": 50,
            "y": 80
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
            "x": 12,
            "y": 40
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
      },
      {
        "angle": 90,
        "stops": [
          {
            "offset": 0,
            "color": {
              "kind": "channel",
              "channel": "mark-2-1"
            }
          },
          {
            "offset": 1,
            "color": {
              "kind": "channel",
              "channel": "mark-2-2"
            }
          }
        ]
      },
      {
        "angle": 90,
        "stops": [
          {
            "offset": 0,
            "color": {
              "kind": "channel",
              "channel": "mark-3-1"
            }
          },
          {
            "offset": 1,
            "color": {
              "kind": "channel",
              "channel": "mark-3-2"
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
        "at": 0.96343302,
        "chroma": {
          "delta": -0.03553758
        },
        "hue": {
          "delta": -2.83912968
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#eef4ff")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.77423383,
        "chroma": {
          "delta": 0.0268115
        },
        "hue": {
          "delta": 0.76703769
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#a7bbd7")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.14915625,
        "chroma": {
          "delta": -0.02679499
        },
        "hue": {
          "delta": -5.35385599
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#354455")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.01445794,
        "chroma": {
          "delta": 0.03574107
        },
        "hue": {
          "delta": 1.59731025
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#1b2533")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e1f3fe")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#a7bbd7")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#004674")
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
        "at": 0.0608,
        "chroma": {
          "delta": -0.0266
        },
        "hue": {
          "delta": 1.38
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#263549")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1377,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -19.62
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.29456 0.05247 216.53)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ebffee")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22179 0.06133 149.83)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f1c5ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.32259 0.15649 317.92)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffebf1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24485 0.09989 357.34)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffede5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2443 0.06914 45.61)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fffbe4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21741 0.04504 98.85)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1377,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -19.62
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20209 0.036 216.53)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ebffee")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18462 0.03062 149.83)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f1c5ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20881 0.055 317.92)")
        }
      }
    },
    "surfaces-widget-2-2": {
      "name": "Widget · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffebf1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19016 0.02303 357.34)")
        }
      }
    },
    "surfaces-widget-3-1": {
      "name": "Widget · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffede5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19002 0.02238 45.61)")
        }
      }
    },
    "surfaces-widget-3-2": {
      "name": "Widget · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fffbe4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18357 0.03033 98.85)")
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.0169
        },
        "hue": {
          "delta": 7.26
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffe147")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.47435946660148653,
          "hue": {
            "delta": -154.96822026884115
          },
          "chroma": {
            "delta": -0.1172057349383323
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ff4e13")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5812320550950738,
          "hue": {
            "delta": 160.4968555591999
          },
          "chroma": {
            "delta": -0.09870146927282442
          }
        }
      }
    },
    "mark-2-1": {
      "name": "Mark · Gradient 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.274,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -22.99
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5387624330124294,
          "hue": {
            "delta": -20.965405285680845
          },
          "chroma": {
            "delta": -0.11380029311546458
          }
        }
      }
    },
    "mark-2-2": {
      "name": "Mark · Gradient 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#6eff86")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.4503119351509426,
          "hue": {
            "delta": -85.93031183210337
          },
          "chroma": {
            "delta": -0.2952540160473779
          }
        }
      }
    },
    "mark-3-1": {
      "name": "Mark · Gradient 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ed9dff")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5346436192757471,
          "hue": {
            "delta": 79.13387351726396
          },
          "chroma": {
            "delta": -0.48751913671880676
          }
        }
      }
    },
    "mark-3-2": {
      "name": "Mark · Gradient 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ff69cb")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5311180494062979,
          "hue": {
            "delta": 105.24195449139211
          },
          "chroma": {
            "delta": -0.403500233214514
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
          },
          {
            "angle": 90,
            "stops": [
              {
                "offset": 0,
                "color": {
                  "kind": "channel",
                  "channel": "mark-2-1"
                }
              },
              {
                "offset": 1,
                "color": {
                  "kind": "channel",
                  "channel": "mark-2-2"
                }
              }
            ]
          },
          {
            "angle": 90,
            "stops": [
              {
                "offset": 0,
                "color": {
                  "kind": "channel",
                  "channel": "mark-3-1"
                }
              },
              {
                "offset": 1,
                "color": {
                  "kind": "channel",
                  "channel": "mark-3-2"
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
    purity: 0.957,
    maxDeltaEOk: 0.000027,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
