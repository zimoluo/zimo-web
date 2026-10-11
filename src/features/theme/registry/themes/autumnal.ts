import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "autumnal",
    name: "Autumnal",
    ramp: {
      hue: 74.32,
      chroma: 0.6395,
      lightest: 0.9642,
      darkest: 0.2385
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {"kind":"tone","at":0.00006964,"chroma":{"delta":0.36062616},"hue":{"delta":1.37239784}},
        textMuted: {"kind":"tone","at":0.09140764,"chroma":{"delta":-0.48961171},"hue":{"delta":127.05593904}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.47698389,"chroma":{"delta":0.05786428},"hue":{"delta":-7.83378953}},
        panel: {"kind":"tone","at":0.28516912,"chroma":{"delta":0.07116498},"hue":{"delta":-0.65415328}},
        edge: { kind: "literal", value: literal("#f9f1e6") },
        shade: { kind: "literal", value: literal("#644110") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.6952,
          chroma: {
            delta: 0.2626
          },
          hue: {
            delta: 171.22
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
                color: { kind: "literal", value: literal("#031d44") }
              },
              {
                at: 20,
                color: { kind: "literal", value: literal("#031d44") }
              },
              {
                at: 20.01,
                color: { kind: "literal", value: literal("#04395e") }
              },
              {
                at: 40,
                color: { kind: "literal", value: literal("#04395e") }
              },
              {
                at: 40.01,
                color: { kind: "literal", value: literal("#70a288") }
              },
              {
                at: 60,
                color: { kind: "literal", value: literal("#70a288") }
              },
              {
                at: 60.01,
                color: {
                  kind: "tone",
                  at: 0.2444,
                  chroma: {
                    delta: -0.1796
                  },
                  hue: {
                    delta: 1.82
                  }
                }
              },
              {
                at: 80,
                color: {
                  kind: "tone",
                  at: 0.2444,
                  chroma: {
                    delta: -0.1796
                  },
                  hue: {
                    delta: 1.82
                  }
                }
              },
              {
                at: 80.01,
                color: {
                  kind: "tone",
                  at: 0.3725,
                  chroma: {
                    delta: -0.1219
                  },
                  hue: {
                    delta: -34.68
                  }
                }
              },
              {
                at: 100,
                color: {
                  kind: "tone",
                  at: 0.3725,
                  chroma: {
                    delta: -0.1219
                  },
                  hue: {
                    delta: -34.68
                  }
                }
              }
            ],
            interpolation: {
              space: "srgb"
            },
            kind: "linear",
            direction: {
              kind: "corner",
              x: "right",
              y: "bottom"
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
                at: 15,
                color: { kind: "literal", value: literal("#15598a") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#15598a") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 90
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
      },
      "page-reduced": {
        layers: [
          {
            id: "page-reduced-0",
            stops: [
              {
                at: 15,
                color: { kind: "literal", value: literal("#04395e") }
              },
              {
                at: 85,
                color: { kind: "literal", value: literal("#04395e") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 90
            }
          }
        ]
      }
    },
    mark: {
      mode: "backdrop"
    },
    reading: {
      blur: 0
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.409,
    maxDeltaEOk: 0.00003,
    flags: [
      "line-defaulted",
      "accent-defaulted",
      "srgb-interpolation",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
