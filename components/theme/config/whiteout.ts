const whiteoutConfig: ThemeDataConfig = {
  palette: {
    primary: [51, 66, 99],
    saturated: [106, 121, 152],
    pastel: [178, 187, 215],
    light: [237, 241, 251],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [246, 249, 255], opacity: 1, at: 40 },
          { color: [233, 236, 250], opacity: 1, at: 98 },
        ],
        posX: 50,
        posY: 100,
        isCircle: true,
        sizeKeyword: "farthest-side",
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [227, 233, 247], opacity: 1, isWidgetOpacity: true, at: 15 },
          { color: [236, 240, 251], opacity: 1, isWidgetOpacity: true, at: 85 },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#e6eaf9",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#a4b2d0" },
          { offset: 0.66667, color: "#e4e8f6" },
        ],
      },
    ],
  },
  animatedBackgroundKey: "whiteout",
};

export default whiteoutConfig;
