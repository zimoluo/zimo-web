const moriConfig: ThemeDataConfig = {
  palette: {
    primary: [74, 92, 30],
    light: [238, 242, 191],
    saturated: [115, 143, 46],
    middle: [165, 191, 69],
    pastel: [207, 230, 131],
    soft: [183, 209, 96],
    page: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          {
            color: "#dde8b9",
            at: "0%",
          },
          {
            color: "#dde8b9",
            at: "20%",
          },
          {
            color: "#e8d2ae",
            at: "20%",
          },
          {
            color: "#e8d2ae",
            at: "40%",
          },
          {
            color: "#d7b29d",
            at: "40%",
          },
          {
            color: "#d7b29d",
            at: "60%",
          },
          {
            color: "#c9908b",
            at: "60%",
          },
          {
            color: "#c9908b",
            at: "80%",
          },
          {
            color: "#b59395",
            at: "80%",
          },
          {
            color: "#b59395",
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
            color: "#e8d2ae",
            at: "15%",
          },
          {
            color: "#e8d2ae",
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
            color: "rgba(255, 230, 189, 1)",
            at: "15%",
          },
          {
            color: "rgba(255, 230, 189, 1)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffe6bd",
  favicon: {
    mode: "backdrop",
  },
};

export default moriConfig;
