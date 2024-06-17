const energizeConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 229, 255],
    light: [114, 11, 183],
    saturated: [227, 153, 242],
    middle: [214, 102, 237],
    pastel: [152, 28, 206],
    soft: [190, 51, 229],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [36, 9, 119], opacity: 1, at: 0 },
          { color: [36, 9, 119], opacity: 1, at: 32 },
          { color: [72, 7, 149], opacity: 1, at: 32.01 },
          { color: [72, 7, 149], opacity: 1, at: 37 },
          { color: [109, 5, 178], opacity: 1, at: 37.01 },
          { color: [109, 5, 178], opacity: 1, at: 40 },
          { color: [145, 2, 208], opacity: 1, at: 40.01 },
          { color: [145, 2, 208], opacity: 1, at: 53 },
          { color: [181, 0, 237], opacity: 1, at: 53.01 },
          { color: [181, 0, 237], opacity: 1, at: 100 },
        ],
        posX: 100,
        posY: 8,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 237, 229], opacity: 1, at: 20 },
          { color: [255, 251, 228], opacity: 1, at: 80 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { color: [36, 9, 119], opacity: 1, at: 0, isWidgetOpacity: true },
          { color: [36, 9, 119], opacity: 1, at: 26, isWidgetOpacity: true },
          { color: [72, 7, 149], opacity: 1, at: 26.01, isWidgetOpacity: true },
          { color: [72, 7, 149], opacity: 1, at: 31, isWidgetOpacity: true },
          {
            color: [109, 5, 178],
            opacity: 1,
            at: 31.01,
            isWidgetOpacity: true,
          },
          { color: [109, 5, 178], opacity: 1, at: 34, isWidgetOpacity: true },
          {
            color: [145, 2, 208],
            opacity: 1,
            at: 34.01,
            isWidgetOpacity: true,
          },
          { color: [145, 2, 208], opacity: 1, at: 47, isWidgetOpacity: true },
          {
            color: [166, 0, 217],
            opacity: 1,
            at: 47.01,
            isWidgetOpacity: true,
          },
          { color: [166, 0, 217], opacity: 1, at: 100, isWidgetOpacity: true },
        ],
        posX: 30,
        posY: 70,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
  },
  siteThemeColor: "#c418e7",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#600ec3", offset: 0 },
          { color: "#d817ff", offset: 1 },
        ],
      },
    ],
  },
  misc: { readingBlur: 24 },
};

export default energizeConfig;
