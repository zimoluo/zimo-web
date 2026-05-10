const goldConfig: ThemeDataConfig = {
  palette: {
    primary: [113, 72, 18],
    saturated: [181, 134, 11],
    pastel: [238, 202, 110],
    light: [254, 247, 232],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 249, 235], opacity: 1, at: 0 },
          { color: [255, 249, 235], opacity: 1, at: 20 },
          { color: [255, 253, 242], opacity: 1, at: 80 },
          { color: [255, 253, 242], opacity: 1, at: 100 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { color: [255, 246, 227], opacity: 1, isWidgetOpacity: true, at: 20 },
          { color: [255, 250, 235], opacity: 1, isWidgetOpacity: true, at: 80 },
        ],
        angle: 45,
      },
    ],
  },
  siteThemeColor: "#f9d986",
  favicon: {
    mode: "separate",
    outline: "#aa8200",
    gradient: [
      {
        stops: [
          { color: "#ffe5a0", offset: 0 },
          { color: "#ecb010", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "gold",
};

export default goldConfig;
