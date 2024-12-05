const meadowlandConfig: ThemeDataConfig = {
  palette: {
    primary: [17, 68, 98],
    saturated: [31, 118, 168],
    pastel: [181, 213, 232],
    light: [227, 242, 250],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          { at: 0, color: [203, 233, 247], opacity: 1, isWidgetOpacity: true },
          {
            at: 100,
            color: [208, 231, 243],
            opacity: 1,
            isWidgetOpacity: true,
          },
        ],
        angle: 12,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { at: 0, color: [179, 208, 221], opacity: 1 },
          { at: 100, color: [179, 208, 221], opacity: 1 },
        ],
        angle: 45,
      },
    ],
  },
  siteThemeColor: "#B3D0DD",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#d9eaf2", offset: 0 },
          { color: "#a9e0ff", offset: 1 },
        ],
      },
    ],
  },
  animatedBackgroundKey: "meadowland",
};

export default meadowlandConfig;
