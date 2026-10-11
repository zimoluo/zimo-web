import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "gallery",
    name: "Gallery",
    ramp: {
      hue: 0,
      chroma: 0,
      lightest: 0.994,
      darkest: 0.6401
    },
    schemes: {
      kind: "single",
      scheme: "dark",
      roles: {
        text: {
          kind: "tone",
          at: 0,
          hue: {
            delta: 89.88
          }
        },
        textMuted: {
          kind: "tone",
          at: 0.3215,
          hue: {
            delta: 89.88
          }
        },
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {
          kind: "tone",
          at: 0.887,
          hue: {
            delta: 89.88
          }
        },
        panel: {
          kind: "tone",
          at: 1,
          hue: {
            delta: 89.88
          }
        },
        edge: 0,
        shade: { kind: "literal", value: literal("#3a3a3a") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.7257,
          hue: {
            delta: 89.88
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
                color: { kind: "literal", value: literal("#a8a8a8") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#a8a8a8") }
              }
            ],
            kind: "linear",
            direction: {
              kind: "angle",
              deg: 0
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
                at: 0,
                color: { kind: "literal", value: literal("#a1a1a1") },
                alpha: 0.78,
                binding: "scaled"
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#a1a1a1") },
                alpha: 0.78,
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
          id: "gallery"
        }
      ]
    },
    mark: {
      mode: "scene",
      sceneId: "gallery"
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "dark",
    purity: 0.501,
    maxDeltaEOk: 0.000048,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "light-unreviewed"
    ]
  } as const;
