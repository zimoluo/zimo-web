const peachConfig: CustomThemeDataConfig = {
  palette: {
    primary: [9, 113, 88],
    saturated: [52, 198, 168],
    middle: [83, 219, 191],
    soft: [116, 222, 193],
    pastel: [161, 230, 211],
    light: [197, 248, 234],
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

export default peachConfig;
