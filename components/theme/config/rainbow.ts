const rainbowConfig: ThemeDataConfig = {
  palette: {
    primary: [51, 65, 85],
    light: [248, 250, 252],
    saturated: [85, 100, 122],
    middle: [148, 163, 184],
    pastel: [241, 245, 249],
    soft: [226, 232, 240],
    page: [
      {
        type: "custom",
        content:
          "linear-gradient(135deg,rgb(255, 153, 153),rgb(255, 179, 128),rgb(255, 255, 128),rgb(128, 255, 128),rgb(128, 179, 255),rgb(153, 102, 204),rgb(204, 153, 255))",
      },
    ],
    widget: [
      {
        type: "custom",
        content:
          "linear-gradient(135deg,rgba(255, 153, 153, $opacity%),rgba(255, 179, 128, $opacity%),rgba(255, 255, 128, $opacity%),rgba(128, 255, 128, $opacity%),rgba(128, 179, 255, $opacity%),rgba(153, 102, 204, $opacity%),rgba(204, 153, 255, $opacity%))",
      },
    ],
  },
  siteThemeColor: "#cbd5e1",
};

export default rainbowConfig;
