import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "default-editor",
  "name": "Default Editor",
  "ramp": {
    "hue": 239.47,
    "chroma": 0.9646,
    "lightest": 0.9851,
    "darkest": 0.3912,
    "torsion": 8.68
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
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 80,
            "y": 100
          },
          "extent": {
            "kind": "ellipse",
            "x": 50,
            "y": 50
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 6,
            "y": 74
          },
          "extent": {
            "kind": "ellipse",
            "x": 60,
            "y": 60
          }
        },
        {
          "id": "page-2",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
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
          "interpolation": {
            "space": "srgb"
          },
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
    },
    "page-reduced": {
      "layers": [
        {
          "id": "page-reduced-0",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-2"
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
    }
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
        "at": 0.99994404,
        "chroma": {
          "delta": -0.03553758
        },
        "hue": {
          "delta": -2.93359749
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 239.47)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.80175238,
        "chroma": {
          "delta": 0.0268115
        },
        "hue": {
          "delta": 0.65980892
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 239.47)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.15407842,
        "chroma": {
          "delta": -0.02679499
        },
        "hue": {
          "delta": -5.56498543
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 239.47)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.01494953,
        "chroma": {
          "delta": 0.03574107
        },
        "hue": {
          "delta": 1.35998306
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 239.47)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#e1f3fe")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 239.47)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#004674")
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
        "at": 0.0577,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -160.47
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 239.47)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.1422,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -19.83
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.29452 0.05246 216.53)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ebffee")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22179 0.06133 149.83)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f1c5ff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.32259 0.15649 317.92)")
        }
      }
    },
    "surfaces-page-2-2": {
      "name": "Page · Layer 2 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffebf1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24485 0.09989 357.34)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffede5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2443 0.06914 45.61)")
        }
      }
    },
    "surfaces-page-3-2": {
      "name": "Page · Layer 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fffbe4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21741 0.04504 98.85)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffede5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19002 0.02238 45.61)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fffbe4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18357 0.03033 98.85)")
        }
      }
    },
    "mark-1-1": {
      "name": "Mark · Gradient 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffede6")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.6574650920670873,
          "hue": {
            "delta": 144.8178660033946
          },
          "chroma": {
            "delta": -0.608692423658417
          }
        }
      }
    },
    "mark-1-2": {
      "name": "Mark · Gradient 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffc5b7")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.299713759837935,
          "hue": {
            "delta": 157.23928191290304
          },
          "chroma": {
            "delta": -0.2877689840547454
          }
        }
      }
    },
    "mark-2-1": {
      "name": "Mark · Gradient 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.0233,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -20.08
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.6070086322579509,
          "hue": {
            "delta": -5.298408922840281
          },
          "chroma": {
            "delta": -0.3143500969967632
          }
        }
      }
    },
    "mark-2-2": {
      "name": "Mark · Gradient 2 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.3067,
        "chroma": {
          "delta": 0.0354
        },
        "hue": {
          "delta": -8.69
        }
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.2128417007717433,
          "hue": {
            "delta": -16.530261860135397
          },
          "chroma": {
            "delta": -0.2905255589143909
          }
        }
      }
    },
    "mark-3-1": {
      "name": "Mark · Gradient 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fcf1ff")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.6527082861605886,
          "hue": {
            "delta": 82.37490843861963
          },
          "chroma": {
            "delta": -0.43503843873152415
          }
        }
      }
    },
    "mark-3-2": {
      "name": "Mark · Gradient 3 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#e58fff")
      },
      "appearance": {
        "dark": {
          "kind": "tone",
          "at": 0.3141220906971247,
          "hue": {
            "delta": 83.45321267109648
          },
          "chroma": {
            "delta": -0.3559622398925908
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
    purity: 0.778,
    maxDeltaEOk: 0.000033,
    flags: [
      "torsion-applied",
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
