const lollipopConfig: ThemeDataConfig = {
  palette: {
    primary: [121, 12, 63],
    saturated: [169, 61, 112],
    pastel: [229, 195, 211],
    light: [246, 234, 239],
    page: [
      {
        type: "repeating-conic-gradient",
        angle: 60,
        stops: [
          { color: [255, 234, 244], opacity: 1.0, at: 0 },
          { color: [255, 234, 244], opacity: 1.0, at: 7 },
          { color: [243, 214, 229], opacity: 1.0, at: 7.01 },
          { color: [243, 214, 229], opacity: 1.0, at: 14 },
        ],
        posX: 60,
        posY: 55,
        sizeX: 20,
        sizeY: 20,
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          { color: [255, 234, 244], opacity: 1.0, at: 0 },
          { color: [255, 234, 244], opacity: 1.0, at: 100 },
        ],
      },
    ],
    widget: [
      {
        type: "repeating-conic-gradient",
        angle: 30,
        posX: 100,
        posY: 0,
        stops: [
          {
            color: [255, 231, 243],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [254, 220, 238],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 5,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#c67199",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          {
            color: "#ffeaf4",
            offset: 0,
          },
          {
            color: "#ffe0f0",
            offset: 1,
          },
        ],
      },
    ],
  },
  misc: { readingBlur: 0 },
};

export default lollipopConfig;
