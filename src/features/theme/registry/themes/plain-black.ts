import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "plain-black",
  "name": "Plain Black",
  "ramp": {
    "hue": 0,
    "chroma": 0,
    "lightest": 0.9672,
    "darkest": 0
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
                "channel": "brand"
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
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.75,
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.75,
              "binding": "scaled"
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 0
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
    "mode": "outline"
  },
  "reading": {
    "blur": 0
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.00005366,
        "chroma": {
          "delta": 8.7e-7
        },
        "hue": {
          "delta": 89.8755631
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.21958417,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.87556344
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.54924657,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.87556275
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.7499552,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.8755626
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f0f0f0")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#3a3a3a")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 1
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#242424")
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.601,
    maxDeltaEOk: 0.000049,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
