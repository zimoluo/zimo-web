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
        angle: 135,
        stops: [
          {
            color: [3, 29, 68],
            opacity: 1,
            at: 0,
          },
          {
            color: [3, 29, 68],
            opacity: 1,
            at: 20,
          },
          {
            color: [4, 57, 94],
            opacity: 1,
            at: 20.01,
          },
          {
            color: [4, 57, 94],
            opacity: 1,
            at: 40,
          },
          {
            color: [112, 162, 136],
            opacity: 1,
            at: 40.01,
          },
          {
            color: [112, 162, 136],
            opacity: 1,
            at: 60,
          },
          {
            color: [218, 183, 133],
            opacity: 1,
            at: 60.01,
          },
          {
            color: [218, 183, 133],
            opacity: 1,
            at: 80,
          },
          {
            color: [213, 137, 111],
            opacity: 1,
            at: 80.01,
          },
          {
            color: [213, 137, 111],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [4, 57, 94],
            opacity: 1,
            at: 15,
          },
          {
            color: [4, 57, 94],
            opacity: 1,
            at: 85,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [21, 89, 138],
            opacity: 1,
            at: 15,
          },
          {
            color: [21, 89, 138],
            opacity: 1,
            at: 85,
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
