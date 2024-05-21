import AddPlusIcon from "@/components/assets/entries/AddPlusIcon";
import { useSettings } from "@/components/contexts/SettingsContext";
import { useGradientData } from "./GradientDataContext";
import { getRandomNewLayer } from "@/lib/themeMaker/layerHelper";
import DuplicateIcon from "@/components/assets/entries/DuplicateIcon";
import CopyIcon from "@/components/assets/entries/CopyIcon";
import PasteIcon from "@/components/assets/entries/PasteIcon";
import ReuseIcon from "@/components/assets/entries/ReuseIcon";

export default function LayerSelectorUtilButtons() {
  const { updateGradientData } = useSettings();
  const {
    selectedGradientCategory,
    currentLayerIndex,
    selectedLayer,
    thisLayerGradient,
    copyCurrentLayer,
    layerClipboard,
  } = useGradientData();

  const isClipboardActive = layerClipboard !== null;

  const insertLayer = (newLayer: ColorGradient) => {
    const newData: ColorGradient[] = [
      ...selectedLayer.slice(0, currentLayerIndex),
      newLayer,
      ...selectedLayer.slice(currentLayerIndex, selectedLayer.length),
    ];

    updateGradientData(selectedGradientCategory, newData);
  };

  const addNewLayer = () => {
    insertLayer(getRandomNewLayer());
  };

  const duplicateLayer = () => {
    insertLayer(structuredClone(thisLayerGradient));
  };

  const pasteLayer = () => {
    if (!isClipboardActive) {
      return;
    }

    insertLayer(structuredClone(layerClipboard));
  };

  const emptyPageMinimalLayer = () => {
    updateGradientData("pageMinimal", []); // specify pageMinimal to prevent accidentally emptying other categories if it ever happens
  };

  return (
    <>
      {selectedGradientCategory === "pageMinimal" && (
        <button
          className="w-auto h-5 aspect-square transition-transform duration-300 ease-out hover:scale-110"
          onClick={emptyPageMinimalLayer}
          disabled={selectedLayer.length === 0}
        >
          <ReuseIcon
            className={`h-full w-auto aspect-square transition-opacity duration-300 ease-out ${
              selectedLayer.length > 0 ? "opacity-100" : "opacity-50"
            }`}
          />
        </button>
      )}
      <button
        className="w-auto h-5 aspect-square transition-transform duration-300 ease-out hover:scale-110"
        onClick={pasteLayer}
        disabled={!isClipboardActive}
      >
        <PasteIcon
          className={`h-full w-auto aspect-square transition-opacity duration-300 ease-out ${
            isClipboardActive ? "opacity-100" : "opacity-50"
          }`}
        />
      </button>
      <button
        className="w-auto h-5 aspect-square transition-transform duration-300 ease-out hover:scale-110"
        onClick={copyCurrentLayer}
        disabled={selectedLayer.length === 0}
      >
        <CopyIcon
          className={`h-full w-auto aspect-square transition-opacity duration-300 ease-out ${
            selectedLayer.length > 0 ? "opacity-100" : "opacity-50"
          }`}
        />
      </button>
      <button
        className="w-auto h-5 aspect-square transition-transform duration-300 ease-out hover:scale-110"
        onClick={duplicateLayer}
        disabled={selectedLayer.length === 0}
      >
        <DuplicateIcon
          className={`h-full w-auto aspect-square transition-opacity duration-300 ease-out ${
            selectedLayer.length > 0 ? "opacity-100" : "opacity-50"
          }`}
        />
      </button>
      <button
        className="w-auto h-5 aspect-square transition-transform duration-300 ease-out hover:scale-110"
        onClick={addNewLayer}
      >
        <AddPlusIcon className="h-full w-auto aspect-square" />
      </button>
    </>
  );
}
