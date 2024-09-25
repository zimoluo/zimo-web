import { isValidElement, ReactNode } from "react";

export const getWindowContentSaveData = (
  component: ReactNode
): WindowSaveData["contentSaveData"] => {
  let contentName = "UnknownComponent";
  let contentData = {};

  if (typeof component === "number" || component === "string") {
    contentName = `${component}`;
  }

  if (isValidElement(component)) {
    contentName =
      typeof component.type === "string"
        ? component.type
        : component.type.name || "UnknownComponent";
    contentData = component.props || {};
  }

  return { name: contentName, data: contentData };
};
