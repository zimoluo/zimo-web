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
          { color: [245, 253, 255], opacity: 1, isWidgetOpacity: true, at: 0 },
          { color: [255, 248, 253], opacity: 1, isWidgetOpacity: true, at: 50 },
          {
            color: [255, 254, 246],
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
          { offset: 0, color: "#ffe18f" },
          { offset: 1, color: "#ffe6c3" },
        ],
      },
      {
        stops: [
          { offset: 0, color: "#5daeff" },
          { offset: 1, color: "#9ecfff" },
        ],
      },
      {
        stops: [
          { offset: 0, color: "#fd7bff" },
          { offset: 1, color: "#f2b3ff" },
        ],
      },
    ],
  },
};

export default unityConfig;
