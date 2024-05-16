const photosConfig: ThemeDataConfig = {
  palette: {
    primary: [124, 45, 18],
    light: [255, 247, 237],
    saturated: [194, 65, 12],
    middle: [251, 146, 60],
    pastel: [254, 215, 170],
    soft: [253, 186, 116],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(255, 237, 229, 1)",
            at: "0%",
          },
          {
            color: "rgba(255, 237, 229, 1)",
            at: "15%",
          },
          {
            color: "rgba(255, 251, 228, 1)",
            at: "85%",
          },
          {
            color: "rgba(255, 251, 228, 1)",
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
            color: "rgba(255, 242, 235, $opacity%)",
            at: "15%",
          },
          {
            color: "rgba(255, 247, 237, $opacity%)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffedd5",
  favicon: {
    mode: "separate",
    outline: "#a24700",
    gradient: [
      [
        {
          color: "#ffbc00",
          offset: 0,
        },
        {
          color: "#ff4f00",
          offset: 1,
        },
      ],
    ],
  },
  animatedBackgroundKey: "photos",
};

export default photosConfig;
