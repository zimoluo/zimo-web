import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "penumbra",
  "name": "Penumbra",
  "ramp": {
    "hue": 277.62,
    "chroma": 0.0981,
    "lightest": 1,
    "darkest": 0.31
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
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 39.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-1"
              }
            },
            {
              "at": 40,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-1",
          "stops": [
            {
              "at": 24,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 41.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0
            },
            {
              "at": 42,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
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
              "at": 59.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-3-1"
              }
            },
            {
              "at": 60,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-3",
          "stops": [
            {
              "at": 36,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 61.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0
            },
            {
              "at": 62,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
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
              "at": 79.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-5-1"
              }
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-5",
          "stops": [
            {
              "at": 64,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 81.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0
            },
            {
              "at": 82,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-6",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-7-1"
              }
            },
            {
              "at": 99.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-7-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-7",
          "stops": [
            {
              "at": 64,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 101.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0
            },
            {
              "at": 102,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-8",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-9-1"
              }
            },
            {
              "at": 119.99,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-9-1"
              }
            },
            {
              "at": 120,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-9",
          "stops": [
            {
              "at": 64,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              }
            },
            {
              "at": 121.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-2-1"
              },
              "alpha": 0
            },
            {
              "at": 122,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-3"
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
            "kind": "circle",
            "size": "farthest-side"
          }
        },
        {
          "id": "page-10",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-11-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-11-1"
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
    },
    "page-reduced": {
      "layers": [
        {
          "id": "page-reduced-0",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-7-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-7-1"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 90
          }
        }
      ]
    }
  },
  "mark": {
    "mode": "backdrop"
  },
  "reading": {
    "blur": 8
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 0.0763085,
        "chroma": {
          "delta": -0.04182079
        },
        "hue": {
          "delta": 8.75474643
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.25 0.025 277.62)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.27914531,
        "chroma": {
          "delta": -0.00677016
        },
        "hue": {
          "delta": 0.98803799
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.44 0.045 277.62)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.66883785,
        "chroma": {
          "delta": 0.03288664
        },
        "hue": {
          "delta": -0.57829216
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.89 0.025 277.62)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.81404574,
        "chroma": {
          "delta": 0.01571529
        },
        "hue": {
          "delta": 0.0061945
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.975 0.009 277.62)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#efeff1")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.995 0.00235 277.62)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#313443")
      }
    },
    "brand": {
      "name": "Browser",
      "source": {
        "kind": "tone",
        "at": 0.9053,
        "chroma": {
          "delta": -0.016
        },
        "hue": {
          "delta": -4.25
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.95 0.015 277.62)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8049,
        "chroma": {
          "delta": -0.0055
        },
        "hue": {
          "delta": -1.23
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.81286 0.00873 276.39)")
        }
      }
    },
    "surfaces-page-1-3": {
      "name": "Page · Layer 1 · Color 3",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.78 0 89.88)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.0333
        },
        "hue": {
          "delta": -4.65
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.93714 0.00194 272.97)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.834,
        "chroma": {
          "delta": -0.0137
        },
        "hue": {
          "delta": -2.48
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.83209 0.00706 275.14)")
        }
      }
    },
    "surfaces-page-5-1": {
      "name": "Page · Layer 5 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.8691,
        "chroma": {
          "delta": -0.0148
        },
        "hue": {
          "delta": -3.29
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.85487 0.00596 274.33)")
        }
      }
    },
    "surfaces-page-7-1": {
      "name": "Page · Layer 7 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9053,
        "chroma": {
          "delta": -0.016
        },
        "hue": {
          "delta": -4.25
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.87795 0.00489 273.37)")
        }
      }
    },
    "surfaces-page-9-1": {
      "name": "Page · Layer 9 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9419,
        "chroma": {
          "delta": -0.0247
        },
        "hue": {
          "delta": -2
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.90097 0.00353 275.62)")
        }
      }
    },
    "surfaces-page-11-1": {
      "name": "Page · Layer 11 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.9745,
        "chroma": {
          "delta": -0.0372
        },
        "hue": {
          "delta": -4.62
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9213 0.0023 273)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "tone",
        "at": 0.765,
        "chroma": {
          "delta": -0.031
        },
        "hue": {
          "delta": -6.67
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.94388 0.02011 270.95)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "tone",
        "at": 0.8069,
        "hue": {
          "delta": -6.05
        }
      },
      "appearance": {
        "light": {
          "kind": "literal",
          "value": literal("oklch(0.9467 0.02522 271.57)")
        }
      }
    }
  },
  "appearance": {
    "light": {
      "mark": {
        "mode": "backdrop",
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
    purity: 0.961,
    maxDeltaEOk: 0.000032,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
