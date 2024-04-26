const cherryConfig: ThemeDataConfig = {
  palette: {
    primary: [128, 8, 48],
    light: [255, 235, 238],
    saturated: [196, 26, 134],
    middle: [251, 84, 134],
    pastel: [254, 179, 219],
    soft: [253, 133, 181],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "#cfd4c5",
            at: "0%",
          },
          {
            color: "#cfd4c5",
            at: "20%",
          },
          {
            color: "#eecfd4",
            at: "20%",
          },
          {
            color: "#eecfd4",
            at: "40%",
          },
          {
            color: "#efb9cb",
            at: "40%",
          },
          {
            color: "#efb9cb",
            at: "60%",
          },
          {
            color: "#e6adec",
            at: "60%",
          },
          {
            color: "#e6adec",
            at: "80%",
          },
          {
            color: "#c287e8",
            at: "80%",
          },
          {
            color: "#c287e8",
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
            color: "#eecfd4",
            at: "15%",
          },
          {
            color: "#eecfd4",
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
            color: "rgba(255, 235, 249, $opacity%)",
            at: "10%",
          },
          {
            color: "rgba(255, 235, 249, 1)",
            at: "60%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#efb9cb",
};

export default cherryConfig;
