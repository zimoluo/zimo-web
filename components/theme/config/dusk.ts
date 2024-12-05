const duskConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 241, 251],
    saturated: [247, 191, 180],
    pastel: [215, 129, 152],
    light: [179, 81, 119],
    widget: [
      {
        type: "linear-gradient",
        stops: [
          {
            at: 8,
            color: [231, 129, 181],
            opacity: 0.95,
            isWidgetOpacity: true,
          },
          {
            at: 40,
            color: [234, 135, 158],
            opacity: 0.97,
            isWidgetOpacity: true,
          },
          {
            at: 75,
            color: [241, 141, 136],
            opacity: 0.94,
            isWidgetOpacity: true,
          },
          {
            at: 100,
            color: [237, 168, 128],
            opacity: 0.98,
            isWidgetOpacity: true,
          },
        ],
        angle: 22.5,
      },
    ],
    page: [
      {
        type: "linear-gradient",
        stops: [
          { at: 0, color: [239, 179, 153], opacity: 1 },
          { at: 33, color: [249, 165, 161], opacity: 1 },
          { at: 67, color: [239, 148, 170], opacity: 1 },
          { at: 100, color: [230, 145, 194], opacity: 1 },
        ],
        angle: 0,
      },
    ],
  },
  siteThemeColor: "#C493B7",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#B35177", offset: 0 },
          { color: "#F7BFB4", offset: 1 },
        ],
      },
    ],
  },
  misc: { readingBlur: 8 },
  animatedBackgroundKey: "dusk",
};

export default duskConfig;
