const halloweenConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 252, 247],
    light: [205, 88, 44],
    saturated: [255, 172, 35],
    middle: [245, 133, 36],
    pastel: [201, 107, 26],
    soft: [229, 120, 35],
    page: [
      {
        type: "linear-gradient",
        angle: "10deg",
        stops: [
          {
            color: "rgba(31, 15, 60, 1)",
            at: "15%",
          },
          {
            color: "rgba(107, 24, 141, 1)",
            at: "85%",
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
            color: "rgba(205, 88, 44, $opacity%)",
            at: "15%",
          },
          {
            color: "rgba(234, 131, 5, $opacity%)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#6b188d",
  favicon: {
    mode: "separate",
    outline: "#ffdecb",
    gradient: {
      stops: [
        [
          {
            color: "#ff9225",
            offset: 0,
          },
          {
            color: "#7e1e81",
            offset: 1,
          },
        ],
      ],
    },
  },
  animatedBackgroundKey: "halloween",
};

export default halloweenConfig;
