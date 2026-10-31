import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "storm",
  "name": "Storm",
  "ramp": {
    "hue": 87.55,
    "chroma": 0.2482,
    "lightest": 0.9493,
    "darkest": 0.4362
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
              "at": 100,
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
            "kind": "ellipse",
            "x": 90,
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
              "binding": "scaled"
            }
          ],
          "kind": "radial",
          "at": {
            "x": 50,
            "y": 100
          },
          "extent": {
            "kind": "ellipse",
            "x": 90,
            "y": 100
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
        "id": "storm"
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
        "at": 0.00005977,
        "chroma": {
          "delta": -0.13357743
        },
        "hue": {
          "delta": 1.09361329
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 87.55)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.14232987,
        "chroma": {
          "delta": -0.09803784
        },
        "hue": {
          "delta": 2.25527162
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 87.55)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.74241918,
        "chroma": {
          "delta": 0.12295275
        },
        "hue": {
          "delta": -2.33726523
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 87.55)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.9747835,
        "chroma": {
          "delta": 0.10881921
        },
        "hue": {
          "delta": 1.24319676
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 87.55)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f2f0ee")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.005 87.55)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#47402d")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.9002,
        "chroma": {
          "delta": -0.0338
        },
        "hue": {
          "delta": 1.91
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 87.55)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.6856,
        "chroma": {
          "delta": -0.0691
        },
        "hue": {
          "delta": 3.09
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.8213 0.03007 90.64)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.9002,
        "chroma": {
          "delta": -0.0338
        },
        "hue": {
          "delta": 1.91
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9287 0.01908 89.46)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9748,
        "chroma": {
          "delta": 0.1088
        },
        "hue": {
          "delta": 1.24
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.94522 0.03267 88.79)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.9206,
        "chroma": {
          "delta": 0.0863
        },
        "hue": {
          "delta": 1.25
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9427 0.03233 88.8)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.3828,
        "chroma": {
          "delta": -0.0594
        },
        "hue": {
          "delta": 1.23
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.0315
        },
        "hue": {
          "delta": 1.26
        }
      }
    }
  },
  "appearance": {
    "light": {
      "backdrop": {
        "scenes": [
          {
            "id": "storm",
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
    purity: 0.891,
    maxDeltaEOk: 0.000021,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
