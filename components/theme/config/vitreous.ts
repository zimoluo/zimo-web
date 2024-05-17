const vitreousConfig: ThemeDataConfig = {
  palette: {
    primary: [243, 242, 255],
    light: [85, 66, 255],
    saturated: [184, 198, 255],
    middle: [145, 149, 255],
    pastel: [95, 89, 255],
    soft: [117, 107, 255],
    page: [
      {
        type: "repeating-linear-gradient",
        angle: "315deg",
        stops: [
          {
            color: "#00ffff2e",
            at: "92%",
          },
          {
            color: "#073aff00",
            at: "100%",
          },
        ],
      },
      {
        type: "repeating-radial-gradient",
        sizeX: "75%",
        sizeY: "75%",
        posX: "238%",
        posY: "218%",
        stops: [
          {
            color: "#00ffff12",
            at: "30%",
          },
          {
            color: "#073aff14",
            at: "39%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "99%",
        sizeY: "99%",
        posX: "109%",
        posY: "2%",
        stops: [
          {
            color: "#00c9ffff",
            at: "0%",
          },
          {
            color: "#073aff00",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "99%",
        sizeY: "99%",
        posX: "21%",
        posY: "78%",
        stops: [
          {
            color: "#7b00ffff",
            at: "0%",
          },
          {
            color: "#073aff00",
            at: "100%",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "160%",
        sizeY: "154%",
        posX: "0%",
        posY: "100%",
        stops: [
          {
            color: "#4f35e6",
            at: "0%",
          },
          {
            color: "#2660ff",
            at: "100%",
          },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "#4f35e6",
            at: "15%",
          },
          {
            color: "#2660ff",
            at: "85%",
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: "90deg",
        stops: [
          {
            color: "rgba(56, 109, 242, $opacity%)",
            at: "15%",
          },
          {
            color: "rgba(59, 104, 255, $opacity%)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#2660ff",
  favicon: {
    mode: "separate",
    gradient: {
      stops: [
        [
          {
            color: "#883dff",
            offset: 0,
          },
          {
            color: "#3068ff",
            offset: 1,
          },
        ],
      ],
    },
  },
};

export default vitreousConfig;
