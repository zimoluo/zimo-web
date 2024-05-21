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
        angle: 45,
        stops: [
          {
            color: [207, 212, 197],
            opacity: 1,
            at: 0,
          },
          {
            color: [207, 212, 197],
            opacity: 1,
            at: 20,
          },
          {
            color: [238, 207, 212],
            opacity: 1,
            at: 20,
          },
          {
            color: [238, 207, 212],
            opacity: 1,
            at: 40,
          },
          {
            color: [239, 185, 203],
            opacity: 1,
            at: 40,
          },
          {
            color: [239, 185, 203],
            opacity: 1,
            at: 60,
          },
          {
            color: [230, 173, 236],
            opacity: 1,
            at: 60,
          },
          {
            color: [230, 173, 236],
            opacity: 1,
            at: 80,
          },
          {
            color: [194, 135, 232],
            opacity: 1,
            at: 80,
          },
          {
            color: [194, 135, 232],
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
            color: [238, 207, 212],
            opacity: 1,
            at: 15,
          },
          {
            color: [238, 207, 212],
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
            color: [255, 235, 249],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 10,
          },
          {
            color: [255, 235, 249],
            opacity: 1,
            at: 60,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#efb9cb",
  favicon: {
    mode: "backdrop",
  },
  misc: {
    readingBlur: 0,
  },
};

export default cherryConfig;
