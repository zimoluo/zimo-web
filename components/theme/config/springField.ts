const springFieldConfig: ThemeDataConfig = {
  palette: {
    primary: [255, 255, 240],
    saturated: [255, 244, 179],
    pastel: [246, 209, 26],
    light: [234, 195, 0],
    page: [
      {
        type: "linear-gradient",
        angle: 60,
        stops: [
          { color: [242, 189, 199], opacity: 1, at: 0 },
          { color: [242, 189, 199], opacity: 1, at: 20 },
          { color: [242, 220, 107], opacity: 1, at: 20.01 },
          { color: [242, 220, 107], opacity: 1, at: 40 },
          { color: [91, 166, 131], opacity: 1, at: 40.01 },
          { color: [91, 166, 131], opacity: 1, at: 60 },
          { color: [183, 150, 216], opacity: 1, at: 60.01 },
          { color: [183, 150, 216], opacity: 1, at: 80 },
          { color: [60, 116, 166], opacity: 1, at: 80.01 },
          { color: [60, 116, 166], opacity: 1, at: 100 },
        ],
      },
    ],
    pageMinimal: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          { color: [91, 166, 131], opacity: 1, at: 15 },
          { color: [91, 166, 131], opacity: 1, at: 85 },
        ],
      },
    ],
    widget: [
      {
        type: "linear-gradient",
        angle: 90,
        stops: [
          { color: [114, 180, 149], opacity: 1, at: 15 },
          { color: [114, 180, 149], opacity: 1, at: 85 },
        ],
      },
    ],
  },
  siteThemeColor: "#5ba683",
  favicon: { mode: "backdrop" },
  misc: { readingBlur: 0 },
};

export default springFieldConfig;
