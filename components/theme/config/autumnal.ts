const autumnalConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 241, 222],
    light: [224, 168, 90],
    saturated: [211, 227, 228],
    middle: [175, 170, 179],
    pastel: [173, 122, 67],
    soft: [174, 142, 122],
    page: [
      {
        type: "linear-gradient",
        angle: "135deg",
        stops: [
          {
            color: "#031d44",
            at: "0%",
          },
          {
            color: "#031d44",
            at: "20%",
          },
          {
            color: "#04395e",
            at: "20%",
          },
          {
            color: "#04395e",
            at: "40%",
          },
          {
            color: "#70a288",
            at: "40%",
          },
          {
            color: "#70a288",
            at: "60%",
          },
          {
            color: "#dab785",
            at: "60%",
          },
          {
            color: "#dab785",
            at: "80%",
          },
          {
            color: "#d5896f",
            at: "80%",
          },
          {
            color: "#d5896f",
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
            color: "#04395e",
            at: "15%",
          },
          {
            color: "#04395e",
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
            color: "rgba(21, 89, 138, 1)",
            at: "15%",
          },
          {
            color: "rgba(21, 89, 138, 1)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#15598a",
  favicon: {
    mode: "backdrop",
  },
  misc: {
    readingBlur: 0,
  },
};

export default autumnalConfig;
