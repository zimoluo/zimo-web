const birthdayConfig: ThemeDataConfig = {
  palette: {
    primary: [131, 24, 67],
    saturated: [190, 24, 93],
    pastel: [251, 207, 232],
    light: [253, 242, 248],
    page: [
      {
        type: "radial-gradient",
        sizeX: 54,
        sizeY: 54,
        posX: 115,
        posY: 30,
        stops: [
          {
            color: [182, 255, 171],
            opacity: 1,
            at: 0,
          },
          {
            color: [249, 255, 235],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 60,
        sizeY: 60,
        posX: 14,
        posY: 64,
        stops: [
          {
            color: [255, 197, 226],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 235, 238],
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
            color: [255, 245, 229],
            opacity: 1,
            at: 20,
          },
          {
            color: [252, 255, 228],
            opacity: 1,
            at: 80,
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: 70,
        sizeY: 120,
        posX: 120,
        posY: 85,
        stops: [
          {
            color: [182, 255, 171],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [249, 255, 235],
            opacity: 0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 60,
        sizeY: 90,
        posX: 14,
        posY: 20,
        stops: [
          {
            color: [255, 197, 226],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 0,
          },
          {
            color: [255, 235, 238],
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
            color: [255, 245, 229],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [252, 255, 228],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#f9a8d4",
  favicon: {
    mode: "overall",
    outline: "#be185d",
    gradient: [
      {
        angle: 45,
        stops: [
          {
            color: "#fb71a2",
            offset: 0,
          },
          {
            color: "#fbc480",
            offset: 1,
          },
        ],
      },
    ],
  },
  animatedBackgroundKey: "birthday",
};

export default birthdayConfig;
