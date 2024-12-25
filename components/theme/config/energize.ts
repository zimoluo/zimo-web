const energizeConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 229, 255],
    saturated: [227, 153, 242],
    pastel: [152, 28, 206],
    light: [114, 11, 183],
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
          { color: [181, 0, 237], opacity: 1, at: 0 },
          { color: [181, 0, 237], opacity: 1, at: 100 },
        ],
        angle: 0,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            color: [145, 2, 208],
            opacity: 1,
            at: 0,
            isWidgetOpacity: true,
          },
          {
            color: [166, 0, 217],
            opacity: 1,
            at: 100,
            isWidgetOpacity: true,
          },
        ],
        angle: 45,
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
  misc: { readingBlur: 32 },
};

export default energizeConfig;
