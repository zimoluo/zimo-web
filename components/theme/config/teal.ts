const tealConfig: ThemeDataConfig = {
  palette: {
    primary: [19, 78, 74],
    light: [240, 253, 250],
    saturated: [15, 118, 110],
    middle: [45, 212, 191],
    pastel: [153, 246, 228],
    soft: [94, 234, 212],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(234, 250, 255, 1)",
            at: "0%",
          },
          {
            color: "rgba(234, 250, 255, 1)",
            at: "20%",
          },
          {
            color: "rgba(235, 255, 238, 1)",
            at: "80%",
          },
          {
            color: "rgba(235, 255, 238, 1)",
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
            color: "rgba(245, 254, 255, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(240, 253, 250, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ccfbf1",
};

export default tealConfig;
