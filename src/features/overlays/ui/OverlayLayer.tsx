"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { scrimFor } from "../model";
import { selectOverlayOrder, useOverlays } from "../store";
import { OverlayDialog } from "./OverlayDialog";

const DESKTOP_QUERY = "(width >= 48rem)";

export function OverlayLayer() {
  const order = useOverlays(useShallow(selectOverlayOrder));
  const instances = useOverlays((state) => state.instances);
  const dismiss = useOverlays((state) => state.dismiss);
  const dismissAll = useOverlays((state) => state.dismissAll);
  const dropDesktopOnly = useOverlays((state) => state.dropDesktopOnly);

  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    const apply = (): void => {
      if (!query.matches) dropDesktopOnly();
    };

    apply();
    query.addEventListener("change", apply);
    return () => {
      query.removeEventListener("change", apply);
    };
  }, [dropDesktopOnly]);

  return (
    <>
      {order.map((id) => {
        const overlay = instances[id];
        if (overlay === undefined) return null;

        return (
          <OverlayDialog
            key={id}
            overlay={overlay}
            scrim={scrimFor({ instances, order }, id)}
            onDismiss={() => {
              dismiss(id);
            }}
            onExpand={dismissAll}
          />
        );
      })}
    </>
  );
}
