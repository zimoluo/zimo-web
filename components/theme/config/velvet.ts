const velvetConfig: ThemeDataConfig = {
  palette: {
    primary: [233, 221, 236],
    saturated: [195, 159, 209],
    pastel: [143, 83, 165],
    light: [83, 43, 99],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { at: 25, color: [73, 45, 102], opacity: 1, isWidgetOpacity: true },
          { at: 100, color: [64, 38, 83], opacity: 0.8, isWidgetOpacity: true },
        ],
        angle: 0,
      },
    ],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { at: 15, color: [85, 58, 124], opacity: 1 },
          { at: 90, color: [55, 37, 81], opacity: 1 },
        ],
        posX: 50,
        posY: 100,
        isCircle: true,
        sizeKeyword: "farthest-side",
      },
    ],
  },
  siteThemeColor: "#372551",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#583175", offset: 0 },
          { color: "#8e66c3", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "velvet",
};

export default velvetConfig;
