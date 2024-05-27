import { Robots } from "next/dist/lib/metadata/types/metadata-types";

export const defaultRobotsMeta: Robots = {
  follow: true,
  index: true,
  "max-image-preview": "large",
};

export const generateFilterRobotsMeta = (
  unlisted: boolean | undefined
): Partial<Robots> => {
  if (unlisted) {
    return {
      follow: false,
      index: false,
      noarchive: true,
      nosnippet: true,
    };
  }

  return defaultRobotsMeta;
};
