const stormConfig: ThemeDataConfig = {
  palette: {
    primary: [240, 238, 233],
    saturated: [222, 216, 200],
    middle: [179, 169, 143],
    soft: [138, 127, 101],
    pastel: [128, 115, 88],
    light: [92, 84, 64],
    page: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "100%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "#827d6f",
            at: "0%",
          },
          {
            color: "#635e51",
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
            color: "rgba(92, 84, 64, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(99, 91, 71, $opacity%)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#635e51",
  favicon: {
    mode: "separate",
    gradient: [
      [
        {
          color: "#b8b09c",
          offset: 0,
        },
        {
          color: "#575142",
          offset: 1,
        },
      ],
    ],
  },
  animatedBackgroundKey: "storm",
};

export default stormConfig;
