const cubisticConfig: ThemeDataConfig = {
  palette: {
    primary: [246, 246, 246],
    saturated: [212, 212, 212],
    pastel: [141, 141, 141],
    light: [128, 128, 128],
    page: [
      {
        type: "repeating-conic-gradient",
        posX: 43,
        posY: 62,
        sizeX: 70,
        sizeY: 70,
        angle: 45,
        stops: [
          { color: [126, 126, 126], opacity: 1, at: 20 },
          { color: [153, 153, 153], opacity: 1, at: 50 },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        posX: 50,
        posY: 50,
        sizeX: 70,
        sizeY: 70,
        angle: 45,
        stops: [
          { color: [137, 137, 137], opacity: 1, at: 100 },
          { color: [144, 144, 144], opacity: 1, at: 0 },
        ],
      },
    ],
    widget: [
      {
        type: "repeating-linear-gradient",
        posX: 50,
        posY: 100,
        sizeX: 80,
        sizeY: 120,
        angle: 210,
        stops: [
          {
            color: [143, 143, 143],
            opacity: 0.1,
            isWidgetOpacity: true,
            at: 25,
          },
          {
            color: [110, 110, 110],
            opacity: 0.15,
            isWidgetOpacity: true,
            at: 55,
          },
        ],
      },
      {
        type: "repeating-linear-gradient",
        posX: 50,
        posY: 100,
        sizeX: 80,
        sizeY: 120,
        angle: 150,
        stops: [
          {
            color: [143, 143, 143],
            opacity: 0.2,
            isWidgetOpacity: true,
            at: 25,
          },
          {
            color: [110, 110, 110],
            opacity: 0.2,
            isWidgetOpacity: true,
            at: 55,
          },
        ],
      },
      {
        type: "linear-gradient",
        posX: 50,
        posY: 100,
        sizeX: 80,
        sizeY: 120,
        angle: 150,
        stops: [
          {
            color: [143, 143, 143],
            opacity: 0.69,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [116, 116, 116],
            opacity: 0.65,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#919191",
  favicon: { mode: "backdrop" },
};
export default cubisticConfig;
