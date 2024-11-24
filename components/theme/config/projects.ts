const projectsConfig: ThemeDataConfig = {
  palette: {
    primary: [19, 78, 74],
    saturated: [15, 118, 110],
    pastel: [153, 246, 228],
    light: [240, 253, 250],
    page: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [234, 250, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [234, 250, 255],
            opacity: 1,
            at: 20,
          },
          {
            color: [235, 255, 238],
            opacity: 1,
            at: 80,
          },
          {
            color: [235, 255, 238],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [245, 254, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [240, 253, 250],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ccfbf1",
  favicon: {
    mode: "separate",
    outline: "#007063",
    gradient: [
      {
        stops: [
          {
            color: "#36d2ff",
            offset: 0,
          },
          {
            color: "#38ff58",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "projects",
};

export default projectsConfig;
