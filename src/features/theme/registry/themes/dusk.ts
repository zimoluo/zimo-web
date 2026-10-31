import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "dusk",
  "name": "Dusk",
  "ramp": {
    "hue": 4.86,
    "chroma": 0.7331,
    "lightest": 0.972,
    "darkest": 0.5692
  },
  "schemes": {
    "kind": "single",
    "scheme": "dark",
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
              "at": 33,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 67,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 0
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
              "at": 8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.95,
              "binding": "scaled"
            },
            {
              "at": 40,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.97,
              "binding": "scaled"
            },
            {
              "at": 75,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-3"
              },
              "alpha": 0.94,
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-4"
              },
              "alpha": 0.98,
              "binding": "scaled"
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 22.5
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
        "id": "dusk"
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
        "at": 0.00012882,
        "chroma": {
          "delta": 0.26708145
        },
        "hue": {
          "delta": -29.20321946
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.31258171,
        "chroma": {
          "delta": 0.08969104
        },
        "hue": {
          "delta": 26.32647754
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.65959705,
        "chroma": {
          "delta": -0.19908177
        },
        "hue": {
          "delta": -1.8401724
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.15742099
        },
        "hue": {
          "delta": -7.03401348
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f5ebef")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#532134")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.6128,
        "chroma": {
          "delta": -0.4331
        },
        "hue": {
          "delta": -28.65
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.3977,
        "chroma": {
          "delta": -0.0196
        },
        "hue": {
          "delta": 39.61
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.4258,
        "chroma": {
          "delta": 0.1626
        },
        "hue": {
          "delta": 17.67
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.5109,
        "chroma": {
          "delta": 0.0298
        }
      }
    },
    "surfaces-page-1-4": {
      "name": "Page · Layer 1 · Color 4",
      "source": {
        "kind": "tone",
        "at": 0.5284,
        "chroma": {
          "delta": -0.0889
        },
        "hue": {
          "delta": -20.09
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.593,
        "chroma": {
          "delta": -0.0458
        },
        "hue": {
          "delta": -15.66
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5796,
        "chroma": {
          "delta": -0.0121
        },
        "hue": {
          "delta": 0.76
        }
      }
    },
    "surfaces-widget-1-3": {
      "name": "Widget · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.5507,
        "chroma": {
          "delta": 0.0723
        },
        "hue": {
          "delta": 18.59
        }
      }
    },
    "surfaces-widget-1-4": {
      "name": "Widget · Layer 1 · Color 4",
      "source": {
        "kind": "tone",
        "at": 0.4598,
        "chroma": {
          "delta": -0.017
        },
        "hue": {
          "delta": 46.08
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.1574
        },
        "hue": {
          "delta": -7.03
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.3126,
        "chroma": {
          "delta": 0.0897
        },
        "hue": {
          "delta": 26.33
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.667,
    maxDeltaEOk: 0.00002,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "light-unreviewed"
    ]
  } as const;
