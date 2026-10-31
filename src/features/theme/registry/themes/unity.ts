import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "unity",
  "name": "Unity",
  "ramp": {
    "hue": 241.88,
    "chroma": 0.782,
    "lightest": 0.9937,
    "darkest": 0.3635,
    "torsion": 33.5
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
              "at": 25,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 50,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 75,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
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
          "kind": "conic",
          "from": 45,
          "at": {
            "x": 50,
            "y": 50
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
      }
    ]
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.99999775,
        "chroma": {
          "delta": 0.1006318
        },
        "hue": {
          "delta": -4.55049554
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 241.88)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.68021819,
        "chroma": {
          "delta": 0.14708725
        },
        "hue": {
          "delta": -3.23907829
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 241.88)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.33315434,
        "chroma": {
          "delta": -0.06868666
        },
        "hue": {
          "delta": -8.86170787
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 241.88)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.04206791,
        "chroma": {
          "delta": -0.17901865
        },
        "hue": {
          "delta": -3.01706116
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 241.88)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e7f4f9")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 241.88)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#134b61")
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
        "at": 0.1117,
        "chroma": {
          "delta": 0.218
        },
        "hue": {
          "delta": -142.62
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 241.88)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0115,
        "chroma": {
          "delta": 0.218
        },
        "hue": {
          "delta": -14.48
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27316 0.04742 211.04)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fffeee")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.26684 0.05631 103.87)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fffbf1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18277 0.01383 88.68)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fffdf6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18152 0.00945 93.57)")
        }
      }
    },
    "mark-stroke": {
      "name": "Mark · Stroke",
      "source": {
        "kind": "tone",
        "at": 0.9293,
        "chroma": {
          "delta": 0.1426
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.2599,
        "chroma": {
          "delta": 0.218
        },
        "hue": {
          "delta": 19.95
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5952112726944223,
          "hue": {
            "delta": 10.942294096067144
          },
          "chroma": {
            "delta": -0.3573451987889377
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0622,
        "chroma": {
          "delta": 0.218
        },
        "hue": {
          "delta": -4.94
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.24723173846757174,
          "hue": {
            "delta": 8.815378761823467
          },
          "chroma": {
            "delta": -0.14804329938115934
          }
        }
      }
    },
    "mark-2-1": {
      "name": "Mark · Gradient 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffcf94")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5971453083723064,
          "hue": {
            "delta": 174.56546693471603
          },
          "chroma": {
            "delta": -0.1482333887513142
          }
        }
      }
    },
    "mark-2-2": {
      "name": "Mark · Gradient 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fff8ed")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.24166448374482236,
          "hue": {
            "delta": -160.30741652916436
          },
          "chroma": {
            "delta": -0.3086871258709012
          }
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "mark": {
        "mode": "split",
        "stroke": {
          "kind": "role",
          "role": "text"
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
          }
        ]
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.677,
    maxDeltaEOk: 0.000032,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
