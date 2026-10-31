import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "gold",
  "name": "Gold",
  "ramp": {
    "hue": 81.51,
    "chroma": 0.8579,
    "lightest": 0.9926,
    "darkest": 0.439,
    "torsion": -18.78
  },
  "schemes": {
    "kind": "single",
    "scheme": "light",
    "roles": {
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
    }
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
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
        "id": "gold"
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
          "delta": 0.04293564
        },
        "hue": {
          "delta": -3.74967967
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.61105513,
        "chroma": {
          "delta": 0.12477598
        },
        "hue": {
          "delta": 3.72542483
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.27098047,
        "chroma": {
          "delta": -0.17673557
        },
        "hue": {
          "delta": 2.61741831
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.03021487,
        "chroma": {
          "delta": 0.00897526
        },
        "hue": {
          "delta": -4.39007651
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fdf5e3")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#724e02")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.1922,
        "chroma": {
          "delta": -0.0308
        },
        "hue": {
          "delta": 1.78
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0193,
        "chroma": {
          "delta": 0.1421
        },
        "hue": {
          "delta": -3.03
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": 0.1421
        },
        "hue": {
          "delta": 7.38
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0351,
        "chroma": {
          "delta": 0.1421
        },
        "hue": {
          "delta": -4.58
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0154,
        "chroma": {
          "delta": 0.1421
        },
        "hue": {
          "delta": 0.97
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.6461,
        "chroma": {
          "delta": 0.1421
        },
        "hue": {
          "delta": 8.04
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.129,
        "chroma": {
          "delta": 0.1421
        },
        "hue": {
          "delta": 1.25
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.3742,
        "chroma": {
          "delta": 0.1273
        },
        "hue": {
          "delta": -0.51
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.905,
    maxDeltaEOk: 0.000052,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
