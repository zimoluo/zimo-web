const penumbraConfig: ThemeDataConfig = {
  palette: {
    primary: [239, 239, 240],
    saturated: [194, 195, 201],
    middle: [163, 165, 176],
    soft: [131, 135, 152],
    pastel: [102, 106, 128],
    light: [75, 78, 96],
    page: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          {
            color: "#3c3f4a",
            at: "0%",
          },
          {
            color: "#3c3f4a",
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
            color: "rgba(84, 88, 100, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(75, 80, 96, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#3c3f4a",
  favicon: {
    mode: "custom",
    customKey: "penumbra",
  },
};

export default penumbraConfig;
