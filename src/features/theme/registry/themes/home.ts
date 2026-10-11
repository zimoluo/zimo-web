import { literal } from "../../model/literal";
import type { ThemeSource } from "../../model/types";

export default {
    formatVersion: 2,
    id: "home",
    name: "Home",
    ramp: {
      hue: 0,
      chroma: 0,
      lightest: 1,
      darkest: 0.3092
    },
    schemes: {
      kind: "single",
      scheme: "light",
      roles: {
        text: {"kind":"tone","at":1,"chroma":{"delta":1.8e-7},"hue":{"delta":89.87556314}},
        textMuted: {"kind":"tone","at":0.9005083,"chroma":{"delta":1.8e-7},"hue":{"delta":89.8755633}},
        line: {
          kind: "alias",
          of: "textMuted"
        },
        fill: {"kind":"tone","at":0.12424938,"chroma":{"delta":3.5e-7},"hue":{"delta":89.87556321}},
        panel: {"kind":"tone","at":0.02394988,"chroma":{"delta":0.00000196},"hue":{"delta":89.87556322}},
        edge: { kind: "literal", value: literal("#f0f0f0") },
        shade: { kind: "literal", value: literal("#3a3a3a") },
        accent: {
          kind: "alias",
          of: "textMuted"
        },
        brand: {
          kind: "tone",
          at: 0.1242,
          hue: {
            delta: 89.88
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
                color: { kind: "literal", value: literal("#fcfcfc") }
              },
              {
                at: 100,
                color: { kind: "literal", value: literal("#fcfcfc") }
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
                at: 20,
                color: { kind: "literal", value: literal("#f6f6f6") },
                binding: "scaled"
              },
              {
                at: 80,
                color: { kind: "literal", value: literal("#fdfdfd") },
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
          id: "home"
        }
      ]
    },
    mark: {
      mode: "split",
      gradients: [
        {
          angle: 90,
          stops: [
            {
              offset: 0,
              color: { kind: "literal", value: literal("#cacaca") }
            },
            {
              offset: 0.35,
              color: { kind: "literal", value: literal("#f5f5f5") }
            },
            {
              offset: 1,
              color: { kind: "literal", value: literal("#ffffff") }
            }
          ]
        }
      ]
    }
  } satisfies ThemeSource;

export const migrationReport = {
    scheme: "light",
    purity: 0.501,
    maxDeltaEOk: 0.000032,
    flags: [
      "achromatic",
      "line-defaulted",
      "accent-defaulted",
      "literal-stops",
      "dark-unreviewed"
    ]
  } as const;
