const underwaterConfig: ThemeDataConfig = {
  palette: {
    primary: [228, 250, 251],
    saturated: [155, 235, 242],
    pastel: [22, 180, 204],
    light: [16, 129, 156],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { at: 20, color: [12, 121, 148], opacity: 1, isWidgetOpacity: true },
          { at: 80, color: [10, 101, 136], opacity: 1, isWidgetOpacity: true },
        ],
        angle: 30,
      },
    ],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { at: 13, color: [17, 47, 77], opacity: 1 },
          { at: 55, color: [64, 135, 167], opacity: 1 },
          { at: 100, color: [121, 196, 218], opacity: 1 },
        ],
        posX: -4,
        posY: 80,
        sizeX: 130,
        sizeY: 100,
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { at: 20, color: [14, 117, 157], opacity: 1 },
          { at: 80, color: [11, 137, 168], opacity: 1 },
        ],
        angle: 30,
      },
    ],
  },
  siteThemeColor: "#56aed1",
  favicon: {
    mode: "backdrop",
  },
  animatedBackgroundKey: "underwater",
};

export default underwaterConfig;
