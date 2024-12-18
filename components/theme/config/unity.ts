const unityConfig: ThemeDataConfig = {
  palette: {
    primary: [14, 59, 108],
    saturated: [23, 115, 176],
    pastel: [255, 220, 151],
    light: [255, 252, 243],
    page: [
      {
        type: "conic-gradient",
        stops: [
          { color: [247, 254, 255], opacity: 1, at: 0 },
          { color: [255, 241, 254], opacity: 1, at: 33.3 },
          { color: [255, 254, 242], opacity: 1, at: 66.7 },
          { color: [247, 254, 255], opacity: 1, at: 100 },
        ],
        posX: 50,
        posY: 50,
        angle: 120,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [234, 250, 255], opacity: 1, isWidgetOpacity: true, at: 0 },
          { color: [255, 234, 249], opacity: 1, isWidgetOpacity: true, at: 50 },
          {
            color: [255, 251, 222],
            opacity: 1,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        linearGradientKeyword: true,
        linearHorizontalOrientation: "right",
        linearVerticalOrientation: "top",
      },
    ],
  },
  siteThemeColor: "#ffd780",
  favicon: {
    mode: "separate",
    outline: "#0b3e76",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#ffe7a7" },
          { offset: 1, color: "#fff1dd" },
        ],
      },
      {
        stops: [
          { offset: 0, color: "#95caff" },
          { offset: 1, color: "#e2f1ff" },
        ],
      },
      {
        stops: [
          { offset: 0.013, color: "#fd9bff" },
          { offset: 1, color: "#fadfff" },
        ],
      },
    ],
  },
};

export default unityConfig;
