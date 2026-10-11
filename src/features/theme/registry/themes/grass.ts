import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "grass",
    name: "Grass",
    ramp: {
      hue: 136.39,
      chroma: 0.775,
      lightest: 0.9956,
      darkest: 0.5159
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0,"chroma":{"delta":0.2227848},"hue":{"delta":3.05190282}},
        textMuted: {"kind":"tone","at":0.17901006,"chroma":{"delta":-0.46483191},"hue":{"delta":-1.78717449}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.62762248,"chroma":{"delta":0.0981935},"hue":{"delta":0.10939232}},
        panel: {"kind":"tone","at":0.90453605,"chroma":{"delta":0.14157426},"hue":{"delta":0.41677955}},
        edge: { kind: "literal", value: literal("#edf9e6") },
        shade: { kind: "literal", value: literal("#2f6311") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.9503,
          chroma: {
            delta: 0.1268
          }
        }
      }
    },
    surfaceScheme: "dark",
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
                  at: 0.9757,
                  chroma: {
                    delta: 0.1523
                  },
                  hue: {
                    delta: 0.59
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.8808,
                  chroma: {
                    delta: 0.1902
                  },
                  hue: {
                    delta: 1.29
                  }
                }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
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
                  at: 0.9503,
                  chroma: {
                    delta: 0.1268
                  }
                },
                binding: "scaled"
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.9274,
                  chroma: {
                    delta: 0.1861
                  },
                  hue: {
                    delta: 1.28
                  }
                },
                binding: "scaled"
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 45
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
          id: "grass"
        }
      ]
    },
    mark: {
      mode: "split",
      stroke: {
        kind: "tone",
        at: 0,
        chroma: {
          delta: 0.225
        },
        hue: {
          delta: 3.05
        }
      },
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: {
                kind: "tone",
                at: 0.9999,
                chroma: {
                  delta: 0.2073
                },
                hue: {
                  delta: 5.62
                }
              }
            },
            {
              offset: 1,
              color: {
                kind: "tone",
                at: 0.5044,
                chroma: {
                  delta: -0.0238
                },
                hue: {
                  delta: -7.34
                }
              }
            }
          ]
        }
      ]
    },
    reading: {
      blur: 12
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.782,
    maxDeltaEOk: 0.001639,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "light-unreviewed"
    ]
  } as const;
