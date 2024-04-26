const plainLightConfig: ThemeDataConfig = {
  palette: {
    primary: [10, 10, 10],
    light: [255, 255, 255],
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
            color: "rgba(255, 255, 255, 1)",
            at: "0%",
          },
          {
            color: "rgba(255, 255, 255, 1)",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: "0deg",
        stops: [
          {
            color: "rgba(248, 248, 248, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(248, 248, 248, $opacity%)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffffff",
};

export default plainLightConfig;
