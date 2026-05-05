const unityConfig: ThemeDataConfig = {
  palette: {
    primary: [14, 62, 114],
    saturated: [26, 121, 185],
    pastel: [115, 200, 236],
    light: [237, 247, 251],
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
          { color: [255, 251, 241], opacity: 1, isWidgetOpacity: true, at: 0 },
          {
            color: [255, 253, 246],
            opacity: 1,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        angle: 0,
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
