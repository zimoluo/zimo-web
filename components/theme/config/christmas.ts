const christmasConfig: ThemeDataConfig = {
  palette: {
    primary: [140, 20, 20],
    saturated: [200, 44, 44],
    middle: [226, 125, 125],
    soft: [246, 181, 181],
    pastel: [251, 212, 212],
    light: [253, 247, 247],
    page: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "100%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "#fffcfc",
            at: "0%",
          },
          {
            color: "#fff7f7",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "90%",
        posX: "50%",
        posY: "50%",
        stops: [
          {
            color: "rgba(255, 242, 242, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(255, 250, 250, 0)",
            at: "100%",
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: "30deg",
        stops: [
          {
            color: "rgba(255, 250, 250, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(255, 252, 252, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ff7075",
  favicon: {
    mode: "separate",
    outline: "#b61b20",
    gradient: {
      stops: [
        [
          {
            color: "#ffe8e8",
            offset: 0,
          },
          {
            color: "#ffcdcd",
            offset: 0.424,
          },
          {
            color: "#ffe2e2",
            offset: 1,
          },
        ],
      ],
    },
  },
  animatedBackgroundKey: "christmas",
};

export default christmasConfig;
