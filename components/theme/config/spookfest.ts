const spookfestConfig: ThemeDataConfig = {
  palette: {
    primary: [231, 242, 248],
    saturated: [165, 206, 230],
    pastel: [42, 141, 184],
    light: [20, 117, 148],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            at: 20,
            color: [30, 109, 131],
            opacity: 0.69,
            isWidgetOpacity: true,
          },
          { at: 80, color: [21, 80, 96], opacity: 0.72, isWidgetOpacity: true },
        ],
        angle: 30,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { at: 15, color: [17, 70, 84], opacity: 1 },
          { at: 85, color: [39, 138, 165], opacity: 1 },
        ],
        angle: 10,
      },
    ],
  },
  siteThemeColor: "#24809a",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#1e6d83", offset: 0 },
          { color: "#31a6c6", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "halloween",
};

export default spookfestConfig;
