const aquariumConfig: ThemeDataConfig = {
  palette: {
    primary: [65, 86, 100],
    saturated: [83, 122, 143],
    pastel: [131, 169, 189],
    light: [211, 224, 231],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 238, 234], at: 0, opacity: 0.2 },
          { color: [255, 242, 235], at: 8, opacity: 0.155 },
          { color: [255, 248, 235], at: 16, opacity: 0.111 },
          { color: [255, 254, 235], at: 24, opacity: 0.067 },
          { color: [255, 255, 255], at: 36, opacity: 0 },
          { color: [255, 255, 255], at: 100, opacity: 0 },
        ],
        posX: 15,
        posY: 60,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 238, 234], at: 0, opacity: 0.25 },
          { color: [255, 242, 235], at: 6.5, opacity: 0.197 },
          { color: [255, 248, 235], at: 13, opacity: 0.145 },
          { color: [255, 254, 235], at: 19.5, opacity: 0.093 },
          { color: [255, 255, 255], at: 31, opacity: 0 },
          { color: [255, 255, 255], at: 100, opacity: 0 },
        ],
        posX: 64,
        posY: 20,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "linear-gradient",
        stops: [
          { color: [215, 224, 226], opacity: 1, at: 10 },
          { color: [219, 239, 243], opacity: 1, at: 90 },
        ],
        angle: 45,
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        stops: [
          { color: [215, 224, 226], opacity: 1, at: 10 },
          { color: [219, 239, 243], opacity: 1, at: 90 },
        ],
        angle: 45,
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          {
            color: [255, 238, 234],
            at: 0,
            opacity: 0.225,
            isWidgetOpacity: true,
          },
          {
            color: [255, 242, 235],
            at: 7,
            opacity: 0.18,
            isWidgetOpacity: true,
          },
          {
            color: [255, 248, 235],
            at: 14,
            opacity: 0.135,
            isWidgetOpacity: true,
          },
          {
            color: [255, 254, 235],
            at: 21,
            opacity: 0.09,
            isWidgetOpacity: true,
          },
          { color: [255, 255, 255], at: 35, opacity: 0 },
        ],
        posX: 40,
        posY: 24,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "linear-gradient",
        stops: [
          {
            color: [190, 213, 219],
            opacity: 1,
            isWidgetOpacity: true,
            at: 10,
          },
          {
            color: [223, 235, 238],
            opacity: 1,
            isWidgetOpacity: true,
            at: 90,
          },
        ],
        linearGradientKeyword: true,
        linearHorizontalOrientation: "right",
        linearVerticalOrientation: "top",
      },
    ],
  },
  siteThemeColor: "#7da2b4",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          { color: "#f0f9ff", offset: 0 },
          { color: "#4e7489", offset: 1 },
        ],
        angle: 45,
      },
    ],
  },
  animatedBackgroundKey: "underwater",
};

export default aquariumConfig;
