const oasisConfig: ThemeDataConfig = {
  palette: {
    primary: [8, 111, 87],
    saturated: [25, 189, 152],
    pastel: [177, 247, 230],
    light: [212, 255, 244],
    page: [
      {
        type: "repeating-linear-gradient",
        angle: 45,
        stops: [
          { color: [253, 213, 187], opacity: 0.45, at: 0 },
          { color: [252, 234, 206], opacity: 0.39, at: 18 },
        ],
      },
      {
        type: "repeating-radial-gradient",
        posX: 50,
        posY: 120,
        sizeX: 40,
        sizeY: 20,
        stops: [
          { color: [255, 241, 231], opacity: 1, at: 0 },
          { color: [255, 232, 214], opacity: 1, at: 100 },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          { color: [255, 232, 214], opacity: 1, at: 0 },
          { color: [255, 232, 214], opacity: 1, at: 100 },
        ],
      },
    ],
    widget: [
      {
        type: "repeating-linear-gradient",
        angle: 165,
        stops: [
          {
            color: [222, 255, 243],
            opacity: 0.33,
            at: 30,
            isWidgetOpacity: true,
          },
          {
            color: [208, 242, 230],
            opacity: 0.33,
            at: 70,
            isWidgetOpacity: true,
          },
        ],
      },
      {
        type: "repeating-linear-gradient",
        angle: 75,
        stops: [
          {
            color: [230, 252, 244],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 30,
          },
          {
            color: [240, 255, 250],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 70,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffdec4",
  favicon: {
    mode: "separate",
    outline: "#078265",
    gradient: [
      {
        stops: [
          {
            color: "#ffe7d6",
            offset: 0,
          },
          {
            color: "#ffc79c",
            offset: 1,
          },
        ],
      },
    ],
  },
};

export default oasisConfig;
