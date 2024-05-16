const neutralConfig: ThemeDataConfig = {
  palette: {
    primary: [23, 23, 23],
    light: [250, 250, 250],
    saturated: [64, 64, 64],
    middle: [163, 163, 163],
    pastel: [229, 229, 229],
    soft: [212, 212, 212],
    page: [
      {
        type: "linear-gradient",
        angle: "0deg",
        stops: [
          {
            color: "rgba(252, 252, 252, 1)",
            at: "0%",
          },
          {
            color: "rgba(252, 252, 252, 1)",
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
            color: "rgba(246, 246, 246, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(253, 253, 253, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#e5e5e5",
  favicon: {
    mode: "separate",
    gradient: [
      [
        {
          color: "#cacaca",
          offset: 0,
        },
        {
          color: "#f5f5f5",
          offset: 0.204,
        },
        {
          color: "#ffffff",
          offset: 1,
        },
      ],
    ],
  },
};

export default neutralConfig;
