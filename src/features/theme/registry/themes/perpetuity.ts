import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "perpetuity",
  "name": "Perpetuity",
  "ramp": {
    "hue": 236.09,
    "chroma": 0.8744,
    "lightest": 0.9814,
    "darkest": 0.6282,
    "torsion": 2.9
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
              }
            },
            {
              "at": 18,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0.7
            },
            {
              "at": 51,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 55,
            "y": 0
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
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 70,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": -10,
            "y": 66
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
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 29,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
              }
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 100,
            "y": 80
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              "alpha": 0.9,
              "binding": "scaled"
            },
            {
              "at": 18,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.7,
              "binding": "scaled"
            },
            {
              "at": 51,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-3"
              },
              "alpha": 0,
              "binding": "scaled"
            }
          ],
          "kind": "radial",
          "at": {
            "x": 55,
            "y": -14
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
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-1"
              },
              "alpha": 0.9,
              "binding": "scaled"
            },
            {
              "at": 70,
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
            "x": -10,
            "y": 66
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              "alpha": 0.9,
              "binding": "scaled"
            },
            {
              "at": 34,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-2"
              },
              "alpha": 0.9,
              "binding": "scaled"
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 105,
            "y": 80
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
        "id": "perpetuity"
      }
    ]
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
  "reading": {
    "blur": 48
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.00270097,
        "chroma": {
          "delta": 0.12567985
        },
        "hue": {
          "delta": 0.16558062
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 236.09)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.27290084,
        "chroma": {
          "delta": -0.12661513
        },
        "hue": {
          "delta": -1.78587141
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 236.09)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.82552731,
        "chroma": {
          "delta": -0.03132422
        },
        "hue": {
          "delta": -2.19486423
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 236.09)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.99991829,
        "chroma": {
          "delta": 0.03240848
        },
        "hue": {
          "delta": 0.78089167
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 236.09)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e6f3f9")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.00272 236.09)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#104764")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.998,
        "chroma": {
          "delta": 0.1256
        },
        "hue": {
          "delta": -5.84
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 236.09)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffbd59")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.82088 0.15755 75.12)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffa25c")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.86902 0.08285 55.96)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#ff6b11")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95921 0.02161 44.15)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ee3cff")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.96439 0.03009 324.1)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ff1148")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.97 0.01466 19.45)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#2aff75")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78561 0.22288 148.78)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5134,
        "chroma": {
          "delta": 0.1256
        },
        "hue": {
          "delta": -15.42
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.86221 0.09838 220.71)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffbd59")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.90591 0.035 75.12)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffa25c")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.91072 0.035 55.96)")
        }
      }
    },
    "surfaces-widget-1-3": {
      "name": "Widget · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#ff6b11")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.91974 0.035 44.15)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ee3cff")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.92026 0.035 324.1)")
        }
      }
    },
    "surfaces-widget-2-2": {
      "name": "Widget · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ff1148")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.92636 0.035 19.45)")
        }
      }
    },
    "surfaces-widget-3-1": {
      "name": "Widget · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#2aff75")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.90238 0.035 148.78)")
        }
      }
    },
    "surfaces-widget-3-2": {
      "name": "Widget · Layer 3 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5134,
        "chroma": {
          "delta": 0.1256
        },
        "hue": {
          "delta": -15.42
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.91004 0.035 220.71)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffe147")
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ff4e13")
      }
    },
    "mark-2-1": {
      "name": "Mark · Gradient 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.444,
        "chroma": {
          "delta": 0.1256
        },
        "hue": {
          "delta": -21.52
        }
      }
    },
    "mark-2-2": {
      "name": "Mark · Gradient 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#6eff86")
      }
    },
    "mark-3-1": {
      "name": "Mark · Gradient 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ed9dff")
      }
    },
    "mark-3-2": {
      "name": "Mark · Gradient 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ff69cb")
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.0001,
        "chroma": {
          "delta": 0.1256
        },
        "hue": {
          "delta": -43.73
        }
      }
    }
  },
  "appearance": {
    "light": {
      "backdrop": {
        "scenes": [
          {
            "id": "perpetuity",
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
    scheme: "dark",
    purity: 0.9,
    maxDeltaEOk: 0.000034,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
