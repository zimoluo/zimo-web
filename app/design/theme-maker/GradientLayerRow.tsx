"use client";

import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import selectorStyle from "./layer-selector.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import CrossIcon from "@/components/assets/CrossIcon";
import { emptyLayer, gradientTypeNameMap } from "@/lib/themeMaker/layerHelper";
import { useGradientData } from "./GradientCategoryContext";

interface Props {
  gradientData: ColorGradient;
  index: number;
}

export default function GradientLayerRow({ gradientData, index }: Props) {
  const { updateGradientData } = useSettings();
  const {
    selectedGradientCategory,
    currentLayerIndex,
    selectedLayer,
    setCurrentLayerIndex,
  } = useGradientData();

  const movePos = (step: number) => {
    const newList = [...selectedLayer];

    const newIndex = index + step;

    if (newIndex >= 0 && newIndex < newList.length) {
      const movedItem = newList.splice(index, 1)[0];
      newList.splice(newIndex, 0, movedItem);

      updateGradientData(selectedGradientCategory, newList);

      if (index === currentLayerIndex) {
        setCurrentLayerIndex(newIndex);
      } else if (index < currentLayerIndex && newIndex >= currentLayerIndex) {
        setCurrentLayerIndex(currentLayerIndex - 1);
      } else if (index > currentLayerIndex && newIndex <= currentLayerIndex) {
        setCurrentLayerIndex(currentLayerIndex + 1);
      }
    }
  };

  const deleteThisEntry = () => {
    const newList = [...selectedLayer];

    if (newList.length <= 1) {
      setCurrentLayerIndex(0);
      updateGradientData(selectedGradientCategory, [emptyLayer]);
      return;
    }

    newList.splice(index, 1);

    updateGradientData(selectedGradientCategory, newList);

    if (index === currentLayerIndex) {
      setCurrentLayerIndex(Math.min(index, newList.length - 1));
    } else if (index < currentLayerIndex) {
      setCurrentLayerIndex(currentLayerIndex - 1);
    }
  };

  return (
    <div
      className={`rounded-lg bg-pastel bg-opacity-80 shadow-sm w-full h-10 flex items-center p-2 gap-2 relative ${selectorStyle.rowContainer}`}
    >
      <button
        className="h-full flex items-center gap-2 flex-grow"
        onClick={() => {
          setCurrentLayerIndex(index);
        }}
      >
        <div
          className={`absolute w-full h-full left-0 top-0 rounded-lg border-2 border-soft border-opacity-90 ${
            index === currentLayerIndex ? "opacity-100" : "opacity-0"
          } pointer-events-none select-none`}
        />
        <div
          className={`${selectorStyle.transparentLayer} h-full w-auto aspect-square rounded-md shrink-0`}
        >
          <div
            style={generateInlineStyleObject({ page: [gradientData] })}
            className="bg-page h-full w-full aspect-square rounded-md shadow-sm"
          />
        </div>
        <p
          className={`whitespace-nowrap shrink-0 text-sm ${selectorStyle.layerText}`}
        >
          {gradientTypeNameMap[gradientData.type] ?? "Gradient"}
        </p>
      </button>
      <div className="shrink-0 flex items-center gap-2">
        {index > 0 && (
          <button
            className="transition-transform duration-300 ease-out hover:scale-110"
            onClick={() => {
              movePos(-1);
            }}
          >
            <UpDownSwitchIcon className="w-auto h-4 aspect-square" />
          </button>
        )}
        {index < selectedLayer.length - 1 && (
          <button
            className="transition-transform duration-300 ease-out hover:scale-110"
            onClick={() => {
              movePos(1);
            }}
          >
            <UpDownSwitchIcon className="w-auto h-4 aspect-square rotate-180" />
          </button>
        )}
        <button
          className="transition-transform duration-300 ease-out hover:scale-110"
          onClick={deleteThisEntry}
        >
          <CrossIcon className="w-auto h-4 aspect-square scale-90" />
        </button>
      </div>
    </div>
  );
}
