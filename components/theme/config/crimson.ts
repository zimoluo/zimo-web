const crimsonConfig: ThemeDataConfig = {
  palette: {
    primary: [106, 20, 20],
    saturated: [139, 61, 61],
    pastel: [215, 194, 194],
    light: [245, 238, 238],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { at: 20, color: [255, 249, 249], opacity: 1, isWidgetOpacity: true },
          { at: 80, color: [255, 243, 243], opacity: 1, isWidgetOpacity: true },
        ],
        angle: 60,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { at: 20, color: [255, 249, 249], opacity: 1 },
          { at: 80, color: [255, 243, 243], opacity: 1 },
        ],
        angle: 60,
      },
    ],
  },
  siteThemeColor: "#832525",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#bf9898", offset: 0 },
          { color: "#ffeaea", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "crimson",
};

export default crimsonConfig;
