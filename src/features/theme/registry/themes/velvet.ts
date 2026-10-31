import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "velvet",
  "name": "Velvet",
  "ramp": {
    "hue": 316.32,
    "chroma": 0.4625,
    "lightest": 0.9115,
    "darkest": 0.309,
    "torsion": -4.17
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
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 90,
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
            "kind": "circle",
            "size": "farthest-side"
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
              "at": 25,
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
              "alpha": 0.8,
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
        "id": "velvet"
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
        "at": 0.00004945,
        "chroma": {
          "delta": -0.11399769
        },
        "hue": {
          "delta": 1.04684477
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 316.32)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.28105291,
        "chroma": {
          "delta": -0.04652897
        },
        "hue": {
          "delta": -0.81207625
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 316.32)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.59978774,
        "chroma": {
          "delta": 0.05596716
        },
        "hue": {
          "delta": 0.4664123
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 316.32)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.8939405,
        "chroma": {
          "delta": 0.10466239
        },
        "hue": {
          "delta": 0.76306341
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 316.32)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f2ebf5")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.00349 316.32)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#452153")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.0149
        },
        "hue": {
          "delta": -13.44
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 316.32)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8155,
        "chroma": {
          "delta": 0.0356
        },
        "hue": {
          "delta": -14.42
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.82381 0.05194 300.58)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": 0.0149
        },
        "hue": {
          "delta": -13.44
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.92619 0.02001 300.8)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9071,
        "chroma": {
          "delta": 0.064
        },
        "hue": {
          "delta": -10.01
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95403 0.02704 304.61)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.9737,
        "chroma": {
          "delta": 0.0385
        },
        "hue": {
          "delta": -5.16
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95767 0.02652 309.18)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8444,
        "chroma": {
          "delta": 0.1143
        },
        "hue": {
          "delta": -6.41
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5287,
        "chroma": {
          "delta": 0.0606
        },
        "hue": {
          "delta": -14.1
        }
      }
    }
  },
  "appearance": {
    "light": {
      "backdrop": {
        "scenes": [
          {
            "id": "velvet",
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
    purity: 0.914,
    maxDeltaEOk: 0.001177,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
