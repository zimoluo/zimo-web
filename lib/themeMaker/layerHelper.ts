export const defaultLayer: ColorGradient = {
  type: "radial-gradient",
  posX: "50%",
  posY: "50%",
  sizeX: "50%",
  sizeY: "50%",
  stops: [
    {
      color: "#fe8a1daa",
      at: "0%",
    },
    {
      color: "#fe8a1d00",
      at: "100%",
    },
  ],
};

export const emptyLayer: ColorGradient = {
  type: "linear-gradient",
  angle: "0deg",
  stops: [
    {
      color: "#ffffff00",
      at: "0%",
    },
    {
      color: "#ffffff00",
      at: "100%",
    },
  ],
};

export const gradientTypeNameMap: Record<EditorGradientMode | string, string> =
  {
    "linear-gradient": "Linear",
    "radial-gradient": "Radial",
    "conic-gradient": "Conic",
    "repeating-linear-gradient": "Repeating linear",
    "repeating-radial-gradient": "Repeating radial",
    "repeating-conic-gradient": "Repeating conic",
  };
