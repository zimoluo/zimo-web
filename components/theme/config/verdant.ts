const verdantConfig: ThemeDataConfig = {
  palette: {
    primary: [82, 116, 12],
    saturated: [121, 166, 29],
    middle: [198, 255, 19],
    soft: [207, 255, 59],
    pastel: [222, 255, 102],
    light: [243, 255, 197],
    page: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          {
            color: "#8edf22",
            at: "0%",
          },
          {
            color: "#8edf22",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          {
            color: "rgba(232, 255, 164, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(232, 255, 164, $opacity%)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#8edf22",
  favicon: {
    mode: "backdrop",
  },
};

export default verdantConfig;
