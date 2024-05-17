const skyConfig: ThemeDataConfig = {
  palette: {
    primary: [13, 80, 102],
    saturated: [31, 122, 153],
    middle: [49, 138, 168],
    soft: [83, 166, 194],
    pastel: [116, 193, 219],
    light: [207, 243, 255],
    page: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "100%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "#e0f6ff",
            at: "0%",
          },
          {
            color: "#a3e3ff",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "100%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "rgba(237, 250, 255, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(224, 247, 255, $opacity%)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#8adbff",
  favicon: {
    mode: "separate",
    gradient: {
      stops: [
        [
          {
            color: "#e0f6ff",
            offset: 0,
          },
          {
            color: "#a3e3ff",
            offset: 1,
          },
        ],
      ],
    },
  },
  animatedBackgroundKey: "sky",
};

export default skyConfig;
