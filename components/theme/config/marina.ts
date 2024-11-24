const marinaConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 255, 247],
    saturated: [186, 255, 194],
    pastel: [96, 171, 127],
    light: [116, 166, 113],
    page: [
      {
        type: "linear-gradient",
        angle: 180,
        stops: [
          {
            color: [2, 8, 135],
            opacity: 1,
            at: 0,
          },
          {
            color: [2, 8, 135],
            opacity: 1,
            at: 20,
          },
          {
            color: [51, 65, 149],
            opacity: 1,
            at: 20.01,
          },
          {
            color: [51, 65, 149],
            opacity: 1,
            at: 40,
          },
          {
            color: [100, 122, 163],
            opacity: 1,
            at: 40.01,
          },
          {
            color: [100, 122, 163],
            opacity: 1,
            at: 60,
          },
          {
            color: [149, 178, 176],
            opacity: 1,
            at: 60.01,
          },
          {
            color: [149, 178, 176],
            opacity: 1,
            at: 80,
          },
          {
            color: [198, 235, 190],
            opacity: 1,
            at: 80.01,
          },
          {
            color: [198, 235, 190],
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
            color: [51, 65, 149],
            opacity: 1,
            at: 15,
          },
          {
            color: [51, 65, 149],
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
            color: [83, 102, 212],
            opacity: 1,
            at: 0,
          },
          {
            color: [83, 102, 212],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#020887",
  favicon: {
    mode: "backdrop",
  },
  misc: {
    readingBlur: 0,
  },
};

export default marinaConfig;
