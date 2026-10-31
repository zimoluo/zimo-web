import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "midnight",
  "name": "Midnight",
  "ramp": {
    "hue": 260.19,
    "chroma": 0.1679,
    "lightest": 0.9846,
    "darkest": 0.2101
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
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "brand"
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
              "alpha": 0.7,
              "binding": "scaled"
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.7,
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
        "id": "midnight"
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
              "channel": "surfaces-page-1-1"
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
        "at": 0,
        "chroma": {
          "delta": 0.05593812
        },
        "hue": {
          "delta": -12.35107866
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.02530108,
        "chroma": {
          "delta": 0.01757614
        },
        "hue": {
          "delta": 4.35193422
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.55447833,
        "chroma": {
          "delta": -0.07357267
        },
        "hue": {
          "delta": 4.17374217
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.68083564,
        "chroma": {
          "delta": -0.00040793
        },
        "hue": {
          "delta": -3.38824929
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#eeeff1")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#303844")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.9031,
        "chroma": {
          "delta": 0.1338
        },
        "hue": {
          "delta": -3.34
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.0516
        },
        "hue": {
          "delta": 4.47
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9301,
        "chroma": {
          "delta": 0.1206
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.8695,
        "chroma": {
          "delta": 0.1043
        },
        "hue": {
          "delta": -3.35
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.0253,
        "chroma": {
          "delta": 0.0176
        },
        "hue": {
          "delta": 4.35
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.774,
        "chroma": {
          "delta": 0.0363
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.913,
    maxDeltaEOk: 0.00007,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
