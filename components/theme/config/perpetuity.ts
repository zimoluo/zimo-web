const perpetuityConfig: ThemeDataConfig = {
  palette: {
    primary: [242, 250, 255],
    saturated: [189, 225, 246],
    pastel: [60, 165, 218],
    light: [39, 146, 204],
    page: [
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 189, 89], opacity: 1, at: 0 },
          { color: [255, 162, 92], opacity: 0.7, at: 18 },
          { color: [255, 107, 17], opacity: 0, at: 51 },
        ],
        posX: 55,
        posY: 0,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [238, 60, 255], opacity: 1, at: 0 },
          { color: [255, 17, 72], opacity: 0, at: 70 },
        ],
        posX: -10,
        posY: 66,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [42, 255, 117], opacity: 1, at: 0 },
          { color: [0, 210, 255], opacity: 1, at: 29 },
        ],
        posX: 100,
        posY: 80,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        stops: [
          { color: [255, 189, 89], opacity: 0.9, isWidgetOpacity: true, at: 0 },
          {
            color: [255, 162, 92],
            opacity: 0.7,
            isWidgetOpacity: true,
            at: 18,
          },
          {
            color: [255, 107, 17],
            opacity: 0,
            isWidgetOpacity: true,
            at: 51,
          },
        ],
        posX: 55,
        posY: -14,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [238, 60, 255], opacity: 0.9, isWidgetOpacity: true, at: 0 },
          { color: [255, 17, 72], opacity: 0, isWidgetOpacity: true, at: 70 },
        ],
        posX: -10,
        posY: 66,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
      {
        type: "radial-gradient",
        stops: [
          { color: [42, 255, 117], opacity: 0.9, isWidgetOpacity: true, at: 0 },
          {
            color: [0, 210, 255],
            opacity: 0.9,
            isWidgetOpacity: true,
            at: 34,
          },
        ],
        posX: 105,
        posY: 80,
        isCircle: true,
        sizeKeyword: "farthest-corner",
      },
    ],
  },
  siteThemeColor: "#0095c8",
  favicon: {
    mode: "separate",
    outline: "#e6fffd",
    gradient: [
      {
        stops: [
          {
            color: "#ffbd59",
            offset: 0,
          },
          {
            color: "#ff6b11",
            offset: 1,
          },
        ],
      },
      {
        stops: [
          {
            color: "#00d2ff",
            offset: 0,
          },
          {
            color: "#2aff75",
            offset: 1,
          },
        ],
      },
      {
        stops: [
          {
            color: "#ff1148",
            offset: 0,
          },
          {
            color: "#ee3cff",
            offset: 1,
          },
        ],
      },
    ],
  },
  misc: { readingBlur: 48 },
  animatedBackgroundKey: "perpetuity",
};

export default perpetuityConfig;
