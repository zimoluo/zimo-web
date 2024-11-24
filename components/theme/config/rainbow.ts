const rainbowConfig: ThemeDataConfig = {
  palette: {
    primary: [51, 65, 85],
    saturated: [85, 100, 122],
    pastel: [241, 245, 249],
    light: [248, 250, 252],
    page: [
      {
        type: "linear-gradient",
        angle: 135,
        stops: [
          {
            at: 0,
            color: [255, 153, 153],
            opacity: 1,
          },
          {
            at: 16.67,
            color: [255, 179, 128],
            opacity: 1,
          },
          {
            at: 33.33,
            color: [255, 255, 128],
            opacity: 1,
          },
          {
            at: 50,
            color: [128, 255, 128],
            opacity: 1,
          },
          {
            at: 66.67,
            color: [128, 179, 255],
            opacity: 1,
          },
          {
            at: 83.33,
            color: [153, 102, 204],
            opacity: 1,
          },
          {
            at: 100,
            color: [204, 153, 255],
            opacity: 1,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 135,
        stops: [
          {
            at: 0,
            color: [255, 153, 153],
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 16.67,
            color: [255, 179, 128],
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 33.33,
            color: [255, 255, 128],
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 50,
            color: [128, 255, 128],
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 66.67,
            color: [128, 179, 255],
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 83.33,
            color: [153, 102, 204],
            opacity: 1,
            isWidgetOpacity: true,
          },
          {
            at: 100,
            color: [204, 153, 255],
            opacity: 1,
            isWidgetOpacity: true,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#cbd5e1",
  favicon: {
    mode: "backdrop",
  },
  animatedBackgroundKey: "rainbow",
};

export default rainbowConfig;
