const starsConfig: ThemeDataConfig = {
  palette: {
    primary: [243, 253, 255],
    saturated: [203, 244, 250],
    middle: [118, 212, 231],
    soft: [77, 172, 198],
    pastel: [54, 130, 158],
    light: [22, 47, 70],
    page: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "100%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "#0f2540",
            at: "0%",
          },
          {
            color: "#1a1c2b",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: "90%",
        sizeY: "100%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "rgba(24, 46, 74, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(28, 41, 59, $opacity%)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#0f2540",
};

export default starsConfig;
