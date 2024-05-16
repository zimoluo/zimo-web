const fuchsiaConfig: ThemeDataConfig = {
  palette: {
    primary: [112, 26, 117],
    light: [253, 244, 255],
    saturated: [162, 28, 175],
    middle: [232, 121, 249],
    pastel: [245, 208, 254],
    soft: [240, 171, 252],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(249, 232, 255, 1)",
            at: "0%",
          },
          {
            color: "rgba(249, 232, 255, 1)",
            at: "20%",
          },
          {
            color: "rgba(255, 235, 241, 1)",
            at: "80%",
          },
          {
            color: "rgba(255, 235, 241, 1)",
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
            color: "rgba(253, 244, 255, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(253, 244, 251, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#f5d0fe",
  favicon: {
    mode: "separate",
    outline: "#880098",
    gradient: [
      [
        {
          color: "#e45eff",
          offset: 0,
        },
        {
          color: "#ff4f9e",
          offset: 1,
        },
      ],
    ],
  },
};

export default fuchsiaConfig;
