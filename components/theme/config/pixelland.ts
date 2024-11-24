const pixellandConfig: ThemeDataConfig = {
  palette: {
    primary: [247, 253, 255],
    saturated: [179, 226, 255],
    pastel: [52, 147, 207],
    light: [21, 129, 212],
    page: [
      {
        type: "radial-gradient",
        sizeX: 80,
        sizeY: 70,
        posX: 5,
        posY: 10,
        stops: [
          {
            color: [66, 139, 255],
            opacity: 0.53,
            at: 0,
          },
          {
            color: [97, 171, 255],
            opacity: 0.87,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 80,
        sizeY: 120,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [199, 236, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [117, 198, 255],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: 80,
        sizeY: 90,
        posX: 50,
        posY: 100,
        stops: [
          {
            color: [138, 208, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [74, 174, 255],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#4f93ff",
  favicon: {
    mode: "custom",
    customKey: "pixelland",
  },
  animatedBackgroundKey: "pixelland",
  misc: {
    readingBlur: 8,
  },
};

export default pixellandConfig;
