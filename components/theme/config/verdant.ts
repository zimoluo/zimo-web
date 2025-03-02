const verdantConfig: ThemeDataConfig = {
  palette: {
    primary: [36, 69, 78],
    saturated: [66, 128, 135],
    pastel: [200, 224, 218],
    light: [240, 255, 244],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { color: [153, 193, 194], opacity: 1, at: 0 },
          { color: [153, 193, 194], opacity: 1, at: 100 },
        ],
        angle: 90,
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            color: [226, 238, 236],
            opacity: 1,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [226, 238, 236],
            opacity: 1,
            isWidgetOpacity: true,
            at: 100,
          },
        ],
        angle: 30,
      },
    ],
  },
  siteThemeColor: "#99c1c2",
  favicon: { mode: "backdrop" },
  animatedBackgroundKey: "verdant",
};

export default verdantConfig;
