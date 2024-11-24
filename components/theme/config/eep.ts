const eepConfig: ThemeDataConfig = {
  palette: {
    primary: [14, 100, 65],
    saturated: [27, 172, 111],
    pastel: [183, 240, 216],
    light: [230, 250, 241],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { color: [224, 214, 255], at: 0, opacity: 1, isWidgetOpacity: true },
          {
            color: [255, 224, 224],
            at: 100,
            opacity: 1,
            isWidgetOpacity: true,
          },
        ],
        colorInterpolation: {
          colorSpace: "hsl",
          hueInterpolationMethod: "longer",
        },
        posX: 50,
        posY: 50,
        isCircle: true,
        sizeKeyword: "farthest-side",
      },
    ],
    page: [
      {
        type: "repeating-radial-gradient",
        stops: [
          { color: [255, 186, 186], at: 0, opacity: 1 },
          { color: [255, 216, 173], at: 5, opacity: 1 },
          { color: [255, 252, 173], at: 10, opacity: 1 },
          { color: [163, 255, 163], at: 15, opacity: 1 },
          { color: [163, 255, 235], at: 20, opacity: 1 },
          { color: [163, 220, 255], at: 25, opacity: 1 },
          { color: [206, 163, 255], at: 30, opacity: 1 },
          { color: [255, 186, 186], at: 35, opacity: 1 },
        ],
        posX: 50,
        posY: 50,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
  },
  siteThemeColor: "#fefefe",
  favicon: {
    mode: "separate",
    outline: "#117c4c",
    gradient: [
      {
        stops: [
          { color: "#117c4c", offset: 0 },
          { color: "#3EDD9B", offset: 1 },
        ],
      },
      {
        stops: [
          { color: "#115d7d", offset: 0 },
          { color: "#3ebede", offset: 1 },
        ],
      },
      {
        stops: [
          { color: "#4d7d11", offset: 0.001 },
          { color: "#a3de3e", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "eep",
};

export default eepConfig;
