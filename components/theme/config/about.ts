const aboutConfig: ThemeDataConfig = {
  palette: {
    primary: [12, 74, 110],
    saturated: [3, 105, 161],
    pastel: [186, 230, 253],
    light: [240, 249, 255],
    page: [
      {
        type: "radial-gradient",
        sizeX: 50,
        sizeY: 50,
        posX: 80,
        posY: 100,
        stops: [
          {
            color: [171, 237, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [235, 255, 238],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 60,
        sizeY: 60,
        posX: 6,
        posY: 74,
        stops: [
          {
            color: [241, 197, 255],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 235, 241],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [255, 237, 229],
            opacity: 1,
            at: 20,
          },
          {
            color: [255, 251, 228],
            opacity: 1,
            at: 80,
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: 50,
        sizeY: 80,
        posX: 110,
        posY: 60,
        stops: [
          {
            color: [171, 237, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [235, 255, 238],
            opacity: 0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 60,
        sizeY: 90,
        posX: 12,
        posY: 40,
        stops: [
          {
            color: [241, 197, 255],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [255, 235, 241],
            opacity: 0,
            at: 100,
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [255, 237, 229],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [255, 251, 228],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#e0f2fe",
  favicon: {
    mode: "separate",
    outline: "#074174",
    gradient: [
      {
        stops: [
          { color: "#ffe147", offset: 0 },
          { color: "#ff4e13", offset: 1 },
        ],
      },
      {
        stops: [
          { color: "#18ddff", offset: 0 },
          { color: "#6eff86", offset: 1 },
        ],
      },
      {
        stops: [
          { color: "#ed9dff", offset: 0 },
          { color: "#ff69cb", offset: 1 },
        ],
      },
    ],
  },
};

export default aboutConfig;
