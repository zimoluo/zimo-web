const candyConfig: CustomThemeDataConfig = {
  palette: {
    primary: [244, 244, 244],
    saturated: [255, 246, 197],
    middle: [255, 238, 150],
    soft: [255, 228, 90],
    pastel: [255, 224, 64],
    light: [255, 219, 34],
    page: [
      {
        type: "linear-gradient",
        angle: "60deg",
        stops: [
          {
            color: "#f2bdc7",
            at: "0%",
          },
          {
            color: "#f2bdc7",
            at: "20%",
          },
          {
            color: "#f2dc6b",
            at: "20%",
          },
          {
            color: "#f2dc6b",
            at: "40%",
          },
          {
            color: "#5ba683",
            at: "40%",
          },
          {
            color: "#5ba683",
            at: "60%",
          },
          {
            color: "#b796d8",
            at: "60%",
          },
          {
            color: "#b796d8",
            at: "80%",
          },
          {
            color: "#3c74a6",
            at: "80%",
          },
          {
            color: "#3c74a6",
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
            color: "#5ba683",
            at: "15%",
          },
          {
            color: "#5ba683",
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
            color: "rgba(114, 180, 149, 1)",
            at: "15%",
          },
          {
            color: "rgba(114, 180, 149, 1)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#5ba683",
};

export default candyConfig;
