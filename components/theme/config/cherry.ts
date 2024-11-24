const cherryConfig: ThemeDataConfig = {
  palette: {
    primary: [128, 8, 48],
    saturated: [196, 26, 134],
    pastel: [254, 179, 219],
    light: [255, 235, 238],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [207, 212, 197], opacity: 1, at: 0 },
          { color: [207, 212, 197], opacity: 1, at: 20 },
          { color: [238, 207, 212], opacity: 1, at: 20.01 },
          { color: [238, 207, 212], opacity: 1, at: 40 },
          { color: [239, 185, 203], opacity: 1, at: 40.01 },
          { color: [239, 185, 203], opacity: 1, at: 60 },
          { color: [230, 173, 236], opacity: 1, at: 60.01 },
          { color: [230, 173, 236], opacity: 1, at: 80 },
          { color: [194, 135, 232], opacity: 1, at: 80.01 },
          { color: [194, 135, 232], opacity: 1, at: 100 },
        ],
        linearGradientKeyword: true,
        linearHorizontalOrientation: "right",
        linearVerticalOrientation: "top",
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { color: [238, 207, 212], opacity: 1, at: 15 },
          { color: [238, 207, 212], opacity: 1, at: 85 },
        ],
        angle: 90,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 235, 249], opacity: 1, isWidgetOpacity: true, at: 10 },
          { color: [255, 235, 249], opacity: 1, at: 60 },
        ],
        angle: 90,
      },
    ],
  },
  siteThemeColor: "#efb9cb",
  favicon: { mode: "backdrop" },
  misc: { readingBlur: 0 },
};

export default cherryConfig;
