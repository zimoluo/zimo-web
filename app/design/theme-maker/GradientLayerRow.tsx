"use client";

import { generateInlineStyleObject } from "@/lib/colorPaletteParser";
import selectorStyle from "./layer-selector.module.css";
import transparentLayerStyle from "./transparent-layer.module.css";
import { useSettings } from "@/components/contexts/SettingsContext";
import UpDownSwitchIcon from "@/components/assets/entries/UpDownSwitchIcon";
import CrossIcon from "@/components/assets/CrossIcon";
import { emptyLayer, gradientTypeNameMap } from "@/lib/themeMaker/layerHelper";
import { useGradientData } from "./GradientDataContext";
import VisibleIcon from "@/components/assets/entries/VisibleIcon";
import InvisibleIcon from "@/components/assets/entries/InvisibleIcon";

interface Props {
  gradientData: ColorGradient;
  index: number;
}

export default function GradientLayerRow({ gradientData, index }: Props) {
  const { updateGradientData } = useSettings();
  const { selectedGradientCategory, layerIndex, currentLayers, setLayerIndex } =
    useGradientData();

  const isRowSelected: boolean = index === layerIndex;

  const movePos = (step: number) => {
    const newList = structuredClone(currentLayers);

    const newIndex = index + step;

    if (newIndex >= 0 && newIndex < newList.length) {
      const movedItem = newList.splice(index, 1)[0];
      newList.splice(newIndex, 0, movedItem);

      updateGradientData(selectedGradientCategory, newList);

      if (index === layerIndex) {
        setLayerIndex(newIndex);
      } else if (index < layerIndex && newIndex >= layerIndex) {
        setLayerIndex(layerIndex - 1);
      } else if (index > layerIndex && newIndex <= layerIndex) {
        setLayerIndex(layerIndex + 1);
      }
    }
  };

  const deleteThisEntry = () => {
    const newList = [...currentLayers];

    if (newList.length <= 1) {
      setLayerIndex(0);
      updateGradientData(selectedGradientCategory, [emptyLayer]);
      return;
    }

    newList.splice(index, 1);

    updateGradientData(selectedGradientCategory, newList);

    if (index === layerIndex) {
      setLayerIndex(Math.min(index, newList.length - 1));
    } else if (index < layerIndex) {
      setLayerIndex(layerIndex - 1);
    }
  };

  const toggleVisibility = () => {
    const newList = structuredClone(currentLayers);
    if (index > newList.length) {
      return;
    }

    newList[index].disabled = !(newList[index].disabled ?? false);
    updateGradientData(selectedGradientCategory, newList);
  };

  return (
    <div
      className={`rounded-lg bg-pastel ${
        isRowSelected ? "bg-opacity-90" : "bg-opacity-50"
      } transition-colors ease-out duration-150 shadow-sm w-full h-10 flex items-center p-2 gap-2 relative ${
        selectorStyle.rowContainer
      }`}
    >
      <button
        className="h-full flex items-center gap-2 flex-grow"
        onClick={() => {
          setLayerIndex(index);
        }}
      >
        <div
          className={`absolute w-full h-full left-0 top-0 rounded-lg border-2 ${
            selectorStyle.borderColor
          } ${
            isRowSelected ? "opacity-100" : "opacity-0"
          } pointer-events-none select-none`}
        />
        <div
          className={`${transparentLayerStyle.transparentLayer} h-full w-auto aspect-square rounded-md shrink-0`}
        >
          <div
            style={generateInlineStyleObject({
              page: [{ ...gradientData, disabled: false }],
            })}
            className="bg-page h-full w-full aspect-square rounded-md shadow-sm"
          />
        </div>
        <p
          className={`whitespace-nowrap shrink-0 text-sm ${selectorStyle.layerText}`}
        >
          {gradientTypeNameMap[gradientData.type] ?? "Custom"}
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
        {index < currentLayers.length - 1 && (
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
          onClick={toggleVisibility}
        >
          {gradientData.disabled ? (
            <InvisibleIcon className="w-auto h-4 aspect-square" />
          ) : (
            <VisibleIcon className="w-auto h-4 aspect-square" />
          )}
        </button>
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
