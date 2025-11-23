const birthday20Config: ThemeDataConfig = {
  palette: {
    primary: [37, 77, 42],
    saturated: [82, 146, 94],
    pastel: [180, 212, 180],
    light: [238, 253, 237],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { at: 20, color: [220, 241, 216], opacity: 1, isWidgetOpacity: true },
          { at: 80, color: [235, 248, 233], opacity: 1, isWidgetOpacity: true },
        ],
        angle: 0,
      },
    ],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { at: 0, color: [238, 250, 234], opacity: 1 },
          { at: 100, color: [243, 255, 243], opacity: 1 },
        ],
        posX: 50,
        posY: 100,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
  },
  siteThemeColor: "#f3fff3",
  favicon: {
    mode: "overall",
    gradient: [
      {
        stops: [
          { color: "#a9e09e", offset: 0 },
          { color: "#e3ffeb", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "birthday20",
};

export default birthday20Config;
