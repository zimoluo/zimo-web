const moriConfig: ThemeDataConfig = {
  palette: {
    primary: [74, 92, 30],
    saturated: [115, 143, 46],
    pastel: [207, 230, 131],
    light: [238, 242, 191],
    page: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [221, 232, 185],
            opacity: 1,
            at: 0,
          },
          {
            color: [221, 232, 185],
            opacity: 1,
            at: 20,
          },
          {
            color: [232, 210, 174],
            opacity: 1,
            at: 20.01,
          },
          {
            color: [232, 210, 174],
            opacity: 1,
            at: 40,
          },
          {
            color: [215, 178, 157],
            opacity: 1,
            at: 40.01,
          },
          {
            color: [215, 178, 157],
            opacity: 1,
            at: 60,
          },
          {
            color: [201, 144, 139],
            opacity: 1,
            at: 60.01,
          },
          {
            color: [201, 144, 139],
            opacity: 1,
            at: 80,
          },
          {
            color: [181, 147, 149],
            opacity: 1,
            at: 80.01,
          },
          {
            color: [181, 147, 149],
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
            color: [232, 210, 174],
            opacity: 1,
            at: 15,
          },
          {
            color: [232, 210, 174],
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
            color: [255, 230, 189],
            opacity: 1,
            at: 15,
          },
          {
            color: [255, 230, 189],
            opacity: 1,
            at: 85,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffe6bd",
  favicon: {
    mode: "backdrop",
  },
  misc: {
    readingBlur: 0,
  },
};

export default moriConfig;
