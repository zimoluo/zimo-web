const lollipopConfig: ThemeDataConfig = {
  palette: {
    primary: [121, 12, 63],
    saturated: [169, 61, 112],
    middle: [191, 92, 138],
    soft: [205, 134, 167],
    pastel: [229, 195, 211],
    light: [246, 234, 239],
    page: [
      {
        type: "repeating-conic-gradient",
        angle: "60deg",
        stops: [
          { color: "rgba(255, 234, 244, 1.00)", at: "0%" },
          { color: "rgba(255, 234, 244, 1.00)", at: "7%" },
          { color: "rgba(243, 214, 229, 1.00)", at: "7.01%" },
          { color: "rgba(243, 214, 229, 1.00)", at: "14%" },
        ],
        posX: "60%",
        posY: "55%",
        sizeX: "20%",
        sizeY: "20%",
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          { color: "rgba(255, 234, 244, 1.00)", at: "0%" },
          { color: "rgba(255, 234, 244, 1.00)", at: "100%" },
        ],
      },
    ],
    widget: [
      {
        type: "repeating-conic-gradient",
        angle: "30deg",
        posX: "100%",
        posY: "0%",
        stops: [
          { color: "rgba(255, 231, 243, $opacity%)", at: "0%" },
          { color: "rgba(254, 220, 238, $opacity%)", at: "8%" },
        ],
      },
    ],
  },
  siteThemeColor: "#c67199",
  favicon: {
    mode: "separate",
    gradient: {
      stops: [
        [
          {
            color: "#ffeaf4",
            offset: 0,
          },
          {
            color: "#ffe0f0",
            offset: 1,
          },
        ],
      ],
    },
  },
  misc: { readingBlur: 0 },
};

export default lollipopConfig;
