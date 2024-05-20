const glitterConfig: ThemeDataConfig = {
  palette: {
    primary: [249, 250, 251],
    saturated: [243, 244, 246],
    middle: [229, 231, 235],
    soft: [156, 163, 175],
    pastel: [107, 114, 128],
    light: [75, 85, 99],
    page: [
      {
        type: "linear-gradient",
        angle: "45deg",
        stops: [
          {
            color: "rgba(17, 24, 39, 1)",
            at: "0%",
          },
          {
            color: "rgba(31, 41, 55, 1)",
            at: "100%",
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
            color: "rgba(27, 36, 51, $opacity%)",
            at: "20%",
          },
          {
            color: "rgba(37, 47, 61, $opacity%)",
            at: "80%",
          },
        ],
      },
    ],
  },
  siteThemeColor: "#1f2937",
  favicon: {
    mode: "backdrop",
    outline: "#f3f4f6",
    backdropGradient: [
      {
        type: "radial-gradient",
        sizeX: "44.5%",
        sizeY: "44.5%",
        posX: "94.6%",
        posY: "55.8%",
        stops: [
          {
            at: "0%",
            color: "#8e734fff",
          },
          {
            at: "100%",
            color: "#69644000",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "54.9%",
        sizeY: "54.9%",
        posX: "0%",
        posY: "59.5%",
        stops: [
          {
            at: "0%",
            color: "#8e4f77ff",
          },
          {
            at: "100%",
            color: "#69406200",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "50.3%",
        sizeY: "50.3%",
        posX: "38.3%",
        posY: "92.0%",
        stops: [
          {
            at: "0%",
            color: "#4f8e62ff",
          },
          {
            at: "100%",
            color: "#40694c00",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "64.0%",
        sizeY: "64.0%",
        posX: "31.7%",
        posY: "14.4%",
        stops: [
          {
            at: "0%",
            color: "#4f838eff",
          },
          {
            at: "100%",
            color: "#404b6900",
          },
        ],
      },
      {
        type: "radial-gradient",
        sizeX: "53.3%",
        sizeY: "53.3%",
        posX: "74.9%",
        posY: "31.4%",
        stops: [
          {
            at: "0%",
            color: "#4f538eff",
          },
          {
            at: "100%",
            color: "#40456900",
          },
        ],
      },
      {
        type: "linear-gradient",
        angle: "0deg",
        stops: [
          { at: "0%", color: "#111827" },
          { at: "100%", color: "#374151" },
        ],
      },
    ],
  },
  animatedBackgroundKey: "glitter",
};

export default glitterConfig;
