const blueConfig: ThemeDataConfig = {
  palette: {
    primary: [21, 66, 124],
    light: [239, 247, 255],
    saturated: [16, 91, 188],
    middle: [76, 177, 249],
    pastel: [188, 224, 253],
    soft: [136, 204, 252],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(232, 244, 255, 1)",
            at: "20%",
          },
          {
            color: "rgba(235, 249, 255, 1)",
            at: "80%",
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
            color: "rgba(242, 249, 255, $opacity%)",
            at: "15%",
          },
          {
            color: "rgba(242, 252, 255, $opacity%)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ddeefe",
};

export default blueConfig;
