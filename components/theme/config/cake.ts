const cakeConfig: ThemeDataConfig = {
  palette: {
    primary: [131, 24, 67],
    light: [253, 242, 248],
    saturated: [190, 24, 93],
    middle: [244, 114, 182],
    pastel: [251, 207, 232],
    soft: [249, 168, 212],
    page: [
      {
        type: "radial-gradient",
        sizeX: "54%",
        sizeY: "54%",
        posX: "115%",
        posY: "30%",
        stops: [
          {
            color: "#b6ffab",
            at: "0%",
          },
          {
            color: "#f9ffeb00",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "60%",
        sizeY: "60%",
        posX: "14%",
        posY: "64%",
        stops: [
          {
            color: "#ffc5e2",
            at: "0%",
          },
          {
            color: "#ffebee00",
            at: "100%",
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "#fff5e5",
            at: "20%",
          },
          {
            color: "#fcffe4",
            at: "80%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: "70%",
        sizeY: "120%",
        posX: "120%",
        posY: "85%",
        stops: [
          {
            color: "rgba(182, 255, 171, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(249, 255, 235, 0)",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "60%",
        sizeY: "90%",
        posX: "14%",
        posY: "20%",
        stops: [
          {
            color: "rgba(255, 197, 226, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(255, 235, 238, 0)",
            at: "100%",
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(255, 245, 229, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(252, 255, 228, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#f9a8d4",
};

export default cakeConfig;
