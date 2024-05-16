const plainDarkConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 255, 255],
    light: [50, 50, 50],
    saturated: [229, 229, 229],
    soft: [96, 96, 96],
    pastel: [78, 78, 78],
    middle: [128, 128, 128],
    page: [
      {
        type: "linear-gradient",
        angle: "0deg",
        stops: [
          {
            color: "rgba(50, 50, 50, 1)",
            at: "0%",
          },
          {
            color: "rgba(50, 50, 50, 1)",
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
            color: "rgba(64, 64, 64, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(64, 64, 64, $opacity%)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#323232",
  favicon: {
    mode: "outline",
  },
};

export default plainDarkConfig;
