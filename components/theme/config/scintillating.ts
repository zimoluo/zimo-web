const scintillatingConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 245, 237],
    light: [255, 161, 0],
    saturated: [255, 221, 163],
    middle: [255, 202, 112],
    pastel: [255, 173, 33],
    soft: [255, 187, 71],
    page: [
      {
        type: "repeating-linear-gradient",
        angle: "315deg",
        stops: [
          {
            color: "#ffc8002e",
            at: "92%",
          },
          {
            color: "#ff770700",
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
            color: "#ffc80012",
            at: "30%",
          },
          {
            color: "#ff770714",
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
            color: "#ffae00ff",
            at: "0%",
          },
          {
            color: "#ff660700",
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
            color: "#ff6f00ff",
            at: "0%",
          },
          {
            color: "#ffa80700",
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
            color: "#e67335",
            at: "0%",
          },
          {
            color: "#ff9626",
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
            color: "#e66a35",
            at: "15%",
          },
          {
            color: "#ffa826",
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
            color: "rgba(255, 160, 36, $opacity%)",
            at: "15%",
          },
          {
            color: "rgba(255, 173, 66, $opacity%)",
            at: "85%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#ff8f17",
  favicon: {
    mode: "separate",
    gradient: [
      [
        {
          color: "#ff7e47",
          offset: 0,
        },
        {
          color: "#ff9700",
          offset: 1,
        },
      ],
    ],
  },
};

export default scintillatingConfig;
