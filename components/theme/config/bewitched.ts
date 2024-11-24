const bewitchedConfig: ThemeDataConfig = {
  palette: {
    primary: [27, 3, 112],
    saturated: [47, 7, 191],
    pastel: [190, 174, 249],
    light: [232, 227, 253],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { at: 20, color: [234, 215, 250], opacity: 1, isWidgetOpacity: true },
          { at: 80, color: [227, 201, 249], opacity: 1, isWidgetOpacity: true },
        ],
        angle: 30,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { at: 15, color: [227, 201, 249], opacity: 1 },
          { at: 85, color: [220, 188, 248], opacity: 1 },
        ],
        angle: 45,
      },
    ],
  },
  siteThemeColor: "#d5aff6",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#ac5ff0", offset: 0 },
          { color: "#d5aff6", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "bewitched",
};

export default bewitchedConfig;
