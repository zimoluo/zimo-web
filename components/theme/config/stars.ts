const starsConfig: ThemeDataConfig = {
  palette: {
    primary: [243, 253, 255],
    saturated: [203, 244, 250],
    pastel: [54, 130, 158],
    light: [22, 47, 70],
    page: [
      {
        type: "radial-gradient",
        sizeX: 90,
        sizeY: 100,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [15, 37, 64],
            opacity: 1,
            at: 0,
          },
          {
            color: [26, 28, 43],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: 90,
        sizeY: 100,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [24, 46, 74],
            opacity: 0.5,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [28, 41, 59],
            opacity: 0.5,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#0f2540",
  favicon: {
    mode: "separate",
    outline: "#e8fcff",
    gradient: [
      {
        stops: [
          {
            color: "#162f46",
            offset: 0,
          },
          {
            color: "#203b5c",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "stars",
  misc: {
    readingBlur: 12,
  },
};

export default starsConfig;
