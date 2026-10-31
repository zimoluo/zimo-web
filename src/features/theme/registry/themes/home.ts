import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "home",
  "name": "Home",
  "ramp": {
    "hue": 0,
    "chroma": 0,
    "lightest": 1,
    "darkest": 0.3092
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
                "channel": "surfaces-page-1-1"
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
        "id": "home"
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
            "offset": 0.35,
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
        "at": 1,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.87556314
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#f4eff8")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.9005083,
        "chroma": {
          "delta": 1.8e-7
        },
        "hue": {
          "delta": 89.8755633
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#b8aacd")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.12424938,
        "chroma": {
          "delta": 3.5e-7
        },
        "hue": {
          "delta": 89.87556321
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#41364e")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.02394988,
        "chroma": {
          "delta": 0.00000196
        },
        "hue": {
          "delta": 89.87556322
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#221d2c")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#f0f0f0")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#b8aacd")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#3a3a3a")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#080a10")
        }
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.1242,
        "hue": {
          "delta": 89.88
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#302639")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fcfcfc")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27 0 89.88)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f6f6f6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18644 0 89.88)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fdfdfd")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18143 0 89.88)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#cacaca")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.7982502619976168,
          "hue": {
            "delta": -78.49854577105248
          },
          "chroma": {
            "delta": 0.06870387832964085
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#f5f5f5")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.47151983926201,
          "hue": {
            "delta": -71.5822942538482
          },
          "chroma": {
            "delta": 0.13596765480136544
          }
        }
      }
    },
    "mark-1-3": {
      "name": "Mark · Gradient 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.2712367274291074,
          "hue": {
            "delta": -63.43615657186797
          },
          "chroma": {
            "delta": 0.18236302882687622
          }
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "backdrop": {
        "scenes": [
          {
            "id": "home",
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
                "role": "panel"
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
                "offset": 0.35,
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
    scheme: "light",
    purity: 0.501,
    maxDeltaEOk: 0.000032,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
