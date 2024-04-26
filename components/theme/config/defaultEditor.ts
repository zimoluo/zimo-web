const defaultEditorConfig: ThemeDataConfig = {
  palette: {
    primary: [12, 74, 110],
    light: [240, 249, 255],
    saturated: [3, 105, 161],
    middle: [56, 189, 248],
    pastel: [186, 230, 253],
    soft: [125, 211, 252],
    page: [
      {
        type: "radial-gradient",
        sizeX: "50%",
        sizeY: "50%",
        posX: "80%",
        posY: "100%",
        stops: [
          {
            color: "#abedff",
            at: "0%",
          },
          {
            color: "#ebffee00",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "60%",
        sizeY: "60%",
        posX: "6%",
        posY: "74%",
        stops: [
          {
            color: "#f1c5ff",
            at: "0%",
          },
          {
            color: "#ffebf100",
            at: "100%",
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "#ffede5",
            at: "20%",
          },
          {
            color: "#fffbe4",
            at: "80%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(255, 237, 229, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(255, 251, 228, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ffedd5",
};

export default defaultEditorConfig;
