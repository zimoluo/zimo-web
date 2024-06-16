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
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #4d505f 0%, #4d505f 39.8%, #ffffff00 40%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #2e3037 24%, #2e303700 41.8%, #ffffff00 42%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #484b58 0%, #484b58 59.8%, #ffffff00 60%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #2e3037 36%, #2e303700 61.8%, #ffffff00 62%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #424551 0%, #424551 79.8%, #ffffff00 80%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #2e3037 64%, #2e303700 81.8%, #ffffff00 82%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #3c3f4a 0%, #3c3f4a 99.8%, #ffffff00 100%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #2e3037 64%, #2e303700 101.8%, #ffffff00 102%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #373942 0%, #373942 119.8%, #ffffff00 120%)",
      },
      {
        type: "custom",
        content:
          "radial-gradient(circle farthest-side at center, #2e3037 64%, #2e303700 121.8%, #ffffff00 122%)",
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
    mode: "custom",
    customKey: "penumbra",
  },
};

export default penumbraConfig;
