import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "photos",
  "name": "Photos",
  "ramp": {
    "hue": 45.84,
    "chroma": 0.9527,
    "lightest": 0.9851,
    "darkest": 0.4084,
    "torsion": -41.92
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
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
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
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "binding": "scaled"
            },
            {
              "at": 85,
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
        "id": "photos"
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
        "at": 1,
        "chroma": {
          "delta": -0.07827704
        },
        "hue": {
          "delta": 13.29151566
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#fff2e5")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.73270015,
        "chroma": {
          "delta": 0.01538851
        },
        "hue": {
          "delta": 2.31700584
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#d3b296")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.15838779,
        "chroma": {
          "delta": 0.01546848
        },
        "hue": {
          "delta": 10.53678654
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#513f33")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.01055284,
        "chroma": {
          "delta": 0.04740526
        },
        "hue": {
          "delta": 7.326453
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#2a211d")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fef1e1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#d3b296")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#744000")
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
        "at": 0.0594,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": 10.85
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("#392a22")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0517,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": -19.03
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28344 0.08022 45.6)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": 32.05
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25656 0.05315 98.85)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0302,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": -15.1
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18734 0.01691 50.43)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0106,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": 7.33
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.1849 0.01579 73.69)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1444,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": 37.04
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5677286330197062,
          "hue": {
            "delta": 29.063215635431334
          },
          "chroma": {
            "delta": -0.09626437430551182
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.5436,
        "chroma": {
          "delta": 0.0473
        },
        "hue": {
          "delta": -7.96
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.6524905722036021,
          "hue": {
            "delta": 0.1111989578404291
          },
          "chroma": {
            "delta": -0.08403294261162653
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
            "id": "photos",
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
    scheme: "light",
    purity: 0.91,
    maxDeltaEOk: 0.000028,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "dark-unreviewed"
    ]
  } as const;
