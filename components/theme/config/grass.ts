const grassConfig: ThemeDataConfig = {
  palette: {
    primary: [251, 255, 250],
    saturated: [211, 237, 197],
    middle: [150, 224, 110],
    soft: [119, 207, 72],
    pastel: [97, 179, 50],
    light: [67, 135, 27],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(60, 125, 22, 1)",
            at: "0%",
          },
          {
            color: "rgba(61, 140, 15, 1)",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(65, 128, 28, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(58, 133, 15, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#41801c",
  favicon: {
    mode: "separate",
    outline: "#fbfffa",
    gradient: [
      [
        {
          color: "#117e06",
          offset: 0,
        },
        {
          color: "#91c152",
          offset: 1,
        },
      ],
    ],
  },
  animatedBackgroundKey: "grass",
};

export default grassConfig;
