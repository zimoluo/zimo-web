import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "spring-field",
  "name": "Spring Field",
  "ramp": {
    "hue": 96.39,
    "chroma": 0.9945,
    "lightest": 0.996,
    "darkest": 0.5436,
    "torsion": -12.97
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
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 20.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 40,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 40.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 60,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 60.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 80.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-9"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-9"
              }
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 60
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
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 90
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
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
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
    "mode": "backdrop"
  },
  "reading": {
    "blur": 0
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.00005815,
        "chroma": {
          "delta": 0.00553381
        },
        "hue": {
          "delta": 3.87622331
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.08638882,
        "chroma": {
          "delta": 0.00551974
        },
        "hue": {
          "delta": -2.09719652
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.3009256,
        "chroma": {
          "delta": -0.01667819
        },
        "hue": {
          "delta": -3.28921787
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.38479211,
        "chroma": {
          "delta": 0.00552248
        },
        "hue": {
          "delta": -3.55644492
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fef9e1")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#746100")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.7129,
        "chroma": {
          "delta": -0.3605
        },
        "hue": {
          "delta": 68.61
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f2bdc7")
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.249,
        "chroma": {
          "delta": -0.2608
        },
        "hue": {
          "delta": -1.19
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "literal",
        "value": literal("#5ba683")
      }
    },
    "surfaces-page-1-7": {
      "name": "Page · Layer 1 · Color 7",
      "source": {
        "kind": "literal",
        "value": literal("#b796d8")
      }
    },
    "surfaces-page-1-9": {
      "name": "Page · Layer 1 · Color 9",
      "source": {
        "kind": "literal",
        "value": literal("#3c74a6")
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#72b495")
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.831,
    maxDeltaEOk: 0.000085,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
