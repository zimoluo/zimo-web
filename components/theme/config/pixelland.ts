const pixellandConfig: ThemeDataConfig = {
  palette: {
    primary: [247, 253, 255],
    saturated: [179, 226, 255],
    middle: [135, 208, 255],
    soft: [63, 157, 217],
    pastel: [52, 147, 207],
    light: [21, 129, 212],
    page: [
      {
        type: "radial-gradient",
        sizeX: "80%",
        sizeY: "70%",
        posX: "5%",
        posY: "10%",
        stops: [
          {
            color: "#428bff88",
            at: "0%",
          },
          {
            color: "#61abffdd",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "80%",
        sizeY: "120%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "#c7ecff",
            at: "0%",
          },
          {
            color: "#75c6ff",
            at: "100%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "radial-gradient",
        sizeX: "80%",
        sizeY: "90%",
        posX: "50%",
        posY: "100%",
        stops: [
          {
            color: "rgba(138, 208, 255, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(74, 174, 255, 1)",
            at: "100%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#4f93ff",
  favicon: {
    mode: "backdrop",
  },
};

export default pixellandConfig;
