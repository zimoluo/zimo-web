import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "scintillating",
  "name": "Scintillating",
  "ramp": {
    "hue": 2.31,
    "chroma": 1,
    "lightest": 0.9526,
    "darkest": 0.3675,
    "torsion": 10.1
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
              "at": 92,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "alpha": 0.18
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "repeating": true,
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 315
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 30,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0.0706
            },
            {
              "at": 39,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-2"
              },
              "alpha": 0.0784
            }
          ],
          "repeating": true,
          "kind": "radial",
          "at": {
            "x": 238,
            "y": 218
          },
          "extent": {
            "kind": "ellipse",
            "x": 75,
            "y": 75
          }
        },
        {
          "id": "page-2",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 109,
            "y": 2
          },
          "extent": {
            "kind": "ellipse",
            "x": 99,
            "y": 99
          }
        },
        {
          "id": "page-3",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-4-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-4-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 21,
            "y": 78
          },
          "extent": {
            "kind": "ellipse",
            "x": 99,
            "y": 99
          }
        },
        {
          "id": "page-4",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-5-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-5-2"
              }
            }
          ],
          "kind": "radial",
          "at": {
            "x": 0,
            "y": 100
          },
          "extent": {
            "kind": "ellipse",
            "x": 160,
            "y": 154
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
                "channel": "surfaces-page-reduced-1-1"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-reduced-1-2"
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
    }
  },
  "mark": {
    "mode": "split",
    "gradients": [
      {
        "angle": 135,
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
          "delta": 0.00000947
        },
        "hue": {
          "delta": -0.67815753
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 2.31)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.71558109,
        "chroma": {
          "delta": 0.00002493
        },
        "hue": {
          "delta": -1.29077934
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 2.31)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.15056818,
        "chroma": {
          "delta": 0.00005619
        },
        "hue": {
          "delta": -6.47246318
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 2.31)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.00687153,
        "chroma": {
          "delta": 0.00008233
        },
        "hue": {
          "delta": 3.33639174
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 2.31)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fee1e9")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 2.31)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#74001d")
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
        "at": 0.2974,
        "hue": {
          "delta": -5.13
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 2.31)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.2104,
        "hue": {
          "delta": -3.34
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.26735 0.10944 356.05)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.213,
        "hue": {
          "delta": 5.77
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.26884 0.10799 5.18)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0827,
        "hue": {
          "delta": -11.94
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19704 0.0834 346.16)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.3883,
        "hue": {
          "delta": 8.57
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.37445 0.14977 9.75)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0454,
        "hue": {
          "delta": -12.11
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.17721 0.07518 345.61)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.2222,
        "hue": {
          "delta": -5.06
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.27411 0.11272 354.44)")
        }
      }
    },
    "surfaces-page-4-1": {
      "name": "Page · Layer 4 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0351,
        "hue": {
          "delta": 4.87
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.17177 0.06931 2.48)")
        }
      }
    },
    "surfaces-page-4-2": {
      "name": "Page · Layer 4 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0266,
        "hue": {
          "delta": -11.35
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.16729 0.07081 346.18)")
        }
      }
    },
    "surfaces-page-5-1": {
      "name": "Page · Layer 5 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0446,
        "hue": {
          "delta": -3.09
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.17679 0.07267 354.62)")
        }
      }
    },
    "surfaces-page-5-2": {
      "name": "Page · Layer 5 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.0233,
        "hue": {
          "delta": 5.64
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.16555 0.06672 3.14)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1123,
        "hue": {
          "delta": 4.25
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2057 0.055 2.64)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0,
        "hue": {
          "delta": -10.18
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19138 0.02876 347.08)")
        }
      }
    },
    "surfaces-page-reduced-1-1": {
      "name": "Page reduced · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1158,
        "hue": {
          "delta": -11.34
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21483 0.09061 347.09)")
        }
      }
    },
    "surfaces-page-reduced-1-2": {
      "name": "Page reduced · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.1013,
        "hue": {
          "delta": -3.92
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20701 0.08515 354.36)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0072,
        "hue": {
          "delta": -12.38
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.5804089909779389,
          "hue": {
            "delta": -10.062522386844307
          },
          "chroma": {
            "delta": -0.5099063749972614
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.2949,
        "hue": {
          "delta": -1.74
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.33689518278168795,
          "hue": {
            "delta": -5.034814262384771
          },
          "chroma": {
            "delta": -0.26412534805855514
          }
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "mark": {
        "mode": "split",
        "gradients": [
          {
            "angle": 135,
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
    purity: 0.981,
    maxDeltaEOk: 0.000024,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "dark-unreviewed"
    ]
  } as const;
