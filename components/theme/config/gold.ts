const goldConfig: ThemeDataConfig = {
  palette: {
    primary: [113, 72, 18],
    light: [254, 247, 232],
    saturated: [181, 134, 11],
    middle: [245, 187, 40],
    pastel: [250, 224, 157],
    soft: [249, 217, 134],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(255, 249, 235, 1)",
            at: "0%",
          },
          {
            color: "rgba(255, 249, 235, 1)",
            at: "20%",
          },
          {
            color: "rgba(255, 253, 242, 1)",
            at: "80%",
          },
          {
            color: "rgba(255, 253, 242, 1)",
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
            color: "rgba(255, 246, 227, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(255, 250, 235, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#f9d986",
  favicon: {
    mode: "separate",
    outline: "#b68b00",
    gradient: {
      stops: [
        [
          {
            color: "#ffe5a0",
            offset: 0,
          },
          {
            color: "#ecb010",
            offset: 1,
          },
        ],
      ],
    },
  },
  animatedBackgroundKey: "gold",
};

export default goldConfig;
