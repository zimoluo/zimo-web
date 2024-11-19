"use client";

import React from "react";
import { useWindowAction } from "@/components/contexts/WindowActionContext";
import { useInputParser } from "@/lib/helperHooks";
import { useWindow } from "@/components/contexts/WindowContext";

const WindowDebugger = () => {
  const { windowData, windowState, setWindowData, setWindowState } =
    useWindowAction();
  const { saveWindows } = useWindow();

  const setDataAndSave = (newData: Partial<WindowData>) => {
    setWindowData(newData);
    saveWindows();
  };

  const setStateAndSave = (newState: Partial<WindowState>) => {
    setWindowState(newState);
    saveWindows();
  };

  const isNumber = (value: string) => !isNaN(Number(value));
  const isBoolean = (value: string) => value === "true" || value === "false";
  const formatNumber = (value: string) => Number(value);
  const formatBoolean = (value: string) => value === "true";

  const createNumberInput = (
    key: keyof typeof windowData,
    required = false
  ) => {
    const [value, handleChange] = useInputParser({
      value: windowData[key] as number,
      setValue: (newValue) => setDataAndSave({ [key]: newValue }),
      isValid: isNumber,
      formatValue: formatNumber,
    });

    return (
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">{key}</label>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50"
          placeholder={required ? "Required" : "Optional"}
        />
      </div>
    );
  };

  const createBooleanInput = (key: keyof typeof windowData) => {
    const [value, handleChange] = useInputParser({
      value: windowData[key] as boolean,
      setValue: (newValue) => setDataAndSave({ [key]: newValue }),
      isValid: isBoolean,
      formatValue: formatBoolean,
    });

    return (
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">{key}</label>
        <select
          value={value}
          onChange={handleChange as any}
          className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80"
        >
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      </div>
    );
  };

  const createStateInput = (key: keyof typeof windowState) => {
    const [value, handleChange] = useInputParser({
      value: windowState[key],
      setValue: (newValue) => setStateAndSave({ [key]: newValue }),
      isValid: isNumber,
      formatValue: formatNumber,
    });

    return (
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">{key}</label>
        <input
          type="number"
          value={value}
          onChange={handleChange}
          className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80"
        />
      </div>
    );
  };

  return (
    <div className="w-full h-full bg-widget-80 grid grid-cols-2 gap-4 p-6 overflow-auto">
      <div>
        <h2 className="text-lg font-bold mb-4">Window Data</h2>
        <div className="space-y-4">
          {createNumberInput("defaultHeight", true)}
          {createNumberInput("defaultWidth", true)}

          {createNumberInput("defaultCenterX")}
          {createNumberInput("defaultCenterY")}
          {createNumberInput("minHeight")}
          {createNumberInput("minWidth")}
          {createNumberInput("maxHeight")}
          {createNumberInput("maxWidth")}
          {createNumberInput("minAspectRatio")}
          {createNumberInput("maxAspectRatio")}
          {createNumberInput("layer")}

          {createBooleanInput("disableWidthAdjustment")}
          {createBooleanInput("disableHeightAdjustment")}
          {createBooleanInput("disableExpandToScreen")}
          {createBooleanInput("allowOverflow")}
          {createBooleanInput("disableBlur")}
          {createBooleanInput("disableShadow")}
          {createBooleanInput("countsToLimit")}
          {createBooleanInput("reducedStartingAnimation")}
          {createBooleanInput("removeStartingAnimation")}

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              uniqueId (read-only)
            </label>
            <input
              type="text"
              value={windowData.uniqueId || "Not set"}
              disabled
              className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 text-saturated"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">contextKey</label>
            <input
              type="text"
              value={windowData.contextKey || ""}
              onChange={(e) => setDataAndSave({ contextKey: e.target.value })}
              className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50"
              placeholder="Optional"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              saveComponentKey
            </label>
            <input
              type="text"
              value={windowData.saveComponentKey || ""}
              onChange={(e) =>
                setDataAndSave({
                  saveComponentKey: e.target.value,
                })
              }
              className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50"
              placeholder="Optional"
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">
              tags (comma-separated)
            </label>
            <input
              type="text"
              value={windowData.tags?.join(",") || ""}
              onChange={(e) =>
                setDataAndSave({
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
              className="w-full p-2 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80 placeholder:text-saturated placeholder:text-opacity-50"
              placeholder="Optional"
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold mb-4">Window State</h2>
        <div className="space-y-4">
          {createStateInput("width")}
          {createStateInput("height")}
          {createStateInput("x")}
          {createStateInput("y")}
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Raw Data</h3>
          <div className="p-4 border border-pastel border-opacity-80 rounded-lg bg-none bg-light bg-opacity-80">
            <pre className="whitespace-pre-wrap break-all font-mono">
              {JSON.stringify({ windowData, windowState }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WindowDebugger;
