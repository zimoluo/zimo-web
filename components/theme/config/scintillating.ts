const scintillatingConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 245, 237],
    saturated: [255, 221, 163],
    pastel: [255, 173, 33],
    light: [255, 161, 0],
    page: [
      {
        type: "repeating-linear-gradient",
        angle: 315,
        stops: [
          {
            color: [255, 200, 0],
            opacity: 0.18,
            at: 92,
          },
          {
            color: [255, 119, 7],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "repeating-radial-gradient",
        sizeX: 75,
        sizeY: 75,
        posX: 238,
        posY: 218,
        stops: [
          {
            color: [255, 200, 0],
            opacity: 0.0706,
            at: 30,
          },
          {
            color: [255, 119, 7],
            opacity: 0.0784,
            at: 39,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 99,
        sizeY: 99,
        posX: 109,
        posY: 2,
        stops: [
          {
            color: [255, 174, 0],
            opacity: 1.0,
            at: 0,
          },
          {
            color: [255, 102, 7],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 99,
        sizeY: 99,
        posX: 21,
        posY: 78,
        stops: [
          {
            color: [255, 111, 0],
            opacity: 1.0,
            at: 0,
          },
          {
            color: [255, 168, 7],
            opacity: 0.0,
            at: 100,
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: 160,
        sizeY: 154,
        posX: 0,
        posY: 100,
        stops: [
          {
            color: [230, 115, 53],
            opacity: 1,
            at: 0,
          },
          {
            color: [255, 150, 38],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [230, 106, 53],
            opacity: 1,
            at: 15,
          },
          {
            color: [255, 168, 38],
            opacity: 1,
            at: 85,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [255, 160, 36],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 15,
          },
          {
            color: [255, 173, 66],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 85,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ff8f17",
  favicon: {
    mode: "separate",
    gradient: [
      {
        stops: [
          {
            color: "#ff7e47",
            offset: 0,
          },
          {
            color: "#ff9700",
            offset: 1,
          },
        ],
      },
    ],
  },
};

export default scintillatingConfig;
