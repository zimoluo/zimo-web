const aboutConfig: ThemeDataConfig = {
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
        type: "radial-gradient",
        sizeX: "50%",
        sizeY: "80%",
        posX: "110%",
        posY: "60%",
        stops: [
          {
            color: "rgba(171, 237, 255, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(235, 255, 238, 0)",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "60%",
        sizeY: "90%",
        posX: "12%",
        posY: "40%",
        stops: [
          {
            color: "rgba(241, 197, 255, $opacity%)",
            at: "0%",
          },
          {
            color: "rgba(255, 235, 241, 0)",
            at: "100%",
          },
        ],
      },
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
  siteThemeColor: "#e0f2fe",
  favicon: {
    mode: "separate",
    outline: "#310024",
    gradient: [
      [
        {
          color: "#ffbd59",
          offset: 0,
        },
        {
          color: "#ff6b11",
          offset: 1,
        },
      ],
      [
        {
          color: "#00d2ff",
          offset: 0,
        },
        {
          color: "#2aff75",
          offset: 1,
        },
      ],
      [
        {
          color: "#ff1148",
          offset: 0,
        },
        {
          color: "#ee3cff",
          offset: 1,
        },
      ],
    ],
  },
};

export default aboutConfig;
