const vibrantConfig: ThemeDataConfig = {
  palette: {
    primary: [234, 247, 236],
    saturated: [161, 217, 234],
    pastel: [233, 51, 78],
    light: [180, 29, 119],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            at: 10,
            color: [12, 117, 159],
            opacity: 0.75,
            isWidgetOpacity: true,
          },
          { at: 90, color: [4, 101, 175], opacity: 0.8, isWidgetOpacity: true },
        ],
        angle: 70,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 255, 255], at: 19.99, opacity: 0 },
          { color: [106, 186, 69], at: 20, opacity: 1 },
          { color: [106, 186, 69], at: 27, opacity: 1 },
          { color: [255, 184, 41], at: 27.01, opacity: 1 },
          { color: [255, 184, 41], at: 33.99, opacity: 1 },
          { color: [255, 128, 29], at: 34, opacity: 1 },
          { color: [255, 128, 29], at: 40.99, opacity: 1 },
          { color: [253, 56, 61], at: 41, opacity: 1 },
          { color: [253, 56, 61], at: 47.99, opacity: 1 },
          { color: [170, 59, 150], at: 48, opacity: 1 },
          { color: [170, 59, 150], at: 54.99, opacity: 1 },
          { color: [0, 157, 219], at: 55, opacity: 1 },
          { color: [0, 157, 219], at: 61.99, opacity: 1 },
          { color: [255, 255, 255], at: 62, opacity: 0 },
        ],
        angle: 155,
      },
      {
        type: "linear-gradient",
        stops: [
          { at: 15, color: [144, 205, 123], opacity: 1 },
          { at: 85, color: [144, 205, 123], opacity: 1 },
        ],
        angle: 0,
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { at: 15, color: [144, 205, 123], opacity: 1 },
          { at: 85, color: [144, 205, 123], opacity: 1 },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#90cd7b",
  favicon: {
    mode: "overall",
    gradient: [
      {
        stops: [
          { offset: 0, color: "#6aba45" },
          { offset: 0.166, color: "#6aba45" },
          { offset: 0.167, color: "#ffb829" },
          { offset: 0.333, color: "#ffb829" },
          { offset: 0.334, color: "#ff801d" },
          { offset: 0.5, color: "#ff801d" },
          { offset: 0.501, color: "#fd383d" },
          { offset: 0.666, color: "#fd383d" },
          { offset: 0.667, color: "#aa3b96" },
          { offset: 0.833, color: "#aa3b96" },
          { offset: 0.834, color: "#009ddb" },
          { offset: 1, color: "#009ddb" },
        ],
        angle: 30,
      },
    ],
  },
  misc: { readingBlur: 48 },
};

export default vibrantConfig;
