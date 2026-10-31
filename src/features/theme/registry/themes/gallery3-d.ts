import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
  "formatVersion": 2,
  "id": "gallery3-d",
  "name": "Gallery 3D",
  "ramp": {
    "hue": 330,
    "chroma": 0.1712,
    "lightest": 1,
    "darkest": 0.3177
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
              },
              "alpha": 0.08
            },
            {
              "at": 44,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 19.3,
            "y": 100.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.05
            },
            {
              "at": 39.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 22.3,
            "y": 8.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.12
            },
            {
              "at": 41.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 53.5,
            "y": 53.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.07
            },
            {
              "at": 29.6,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 100.1,
            "y": 16.9
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.03
            },
            {
              "at": 38,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 77.1,
            "y": 82.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "page-5",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-6-1"
              },
              "alpha": 0.07
            },
            {
              "at": 47.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 22.3,
            "y": 8.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.1
            },
            {
              "at": 46.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 13.3,
            "y": 97.3
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "page-7",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-8-1"
              },
              "alpha": 0.11
            },
            {
              "at": 40.1,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 11.3,
            "y": 45.1
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.09
            },
            {
              "at": 43.4,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 41.4,
            "y": 62.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "page-9",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-10-1"
              },
              "alpha": 0.11
            },
            {
              "at": 41.2,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 70.1,
            "y": 10.1
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
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
              },
              "alpha": 0.04
            },
            {
              "at": 30.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 103.2,
            "y": 76.2
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "page-11",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-12-1"
              }
            },
            {
              "at": 100,
              "color": {
                "kind": "channel",
                "channel": "surfaces-page-12-2"
              }
            }
          ],
          "kind": "linear",
          "direction": {
            "kind": "angle",
            "deg": 180
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
              "alpha": 0.24,
              "binding": "scaled"
            },
            {
              "at": 32.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 53.5,
            "y": 53.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-1",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-2-1"
              },
              "alpha": 0.09,
              "binding": "scaled"
            },
            {
              "at": 37.3,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 50.7,
            "y": 98.5
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-2",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-3-1"
              },
              "alpha": 0.15,
              "binding": "scaled"
            },
            {
              "at": 39.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 22.3,
            "y": 8.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-3",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-4-1"
              },
              "alpha": 0.06,
              "binding": "scaled"
            },
            {
              "at": 24.1,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 54.8,
            "y": 77
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-4",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-5-1"
              },
              "alpha": 0.15,
              "binding": "scaled"
            },
            {
              "at": 21.6,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 100.1,
            "y": 16.9
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-5",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-6-1"
              },
              "alpha": 0.21,
              "binding": "scaled"
            },
            {
              "at": 31.4,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 47.5,
            "y": 82.9
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-6",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-7-1"
              },
              "alpha": 0.07,
              "binding": "scaled"
            },
            {
              "at": 27,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 77.1,
            "y": 82.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-7",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-8-1"
              },
              "alpha": 0.21,
              "binding": "scaled"
            },
            {
              "at": 21.8,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 75.7,
            "y": 53.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-8",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-9-1"
              },
              "alpha": 0.2,
              "binding": "scaled"
            },
            {
              "at": 39.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 13.3,
            "y": 97.3
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-9",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-10-1"
              },
              "alpha": 0.23,
              "binding": "scaled"
            },
            {
              "at": 27.7,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 73.1,
            "y": 47.7
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-10",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-11-1"
              },
              "alpha": 0.17,
              "binding": "scaled"
            },
            {
              "at": 35,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 19.3,
            "y": 100.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-11",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-12-1"
              },
              "alpha": 0.21,
              "binding": "scaled"
            },
            {
              "at": 20.1,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 18,
            "y": 36.7
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-12",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-13-1"
              },
              "alpha": 0.23,
              "binding": "scaled"
            },
            {
              "at": 31.1,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 11.3,
            "y": 45.1
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-13",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-14-1"
              },
              "alpha": 0.1,
              "binding": "scaled"
            },
            {
              "at": 21.9,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 8.6,
            "y": 16.2
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-14",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-15-1"
              },
              "alpha": 0.18,
              "binding": "scaled"
            },
            {
              "at": 36.4,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 41.4,
            "y": 62.6
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-15",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-16-1"
              },
              "alpha": 0.1,
              "binding": "scaled"
            },
            {
              "at": 36,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 91.2,
            "y": 68.9
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-16",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-17-1"
              },
              "alpha": 0.22,
              "binding": "scaled"
            },
            {
              "at": 32.2,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 70.1,
            "y": 10.1
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-17",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-18-1"
              },
              "alpha": 0.24,
              "binding": "scaled"
            },
            {
              "at": 31.2,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 83.9,
            "y": 27.2
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-18",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-19-1"
              },
              "alpha": 0.09,
              "binding": "scaled"
            },
            {
              "at": 23.5,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 103.2,
            "y": 76.2
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-19",
          "stops": [
            {
              "at": 0,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-20-1"
              },
              "alpha": 0.23,
              "binding": "scaled"
            },
            {
              "at": 35.3,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-1-2"
              },
              "alpha": 0
            }
          ],
          "kind": "radial",
          "at": {
            "x": 84,
            "y": 58.5
          },
          "extent": {
            "kind": "circle",
            "size": "farthest-corner"
          }
        },
        {
          "id": "widget-20",
          "stops": [
            {
              "at": 20,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-21-1"
              },
              "binding": "scaled"
            },
            {
              "at": 80,
              "color": {
                "kind": "channel",
                "channel": "surfaces-widget-21-2"
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
        "id": "gallery3D"
      }
    ]
  },
  "mark": {
    "mode": "scene",
    "sceneId": "gallery3D"
  },
  "channels": {
    "text": {
      "name": "Text",
      "source": {
        "kind": "tone",
        "at": 1,
        "chroma": {
          "delta": -0.13515833
        },
        "hue": {
          "delta": -55.25315419
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.94 0.025 330)")
        }
      }
    },
    "text-muted": {
      "name": "Secondary text",
      "source": {
        "kind": "tone",
        "at": 0.72877036,
        "chroma": {
          "delta": -0.07542674
        },
        "hue": {
          "delta": -9.39874203
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 330)")
        }
      }
    },
    "fill": {
      "name": "Fill",
      "source": {
        "kind": "tone",
        "at": 0.40575289,
        "chroma": {
          "delta": -0.08128828
        },
        "hue": {
          "delta": 84.84304105
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36 0.032 330)")
        }
      }
    },
    "panel": {
      "name": "Panel",
      "source": {
        "kind": "tone",
        "at": 0.0726915,
        "chroma": {
          "delta": 0.29185588
        },
        "hue": {
          "delta": -38.04959721
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22 0.022 330)")
        }
      }
    },
    "edge": {
      "name": "Highlight",
      "source": {
        "kind": "literal",
        "value": literal("#edecf4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.77 0.04 330)")
        }
      }
    },
    "shade": {
      "name": "Shadow",
      "source": {
        "kind": "literal",
        "value": literal("#2a254f")
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
        "at": 0.0048,
        "chroma": {
          "delta": -0.1712
        },
        "hue": {
          "delta": 119.88
        }
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.28 0.03 330)")
        }
      }
    },
    "surfaces-page-1-1": {
      "name": "Page · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f2b6f4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.31834 0.11435 325.4)")
        }
      }
    },
    "surfaces-page-1-2": {
      "name": "Page · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.16889 0 89.88)")
        }
      }
    },
    "surfaces-page-2-1": {
      "name": "Page · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#d5a9f5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.36813 0.15629 310.36)")
        }
      }
    },
    "surfaces-page-3-1": {
      "name": "Page · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f7e1d1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24557 0.03967 58.38)")
        }
      }
    },
    "surfaces-page-4-1": {
      "name": "Page · Layer 4 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#c3f3a6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25677 0.03988 134.16)")
        }
      }
    },
    "surfaces-page-5-1": {
      "name": "Page · Layer 5 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#a9c7f2")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.34653 0.09626 257.35)")
        }
      }
    },
    "surfaces-page-6-1": {
      "name": "Page · Layer 6 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f6a9d0")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.34886 0.12188 347.83)")
        }
      }
    },
    "surfaces-page-7-1": {
      "name": "Page · Layer 7 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#c6f5a5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.25066 0.04146 133.01)")
        }
      }
    },
    "surfaces-page-8-1": {
      "name": "Page · Layer 8 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f9badc")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.3127 0.11442 345.43)")
        }
      }
    },
    "surfaces-page-9-1": {
      "name": "Page · Layer 9 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#a8f7b6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.2606 0.05208 149.16)")
        }
      }
    },
    "surfaces-page-10-1": {
      "name": "Page · Layer 10 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#def0aa")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.24379 0.02435 119.95)")
        }
      }
    },
    "surfaces-page-11-1": {
      "name": "Page · Layer 11 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f5b5c7")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.33186 0.10697 0.39)")
        }
      }
    },
    "surfaces-page-12-1": {
      "name": "Page · Layer 12 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fefefe")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.17187 0 89.88)")
        }
      }
    },
    "surfaces-page-12-2": {
      "name": "Page · Layer 12 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#f2f2f2")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20774 0 89.88)")
        }
      }
    },
    "surfaces-widget-1-1": {
      "name": "Widget · Layer 1 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f7e1d1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.1984 0.03239 58.38)")
        }
      }
    },
    "surfaces-widget-1-2": {
      "name": "Widget · Layer 1 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#ffffff")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18 0 89.88)")
        }
      }
    },
    "surfaces-widget-2-1": {
      "name": "Widget · Layer 2 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f7c5ec")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20906 0.055 334.03)")
        }
      }
    },
    "surfaces-widget-3-1": {
      "name": "Widget · Layer 3 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f6a9d0")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22319 0.055 347.83)")
        }
      }
    },
    "surfaces-widget-4-1": {
      "name": "Widget · Layer 4 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f3c5f6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20914 0.055 324.28)")
        }
      }
    },
    "surfaces-widget-5-1": {
      "name": "Widget · Layer 5 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#c3f3a6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20109 0.055 134.16)")
        }
      }
    },
    "surfaces-widget-6-1": {
      "name": "Widget · Layer 6 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#a3eef6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20331 0.03468 204.36)")
        }
      }
    },
    "surfaces-widget-7-1": {
      "name": "Widget · Layer 7 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#a9c7f2")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.22263 0.055 257.35)")
        }
      }
    },
    "surfaces-widget-8-1": {
      "name": "Widget · Layer 8 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#b2f5f1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19811 0.03407 191.42)")
        }
      }
    },
    "surfaces-widget-9-1": {
      "name": "Widget · Layer 9 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#c6f5a5")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19962 0.055 133.01)")
        }
      }
    },
    "surfaces-widget-10-1": {
      "name": "Widget · Layer 10 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f9b6b0")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21918 0.055 24.67)")
        }
      }
    },
    "surfaces-widget-11-1": {
      "name": "Widget · Layer 11 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f2b6f4")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21587 0.055 325.4)")
        }
      }
    },
    "surfaces-widget-12-1": {
      "name": "Widget · Layer 12 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#c8f7ef")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19411 0.03442 183.77)")
        }
      }
    },
    "surfaces-widget-13-1": {
      "name": "Widget · Layer 13 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f9badc")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21451 0.055 345.43)")
        }
      }
    },
    "surfaces-widget-14-1": {
      "name": "Widget · Layer 14 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#fac7c1")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21051 0.055 26.11)")
        }
      }
    },
    "surfaces-widget-15-1": {
      "name": "Widget · Layer 15 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#a8f7b6")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20201 0.055 149.16)")
        }
      }
    },
    "surfaces-widget-16-1": {
      "name": "Widget · Layer 16 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f8b8cf")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21655 0.055 355.56)")
        }
      }
    },
    "surfaces-widget-17-1": {
      "name": "Widget · Layer 17 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#def0aa")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.19798 0.04698 119.95)")
        }
      }
    },
    "surfaces-widget-18-1": {
      "name": "Widget · Layer 18 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#e6face")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.1898 0.04926 127.45)")
        }
      }
    },
    "surfaces-widget-19-1": {
      "name": "Widget · Layer 19 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#f5b5c7")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.21911 0.055 0.39)")
        }
      }
    },
    "surfaces-widget-20-1": {
      "name": "Widget · Layer 20 · Color 1",
      "source": {
        "kind": "literal",
        "value": literal("#b2f2bf")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.20286 0.055 150.4)")
        }
      }
    },
    "surfaces-widget-21-1": {
      "name": "Widget · Layer 21 · Color 1",
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
    "surfaces-widget-21-2": {
      "name": "Widget · Layer 21 · Color 2",
      "source": {
        "kind": "literal",
        "value": literal("#fefefe")
      },
      "appearance": {
        "dark": {
          "kind": "literal",
          "value": literal("oklch(0.18071 0 89.88)")
        }
      }
    }
  },
  "appearance": {
    "dark": {
      "backdrop": {
        "scenes": [
          {
            "id": "gallery3D",
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
        "mode": "scene",
        "sceneId": "gallery3D",
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
    purity: 0.507,
    maxDeltaEOk: 0.000035,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
