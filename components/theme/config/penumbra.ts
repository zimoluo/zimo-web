const penumbraConfig: ThemeDataConfig = {
  palette: {
    primary: [239, 239, 240],
    saturated: [194, 195, 201],
    middle: [163, 165, 176],
    soft: [131, 135, 152],
    pastel: [102, 106, 128],
    light: [75, 78, 96],
    page: [
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [77, 80, 95], opacity: 1, at: 0 },
          { color: [77, 80, 95], opacity: 1, at: 39.99 },
          { color: [255, 255, 255], opacity: 0, at: 40 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [46, 48, 55], opacity: 1, at: 24 },
          { color: [46, 48, 55], opacity: 0, at: 41.8 },
          { color: [255, 255, 255], opacity: 0, at: 42 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [72, 75, 88], opacity: 1, at: 0 },
          { color: [72, 75, 88], opacity: 1, at: 59.99 },
          { color: [255, 255, 255], opacity: 0, at: 60 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [46, 48, 55], opacity: 1, at: 36 },
          { color: [46, 48, 55], opacity: 0, at: 61.8 },
          { color: [255, 255, 255], opacity: 0, at: 62 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [66, 69, 81], opacity: 1, at: 0 },
          { color: [66, 69, 81], opacity: 1, at: 79.99 },
          { color: [255, 255, 255], opacity: 0, at: 80 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [46, 48, 55], opacity: 1, at: 64 },
          { color: [46, 48, 55], opacity: 0, at: 81.8 },
          { color: [255, 255, 255], opacity: 0, at: 82 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [60, 63, 74], opacity: 1, at: 0 },
          { color: [60, 63, 74], opacity: 1, at: 99.99 },
          { color: [255, 255, 255], opacity: 0, at: 100 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [46, 48, 55], opacity: 1, at: 64 },
          { color: [46, 48, 55], opacity: 0, at: 101.8 },
          { color: [255, 255, 255], opacity: 0, at: 102 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [55, 57, 66], opacity: 1, at: 0 },
          { color: [55, 57, 66], opacity: 1, at: 119.99 },
          { color: [255, 255, 255], opacity: 0, at: 120 },
        ],
      },
      {
        type: "radial-gradient",
        isCircle: true,
        sizeKeyword: "farthest-side",
        posX: 50,
        posY: 50,
        stops: [
          { color: [46, 48, 55], opacity: 1, at: 64 },
          { color: [46, 48, 55], opacity: 0, at: 121.8 },
          { color: [255, 255, 255], opacity: 0, at: 122 },
        ],
      },
      {
        type: "linear-gradient",
        angle: 0,
        stops: [
          {
            at: 0,
            color: [50, 52, 59],
            opacity: 1,
          },
          {
            at: 100,
            color: [50, 52, 59],
            opacity: 1,
          },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          {
            color: [60, 63, 74],
            opacity: 1,
            at: 0,
          },
          {
            color: [60, 63, 74],
            opacity: 1,
            at: 100,
          },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 45,
        stops: [
          {
            color: [84, 88, 100],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 20,
          },
          {
            color: [75, 80, 96],
            opacity: 1.0,
            isWidgetOpacity: true,
            at: 80,
          },
        ],
      },
    ],
  },
  siteThemeColor: "#3c3f4a",
  favicon: {
    mode: "backdrop",
  },
};

export default penumbraConfig;
