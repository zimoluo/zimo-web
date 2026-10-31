import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "murk",
  "name": "Murk",
  "ramp": {
    "hue": 204.61,
    "chroma": 0.5943,
    "lightest": 0.963,
    "darkest": 0.3906,
    "torsion": 4.6
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
              "at": 50,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
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
              "alpha": 0.92,
              "binding": "scaled"
            },
            {
              "at": 50,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0.9,
              "binding": "scaled"
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-3"
              },
              "alpha": 0.88,
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
  "backdrop": {
    "scenes": [
      {
        "id": "murk"
      }
    ]
  },
  "mark": {
    "mode": "split",
    "gradients": [
      {
        "angle": 10,
        "stops": [
          {
            "offset": 0,
            "color": {
              "kind": "channel",
              "channel": "mark-1-1"
            }
          },
          {
            "offset": 0.3,
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
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": -0.24284366
        },
        "hue": {
          "delta": -0.25661068
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.18918671,
        "chroma": {
          "delta": -0.22804634
        },
        "hue": {
          "delta": 0.37753733
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.53212895,
        "chroma": {
          "delta": 0.20740409
        },
        "hue": {
          "delta": -0.0164936
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.74887713,
        "chroma": {
          "delta": 0.26292445
        },
        "hue": {
          "delta": -0.05501566
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e8f6f7")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#19555c")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.8661,
        "chroma": {
          "delta": 0.1634
        },
        "hue": {
          "delta": 7.6
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.6802,
        "chroma": {
          "delta": 0.2529
        },
        "hue": {
          "delta": -19.83
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.6393,
        "chroma": {
          "delta": 0.2762
        },
        "hue": {
          "delta": -15.15
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.7206,
        "chroma": {
          "delta": 0.2873
        },
        "hue": {
          "delta": -3.97
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.7985,
        "chroma": {
          "delta": 0.2546
        },
        "hue": {
          "delta": -19.56
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.7418,
        "chroma": {
          "delta": 0.2676
        },
        "hue": {
          "delta": -15.24
        }
      }
    },
    "surfaces-widget-1-3": {
      "name": "Widget · Layer 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.8361,
        "chroma": {
          "delta": 0.2487
        },
        "hue": {
          "delta": -4.27
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8115,
        "chroma": {
          "delta": 0.0366
        },
        "hue": {
          "delta": 14.68
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.0741
        },
        "hue": {
          "delta": 15.67
        }
      }
    },
    "mark-1-3": {
      "name": "Mark · Gradient 1 · Color 3",
      "source": {
        "kind": "tone",
        "at": 0.3194,
        "chroma": {
          "delta": 0.1665
        },
        "hue": {
          "delta": -17.79
        }
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.77,
    maxDeltaEOk: 0.000355,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
