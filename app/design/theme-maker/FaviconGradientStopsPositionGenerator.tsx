"use client";

import {
  faviconGradientStopToGradientStop,
  gradientStopToFaviconGradientStop,
} from "@/lib/themeMaker/faviconHelper";
import { useFaviconEditor } from "./FaviconEditorContext";
import StopsPositionManager from "./StopsPositionManager";

export default function FaviconGradientStopsPositionGenerator() {
  const {
    selectedGradientStops,
    currentFaviconGradientStop,
    faviconGradientStopsIndex,
    setFaviconGradientStopIndex,
    modifyFaviconGradientStop,
    appendFaviconGradientStop,
    deleteFaviconGradientStop,
    updateFaviconGradientStopsDirectly,
  } = useFaviconEditor();

  return (
    <StopsPositionManager
      {...{
        gradientStops: selectedGradientStops.map((faviconStop) =>
          faviconGradientStopToGradientStop(faviconStop)
        ),
        currentGradientStop: faviconGradientStopToGradientStop(
          currentFaviconGradientStop
        ),
        gradientStopIndex: faviconGradientStopsIndex,
        setGradientStopIndex: setFaviconGradientStopIndex,
        modifyGradientStop: (data, index, doSync) => {
          modifyFaviconGradientStop(
            gradientStopToFaviconGradientStop(data),
            index,
            doSync
          );
        },
        appendGradientStop: (data, doSync) => {
          appendFaviconGradientStop(
            gradientStopToFaviconGradientStop(data),
            doSync
          );
        },
        deleteGradientStop: (index, doSync) => {
          deleteFaviconGradientStop(index, doSync);
        },
        updateGradientStopsDirectly: (newStops, doSync) => {
          updateFaviconGradientStopsDirectly(
            newStops.map((gradientStop) =>
              gradientStopToFaviconGradientStop(gradientStop)
            ),
            doSync
          );
        },
      }}
    />
  );
}
