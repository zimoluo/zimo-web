const autumnalConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 241, 222],
    saturated: [211, 227, 228],
    pastel: [173, 122, 67],
    light: [224, 168, 90],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [3, 29, 68], opacity: 1, at: 0 },
          { color: [3, 29, 68], opacity: 1, at: 20 },
          { color: [4, 57, 94], opacity: 1, at: 20.01 },
          { color: [4, 57, 94], opacity: 1, at: 40 },
          { color: [112, 162, 136], opacity: 1, at: 40.01 },
          { color: [112, 162, 136], opacity: 1, at: 60 },
          { color: [218, 183, 133], opacity: 1, at: 60.01 },
          { color: [218, 183, 133], opacity: 1, at: 80 },
          { color: [213, 137, 111], opacity: 1, at: 80.01 },
          { color: [213, 137, 111], opacity: 1, at: 100 },
        ],
        linearGradientKeyword: true,
        linearHorizontalOrientation: "right",
        linearVerticalOrientation: "bottom",
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { color: [4, 57, 94], opacity: 1, at: 15 },
          { color: [4, 57, 94], opacity: 1, at: 85 },
        ],
        angle: 90,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [21, 89, 138], opacity: 1, at: 15 },
          { color: [21, 89, 138], opacity: 1, at: 85 },
        ],
        angle: 90,
      },
    ],
  },
  siteThemeColor: "#15598a",
  favicon: { mode: "backdrop" },
  misc: { readingBlur: 0 },
};

export default autumnalConfig;
