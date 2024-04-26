const midnightConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 250, 251],
    saturated: [243, 244, 246],
    middle: [229, 231, 235],
    soft: [156, 163, 175],
    pastel: [107, 114, 128],
    light: [75, 85, 99],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(17, 24, 39, 1)",
            at: "0%",
          },
          {
            color: "rgba(31, 41, 55, 1)",
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
            color: "rgba(27, 36, 51, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(37, 47, 61, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#1f2937",
};

export default midnightConfig;
