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
          { color: [243, 253, 255], opacity: 1, at: 0 },
          { color: [255, 254, 238], opacity: 1, at: 25 },
          { color: [243, 253, 255], opacity: 1, at: 50 },
          { color: [255, 254, 238], opacity: 1, at: 75 },
          { color: [243, 253, 255], opacity: 1, at: 100 },
        ],
        posX: 50,
        posY: 50,
        angle: 45,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 252, 243], opacity: 1, isWidgetOpacity: true, at: 0 },
          {
            color: [255, 250, 232],
            opacity: 1,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        angle: 45,
      },
    ],
  },
  siteThemeColor: "#ffe5ac",
  favicon: {
    mode: "separate",
    outline: "#0c478b",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#a6ceff" },
          { offset: 1, color: "#def6ff" },
        ],
      },
      {
        stops: [
          { offset: 0, color: "#ffcf94" },
          { offset: 1, color: "#fff8ed" },
        ],
      },
      {
        stops: [
          { offset: 0, color: "#ffcf94" },
          { offset: 1, color: "#fff8ed" },
        ],
      },
    ],
  },
};

export default unityConfig;
