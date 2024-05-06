const oasisConfig: ThemeDataConfig = {
  palette: {
    primary: [8, 111, 87],
    saturated: [25, 189, 152],
    middle: [57, 230, 195],
    soft: [107, 236, 201],
    pastel: [177, 247, 230],
    light: [212, 255, 244],
    page: [
      {
        type: "repeating-linear-gradient",
        angle: "45deg",
        stops: [
          { color: "#fdd5bb73", at: "0%" },
          { color: "#fceace63", at: "18%" },
        ],
      },
      {
        type: "repeating-radial-gradient",
        posX: "50%",
        posY: "120%",
        sizeX: "40%",
        sizeY: "20%",
        stops: [
          { color: "#fff1e7", at: "0%" },
          { color: "#ffe8d6", at: "100%" },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          { color: "#ffe8d6", at: "0%" },
          { color: "#ffe8d6", at: "100%" },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          { color: "rgba(221, 247, 238, $opacity%)", at: "15%" },
          { color: "rgba(240, 255, 250, $opacity%)", at: "85%" },
        ],
      },
    ],
  },
  siteThemeColor: "#ffdec4",
};

export default oasisConfig;
