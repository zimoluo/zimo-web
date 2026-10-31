import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "vibrant",
  "name": "Vibrant",
  "ramp": {
    "hue": 1.5,
    "chroma": 0.6723,
    "lightest": 1,
    "darkest": 0.4994
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
              "at": 19.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "alpha": 0
            },
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 27,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              }
            },
            {
              "at": 27.01,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              }
            },
            {
              "at": 33.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-4"
              }
            },
            {
              "at": 34,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-6"
              }
            },
            {
              "at": 40.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-6"
              }
            },
            {
              "at": 41,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-8"
              }
            },
            {
              "at": 47.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-8"
              }
            },
            {
              "at": 48,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-10"
              }
            },
            {
              "at": 54.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-10"
              }
            },
            {
              "at": 55,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-12"
              }
            },
            {
              "at": 61.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-12"
              }
            },
            {
              "at": 62,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              },
              "alpha": 0
            }
          ],
          "interpolation": {
            "space": "srgb"
          },
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 155
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 15,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
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
              "at": 10,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-1"
              },
              "alpha": 0.75,
              "binding": "scaled"
            },
            {
              "at": 90,
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
            "deg": 70
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
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 85,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
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
    }
  },
  "mark": {
    "mode": "unified",
    "gradients": [
      {
        "angle": 120,
        "stops": [
          {
            "offset": 0,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-2"
            }
          },
          {
            "offset": 0.166,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-2"
            }
          },
          {
            "offset": 0.167,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-4"
            }
          },
          {
            "offset": 0.333,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-4"
            }
          },
          {
            "offset": 0.334,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-6"
            }
          },
          {
            "offset": 0.5,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-6"
            }
          },
          {
            "offset": 0.501,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-8"
            }
          },
          {
            "offset": 0.666,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-8"
            }
          },
          {
            "offset": 0.667,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-10"
            }
          },
          {
            "offset": 0.833,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-10"
            }
          },
          {
            "offset": 0.834,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-12"
            }
          },
          {
            "offset": 1,
            "color": {
              "kind": "channel",
              "channel": "surfaces-page-1-12"
            }
          }
        ]
      }
    ]
  },
  "reading": {
    "blur": 48
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.08080119,
        "chroma": {
          "delta": -0.3367147
        },
        "hue": {
          "delta": 148.60197017
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.30949348,
        "chroma": {
          "delta": -0.11046832
        },
        "hue": {
          "delta": -142.99335638
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.75510588,
        "chroma": {
          "delta": 0.20161019
        },
        "hue": {
          "delta": 17.43403585
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.95784519,
        "chroma": {
          "delta": 0.2457252
        },
        "hue": {
          "delta": -10.93070528
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#fae6f2")
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#660e43")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.4321,
        "chroma": {
          "delta": -0.1465
        },
        "hue": {
          "delta": 136.5
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#6aba45")
      }
    },
    "surfaces-page-1-4": {
      "name": "Page · Layer 1 · Color 4",
      "source": {
        "kind": "literal",
        "value": literal("#ffb829")
      }
    },
    "surfaces-page-1-6": {
      "name": "Page · Layer 1 · Color 6",
      "source": {
        "kind": "tone",
        "at": 0.531,
        "chroma": {
          "delta": 0.3277
        },
        "hue": {
          "delta": 49.58
        }
      }
    },
    "surfaces-page-1-8": {
      "name": "Page · Layer 1 · Color 8",
      "source": {
        "kind": "tone",
        "at": 0.6848,
        "chroma": {
          "delta": 0.3062
        },
        "hue": {
          "delta": 23.96
        }
      }
    },
    "surfaces-page-1-10": {
      "name": "Page · Layer 1 · Color 10",
      "source": {
        "kind": "tone",
        "at": 0.9081,
        "chroma": {
          "delta": 0.0702
        },
        "hue": {
          "delta": -25.86
        }
      }
    },
    "surfaces-page-1-12": {
      "name": "Page · Layer 1 · Color 12",
      "source": {
        "kind": "literal",
        "value": literal("#009ddb")
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#90cd7b")
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#0c759f")
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#0465af")
      }
    }
  }
} satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.285,
    maxDeltaEOk: 0.000021,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
