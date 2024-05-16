const marinaConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 255, 247],
    light: [116, 166, 113],
    saturated: [186, 255, 194],
    middle: [99, 214, 124],
    pastel: [96, 171, 127],
    soft: [97, 185, 135],
    page: [
      {
        type: "linear-gradient",
        angle: "180deg",
        stops: [
          {
            color: "#020887",
            at: "0%",
          },
          {
            color: "#020887",
            at: "20%",
          },
          {
            color: "#334195",
            at: "20%",
          },
          {
            color: "#334195",
            at: "40%",
          },
          {
            color: "#647aa3",
            at: "40%",
          },
          {
            color: "#647aa3",
            at: "60%",
          },
          {
            color: "#95b2b0",
            at: "60%",
          },
          {
            color: "#95b2b0",
            at: "80%",
          },
          {
            color: "#c6ebbe",
            at: "80%",
          },
          {
            color: "#c6ebbe",
            at: "100%",
          },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          {
            color: "#334195",
            at: "15%",
          },
          {
            color: "#334195",
            at: "85%",
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
            color: "rgba(83, 102, 212, 1)",
            at: "0%",
          },
          {
            color: "rgba(83, 102, 212, 1)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#020887",
  favicon: {
    mode: "backdrop",
  },
};

export default marinaConfig;
