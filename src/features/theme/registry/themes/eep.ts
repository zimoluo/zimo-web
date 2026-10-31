import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "eep",
  "name": "Eep",
  "ramp": {
    "hue": 161.18,
    "chroma": 0.7264,
    "lightest": 0.997,
    "darkest": 0.4462,
    "torsion": -9.92
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
              "at": 5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 10,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
              }
            },
            {
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              }
            },
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-5"
              }
            },
            {
              "at": 25,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-6"
              }
            },
            {
              "at": 30,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-7"
              }
            },
            {
              "at": 35,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            }
          ],
          "repeating": true,
          "interpolation": {
            "space": "srgb"
          },
          "kind": "radial",
          "at": {
            "x": 50,
            "y": 50
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
          "interpolation": {
            "space": "hsl",
            "hue": "longer"
          },
          "kind": "radial",
          "at": {
            "x": 50,
            "y": 50
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-side"
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
        "id": "eep"
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
              "channel": "mark-stroke"
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
            "offset": 0.001,
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
        "at": 0.99990057,
        "chroma": {
          "delta": 0.22148308
        },
        "hue": {
          "delta": 3.51188141
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.60460214,
        "chroma": {
          "delta": 0.23313354
        },
        "hue": {
          "delta": -1.69825597
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.1728445,
        "chroma": {
          "delta": -0.25337027
        },
        "hue": {
          "delta": 2.72978244
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.05848143,
        "chroma": {
          "delta": -0.20134456
        },
        "hue": {
          "delta": 1.5489814
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e6f9f1")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#11633e")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": -0.7264
        },
        "hue": {
          "delta": -76.26
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffbaba")
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffd8ad")
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.0433,
        "chroma": {
          "delta": 0.2736
        },
        "hue": {
          "delta": -59.46
        }
      }
    },
    "surfaces-page-1-4": {
      "name": "Page · Layer 1 · Color 4",
      "source": {
        "kind": "tone",
        "at": 0.1527,
        "chroma": {
          "delta": 0.2736
        },
        "hue": {
          "delta": -20.4
        }
      }
    },
    "surfaces-page-1-5": {
      "name": "Page · Layer 1 · Color 5",
      "source": {
        "kind": "tone",
        "at": 0.1204,
        "chroma": {
          "delta": 0.2736
        },
        "hue": {
          "delta": 13.9
        }
      }
    },
    "surfaces-page-1-6": {
      "name": "Page · Layer 1 · Color 6",
      "source": {
        "kind": "literal",
        "value": literal("#a3dcff")
      }
    },
    "surfaces-page-1-7": {
      "name": "Page · Layer 1 · Color 7",
      "source": {
        "kind": "literal",
        "value": literal("#cea3ff")
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#e0d6ff")
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffe0e0")
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.8568,
        "chroma": {
          "delta": 0.231
        },
        "hue": {
          "delta": -0.6
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.3686,
        "chroma": {
          "delta": 0.1748
        },
        "hue": {
          "delta": -1.69
        }
      }
    },
    "mark-2-1": {
      "name": "Mark · Gradient 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#115d7d")
      }
    },
    "mark-2-2": {
      "name": "Mark · Gradient 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.4601,
        "chroma": {
          "delta": 0.1478
        },
        "hue": {
          "delta": 56.7
        }
      }
    },
    "mark-3-1": {
      "name": "Mark · Gradient 3 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8246,
        "chroma": {
          "delta": 0.2245
        },
        "hue": {
          "delta": -26.06
        }
      }
    },
    "mark-3-2": {
      "name": "Mark · Gradient 3 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.3157,
        "chroma": {
          "delta": 0.1628
        },
        "hue": {
          "delta": -35.06
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.578,
    maxDeltaEOk: 0.000035,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
