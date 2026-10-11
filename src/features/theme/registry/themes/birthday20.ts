import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "birthday20",
    name: "Birthday20",
    ramp: {
      hue: 146.8,
      chroma: 0.5438,
      lightest: 0.9878,
      darkest: 0.3807
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":0.99992321,"chroma":{"delta":0.10555145},"hue":{"delta":-0.15506729}},
        textMuted: {"kind":"tone","at":0.62294247,"chroma":{"delta":0.05566672},"hue":{"delta":1.87184991}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.26297591,"chroma":{"delta":-0.33215813},"hue":{"delta":-1.74255606}},
        panel: {"kind":"tone","at":0.01682223,"chroma":{"delta":0.17109847},"hue":{"delta":-3.18660178}},
        edge: { kind: "literal", value: literal("#e6fbe4") },
        shade: { kind: "literal", value: literal("#106b09") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0,
          chroma: {
            delta: 0.4562
          },
          hue: {
            delta: -1.38
          }
        }
      }
    },
    surfaceScheme: "light",
    surfaces: {
      page: {
        layers: [
          {
            id: "page-0",
            stops: [
              {
                at: 0,
                color: {
                  kind: "tone",
                  at: 0.0292,
                  chroma: {
                    delta: -0.0855
                  },
                  hue: {
                    delta: -8.99
                  }
                }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#f3fff3") }
              }
            ],
            kind: "radial",
            at: {
              x: 50,
              y: 100
            },
            extent: {
              kind: "circle",
              size: "farthest-corner"
            }
          }
        ]
      },
      widget: {
        layers: [
          {
            id: "widget-0",
            stops: [
              {
                at: 20,
                color: {
                  kind: "tone",
                  at: 0.0943,
                  chroma: {
                    delta: -0.2233
                  },
                  hue: {
                    delta: -6.13
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.041,
                  chroma: {
                    delta: -0.1604
                  },
                  hue: {
                    delta: -5.28
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
            }
          }
        ],
        alpha: 0.68,
        lens: {
          blur: 12,
          saturate: 1.15
        },
        variation: {
          rotate: 24,
          shift: 12,
          count: 8
        }
      }
    },
    backdrop: {
      scenes: [
        {
          id: "birthday20"
        }
      ]
    },
    mark: {
      mode: "unified",
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.2393,
                chroma: {
                  delta: -0.1607
                },
                hue: {
                  delta: -6.44
                }
              }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#e3ffeb") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.767,
    maxDeltaEOk: 0.000366,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
