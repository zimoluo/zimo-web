import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "christmas",
  "name": "Christmas",
  "ramp": {
    "hue": 25.7,
    "chroma": 0.8345,
    "lightest": 0.9934,
    "darkest": 0.4128,
    "torsion": 11.62
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
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 50,
            "y": 50
          },
          "extent": {
            "kind": "ellipse",
            "x": 90,
            "y": 90
          }
        },
        {
          "id": "widget-1",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "binding": "scaled"
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "binding": "scaled"
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 30
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
        "id": "christmas"
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
            "offset": 0.424,
            "color": {
              "kind": "channel",
              "channel": "mark-1-2"
            }
          },
          {
            "offset": 1,
            "color": {
              "kind": "channel",
              "channel": "mark-1-3"
            }
          }
        ]
      }
    ]
  },
  "reading": {
    "blur": 8
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.99999234,
        "chroma": {
          "delta": 0.08068141
        },
        "hue": {
          "delta": -4.16022706
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.75527631,
        "chroma": {
          "delta": 0.03183881
        },
        "hue": {
          "delta": -2.25909398
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.16980377,
        "chroma": {
          "delta": 0.03424333
        },
        "hue": {
          "delta": -3.87008078
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.02418314,
        "chroma": {
          "delta": -0.14664597
        },
        "hue": {
          "delta": -2.9044748
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f8e7e7")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#5f1515")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.4735,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -4.96
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0001,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -2.68
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0212,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -2.83
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0422,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -2.98
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0085,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -2.74
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.837,
        "chroma": {
          "delta": 0.0904
        },
        "hue": {
          "delta": -3.28
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0836,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -3.26
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.1898,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -3.82
        }
      }
    },
    "mark-1-3": {
      "name": "Mark · Gradient 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.108,
        "chroma": {
          "delta": 0.1655
        },
        "hue": {
          "delta": -3.41
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.888,
    maxDeltaEOk: 0.000016,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
